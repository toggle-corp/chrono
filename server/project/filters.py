import django_filters
from utils.filters import AllowInitialFilterSetMixin
from project.models import Project, Tag
from utils.filters import IDListFilter


class ProjectFilter(AllowInitialFilterSetMixin, django_filters.FilterSet):
    user_groups_in = IDListFilter(method='filter_user_groups_in')

    class Meta:
        model = Project
        fields = {
            'title': ['icontains'],
            'description': ['icontains'],
        }

    def filter_user_groups_in(self, qs, name, value):
        if not value:
            return qs
        return qs.filter(
            user_group__in=value
        )

    @property
    def qs(self):
        return super().qs.select_related('user_group')


class TagFilter(AllowInitialFilterSetMixin, django_filters.FilterSet):
    project_in = IDListFilter(method='filter_project_in')

    class Meta:
        model = Tag
        fields = {
            'title': ['icontains'],
            'description': ['icontains'],
        }

    def filter_project_in(self, qs, name, value):
        if not value:
            return qs
        return qs.filter(
            project__in=value
        )

    @property
    def qs(self):
        return super().qs.select_related('project')
