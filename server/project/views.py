from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend

from chrono.permissions import ModifyPermission
from .models import Project
from .serializers import ProjectSerializer

import logging

logger = logging.getLogger(__name__)


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated,
                          ModifyPermission]
    filter_classes = [DjangoFilterBackend]
    filter_fields = ['user_group']

    def get_queryset(self):
        return Project.get_for(self.request.user)
