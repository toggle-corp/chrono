from rest_framework import viewsets, permissions

from chrono.permissions import ModifyPermission
from .models import (Project, Phase)
from .serializers import (ProjectSerializer, PhaseSerializer)

import logging

logger = logging.getLogger(__name__)


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated,
                          ModifyPermission]

    def get_queryset(self):
        user = self.request.GET.get('user', self.request.user)
        projects = Project.get_for(user)

        user_group = self.request.GET.get('user_group')
        if user_group:
            projects = projects.filter(user_group=user_group)

        return projects


class PhaseViewSet(viewsets.ModelViewSet):
    serializer_class = PhaseSerializer
    permission_classes = [permissions.IsAuthenticated,
                          ModifyPermission]

    def get_queryset(self):
        user = self.request.GET.get('user', self.request.user)
        phases = Phase.get_for(user)

        user_group = self.request.GET.get('user_group')
        if user_group:
            phases = phases.filter(user_group=user_group)

        return phases
