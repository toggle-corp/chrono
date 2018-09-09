from django.db import models
from rest_framework import generics
from rest_framework import (
    filters,
    permissions,
    viewsets,
    views,
    response,
)
import django_filters

from chrono.permissions import ModifyPermission

from project.models import Project
from user_group.models import UserGroup
from user.models import User
from .models import (Task, TimeSlot)
from .serializers import (
    TaskSerializer,
    TimeSlotSerializer,
    TimeSlotStatsSerializer,
    TimeSlotStatsProjectWiseSerializer,
    TimeSlotStatsDayWiseSerializer,
)

import datetime
import logging

logger = logging.getLogger(__name__)


TIME_SLOT_DEFAULT_SORT = (
    'task__project__user_group', 'user', 'task__project', 'task', 'date',
)


class TimeSlotFilterSet(django_filters.FilterSet):
    """
    Task filter set
    """

    date_lt = django_filters.DateFilter(name='date', lookup_expr='lte')
    date_gt = django_filters.DateFilter(name='date', lookup_expr='gte')

    user = django_filters.ModelMultipleChoiceFilter(
        name='user',
        queryset=User.objects.all(),
        lookup_expr='in',
        widget=django_filters.widgets.CSVWidget,
    )

    task = django_filters.ModelMultipleChoiceFilter(
        name='task',
        queryset=Task.objects.all(),
        lookup_expr='in',
        widget=django_filters.widgets.CSVWidget,
    )

    project = django_filters.ModelMultipleChoiceFilter(
        name='task__project',
        queryset=Project.objects.all(),
        lookup_expr='in',
        widget=django_filters.widgets.CSVWidget,
    )

    user_group = django_filters.ModelMultipleChoiceFilter(
        name='task__project__user_group',
        queryset=UserGroup.objects.all(),
        lookup_expr='in',
        widget=django_filters.widgets.CSVWidget,
    )

    class Meta:
        model = TimeSlot
        exclude = []

        filter_overrides = {
            models.CharField: {
                'filter_class': django_filters.CharFilter,
                'extra': lambda f: {
                    'lookup_expr': 'icontains',
                },
            },
        }


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, ModifyPermission]
    filter_classes = [django_filters.rest_framework.DjangoFilterBackend]
    filter_fields = ['project', 'title']

    def get_queryset(self):
        return Task.get_for(self.request.user)


class TimeSlotViewSet(viewsets.ModelViewSet):
    serializer_class = TimeSlotSerializer
    permission_classes = [permissions.IsAuthenticated, ModifyPermission]
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter)
    filter_class = TimeSlotFilterSet
    search_fields = ('title', 'description')

    def get_queryset(self):
        user_qs = TimeSlot.get_for(self.request.user)
        tag_values = self.request.query_params.get('tag') or []
        if not tag_values:
            return user_qs
        tagids = [x.strip() for x in tag_values.split(',') if x.strip()]
        for id in tagids:
            user_qs = user_qs.filter(tags__id=id)
        return user_qs

    # TODO: Auto set user from request.user


class TimeSlotStatsViewSet(generics.ListAPIView):
    queryset = TimeSlot.objects.order_by(*TIME_SLOT_DEFAULT_SORT)
    serializer_class = TimeSlotStatsSerializer
    permission_classes = [permissions.IsAuthenticated, ModifyPermission]
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter)
    filter_class = TimeSlotFilterSet
    search_fields = ('title', 'description')


class TimeSlotStatsProjectWiseViewSet(generics.ListAPIView):
    serializer_class = TimeSlotStatsProjectWiseSerializer
    permission_classes = [permissions.IsAuthenticated, ModifyPermission]

    def _get_queryset(self, project):
        qs = User.objects.all()

        filtered_slots = TimeSlotFilterSet(
            self.request.GET,
            queryset=TimeSlot.objects.filter(task__project=project),
        ).qs.values_list('id', flat=True)

        total_tasks = models.Count(
            'timeslot__task',
            distinct=True,
            filter=models.Q(timeslot__in=filtered_slots),
        )
        total_time = models.Sum(
            models.F('timeslot__end_time') - models.F('timeslot__start_time'),
            output_field=models.DurationField(),
            filter=models.Q(timeslot__in=filtered_slots)
        )

        qs = qs.annotate(
            total_tasks=total_tasks,
            total_time=total_time,
        ).filter(total_tasks__gt=0)

        return qs

    def get_queryset(self):
        qs = []
        for project in Project.objects.all():
            for slot in self._get_queryset(project):
                slot.project = project
                qs.append(slot)
        return qs


class TimeSlotStatsDayWiseViewSet(views.APIView):
    permission_classes = [permissions.IsAuthenticated, ModifyPermission]

    def get_for_date(self, slots, date):
        slots = slots.filter(date=date)

        total_time = models.Sum(
            models.F('timeslot__end_time') - models.F('timeslot__start_time'),
            output_field=models.DurationField(),
            filter=models.Q(timeslot__in=slots)
        )
        return User.objects.annotate(
            total_time=total_time,
        )

    def get(self, request, version=None):
        filtered_slots = TimeSlotFilterSet(
            request.GET,
            queryset=TimeSlot.objects.all(),
        ).qs.order_by('date')

        data = []

        if filtered_slots.exists():
            min = filtered_slots.first().date
            max = filtered_slots.last().date

            filtered_slots = filtered_slots\
                .values_list('id', flat=True)

            date = min
            delta = datetime.timedelta(days=1)
            while date <= max:
                data.append({
                    'date': date,
                    'users': self.get_for_date(filtered_slots, date)
                })
                date += delta

        return response.Response(
            TimeSlotStatsDayWiseSerializer(data, many=True).data
        )
