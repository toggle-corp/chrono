from django.contrib import admin
from .models import (Task, TimeSlot, DateRemark)


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    pass


@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    pass


@admin.register(DateRemark)
class DateRemarkAdmin(admin.ModelAdmin):
    pass
