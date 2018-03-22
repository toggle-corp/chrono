from rest_framework import viewsets, permissions

from chrono.permissions import ModifyPermission
from .models import Project
from .serializers import ProjectSerializer

import logging

logger = logging.getLogger(__name__)


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated,
                          ModifyPermission]

    def get_queryset(self):
        return Project.get_for(self.request.user)
