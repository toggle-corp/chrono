from django.core.files.base import ContentFile

from rest_framework import views, response

from export.exporters import CSVExporter
from export.serializers import ExportSerializer
from export.models import Export
from utils.common import json_to_csv_data, generate_filename
from task.views import TimeSlotStatsViewSet

from .utils import sum_string_times

from collections import OrderedDict

import logging

logger = logging.getLogger(__name__)


class ExportViewSet(views.APIView):

    def get(self, request, version=None):
        resp = TimeSlotStatsViewSet.as_view()(request._request)
        if resp.status_code != 200:
            return resp

        export_fields = [
            'user_display_name',
            'user_group_display_name',
            'project_display_name',
            'date',
            'total_time',
            'total_time_in_seconds',
            'remarks',
        ]

        def extract_export_fields(obj):
            return OrderedDict([(k, obj[k]) for k in export_fields])

        data = resp.data['results']
        datadict = [extract_export_fields(x) for x in data]

        # total functions, used as accumulator functions in reduce
        col_total_functions = {
            # summing 1:0:10 and 10:12:00
            'total_time': sum_string_times,
        }
        # csvdata is [cols, *rows]
        csvdata = json_to_csv_data(
            datadict,
            col_total=True,
            col_total_functions=col_total_functions
        )

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
            ContentFile(open(filename, "rb").read())
        )

        serializer = ExportSerializer(export, context={'request': request})
        return response.Response(serializer.data)
