import graphene
from graphene_django_extras import DjangoObjectType
from task.models import Task, TimeSlot
from task.filters import TaskFilter
from utils.graphene.types import CustomDjangoListObjectType
from utils.graphene.fields import DjangoPaginatedListObjectField
from utils.pagination import PageGraphqlPaginationWithoutCount
from graphene_django_extras import DjangoObjectField
from user.schema import UserType
from .enums import TimeSlotGroupByEnum
from graphene_django.filter.utils import get_filtering_args_from_filterset
from .filters import TimeSlotFilter
from .views import TIME_SLOT_TOTAL_TIME_ANNOTATE
from django.db import models
from django.db.models.functions import Concat
from django.contrib.postgres.aggregates import StringAgg


TimeSlotFilterType = type(
    'RegionProjectFilterData',
    (graphene.InputObjectType,),
    get_filtering_args_from_filterset(TimeSlotFilter, 'task.schema.ProjectListType')
)


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

    user = graphene.Field(UserType)


class TimeSlotListType(CustomDjangoListObjectType):
    class Meta:
        model = TimeSlot
        filterset_class = TimeSlotFilter


class TimeSlotGroupByType(graphene.ObjectType):
    total_time = graphene.Int()
    # Ids
    project_id = graphene.ID(required=False)
    user_id = graphene.ID(required=False)
    tag_id = graphene.ID(required=False)
    # Descriptions
    user_display_name = graphene.ID(required=False)
    project_title = graphene.ID(required=False)
    tag_name = graphene.ID(required=False)

    @staticmethod
    def resolve_total_time(root, info, **kwargs):
        return int(root["total_time"].total_seconds())


class TimeSlotGroupByListType(graphene.ObjectType):
    results = graphene.List(graphene.NonNull(TimeSlotGroupByType))


class Query(graphene.ObjectType):
    timeslot = DjangoObjectField(TimeSlotType)
    timeslots = DjangoPaginatedListObjectField(
        TimeSlotListType,
        pagination=PageGraphqlPaginationWithoutCount(
            page_size_query_param='pageSize'
        )
    )
    timeslots_group_by = graphene.Field(
        TimeSlotGroupByListType,
        filters=graphene.Argument(TimeSlotFilterType),
        group_by=graphene.List(graphene.NonNull(TimeSlotGroupByEnum))
    )

    @staticmethod
    def resolve_timeslots_group_by(root, info, filters, group_by):
        qs = TimeSlotFilter(data=filters).qs
        annotate_statements = {}
        if TimeSlot.GroupBy.USER.value in group_by:
            annotate_statements = {
                "user_display_name": Concat('user__first_name', models.Value(' '), 'user__last_name'),
                "user_id": models.F('user_id'),
            }
        if TimeSlot.GroupBy.TAG in group_by:
            annotate_statements = {
                "tag_name": StringAgg("task__tags__title", delimiter="", distinct=True, output_field=models.CharField()),
                "tag_id": models.F('task__tags__id'),
            }
        if TimeSlot.GroupBy.PROJECT in group_by:
            annotate_statements = {
                "project_title": models.F("task__project__title"),
                "project_id": models.F("task__project__id")
            }
        return {
            'results': qs.order_by().values(*group_by).annotate(
                total_time=TIME_SLOT_TOTAL_TIME_ANNOTATE,
                **annotate_statements
            ).values(
                *group_by, "total_time", *annotate_statements.keys()
            )
        }
