from drf_dynamic_fields import DynamicFieldsMixin
from rest_framework import serializers
from .models import (Task, TimeSlot)
from user.models import User
from chrono.serializers import RemoveNullFieldsMixin
from user_resource.serializers import UserResourceSerializer


class TaskSerializer(DynamicFieldsMixin,
                     RemoveNullFieldsMixin,
                     UserResourceSerializer):
    userGroup = serializers.IntegerField(
        source='project.user_group.id', read_only=True,
    )

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
    user_group_display_name = serializers.CharField()
    project_display_name = serializers.CharField()
    user_display_name = serializers.CharField()
    # task
    task_display_name = serializers.CharField()
    task_description = serializers.CharField()
    # Time
    total_time = serializers.DurationField()
    total_time_in_seconds = serializers.IntegerField()

    class Meta:
        model = TimeSlot
        exclude = ()


class SecondsField(serializers.Field):
    def to_representation(self, dt):
        return int(dt.total_seconds())


class TimeSlotStatsProjectWiseSerializer(RemoveNullFieldsMixin, serializers.Serializer):
    id = serializers.CharField(source='key')
    user_display_name = serializers.CharField()
    project_title = serializers.CharField()
    project = serializers.IntegerField()
    total_tasks = serializers.IntegerField()
    total_time = serializers.DurationField()
    total_time_in_seconds = SecondsField(source='total_time')


class DeprecatedUserStatsSerializer(RemoveNullFieldsMixin, serializers.ModelSerializer):
    total_time = serializers.DurationField()
    total_time_in_seconds = SecondsField(source='total_time')

    class Meta:
        model = User
        fields = ('id', 'total_time', 'total_time_in_seconds')


class DeprecatedTimeSlotStatsDayWiseSerializer(RemoveNullFieldsMixin, serializers.Serializer):
    date = serializers.DateField()
    users = DeprecatedUserStatsSerializer(many=True)


class TimeSlotStatsUserWiseSerializer(RemoveNullFieldsMixin, serializers.Serializer):
    user = serializers.IntegerField()
    user_display_name = serializers.CharField()
    total_time = serializers.DurationField()
    total_time_in_seconds = SecondsField(source='total_time')


class TimeSlotStatsDayWiseSerializer(RemoveNullFieldsMixin, serializers.Serializer):
    date = serializers.DateField()
    total_time = serializers.DurationField()
    total_time_in_seconds = SecondsField(source='total_time')


class TimeSlotStatsUserDayWiseSerializer(RemoveNullFieldsMixin, serializers.Serializer):
    date = serializers.DateField()
    user = serializers.IntegerField()
    total_time = serializers.DurationField()
    total_time_in_seconds = SecondsField(source='total_time')


class TimeSlotStatsTaskSerializer(RemoveNullFieldsMixin, serializers.Serializer):
    project = serializers.IntegerField()
    project_display_name = serializers.CharField()
    task = serializers.IntegerField()
    task_display_name = serializers.CharField()
    total_time = serializers.DurationField()
    total_time_in_seconds = SecondsField(source='total_time')
