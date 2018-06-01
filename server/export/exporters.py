import json
import tempfile


DOCX_MIME_TYPE = \
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
PDF_MIME_TYPE = \
    'application/pdf'
EXCEL_MIME_TYPE = \
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
JSON_MIME_TYPE = \
    'application/json'


class Exporter:
    """
    Class for exporting data
    """
    def __init__(self, data):
        self.data = data

    def export(self, temp=True):
        """This should return a temporary/persistant file name"""
        raise Exception('Not implemented')


class CSVExporter(Exporter):
    MIME_TYPE = 'text/csv'

    # NOTE: self.data should be list of rows

    def export(self, temp=True):
        f = tempfile.NamedTemporaryFile(mode='w', delete=False)
        for row in self.data:
            f.write(','.join([str(x) for x in row]))
            f.write('\n')
        return f.name


class XLSXExporter(Exporter):
    MIME_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'  # noqa


class JSONExporter(Exporter):
    """
    Class for exporting json
    """
    MIME_TYPE = 'application/json'

    def export(self, temp=True):
        f = tempfile.NamedTemporaryFile(mode='w', delete=False)
        f.write(json.dumps(self.data, indent=2))
        return f.name
