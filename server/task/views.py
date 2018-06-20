from django.db import models
from rest_framework import generics
from rest_framework import (
    filters,
    permissions,
    viewsets,
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
)

import logging

logger = logging.getLogger(__name__)


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
        return TimeSlot.get_for(self.request.user)

    # TODO: Auto set user from request.user


class TimeSlotStatsViewSet(generics.ListAPIView):
    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotStatsSerializer
    permission_classes = [permissions.IsAuthenticated, ModifyPermission]
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter)
    filter_class = TimeSlotFilterSet
    search_fields = ('title', 'description')

    """
    TODO: FIXME
    def filter_queryset(self, queryset):
        qs = super(TimeSlotStatsViewSet, self)\
            .filter_queryset(queryset)\
            .annotate(
                total_spent=models.Sum(
                    models.F('end_time') - models.F('start_time'),
                    output_field=models.TimeField()
                ))
        return qs
    """
