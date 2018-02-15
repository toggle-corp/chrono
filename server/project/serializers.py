from drf_dynamic_fields import DynamicFieldsMixin

from project.models import (Project, Phase)
from user_resource.serializers import UserResourceSerializer


class ProjectSerializer(DynamicFieldsMixin, UserResourceSerializer):
    class Meta:
        model = Project
        fields = ('id', 'title', 'description', 'start_date', 'end_date',
                  'user_group', 'data',
                  'created_at', 'created_by', 'modified_at', 'modified_by',
                  'created_by_name', 'modified_by_name')


class PhaseSerializer(DynamicFieldsMixin, UserResourceSerializer):
    class Meta:
        model = Phase
        fields = ('id', 'title', 'description', 'project', 'data',
                  'created_at', 'created_by', 'modified_at', 'modified_by',
                  'created_by_name', 'modified_by_name')
