import django_filters
from task.models import Task, TimeSlot
from utils.filters import AllowInitialFilterSetMixin
from utils.filters import IDListFilter


class TaskFilter(AllowInitialFilterSetMixin, django_filters.FilterSet):
    project_in = IDListFilter(method='filter_project_in')
    tags_in = IDListFilter(method='filter_tags_in')

    class Meta:
        model = Task
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

    def filter_tags_in(self, qs, name, value):
        if not value:
            return qs
        return qs.filter(
            tags__in=value
        )

    @property
    def qs(self):
        return super().qs.select_related('project').prefetch_related('tags')


class TimeSlotFilter(AllowInitialFilterSetMixin, django_filters.FilterSet):
    task_in = IDListFilter(method='filter_task_in')
    user_in = IDListFilter(method='filter_user_in')
    tags_in = IDListFilter(method='filter_tags_in')

    class Meta:
        model = TimeSlot
        fields = {
            'date': ['gt', 'lt', 'gte', 'lte'],
            'start_time': ['gt', 'lt', 'gte', 'lte'],
            'end_time': ['gt', 'lt', 'gte', 'lte'],
            'remarks': ['icontains']
        }

    def filter_task_in(self, qs, name, value):
        if not value:
            return qs
        return qs.filter(
            task__in=value
        )

    def filter_user_in(self, qs, name, value):
        if not value:
            return qs
        return qs.filter(
            user__in=value
        )

    def filter_tags_in(self, qs, name, value):
        if not value:
            return qs
        return qs.filter(
            tags__in=value
        )

    @property
    def qs(self):
        return super().qs.select_related('user').prefetch_related('tags')
