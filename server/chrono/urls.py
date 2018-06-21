"""chrono URL Configuration
"""
from django.contrib import admin
from django.conf.urls import (include, static, url)
from django.conf import settings
from django.urls import path
from django.contrib.auth import views as auth_views
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.static import serve

from rest_framework import routers

from jwt_auth.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from user.views import (
    UserViewSet,
    PasswordResetView,
)
from user_group.views import (
    GroupMembershipViewSet,
    UserGroupViewSet,
)
from project.views import (
    ProjectViewSet,
)
from task.views import (
    TaskViewSet,
    TimeSlotStatsViewSet,
    TimeSlotViewSet,
)

router = routers.DefaultRouter()

# User routers
router.register(r'users', UserViewSet,
                base_name='user')

# User group registers
router.register(r'user-groups', UserGroupViewSet,
                base_name='user_group')
router.register(r'group-memberships', GroupMembershipViewSet,
                base_name='group_membership')

# Project, Phase routers
router.register(r'projects', ProjectViewSet,
                base_name='project')

# Task, Time Slot routers
router.register(r'tasks', TaskViewSet,
                base_name='task')

router.register(r'time-slots', TimeSlotViewSet,
                base_name='time-slot')

# Versioning : (v1|v2|v3)

API_PREFIX = r'^api/(?P<version>(v1))/'


def get_api_path(path):
    return '{}{}'.format(API_PREFIX, path)


urlpatterns = [
    path('admin/', admin.site.urls),

    # JWT Authentication
    url(get_api_path(r'token/$'),
        TokenObtainPairView.as_view()),

    url(get_api_path(r'token/refresh/$'),
        TokenRefreshView.as_view()),

    # password reset
    url(get_api_path(r'password/reset/$'),
        PasswordResetView.as_view()),

    url(r'^password/reset/done/$',
        auth_views.password_reset_done,
        name="password_rest_done"),

    url(r'^password/reset/(?P<uidb64>[0-9A-Za-z]+)-(?P<token>.+)/$',
        auth_views.password_reset_confirm,
        {
            'post_reset_redirect': '{}://{}/login/'.format(
                settings.HTTP_PROTOCOL, settings.CHRONO_FRONTEND_HOST)
        },
        name="password_reset_confirm"),

    url(r'^password/done/$',
        auth_views.password_reset_complete,
        name="password_reset_complete"),

    url(r'^password/change/$',
        auth_views.password_change,
        name="password_change"),

    url(r'^password/change/done/$',
        auth_views.password_change,
        name="password_change_done"),

    url(get_api_path(r'time-slots-stats/$'),
        TimeSlotStatsViewSet.as_view(),
        name='time-slot-stat'),

    # Viewsets
    url(get_api_path(''), include(router.urls)),
] + static.static(
    settings.MEDIA_URL, view=xframe_options_exempt(serve),
    document_root=settings.MEDIA_ROOT)
