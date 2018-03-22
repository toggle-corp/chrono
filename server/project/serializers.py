from rest_framework import serializers
from drf_dynamic_fields import DynamicFieldsMixin

from project.models import Project
from user_resource.serializers import UserResourceSerializer


class ProjectSerializer(DynamicFieldsMixin, UserResourceSerializer):
    class Meta:
        model = Project
        fields = ('__all__')

    def validate_user_group(self, group):
        if not group.can_get(self.context['request'].user):
            raise serializers.Validations('Invalid user group')
        return group
