from django.core.files.base import ContentFile

from rest_framework import views, response

from export.exporters import CSVExporter
from export.serializers import ExportSerializer
from export.models import Export
from utils.common import json_to_csv_data, generate_filename
from task.views import TimeSlotStatsViewSet

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
            'remarks',
        ]

        def extract_export_fields(obj):
            return OrderedDict([(k, obj[k]) for k in export_fields])

        data = resp.data['results']
        datadict = [extract_export_fields(x) for x in data]

        def sum_time_strs(a, b):
            ha, ma, sa = a.split(':')
            hb, mb, sb = b.split(':')
            sec = int(sa) + int(sb)
            min = int(ma) + int(mb) + int(sec/60)
            hrs = int(ha) + int(hb) + int(min/60)
            sec = sec % 60
            min = min % 60
            return '{}:{}:{}'.format(
                str(hrs).zfill(2),
                str(min).zfill(2),
                str(sec).zfill(2)
            )

        # total functions
        col_total_functions = {
            # summing 1:0:10 and 10:12:00
            'total_time': sum_time_strs,
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
