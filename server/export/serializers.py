from rest_framework import serializers

from chrono.serializers import RemoveNullFieldsMixin
from export.models import Export


class ExportSerializer(RemoveNullFieldsMixin,
                       serializers.ModelSerializer):
    class Meta:
        model = Export
        fields = '__all__'


class ExportTriggerSerializer(RemoveNullFieldsMixin,
                              serializers.Serializer):
    project_id = serializers.IntegerField()
    export_type = serializers.CharField()
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    # TODO: this is now just project specific
