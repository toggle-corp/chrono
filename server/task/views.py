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
        return Task.get_for(self.request.user)


class TimeSlotViewSet(viewsets.ModelViewSet):
    serializer_class = TimeSlotSerializer
    permission_classes = [permissions.IsAuthenticated,
                          ModifyPermission]

    def get_queryset(self):
        return TimeSlot.get_for(self.request.user)

    # TODO: Auto set user from request.user
