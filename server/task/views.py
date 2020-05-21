from django.db import models
from django.db.models import F, Count, Sum, Q
from django.db.models.functions import Concat
from rest_framework import generics
from rest_framework.decorators import list_route
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
from project.serializers import ProjectSerializer
from user_group.models import UserGroup
from user.models import User
from .models import (
    Task,
    Tag,
    TimeSlot,
)
from .serializers import (
    TotalTimeSerializer,
    TaskSerializer,
    TimeSlotSerializer,
    TimeSlotStatsSerializer,
    TimeSlotStatsProjectWiseSerializer,
    TimeSlotStatsUserDayWiseSerializer,
    TimeSlotStatsDayWiseSerializer,
    TimeSlotStatsUserWiseSerializer,
    DeprecatedTimeSlotStatsDayWiseSerializer,
    TimeSlotStatsTaskSerializer,
)

import datetime
import logging

logger = logging.getLogger(__name__)


TIME_SLOT_DEFAULT_SORT = (
    'date', 'task__project__user_group', 'user', 'task__project', 'task',
)

USER_DISPLAY_ANNOTATE = Concat(
    'user__first_name', models.Value(' '), 'user__last_name',
    output_field=models.CharField()
)

TIME_SLOT_TOTAL_TIME_ANNOTATE = Sum(
    F('end_time') - F('start_time'),
    output_field=models.DurationField(),
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

    tags = django_filters.ModelMultipleChoiceFilter(
        name='tags',
        queryset=Tag.objects.all(),
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
        return Task.get_for(self.request.user).prefetch_related('created_by', 'modified_by')


class TimeSlotViewSet(viewsets.ModelViewSet):
    serializer_class = TimeSlotSerializer
    permission_classes = [permissions.IsAuthenticated, ModifyPermission]
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter)
    filter_class = TimeSlotFilterSet
    search_fields = ('title', 'description')

    def get_queryset(self):
        return TimeSlot.get_for(self.request.user)

    @list_route(methods=['get'], url_path='filter-options')
    def filter_options(self, request, pk=None, version=None):
        prefetch_related = ('created_by', 'modified_by')
        return response.Response({
            'tasks': TaskSerializer(
                Task.get_for(self.request.user).prefetch_related(*prefetch_related),
                many=True,
            ).data,
            'projects': ProjectSerializer(
                Project.get_for(self.request.user).prefetch_related(*prefetch_related),
                many=True,
            ).data,
            'user_groups': list(UserGroup.get_for(self.request.user).values('id', 'title', 'description')),
            'users': list(
                User.objects.values(
                    'id',
                    'email',
                    display_name=Concat(
                        'first_name', models.Value(' '), 'last_name',
                        output_field=models.CharField()
                    )
                )
            ),
        })

    # TODO: Auto set user from request.user


class TimeSlotStatsViewSet(generics.ListAPIView):
    queryset = TimeSlot.objects.prefetch_related('tags', 'user', 'user__profile').annotate(
        user_display_name=USER_DISPLAY_ANNOTATE,
        user_group_display_name=F('task__project__user_group__title'),
        project_display_name=F('task__project__title'),
        task_display_name=F('task__title'),
        task_description=F('task__description'),
    ).order_by(*TIME_SLOT_DEFAULT_SORT)

    serializer_class = TimeSlotStatsSerializer
    permission_classes = [permissions.IsAuthenticated, ModifyPermission]
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter)
    filter_class = TimeSlotFilterSet
    search_fields = ('title', 'description')

    def get(self, request, version=None):
        """
        Override list to include aggregated values
        """
        response = super().get(request, version)
        total_time = self.filter_queryset(self.get_queryset()).aggregate(
            total_time=TIME_SLOT_TOTAL_TIME_ANNOTATE
        )
        response.data['extra'] = TotalTimeSerializer(total_time).data
        return response


class TimeSlotStatsProjectWiseViewSet(generics.ListAPIView):
    serializer_class = TimeSlotStatsProjectWiseSerializer
    permission_classes = [permissions.IsAuthenticated, ModifyPermission]

    def get_queryset(self):
        qs = TimeSlotFilterSet(self.request.query_params, queryset=TimeSlot.objects).qs

        return qs.order_by().values(
            key=Concat('user_id', models.Value('-'), 'task__project_id', output_field=models.CharField()),
            user_display_name=USER_DISPLAY_ANNOTATE,
            project_title=F('task__project__title'),
            project=F('task__project_id'),
        ).annotate(
            total_tasks=Count('task', distinct=True),
            total_time=TIME_SLOT_TOTAL_TIME_ANNOTATE,
        ).order_by('project_title', 'user_display_name')

    def get(self, request, version=None):
        """
        Override list to include aggregated values
        """
        response = super().get(request, version)
        total_time = self.filter_queryset(self.get_queryset()).aggregate(
            total_time=TIME_SLOT_TOTAL_TIME_ANNOTATE
        )
        response.data['extra'] = TotalTimeSerializer(total_time).data
        return response


class TimeSlotStatsDayWiseViewSet(views.APIView):
    permission_classes = [permissions.IsAuthenticated, ModifyPermission]

    def get_for_date(self, slots, date):
        slots = slots.filter(date=date)

        total_time = Sum(
            F('timeslot__end_time') - F('timeslot__start_time'),
            output_field=models.DurationField(),
            filter=Q(timeslot__in=slots)
        )
        return User.objects.annotate(
            total_time=total_time,
        )

    def get_deprecated(self, request, version=None):
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
            DeprecatedTimeSlotStatsDayWiseSerializer(data, many=True).data
        )

    def get(self, request, version=None):
        if version == 'v1':
            return self.get_deprecated(request)

        qs = TimeSlotFilterSet(self.request.query_params, queryset=TimeSlot.objects.all()).qs

        userwise_qs = qs.order_by().values('user').annotate(
            user_display_name=USER_DISPLAY_ANNOTATE,
            total_time=TIME_SLOT_TOTAL_TIME_ANNOTATE,
        )
        userdaywise_qs = qs.order_by('date', 'user').values('date', 'user').annotate(
            total_time=TIME_SLOT_TOTAL_TIME_ANNOTATE,
        )
        daywise_qs = qs.order_by('date').values('date').annotate(total_time=TIME_SLOT_TOTAL_TIME_ANNOTATE)

        return response.Response({
            'user_wise': TimeSlotStatsUserWiseSerializer(userwise_qs, many=True).data,
            'day_wise': TimeSlotStatsDayWiseSerializer(daywise_qs, many=True).data,
            'user_day_wise': TimeSlotStatsUserDayWiseSerializer(userdaywise_qs, many=True).data,
        })


class TimeSlotStatsTaskViewSet(generics.ListAPIView):
    serializer_class = TimeSlotStatsTaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend,)
    filter_class = TimeSlotFilterSet

    def get_queryset(self):
        return TimeSlot.objects.order_by().values('task').annotate(
            task_display_name=F('task__title'),
            project_display_name=F('task__project__title'),
            project=F('task__project'),
            total_time=TIME_SLOT_TOTAL_TIME_ANNOTATE,
        )
