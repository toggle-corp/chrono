from chrono.serializers import NestedUpdateMixin, NestedCreateMixin
from rest_framework import serializers


class UserResourceSerializer(NestedCreateMixin,
                             NestedUpdateMixin,
                             serializers.ModelSerializer):

    created_at = serializers.DateTimeField(read_only=True)
    modified_at = serializers.DateTimeField(read_only=True)
    created_by = serializers.PrimaryKeyRelatedField(read_only=True)
    modified_by = serializers.PrimaryKeyRelatedField(read_only=True)
    created_by_name = serializers.CharField(
        source='created_by.profile.get_display_name',
        read_only=True)
    modified_by_name = serializers.CharField(
        source='modified_by.profile.get_display_name',
        read_only=True)

    def create(self, validated_data):
        resource = super(UserResourceSerializer, self).create(validated_data)
        resource.created_by = self.context['request'].user
        resource.modified_by = self.context['request'].user
        resource.save()
        return resource

    def update(self, instance, validated_data):
        resource = super(UserResourceSerializer, self).update(
            instance, validated_data)
        resource.modified_by = self.context['request'].user
        resource.save()
        return resource
