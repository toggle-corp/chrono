from factory.django import DjangoModelFactory
import factory
from factory import fuzzy
from user_group.models import UserGroup, GroupMembership
from user.factories import UserFactory


class UserGroupFactory(DjangoModelFactory):

    title = fuzzy.FuzzyText(length=50)
    description = fuzzy.FuzzyText(length=50)
    # members = factory.RelatedFactory(GroupMembershipFactory, "user")

    class Meta:
        model = UserGroup


class GroupMembershipFactory(DjangoModelFactory):
    member = factory.SubFactory(UserFactory)
    group = factory.SubFactory(UserGroupFactory)
    role = fuzzy.FuzzyChoice(GroupMembership.ROLES)

    class Meta:
        model = GroupMembership
