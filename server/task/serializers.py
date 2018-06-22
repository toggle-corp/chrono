from drf_dynamic_fields import DynamicFieldsMixin
from rest_framework import serializers

from .models import (Task, TimeSlot)
from user.models import User
from user_resource.serializers import UserResourceSerializer


class TaskSerializer(DynamicFieldsMixin, UserResourceSerializer):
    class Meta:
        model = Task
        fields = ('__all__')

    def validate_project(self, project):
        if not project.can_get(self.context['request'].user):
            raise serializers.Validations('Invalid project')
        return project


class TimeSlotSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    userGroup = serializers.IntegerField(
        source='task.project.user_group.pk',
        read_only=True,
    )
    project = serializers.IntegerField(
        source='task.project.pk',
        read_only=True,
    )

    class Meta:
        model = TimeSlot
        exclude = ('user',)  # can be obtained from context

    def validate_task(self, task):
        if not task.can_get(self.context['request'].user):
            raise serializers.Validations('Invalid task')
        return task

    def validate(self, attrs):
        attrs['user'] = self.context['request'].user
        if self.instance:
            attrs['id'] = self.instance.id
        instance = TimeSlot(**attrs)
        instance.clean()
        return attrs


class TimeSlotStatsSerializer(TimeSlotSerializer):
    # user group
    user_group_display_name = serializers.CharField(
        source='task.project.user_group.title'
    )
    # project
    project_display_name = serializers.CharField(source='task.project.title')
    # user
    user_display_name = serializers.CharField(
        source='user.profile.get_display_name'
    )
    # task
    task_display_name = serializers.CharField(source='task.title')
    task_description = serializers.CharField(source='task.description')
    # Time
    total_time = serializers.DurationField()
    total_time_in_seconds = serializers.IntegerField()

    class Meta:
        model = TimeSlot
        exclude = ()


class SecondsField(serializers.Field):
    def to_representation(self, dt):
        return int(dt.total_seconds())


class TimeSlotStatsProjectWiseSerializer(serializers.ModelSerializer):
    user_display_name = serializers.CharField(
        source='profile.get_display_name'
    )
    total_tasks = serializers.IntegerField()
    total_time = serializers.DurationField()
    total_time_in_seconds = SecondsField(source='total_time')

    class Meta:
        model = User
        fields = (
            'id', 'total_tasks', 'user_display_name',
            'total_time', 'total_time_in_seconds',
        )


class UserStatsSerializer(serializers.ModelSerializer):
    total_time = serializers.DurationField()
    total_time_in_seconds = SecondsField(source='total_time')

    class Meta:
        model = User
        fields = ('id', 'total_time', 'total_time_in_seconds')


class TimeSlotStatsDayWiseSerializer(serializers.Serializer):
    date = serializers.DateField()
    users = UserStatsSerializer(many=True)
