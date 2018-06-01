from rest_framework import viewsets, permissions, response, status
from rest_framework.decorators import detail_route
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.http import HttpResponse

from chrono.permissions import ModifyPermission
from .models import Project
from .serializers import ProjectSerializer, ProjectExportSerializer
from export.exporters import JSONExporter, XLSXExporter, CSVExporter

import logging

logger = logging.getLogger(__name__)


format_exporters = {
    'json': JSONExporter,
    'xlsx': XLSXExporter,
    'csv': CSVExporter
}


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    # permission_classes = [permissions.IsAuthenticated,
    #                       ModifyPermission]
    filter_classes = [DjangoFilterBackend]
    filter_fields = ['user_group']

    def get_queryset(self):
        return Project.get_for(self.request.user)

    @detail_route(methods=['get'])
    def export(self, request, pk=None, version=None):
        serializer = ProjectExportSerializer(data=request.query_params)
        if not serializer.is_valid():
            return response.Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        # try get project
        try:
            project = Project.objects.get(pk=pk)
        except Project.DoesNotExist:
            return response.Response(
                {'message': 'Project does not exist'},
                status=status.HTTP_404_NOT_FOUND
            )
        filters = serializer.data
        # pop export_type, which is not required in filters
        export_format = filters.pop('export_format')
        exportable_data = project.filtered_project_summary()

        ExporterClass = format_exporters.get(export_format)
        if not ExporterClass:
            return response.Response(
                {'error': 'Unsupported export format'},
                status=status.HTTP_400_BAD_REQUEST
            )
        exporter = ExporterClass(exportable_data)
        filepath = exporter.export()
        resp = HttpResponse(content_type=ExporterClass.MIME_TYPE)
        resp['Content-Disposition'] = 'attachment; filename=ProjectExport_{}.{}'.format(  # noqa
            timezone.now().strftime('%Y-%m-%dT%H.%M.%S'),
            export_format
        )
        with open(filepath) as f:
            data = f.read()
        resp.write(data)
        return resp
