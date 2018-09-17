from xml.sax.saxutils import escape

import os
from datetime import datetime


USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1)' + \
    ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'


def write_file(r, fp):
    for chunk in r.iter_content(chunk_size=1024):
        if chunk:
            fp.write(chunk)
    return fp


def get_or_write_file(path, text):
    try:
        extracted = open(path, 'r')
    except FileNotFoundError:
        with open(path, 'w') as fp:
            fp.write(text)
        extracted = open(path, 'r')
    return extracted


def makedirs(path):
    try:
        os.makedirs(path)
    except FileExistsError:
        pass


def is_valid_xml_char_ordinal(c):
    codepoint = ord(c)
    # conditions ordered by presumed frequency
    return (
        0x20 <= codepoint <= 0xD7FF or
        codepoint in (0x9, 0xA, 0xD) or
        0xE000 <= codepoint <= 0xFFFD or
        0x10000 <= codepoint <= 0x10FFFF
    )


def get_valid_xml_string(string):
    if string:
        s = escape(string)
        return ''.join(c for c in s
                       if is_valid_xml_char_ordinal(c))
    return ''


def format_date(date):
    if date:
        return date.strftime('%d-%m-%Y')
    else:
        return None


def generate_filename(title, extension):
    return '{} CHRONO {}.{}'.format(
        datetime.now().strftime('%Y%m%dT%H:%M:%S'),
        title,
        extension,
    )


def identity(x):
    return x


def underscore_to_title(x):
    return ' '.join([y.title() for y in x.split('_')])


def json_to_csv_data(
        jsondata,
        rowheading="",
        colheading="",
        row_total=False,
        col_total=False):
    """
    @jsondata: json data, expected format {
        'title1': {'col1': val11, 'col2': val12...},
        'title2': {'col1': val21, 'col2': val22...},
        }
    @rowheading: heading for rows
    @colheading: heading for cols
    @row_total: if rows are to be summed into new col
    @col_total: if cols are to b summed into new row
    """
    keys = list(jsondata.keys())
    if not keys:
        return []
    first_row_key = keys[0]
    first_item = jsondata[first_row_key]

    cols = [underscore_to_title(k) for k, _ in first_item.items()]

    columns = ['{}\\{}'.format(rowheading, colheading)] + cols
    if row_total:
        columns.append('TOTAL')
    rows = [
        [k, *[m for _, m in v.items()]]
        for k, v in jsondata.items()
    ]
    # add total field in rows
    if row_total:
        rows = [row + [sum(row[1:])] for row in rows]
    # now add total for each col
    if col_total:
        colssum = []
        for i in range(1, len(columns)):
            try:
                sm = sum([row[i] for row in rows])
            except Exception as e:  # means there are strings as well
                sm = ''
            colssum.append(sm)

        rows.append(
            ['TOTAL', *colssum]
        )
    return [columns, *rows]
