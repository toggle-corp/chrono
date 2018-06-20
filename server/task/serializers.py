from drf_dynamic_fields import DynamicFieldsMixin
from rest_framework import serializers

from .models import (Task, TimeSlot)
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
    total_time = serializers.IntegerField()

    class Meta:
        model = TimeSlot
        exclude = ()
