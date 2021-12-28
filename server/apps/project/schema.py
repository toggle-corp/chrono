import graphene
from graphene_django_extras import DjangoObjectType
from project.models import Project, Tag
from project.filters import ProjectFilter, TagFilter
from utils.graphene.types import CustomDjangoListObjectType
from utils.graphene.fields import DjangoPaginatedListObjectField
from utils.pagination import PageGraphqlPaginationWithoutCount
from graphene_django_extras import DjangoObjectField


class ProjectType(DjangoObjectType):
    class Meta:
        model = Project

    @staticmethod
    def get_queryset(queryset, info):
        return queryset


class ProjectListType(CustomDjangoListObjectType):
    class Meta:
        model = Project
        filterset_class = ProjectFilter


class TagType(DjangoObjectType):
    class Meta:
        model = Tag

    @staticmethod
    def get_queryset(queryset, info):
        return queryset


class TagListType(CustomDjangoListObjectType):
    class Meta:
        model = Tag
        filterset_class = TagFilter


class Query(graphene.ObjectType):
    project = DjangoObjectField(ProjectType)
    tag = DjangoObjectField(TagType)
    projects = DjangoPaginatedListObjectField(
        ProjectListType,
        pagination=PageGraphqlPaginationWithoutCount(
            page_size_query_param='pageSize'
        )
    )
    tags = DjangoPaginatedListObjectField(
        TagListType,
        pagination=PageGraphqlPaginationWithoutCount(
            page_size_query_param='pageSize'
        )
    )
