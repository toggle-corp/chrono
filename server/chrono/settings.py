"""
Django settings for chrono project.
"""

import os
from urllib.parse import urlparse

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = (
    os.environ.get('DJANGO_SECRET_KEY') or 'qyywo&%0=ipb)7+m7d1jc2-^@v@9if18!^rggb)*_cfla3&4i@'
)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DJANGO_DEBUG', 'True').lower() == 'true'

ALLOWED_HOSTS = [os.environ.get('DJANGO_ALLOWED_HOST', '*')]

APPS_DIR = os.path.join(BASE_DIR, 'apps')

LOCAL_APPS = [
    'jwt_auth',
    'user',
    'user_group',
    'user_resource',
    'project',
    'task',
    'export',
]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'graphene_django',
    'graphene_graphiql_explorer',
    'django_filters',
    'corsheaders',
    'djangorestframework_camel_case',
    'drf_dynamic_fields',
    'rest_framework',
    'storages',
] + [
    '{}.{}.apps.{}Config'.format(
        APPS_DIR.split('/')[-1],
        app,
        ''.join([word.title() for word in app.split('_')]),
    ) for app in LOCAL_APPS
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'chrono.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(APPS_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'chrono.wsgi.application'


# Database

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DATABASE_NAME', 'postgres'),
        'USER': os.environ.get('DATABASE_USER', 'postgres'),
        'PASSWORD': os.environ.get('DATABASE_PASSWORD', 'postgres'),
        'PORT': os.environ.get('DATABASE_PORT', '5432'),
        'HOST': os.environ.get('DATABASE_HOST', 'db'),
    }
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Password validation

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.'
        'UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.'
        'MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.'
        'CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.'
        'NumericPasswordValidator',
    },
]

# Rest framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'jwt_auth.authentication.JwtAuthentication',
    ),
    'EXCEPTION_HANDLER': 'chrono.exception_handler.custom_exception_handler',
    'DEFAULT_RENDERER_CLASSES': (
        'djangorestframework_camel_case.render.CamelCaseJSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ),
    'DEFAULT_PARSER_CLASSES': (
        'djangorestframework_camel_case.parser.CamelCaseJSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser',
    ),
    'DEFAULT_VERSIONING_CLASS':
        'rest_framework.versioning.URLPathVersioning',

    'DEFAULT_PAGINATION_CLASS':
        'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 1000,
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
    ),
}
DEFAULT_VERSION = 'v1'


# Internationalization

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

if os.environ.get('DJANGO_USE_S3', 'False').lower() == 'true':
    # AWS S3 Bucket Credentials
    AWS_STORAGE_BUCKET_NAME_STATIC = os.environ[
        'DJANGO_AWS_STORAGE_BUCKET_NAME_STATIC']
    AWS_STORAGE_BUCKET_NAME_MEDIA = os.environ[
        'DJANGO_AWS_STORAGE_BUCKET_NAME_MEDIA']
    AWS_ACCESS_KEY_ID = os.environ['S3_AWS_ACCESS_KEY_ID']
    AWS_SECRET_ACCESS_KEY = os.environ['S3_AWS_SECRET_ACCESS_KEY']

    AWS_S3_FILE_OVERWRITE = False
    AWS_DEFAULT_ACL = 'private'
    AWS_QUERYSTRING_AUTH = True
    AWS_S3_CUSTOM_DOMAIN = None

    # Static cfonfiguration
    STATICFILES_LOCATION = 'server-static'
    STATIC_URL = "https://%s/%s/" % (AWS_S3_CUSTOM_DOMAIN,
                                     STATICFILES_LOCATION)
    STATICFILES_STORAGE = 'chrono.s3_storages.StaticStorage'

    # Media configuration
    MEDIAFILES_LOCATION = 'server-media'
    MEDIA_URL = "https://%s/%s/" % (AWS_S3_CUSTOM_DOMAIN, MEDIAFILES_LOCATION)
    DEFAULT_FILE_STORAGE = 'chrono.s3_storages.MediaStorage'

else:
    STATIC_URL = '/static/'
    STATIC_ROOT = '/static'

    MEDIA_URL = '/media/'
    MEDIA_ROOT = '/media'

HTTP_PROTOCOL = os.environ.get('HTTP_PROTOCOL', 'http')
CHRONO_FRONTEND_HOST = os.environ.get('CHRONO_FRONTEND_HOST', 'http://localhost:3000')
CHRONO_SITE_NAME = os.environ.get('CHRONO_SITE_NAME', 'Chrono')

# CORS CONFIGS
CORS_ORIGIN_ALLOW_ALL = True

CORS_URLS_REGEX = r'^/api/.*$'

CORS_ALLOW_METHODS = (
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
)

CORS_ALLOW_HEADERS = (
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
)

SESSION_COOKIE_NAME = 'chrono-sessionid'
CSRF_COOKIE_NAME = 'chrono-csrftoken'
if HTTP_PROTOCOL == 'https':
    SESSION_COOKIE_NAME = f'__Secure-{SESSION_COOKIE_NAME}'
    CSRF_COOKIE_NAME = f'__Secure-{CSRF_COOKIE_NAME}'

SESSION_COOKIE_DOMAIN = CSRF_COOKIE_DOMAIN = urlparse(CHRONO_FRONTEND_HOST).hostname

# https://docs.graphene-python.org/projects/django/en/latest/settings/
GRAPHENE = {
    'ATOMIC_MUTATIONS': True,
    'SCHEMA': 'chrono.schema.schema',
    'SCHEMA_OUTPUT': 'schema.json',
    'SCHEMA_INDENT': 2,
    'MIDDLEWARE': [
        'chrono.auth.WhiteListMiddleware',
    ],
}

GRAPHENE_DJANGO_EXTRAS = {
    'DEFAULT_PAGINATION_CLASS': 'graphene_django_extras.paginations.PageGraphqlPagination',
    'DEFAULT_PAGE_SIZE': 20,
    'MAX_PAGE_SIZE': 50
}

GRAPHENE_NODES_WHITELIST = (
    'login',
    'logout',
    'me',
    # __ double underscore nodes
    '__schema',
    '__type',
    '__typename',
)

STATICFILES_DIRS = [
    os.path.join(APPS_DIR, 'static'),
]
