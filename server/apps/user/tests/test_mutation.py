from utils.graphene.tests import GraphQLTestCase
from user.factories import UserFactory


class TestUserLoginLogOut(GraphQLTestCase):
    def setUp(self):
        self.login_mutation = '''
        mutation Mutation($input: LoginInputType!) {
            login(data: $input) {
                ok
                result {
                    username
                    id
                }
            }
        }
        '''
        self.logout_mutation = '''
            mutation Mutation {
              logout {
                ok
              }
            }
        '''
        super().setUp()

    def test_login(self):
        # Test invaid user should not login
        minput = {"username": "alex", "password": "2323SDE#@"}
        self.query_check(self.login_mutation, minput=minput, okay=False)

        # Test valid user should login
        user = UserFactory.create(email=minput['username'])
        minput = {"username": user.username, "password": user.password_text}
        content = self.query_check(self.login_mutation, minput=minput, okay=True)
        self.assertEqual(content['data']['login']['result']['id'], str(user.id), content)
        self.assertEqual(content['data']['login']['result']['username'], user.username, content)

    def test_logout(self):
        self.query_check(self.logout_mutation, okay=True)
