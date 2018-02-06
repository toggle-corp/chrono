from django.contrib.postgres.fields import JSONField
from django.db import models
from user_resource.models import UserResource
from user_group.models import (UserGroup, GroupMembership)


class Project(UserResource):
    """
    Project model
    """

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    start_date = models.DateField(default=None, null=True, blank=True)
    end_date = models.DateField(default=None, null=True, blank=True)

    user_group = models.ForeignKey(
            UserGroup,
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
        return Project.objects.filter(
            models.Q(user_group__members=user)
        ).distinct()

    def can_get(self, user):
        return self in Project.get_for(user)

    def can_modify(self, user):
        return GroupMembership.objects.filter(
            group=self.user_group,
            member=user,
        ).exists()


class Phase(UserResource):
    """
    Phase model
    """

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    project = models.ForeignKey(
            Project,
            on_delete=models.CASCADE,
            # blank=True,
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
        return Phase.objects.filter(
            models.Q(project__in=Project.get_for(user))
        ).distinct()

    def can_get(self, user):
        return self.project.can_get(user)

    def can_modify(self, user):
        return self.project.can_get(user)
