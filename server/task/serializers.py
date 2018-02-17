from drf_dynamic_fields import DynamicFieldsMixin

from .models import (Task, TimeSlot)
from user_resource.serializers import UserResourceSerializer


class TaskSerializer(DynamicFieldsMixin, UserResourceSerializer):
    class Meta:
        model = Task
        fields = ('id', 'title', 'description', 'phase', 'data',
                  'created_at', 'created_by', 'modified_at', 'modified_by',
                  'created_by_name', 'modified_by_name')


class TimeSlotSerializer(DynamicFieldsMixin, UserResourceSerializer):
    class Meta:
        model = TimeSlot
        fields = ('__all__')
