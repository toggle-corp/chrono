from rest_framework import viewsets, permissions

from chrono.permissions import ModifyPermission
from .models import (Task, TimeSlot)
from .serializers import (TaskSerializer, TimeSlotSerializer)

import logging

logger = logging.getLogger(__name__)


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated,
                          ModifyPermission]

    def get_queryset(self):
        user = self.request.GET.get('user', self.request.user)
        projects = Task.get_for(user)

        user_group = self.request.GET.get('user_group')
        if user_group:
            projects = projects.filter(user_group=user_group)

        return projects


class TimeSlotViewSet(viewsets.ModelViewSet):
    serializer_class = TimeSlotSerializer
    permission_classes = [permissions.IsAuthenticated,
                          ModifyPermission]

    def get_queryset(self):
        user = self.request.GET.get('user', self.request.user)
        phases = TimeSlot.get_for(user)

        user_group = self.request.GET.get('user_group')
        if user_group:
            phases = phases.filter(user_group=user_group)

        return phases
