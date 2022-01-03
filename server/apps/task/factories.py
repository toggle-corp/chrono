import factory
from factory import fuzzy
import datetime
import random
from factory.django import DjangoModelFactory
from task.models import Task, TimeSlot
from project.factories import ProjectFactory
from user.factories import UserFactory


class TaskFactory(DjangoModelFactory):

    project = factory.SubFactory(ProjectFactory)
    title = fuzzy.FuzzyText(length=50)
    description = fuzzy.FuzzyText(length=50)

    class Meta:
        model = Task


class TimeSlotFactory(DjangoModelFactory):

    date = fuzzy.FuzzyDate(
        datetime.date(2018, 1, 1),
        datetime.date(2021, 12, 31),
    )
    start_time = f'{random.randint(2, 8)}:00:00'
    end_time = f'{random.randint(12, 18)}:00:00'
    task = factory.SubFactory(TaskFactory)
    user = factory.SubFactory(UserFactory)
    remarks = fuzzy.FuzzyText(length=50)

    class Meta:
        model = TimeSlot
