from chrono.test_case import TestCase

from task.models import DateRemark
import datetime


API_URL = '/api/v1/date-remarks/'


class TestDateRemarkCreate(TestCase):
    """Testcases for DateRemark api"""

    def setUp(self):
        super().setUp()
        # Clear all remarks that exist
        DateRemark.objects.all().delete()

    def test_no_params(self):
        data = {}
        self.authenticate()
        response = self.client.post(API_URL, data)
        self.assert_400(response)

        respdata = response.json()
        assert 'errors' in respdata
        errors = respdata['errors']
        assert 'user' in errors
        assert 'date' in errors
        assert 'remark' in errors

    def test_no_or_invalid_date(self):
        invalid_dates = [None, '1231', 'abcd', 'July 1 2018', '2011/11/11']
        data = {
            'user': self.user.pk,
            'remark': 'Today was holiday',
        }
        for date in invalid_dates:
            postdata = {**data}
            if date is not None:
                postdata['date'] = date

            self.authenticate()
            response = self.client.post(API_URL, postdata)
            self.assert_400(response)

            respdata = response.json()
            assert 'errors' in respdata
            errors = respdata['errors']
            assert 'user' not in errors
            assert 'date' in errors
            assert 'remark' not in errors

    def test_no_or_invalid_user(self):
        invalid_users = [None, '1231', 'abcd', '  ', '-1', '1.1']
        data = {
            'date': '2018-10-10',
            'remark': 'Today was holiday',
        }
        for user in invalid_users:
            postdata = {**data}
            if user is not None:
                postdata['user'] = user

            self.authenticate()
            response = self.client.post(API_URL, postdata)
            self.assert_400(response)

            respdata = response.json()
            assert 'errors' in respdata
            errors = respdata['errors']
            assert 'user' in errors
            assert 'date' not in errors
            assert 'remark' not in errors

    def test_no_remark(self):
        data = {
            'date': '2018-10-10',
            'user': self.user.pk
        }
        self.authenticate()
        response = self.client.post(API_URL, data)
        self.assert_400(response)

        respdata = response.json()
        assert 'errors' in respdata
        errors = respdata['errors']
        assert 'user' not in errors
        assert 'date' not in errors
        assert 'remark' in errors

    def test_valid_data(self):
        data = {
            'date': '2018-10-10',
            'user': self.user.pk,
            'remark': 'Today is holiday'
        }
        self.authenticate()
        response = self.client.post(API_URL, data)
        self.assert_201(response)

        # check if date remark is created
        assert DateRemark.objects.all().count() == 1


class TestDateRemarkGet(TestCase):
    """Test get Remark objects"""
    def setUp(self):
        super().setUp()

        self.date = datetime.datetime.now().date()

        self.remark = self.create(
            DateRemark,
            date=self.date,
            user=self.user
        )
        # Create another one
        self.remark2 = self.create(
            DateRemark,
            date=self.date+datetime.timedelta(days=1),
            user=self.root_user
        )

    def test_get_nonexistent_remark(self):
        url = '{}{}/'.format(API_URL, 9999)  # 9999 should not exist
        self.authenticate()
        response = self.client.get(url)
        self.assert_404(response)

    def test_get_existent_remark(self):
        url = '{}{}/'.format(API_URL, self.remark.pk)
        self.authenticate()
        response = self.client.get(url)
        self.assert_200(response)

        respdata = response.json()

        assert 'date' in respdata
        assert 'remark' in respdata
        assert 'user' in respdata

    def test_get_all(self):
        self.authenticate()
        response = self.client.get(API_URL)
        self.assert_200(response)
        respdata = response.json()
        print(respdata)
        assert 'count' in respdata
        assert 'results' in respdata
        assert respdata['count'] == 2

    def test_filter_date(self):
        date = self.date.isoformat()
        query = {'date': date}
        self.authenticate()

        response = self.client.get(API_URL, query)
        self.assert_200(response)

        respdata = response.json()
        assert 'count' in respdata
        assert respdata['count'] == 1
        assert respdata['results'][0]['date'] == date

    def test_filter_user(self):
        query = {'user': self.user.pk}
        self.authenticate()

        response = self.client.get(API_URL, query)
        self.assert_200(response)

        respdata = response.json()
        assert 'count' in respdata
        assert respdata['count'] == 1
        assert respdata['results'][0]['user'] == self.user.pk
