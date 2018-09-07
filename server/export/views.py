from django.core.files.base import ContentFile

from rest_framework import views, response

from export.exporters import CSVExporter
from export.serializers import ExportSerializer
from export.models import Export
from utils.common import json_to_csv_data, generate_filename
from task.views import TimeSlotStatsViewSet

import logging

logger = logging.getLogger(__name__)


class ExportViewSet(views.APIView):

    def get(self, request, version=None):
        resp = TimeSlotStatsViewSet.as_view()(request._request)
        if resp.status_code != 200:
            return resp

        data = resp.data['results']
        datadict = {x['id']: x for x in data}
        # TODO: make results more readable, replace pk/fk fields by names

        # csvdata is [cols, *rows]
        csvdata = json_to_csv_data(datadict, col_total=True)

        csvexporter = CSVExporter(csvdata)

        export = Export.objects.create(
            title='Tasks Export',
            format=Export.CSV,  # TODO: make this dynamic
            mime_type=csvexporter.MIME_TYPE,
            exported_by=request.user,
        )

        filename = csvexporter.export()

        export.file.save(
            generate_filename(export.title, 'csv'),
            ContentFile(open(filename).read())
        )

        serializer = ExportSerializer(export, context={'request': request})
        return response.Response(serializer.data)
