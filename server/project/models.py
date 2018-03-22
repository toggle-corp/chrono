from django.db import models
from user_resource.models import UserResource
from user_group.models import (UserGroup, GroupMembership)


class Project(UserResource):
    """
    Project model
    """

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    user_group = models.ForeignKey(UserGroup, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

    @staticmethod
    def get_for(user):
        """
        Project can be accessed only if
        * user is member of a group in the project
        """
        return Project.objects.filter(
            user_group__members=user
        ).distinct()

    def can_get(self, user):
        return GroupMembership.objects.filter(
            group=self.user_group,
            member=user,
        ).exists()

    def can_modify(self, user):
        return GroupMembership.objects.filter(
            group=self.user_group,
            member=user,
        ).exists()
