import graphene
from graphene_django_extras import DjangoObjectType
from task.models import Task, TimeSlot
from task.filters import TaskFilter, TimeSlotFilter
from utils.graphene.types import CustomDjangoListObjectType
from utils.graphene.fields import DjangoPaginatedListObjectField
from utils.pagination import PageGraphqlPaginationWithoutCount
from graphene_django_extras import DjangoObjectField


class TaskType(DjangoObjectType):
    class Meta:
        model = Task

    @staticmethod
    def get_queryset(queryset, info):
        return queryset


class TaskListType(CustomDjangoListObjectType):
    class Meta:
        model = Task
        filterset_class = TaskFilter


class TimeSlotType(DjangoObjectType):
    class Meta:
        model = TimeSlot

    @staticmethod
    def get_queryset(queryset, info):
        return queryset


class TimeSlotListType(CustomDjangoListObjectType):
    class Meta:
        model = TimeSlot
        filterset_class = TimeSlotFilter


class Query(graphene.ObjectType):
    task = DjangoObjectField(TaskType)
    timeslot = DjangoObjectField(TimeSlotType)
    tasks = DjangoPaginatedListObjectField(
        TaskListType,
        pagination=PageGraphqlPaginationWithoutCount(
            page_size_query_param='pageSize'
        )
    )
    timeslots = DjangoPaginatedListObjectField(
        TimeSlotListType,
        pagination=PageGraphqlPaginationWithoutCount(
            page_size_query_param='pageSize'
        )
    )
