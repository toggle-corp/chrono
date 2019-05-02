def sum_string_times(time1, time2):
    """
    Sum times like h1:m1:s1 and h2:m2:s2 with
    result hh:mm:ss
    """
    h1, m1, s1 = time1.split(':')
    h2, m2, s2 = time2.split(':')
    s = int(s1) + int(s2)
    m = int(m1) + int(m2) + (s // 60)
    h = int(h1) + int(h2) + (m // 60)
    return '{}:{}:{}'.format(h, m % 60, s % 60)
