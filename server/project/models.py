from collections import OrderedDict

from django.db import models
from user_resource.models import UserResource
from user_group.models import (UserGroup, GroupMembership)
from utils.common import json_to_csv_data


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

    def project_summary_json(self, filters={}):
        data = OrderedDict()
        users = self.user_group.members.all()
        for task in self.tasks.all():
            data[task.title] = OrderedDict(
                (user.username, task.get_duration_for(user, filters))
                for user in users
            )
        return data

    def project_summary_csv(self, filters={}):
        # first get json data
        jsondata = self.project_summary_json(filters)

        return json_to_csv_data(
            jsondata, rowheading="Tasks", colheading="Users",
            col_total=True,
            row_total=True
        )
