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
    class Meta:
        model = TimeSlot
        fields = ('__all__')

    def validate_task(self, task):
        if not task.can_get(self.context['request'].user):
            raise serializers.Validations('Invalid task')
        return task

    def validate(self, attrs):
        instance = TimeSlot(**attrs)
        instance.clean()
        return attrs
