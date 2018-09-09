from rest_framework import serializers
from drf_dynamic_fields import DynamicFieldsMixin

from chrono.serializers import RemoveNullFieldsMixin
from user_resource.serializers import UserResourceSerializer
from project.models import Project, Tag


class ProjectSerializer(DynamicFieldsMixin,
                        RemoveNullFieldsMixin,
                        UserResourceSerializer):
    class Meta:
        model = Project
        fields = ('__all__')

    def validate_user_group(self, group):
        if not group.can_get(self.context['request'].user):
            raise serializers.Validations('Invalid user group')
        return group


class ProjectExportSerializer(RemoveNullFieldsMixin,
                              serializers.Serializer):
    export_format = serializers.CharField()
    start_date = serializers.DateField()
    end_date = serializers.DateField()


class TagSerializer(DynamicFieldsMixin, UserResourceSerializer):
    class Meta:
        model = Tag
        fields = ('__all__')


class TagShortSerializer(serializers.Serializer):
    title = serializers.CharField(required=False)
    id = serializers.IntegerField()
    project = serializers.PrimaryKeyRelatedField(read_only=True)
