"""chrono URL Configuration
"""
from django.contrib import admin
from django.conf.urls import static
from django.conf import settings
from django.urls import path
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.static import serve


urlpatterns = [
    path('admin/', admin.site.urls),
] + static.static(
    settings.MEDIA_URL, view=xframe_options_exempt(serve),
    document_root=settings.MEDIA_ROOT)
