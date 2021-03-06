from django.contrib.auth.models import User
from django.db import models


class UserGroup(models.Model):
    """
    User group model
    """
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    members = models.ManyToManyField(User, blank=True,
                                     through='GroupMembership')

    def __str__(self):
        return self.title

    @staticmethod
    def get_for(user):
        """
        UserGroup can be accessed only if user is a member
        """
        return UserGroup.objects.filter(members=user).distinct()

    @staticmethod
    def get_modifiable_for(user):
        return UserGroup.objects.filter(
            groupmembership__in=GroupMembership.objects.filter(
                member=user,
                role='admin',
            )
        ).distinct()

    def can_get(self, user):
        return user in self.members.all()

    def can_modify(self, user):
        return GroupMembership.objects.filter(
            group=self,
            member=user,
            role='admin',
        ).exists()


class GroupMembership(models.Model):
    """
    User group-Member relationship attributes
    """
    ROLES = [
        ('normal', 'Normal'),
        ('admin', 'Admin'),
    ]

    member = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(UserGroup, on_delete=models.CASCADE)
    role = models.CharField(max_length=100, choices=ROLES,
                            default='normal')
    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return '{} @ {}'.format(str(self.member),
                                self.group.title)

    class Meta:
        unique_together = ('member', 'group')

    @staticmethod
    def get_for(user):
        return GroupMembership.objects.filter(
            group__members=user).distinct()

    def can_get(self, user):
        return self.group.can_get(user)

    def can_modify(self, user):
        return self.group.can_modify(user)
