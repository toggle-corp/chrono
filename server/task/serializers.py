from drf_dynamic_fields import DynamicFieldsMixin
from rest_framework import serializers

from .models import (Task, TimeSlot)
from user.models import User
from chrono.serializers import RemoveNullFieldsMixin
from user_resource.serializers import UserResourceSerializer


class TaskSerializer(DynamicFieldsMixin,
                     RemoveNullFieldsMixin,
                     UserResourceSerializer):
    class Meta:
        model = Task
        fields = ('__all__')

    def validate_project(self, project):
        if not project.can_get(self.context['request'].user):
            raise serializers.ValidationError('Invalid project')
        return project

    def validate_tags(self, tags):
        for tag in tags:
            if not tag.project.id == self.initial_data['project']:
                raise serializers.ValidationError(
                    'Tag {} does not belong to this project.'.format(tag.title)
                )
        return tags


class TimeSlotSerializer(DynamicFieldsMixin,
                         RemoveNullFieldsMixin,
                         serializers.ModelSerializer):
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
        # Popping here because, tags are many-to-many related fields and slot
        # object is not created yet, and not popping gives error
        tags = attrs.pop('tags')
        instance = TimeSlot(**attrs)
        instance.clean()
        # Setting tags here again so that relation can be created
        attrs['tags'] = tags
        return attrs

    def validate_tags(self, tags):
        for tag in tags:
            task = Task.objects.get(id=self.initial_data['task'])
            if not tag.project.id == task.project.id:
                raise serializers.ValidationError(
                    'Tag {} does not belong to this project.'.format(tag.title)
                )
        return tags


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


class TimeSlotStatsProjectWiseSerializer(RemoveNullFieldsMixin,
                                         serializers.ModelSerializer):
    user_display_name = serializers.CharField(
        source='profile.get_display_name'
    )
    project_title = serializers.CharField(source='project.title')
    project = serializers.IntegerField(source='project.id')
    total_tasks = serializers.IntegerField()
    total_time = serializers.DurationField()
    total_time_in_seconds = SecondsField(source='total_time')

    class Meta:
        model = User
        fields = (
            'id', 'total_tasks', 'user_display_name',
            'total_time', 'total_time_in_seconds',
            'project', 'project_title',
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
