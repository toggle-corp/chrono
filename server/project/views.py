from rest_framework import viewsets, permissions, response, status
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.http import HttpResponse

from chrono.permissions import ModifyPermission
from export.exporters import JSONExporter, XLSXExporter, CSVExporter
from .models import Project, Tag
from .serializers import (
    ProjectSerializer,
    TagSerializer,
    ProjectExportSerializer,
)

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
        return Project.get_for(self.request.user).prefetch_related('created_by', 'modified_by')

    @action(detail=True, methods=['get'])
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

        # get exporter class from export format
        ExporterClass = format_exporters.get(export_format)
        if not ExporterClass:
            return response.Response(
                {'error': 'Unsupported export format'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # get the corresponding method from project object
        data_method_name = 'project_summary_{}'.format(export_format)
        if not hasattr(project, data_method_name):
            return response.Response(
                {'error': 'Something went wrong. Try later.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        data_method = getattr(project, data_method_name)
        exportable_data = data_method()

        exporter = ExporterClass(exportable_data)
        filepath = exporter.export()
        resp = HttpResponse(content_type=ExporterClass.MIME_TYPE)
        resp['Content-Disposition'] = 'attachment; filename=ProjectExport_{}.{}'.format(  # noqa
            timezone.now().strftime('%Y-%m-%dT%H.%M.%S'),
            export_format
        )
        # write data to response
        with open(filepath) as f:
            data = f.read()
        resp.write(data)
        return resp


class TagViewSet(viewsets.ModelViewSet):
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticated, ModifyPermission]
    filter_classes = [DjangoFilterBackend]
    filter_fields = ['project', 'title']

    def get_queryset(self):
        return Tag.get_for(self.request.user)
