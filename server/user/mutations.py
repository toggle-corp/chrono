from django.contrib.auth import login, logout
import graphene
from django.conf import settings
from user.schema import UserType
from user.serializers import LoginSerializer
from utils.mutation import generate_input_type_for_serializer
from utils.error_types import CustomErrorType, mutation_is_not_valid
from django.contrib.auth.models import User


LoginInputType = generate_input_type_for_serializer(
    'LoginInputType',
    LoginSerializer
)


class Login(graphene.Mutation):
    class Arguments:
        data = LoginInputType(required=True)

    result = graphene.Field(UserType)
    errors = graphene.List(graphene.NonNull(CustomErrorType))
    ok = graphene.Boolean(required=True)

    @staticmethod
    def mutate(root, info, data):
        serializer = LoginSerializer(data=data,
                                     context={'request': info.context.request})
        errors = mutation_is_not_valid(serializer)
        if errors:
            attempts = User._get_login_attempt(data['email'])
            return Login(
                errors=errors,
                ok=False,
                captcha_required=attempts >= settings.MAX_LOGIN_ATTEMPTS
            )
        if user := serializer.validated_data.get('user'):
            login(info.context.request, user)
        return Login(
            result=user,
            errors=None,
            ok=True
        )


class Logout(graphene.Mutation):
    ok = graphene.Boolean()

    def mutate(self, info, *args, **kwargs):
        if info.context.user.is_authenticated:
            logout(info.context.request)
        return Logout(ok=True)


class Mutation(graphene.ObjectType):
    login = Login.Field()
    logout = Logout.Field()
