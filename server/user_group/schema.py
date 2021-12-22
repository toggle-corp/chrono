import graphene
from graphene_django_extras import DjangoObjectType
from user_group.models import UserGroup, GroupMembership
from user_group.filters import UserGroupFilter, GroupMembershipFilter
from utils.graphene.types import CustomDjangoListObjectType
from utils.graphene.fields import DjangoPaginatedListObjectField
from utils.pagination import PageGraphqlPaginationWithoutCount
from graphene_django_extras import DjangoObjectField


class UserGroupType(DjangoObjectType):
    class Meta:
        model = UserGroup

    @staticmethod
    def get_queryset(queryset, info):
        return queryset


class UserGroupListType(CustomDjangoListObjectType):
    class Meta:
        model = UserGroup
        filterset_class = UserGroupFilter


class GroupMembershipType(DjangoObjectType):
    class Meta:
        model = GroupMembership

    @staticmethod
    def get_queryset(queryset, info):
        return queryset


class GroupMembershipListType(CustomDjangoListObjectType):
    class Meta:
        model = GroupMembership
        filterset_class = GroupMembershipFilter


class Query(graphene.ObjectType):
    user_group = DjangoObjectField(UserGroupType)
    group_membership = DjangoObjectField(GroupMembershipType)
    user_groups = DjangoPaginatedListObjectField(
        UserGroupListType,
        pagination=PageGraphqlPaginationWithoutCount(
            page_size_query_param='pageSize'
        )
    )
    user_group_memberships = DjangoPaginatedListObjectField(
        GroupMembershipListType,
        pagination=PageGraphqlPaginationWithoutCount(
            page_size_query_param='pageSize'
        )
    )
