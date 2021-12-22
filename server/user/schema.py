import graphene
from graphene_django_extras import DjangoObjectType
from django.contrib.auth.models import User
from user.filters import UserFilter
from utils.graphene.types import CustomDjangoListObjectType
from utils.graphene.fields import DjangoPaginatedListObjectField
from utils.pagination import PageGraphqlPaginationWithoutCount


class UserType(DjangoObjectType):
    class Meta:
        model = User
        exclude_fields = (
            'is_staff',
            'is_superuser',
            'is_active',
            'groups',
            'user_permissions',
            'password',
        )

    @staticmethod
    def get_queryset(queryset, info):
        return queryset


class UserListType(CustomDjangoListObjectType):
    class Meta:
        model = User
        filterset_class = UserFilter


class Query(graphene.ObjectType):
    me = graphene.Field(UserType)
    users = DjangoPaginatedListObjectField(
        UserListType,
        pagination=PageGraphqlPaginationWithoutCount(
            page_size_query_param='pageSize'
        )
    )

    def resolve_me(parent, info):
        if info.context.user.is_authenticated:
            return info.context.user
        return None
