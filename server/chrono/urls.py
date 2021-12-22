"""chrono URL Configuration
"""
import json
from django.contrib import admin
from django.conf.urls import (include, static, url)
from django.conf import settings
from django.urls import path
# from django.contrib.auth import views as auth_views
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
    TagViewSet
)
from task.views import (
    TaskViewSet,
    TimeSlotStatsViewSet,
    TimeSlotViewSet,
    TimeSlotStatsProjectWiseViewSet,
    TimeSlotStatsDayWiseViewSet,
    TimeSlotStatsTaskViewSet,
)

from export.views import ExportViewSet
from django.views.decorators.csrf import csrf_exempt
from graphene_file_upload.django import FileUploadGraphQLView
from utils.graphene.context import GQLContext

router = routers.DefaultRouter()

# User routers
router.register(r'users', UserViewSet, basename='user')

# User group registers
router.register(r'user-groups', UserGroupViewSet, basename='user_group')
router.register(r'group-memberships', GroupMembershipViewSet,
                basename='group_membership')

# Project, Phase routers
router.register(r'projects', ProjectViewSet, basename='project')

# Task, Time Slot routers
router.register(r'tasks', TaskViewSet, basename='task')

router.register(r'time-slots', TimeSlotViewSet, basename='time-slot')

router.register(r'tags', TagViewSet, basename='tag')

# Versioning : (v1|v2|v3)

API_PREFIX = r'^api/(?P<version>(v1|v2))/'


def get_api_path(path):
    return '{}{}'.format(API_PREFIX, path)


class CustomGraphQLView(FileUploadGraphQLView):
    """Handles multipart/form-data content type in django views"""
    def get_context(self, request):
        return GQLContext(request)

    def parse_body(self, request):
        """
        Allow for variable batch
        https://github.com/graphql-python/graphene-django/issues/967#issuecomment-640480919
        :param request:
        :return:
        """
        try:
            body = request.body.decode("utf-8")
            request_json = json.loads(body)
            self.batch = isinstance(request_json, list)
        except:  # noqa: E722
            self.batch = False
        return super().parse_body(request)


CustomGraphQLView.graphiql_template = "graphene_graphiql_explorer/graphiql.html"

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

    # TODO
    # url(r'^password/reset/done/$',
    #     auth_views.password_reset_done,
    #     name="password_rest_done"),

    # url(r'^password/reset/(?P<uidb64>[0-9A-Za-z]+)-(?P<token>.+)/$',
    #     auth_views.password_reset_confirm,
    #     {
    #         'post_reset_redirect': '{}://{}/login/'.format(
    #             settings.HTTP_PROTOCOL, settings.CHRONO_FRONTEND_HOST)
    #     },
    #     name="password_reset_confirm"),

    # url(r'^password/done/$',
    #     auth_views.password_reset_complete,
    #     name="password_reset_complete"),

    # url(r'^password/change/$',
    #     auth_views.password_change,
    #     name="password_change"),

    # url(r'^password/change/done/$',
    #     auth_views.password_change,
    #     name="password_change_done"),

    # Slot Stats API
    url(get_api_path(r'time-slots-stats/$'),
        TimeSlotStatsViewSet.as_view(),
        name='time-slot-stat'),
    url(get_api_path(r'time-slots-stats/project-wise/$'),
        TimeSlotStatsProjectWiseViewSet.as_view(),
        name='time-slot-stat-project-wise'),
    url(get_api_path(r'time-slots-stats/day-wise/$'),
        TimeSlotStatsDayWiseViewSet.as_view(),
        name='time-slot-stat-day-wise'),
    url(get_api_path(r'time-slots-stats/task-wise/$'),
        TimeSlotStatsTaskViewSet.as_view(),
        name='time-slot-stat-task-wise'),

    # Export Urls
    url(get_api_path(r'export/$'),
        ExportViewSet.as_view(),
        name='export'),

    # Viewsets
    url(get_api_path(''), include(router.urls)),
    path('graphiql/', csrf_exempt(CustomGraphQLView.as_view(graphiql=True))),
    path('graphql/', csrf_exempt(CustomGraphQLView.as_view())),
] + static.static(
    settings.MEDIA_URL, view=xframe_options_exempt(serve),
    document_root=settings.MEDIA_ROOT)
