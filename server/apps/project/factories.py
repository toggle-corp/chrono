from factory.django import DjangoModelFactory
from project.models import Project, Tag
import factory
from factory import fuzzy
from user_group.factories import UserGroupFactory


class ProjectFactory(DjangoModelFactory):

    title = fuzzy.FuzzyText(length=50)
    description = fuzzy.FuzzyText(length=50)
    user_group = factory.SubFactory(UserGroupFactory)

    class Meta:
        model = Project


class TagFactory(DjangoModelFactory):

    title = fuzzy.FuzzyText(length=50)
    description = fuzzy.FuzzyText(length=50)
    project = factory.SubFactory(ProjectFactory)

    class Meta:
        model = Tag
