from django.contrib import admin
from .models import Project, Tag


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    pass


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    pass
