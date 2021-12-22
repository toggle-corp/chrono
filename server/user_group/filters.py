import django_filters
from utils.filters import AllowInitialFilterSetMixin
from project.models import UserGroup, GroupMembership
from utils.filters import IDListFilter


class UserGroupFilter(AllowInitialFilterSetMixin, django_filters.FilterSet):
    members_in = IDListFilter(method='filter_members_in')

    class Meta:
        model = UserGroup
        fields = {
            'title': ['icontains'],
            'description': ['icontains'],
        }

    def filter_members_in(self, qs, name, value):
        if not value:
            return qs
        return qs.filter(
            members__in=value
        )

    @property
    def qs(self):
        return super().qs.prefetch_related('members')


class GroupMembershipFilter(AllowInitialFilterSetMixin, django_filters.FilterSet):
    member_in = IDListFilter(method='filter_member_in')
    group_in = IDListFilter(method='filter_group_in')

    class Meta:
        model = GroupMembership
        fields = {
            'role': ['icontains'],
        }

    def filter_member_in(self, qs, name, value):
        if not value:
            return qs
        return qs.filter(
            member__in=value
        )

    def filter_group_in(self, qs, name, value):
        if not value:
            return qs
        return qs.filter(
            group__in=value
        )

    @property
    def qs(self):
        return super().qs.select_related('member', 'group')
