import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")

DEBUG = True

ALLOWED_HOSTS = ["*"]

TIME_ZONE = "Asia/Kolkata"
USE_TZ = True  # Keep this True if you're using timezone-aware datetimes

CSRF_TRUSTED_ORIGINS = ["http://localhost", "http://127.0.0.1"]
# SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

CORS_ALLOW_ALL_ORIGINS = True  # Allow all origins (Use cautiously in production)

# OR restrict to specific origins
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # React's default Vite server
    "http://127.0.0.1:5173",
]

CORS_ALLOW_CREDENTIALS = True  # Allow sending cookies with requests


INSTALLED_APPS = [
    "daphne",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "rest_framework_simplejwt",
    'rest_framework_simplejwt.token_blacklist',
    "channels",
    "accounts",
    "chat",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

AUTH_USER_MODEL = "accounts.User"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "chat/templates")],  # Add this
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

ASGI_APPLICATION = "config.asgi.application"
WSGI_APPLICATION = "config.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "chat_db",
        "USER": "chat_user",
        "PASSWORD": "chat@admin",
        "HOST": "localhost",
        "PORT": "5432",
    }
}

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("127.0.0.1", 6379)],
        },
    }
}

AUTHENTICATION_BACKENDS = ("django.contrib.auth.backends.ModelBackend",)

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
}

STATIC_URL = "/static/"
# STATICFILES_DIRS = [
#     os.path.join(BASE_DIR, "static")
# ]  # Optional if you have a 'static' folder
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")  # Required for collectstatic
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


from datetime import timedelta

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=7),  # Set access token to 7 days
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),  # Set refresh token to 30 days
    "SIGNING_KEY": os.getenv("SECRET_KEY", "your-secret-key"),
    "AUTH_HEADER_TYPES": ("Bearer",),
}
