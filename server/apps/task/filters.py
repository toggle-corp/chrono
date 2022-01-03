from django.db import models
import django_filters
from task.models import Task, TimeSlot
from utils.filters import NameFilterMixin
from utils.filters import (
    IDListFilter,
    DateGteFilter,
    DateLteFilter,
)


class TaskFilter(NameFilterMixin, django_filters.FilterSet):
    search = django_filters.CharFilter(method='search_filter')
    projects = IDListFilter(method='projects_filter')
    tags = IDListFilter(method='tags_filter')
    created_by = django_filters.CharFilter(method='created_by_filter')
    modified_by = django_filters.CharFilter(method='modified_by_filter')

    class Meta:
        model = Task
        fields = {}

    def search_filter(self, qs, name, value):
        if not value:
            return qs
        return qs.filter(
            models.Q(title__icontains=value) |
            models.Q(description__icontains=value)
        ).distinct()

    def projects_filter(self, qs, name, value):
        if not value:
            return qs
        return qs.filter(
            project__in=value
        )

    def tags_filter(self, qs, name, value):
        if not value:
            return qs
        return qs.filter(
            tags__in=value
        )

    def created_by_filter(self, qs, name, value):
        if not value:
            return qs
        return qs.filter(
            created_by__in=value
        )

    def modified_by_filter(self, qs, name, value):
        if not value:
            return qs
        return qs.filter(
            modified_by__in=value
        )

    @property
    def qs(self):
        return super().qs.select_related('project', 'created_by', 'modified_by').prefetch_related('tags')


class TimeSlotFilter(NameFilterMixin, django_filters.FilterSet):
    tasks = IDListFilter(method='tasks_filter')
    users = IDListFilter(method='users_filter')
    tags = IDListFilter(method='tags_filter')
    projects = IDListFilter(method='projects_filter')
    date_gte = DateGteFilter(field_name='date')
    date_lte = DateLteFilter(field_name='date')

    class Meta:
        model = TimeSlot
        fields = {}

    def tasks_filter(self, qs, name, value):
        if not value:
            return qs
        return qs.filter(
            task__in=value
        )

    def users_filter(self, qs, name, value):
        if not value:
            return qs
        return qs.filter(
            user__in=value
        )

    def tags_filter(self, qs, name, value):
        if not value:
            return qs
        return qs.filter(
            tags__in=value
        )

    def projects_filter(self, qs, name, value):
        if not value:
            return qs
        return qs.filter(
            task__project__in=value
        )

    @property
    def qs(self):
        return super().qs.select_related('user').prefetch_related('tags', 'tags__project')
