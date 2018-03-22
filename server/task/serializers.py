from drf_dynamic_fields import DynamicFieldsMixin
from rest_framework import serializers

from .models import (Task, TimeSlot)
from user_resource.serializers import UserResourceSerializer


class TaskSerializer(DynamicFieldsMixin, UserResourceSerializer):
    class Meta:
        model = Task
        fields = ('__all__')

    # TODO: Validate project


class TimeSlotSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = ('__all__')

    # TODO: Validate task

    def validate(self, attrs):
        instance = TimeSlot(**attrs)
        instance.clean()
        return attrs
