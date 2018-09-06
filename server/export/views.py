from django.http import HttpResponse
from rest_framework import views

from export.exporters import CSVExporter

from utils.common import json_to_csv_data

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

        # csvdata = [cols, *rows]
        csvdata = json_to_csv_data(datadict, col_total=True)

        csvexporter = CSVExporter(csvdata)

        filename = csvexporter.export()
        response = HttpResponse(
            open(filename, 'r'),
            content_type=csvexporter.MIME_TYPE
        )
        response['Content-Disposition'] = 'attachment; filename=export.csv'

        return response
