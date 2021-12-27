import django_filters
from utils.filters import NameFilterMixin
from project.models import Project, Tag
from utils.filters import IDListFilter
from django.db import models


class ProjectFilter(NameFilterMixin, django_filters.FilterSet):
    user_groups = IDListFilter(method='user_groups_filter')
    search = django_filters.CharFilter(method='search_filter')
    created_by = django_filters.CharFilter(method='created_by_filter')
    modified_by = django_filters.CharFilter(method='modified_by_filter')

    class Meta:
        model = Project
        fields = {}

    def user_groups_filter(self, qs, name, value):
        if not value:
            return qs
        return qs.filter(
            user_group__in=value
        )

    def search_filter(self, qs, name, value):
        if not value:
            return qs
        return qs.filter(
            models.Q(title__icontains=value) |
            models.Q(description__icontains=value)
        ).distinct()

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
        return super().qs.select_related('user_group', 'created_by', 'modified_by')


class TagFilter(NameFilterMixin, django_filters.FilterSet):
    projects = IDListFilter(method='projects_filter')
    search = django_filters.CharFilter(method='search_filter')
    created_by = django_filters.CharFilter(method='created_by_filter')
    modified_by = django_filters.CharFilter(method='modified_by_filter')

    class Meta:
        model = Tag
        fields = {}

    def projects_filter(self, qs, name, value):
        if not value:
            return qs
        return qs.filter(
            project__in=value
        )

    def search_filter(self, qs, name, value):
        if not value:
            return qs
        return qs.filter(
            project__in=value
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
        return super().qs.select_related('project', 'created_by', 'modified_by')
