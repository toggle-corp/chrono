from collections import OrderedDict

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

    def project_summary_json(self, filters={}):
        data = OrderedDict()
        users = self.user_group.members.all()
        for task in self.tasks.all():
            data[task.title] = OrderedDict(
                (user.username, task.get_duration_for(user, filters))
                for user in users
            )

    def project_summary_csv(self, filters={}):
        # first get json data
        jsondata = self.project_summary_json(filters)
        # extract columns
        first_row_key = list(jsondata.keys())[0]
        first_item = jsondata[first_row_key]

        cols = [k for k, _ in first_item.items()]

        columns = ['Tasks\\Users'] + cols + ['TOTAL']
        rows = [
            [k, *[m for _, m in v.items()]]
            for k, v in self.data.items()
        ]
        # add total field in rows
        rows = [row + [sum(row[1:])] for row in rows]
        # now add total for each col
        colssum = [
            sum([row[i] for row in rows])
            for i in range(1, len(columns))
        ]
        rows.append(
            ['TOTAL', *colssum]
        )
        # return list of rows including columns rows
        return [columns, *rows]
