from django.contrib.postgres.fields import JSONField
from django.db import models

from project.models import Phase
from user_resource.models import UserResource
from user.models import User


class Task(UserResource):
    """
    Project model
    """

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    phase = models.ForeignKey(
            Phase,
            on_delete=models.CASCADE,
            # blank=True,
        )
    data = JSONField(default=None, blank=True, null=True)

    def __str__(self):
        return self.title

    @staticmethod
    def get_for(user):
        """
        Project can be accessed only if
        * user is member of a group in the project
        """
        return Task.objects.filter(
            models.Q(phase__in=Phase.get_for(user))
        ).distinct()

    def can_get(self, user):
        return self.phase.can_get(user)

    def can_modify(self, user):
        return self.phase.can_get(user)


class TimeSlot(models.Model):
    """
    Phase model
    """

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    start_date = models.DateTimeField(default=None, null=True, blank=True)
    end_date = models.DateTimeField(default=None, null=True, blank=True)

    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    data = JSONField(default=None, blank=True, null=True)

    def __str__(self):
        return self.title

    @staticmethod
    def get_for(user):
        """
        Phases can be accessed only if
        * user is member of a group of the related project
        """
        return TimeSlot.objects.filter(
            models.Q(task__in=Task.get_for(user))
        ).distinct()

    def can_get(self, user):
        return self.task.can_get(user)

    def can_modify(self, user):
        return self.task.can_get(user)
