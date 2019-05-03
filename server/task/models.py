from datetime import datetime

from django.core.exceptions import ValidationError
from django.db import models

from user_resource.models import UserResource
from user.models import User
from project.models import Project, Tag


class Task(UserResource):
    """
    Task model
    """

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='tasks'
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    tags = models.ManyToManyField('project.Tag', blank=True)

    def __str__(self):
        return self.title

    @staticmethod
    def get_for(user):
        """
        Same logic as project
        """
        return Task.objects.filter(
            project__user_group__members=user
        ).distinct()

    def can_get(self, user):
        return self.project.can_get(user)

    def can_modify(self, user):
        return self.project.can_get(user)

    def get_timeslots_for(self, user, filters):
        return TimeSlot.objects.filter(task=self, user=user, **filters)

    def get_duration_for(self, user, filters):
        slots = self.get_timeslots_for(user, filters)
        return sum([x.duration for x in slots])


class TimeSlot(models.Model):
    """
    Timeslot model
    """
    date = models.DateField()
    start_time = models.TimeField()
    # Null end time indicates a task that is actively going on
    end_time = models.TimeField(default=None, blank=True, null=True)

    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    tags = models.ManyToManyField(Tag, blank=True)

    remarks = models.TextField(blank=True)

    def __str__(self):
        return '{} by {} at {}'.format(
            self.task.title,
            str(self.user),
            str(self.start_time),
        )

    def clean(self):
        """
        Timeslot validation:
        Make sure, no other timeslots for this date overlaps with this
        """
        if self.end_time and self.start_time > self.end_time:
            raise ValidationError('start_time must be less than end_time')

        time_condition = models.Q(
            start_time__lt=self.start_time,
            end_time__gt=self.start_time,
        )
        if self.end_time:
            time_condition |= models.Q(
                    start_time__lt=self.end_time,
                    end_time__gt=self.end_time,
                )
        if TimeSlot.objects.exclude(pk=self.pk) \
                .filter(
                    time_condition,
                    date=self.date,
                    user=self.user,
                    task__project=self.task.project,
                ).exists():
            raise ValidationError('This time slot overlaps with another '
                                  'for this day')

    @staticmethod
    def get_for(user):
        """
        Timeslot can be accessed by the user who created it
        """
        return TimeSlot.objects.filter(user=user)

    def total_time(self):
        return (
            datetime.combine(datetime.now(), self.end_time) -
            datetime.combine(datetime.now(), self.start_time)
        )

    def total_time_in_seconds(self):
        return self.total_time().total_seconds()

    def can_get(self, user):
        return self.user == user

    def can_modify(self, user):
        return self.user == user

    @property
    def duration(self):
        """Return duration in hours"""
        if not self.end_time:
            # TODO: provide some value by calculation if not end time
            return 0
        enddatetime = datetime.combine(self.date, self.end_time)
        startdatetime = datetime.combine(self.date, self.start_time)
        diff = enddatetime - startdatetime
        secs = round(diff.total_seconds(), 0)
        return round(secs / 3600.0, 2)


class Remark(UserResource):
    """
    Record Remark for a particular day.
    For Example: it could be a holiday, sick leave, office event.
    """
    PUBLIC_HOLIDAY = 'public_holiday'
    OFFICE_HOLIDAY = 'office_holiday'
    SICK_LEAVE = 'sick_leave'
    OFFICE_EVENT = 'office_event'
    MISCELLANEOUS = 'miscellaneous'

    REMARK_CHOICES = (
        (PUBLIC_HOLIDAY, 'Public Holiday'),
        (OFFICE_HOLIDAY, 'Office Holiday'),
        (SICK_LEAVE, 'Sick Leave'),
        (OFFICE_EVENT, 'Office Event'),
        (MISCELLANEOUS, 'Miscellaneous'),
    )

    description = models.TextField(blank=True)
    type = models.CharField(max_length=64, choices=REMARK_CHOICES)
    date = models.DateField()

    @staticmethod
    def get_for(user):
        """
        Get Remark for user
        """
        return Remark.objects.filter(
            created_by=user
        ).distinct()

    def __str__(self):
        return '{} - {} - {}'.format(
            self.type,
            self.date.isoformat(),
            self.created_by
        )
