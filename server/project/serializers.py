from drf_dynamic_fields import DynamicFieldsMixin

from project.models import Project
from user_resource.serializers import UserResourceSerializer


class ProjectSerializer(DynamicFieldsMixin, UserResourceSerializer):
    class Meta:
        model = Project
        fields = ('__all__')

    # TODO: Validate user_group
