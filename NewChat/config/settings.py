import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# Secret Key from environment variable, with a default fallback
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")

DEBUG = os.getenv("DEBUG", "True") == "True"

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "*").split(",")

TIME_ZONE = "Asia/Kolkata"
USE_TZ = True  # Keep this True if you're using timezone-aware datetimes

CSRF_TRUSTED_ORIGINS = os.getenv(
    "CSRF_TRUSTED_ORIGINS", "http://localhost,http://127.0.0.1"
).split(",")

CORS_ALLOW_ALL_ORIGINS = (
    os.getenv("CORS_ALLOW_ALL_ORIGINS", "True") == "True"
)  # Allow all origins (Use cautiously in production)

# OR restrict to specific origins
CORS_ALLOWED_ORIGINS = os.getenv(
    "CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
).split(",")

CORS_ALLOW_CREDENTIALS = (
    os.getenv("CORS_ALLOW_CREDENTIALS", "True") == "True"
)  # Allow sending cookies with requests


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
    "rest_framework_simplejwt.token_blacklist",
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

# Database settings from environment variables
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME", "chat_db"),
        "USER": os.getenv("DB_USER", "chat_user"),
        "PASSWORD": os.getenv("DB_PASSWORD", "chat@admin"),
        "HOST": os.getenv("DB_HOST", "localhost"),  # matches docker-compose service name
        "PORT": os.getenv("DB_PORT", "5432"),  # must match container port
    }
}

# Channel layers for Redis
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [
                (os.getenv("REDIS_HOST", "127.0.0.1"), os.getenv("REDIS_PORT", 6379))
            ],
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
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")  # Required for collectstatic

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


from datetime import timedelta

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=7),  # Set access token to 7 days
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),  # Set refresh token to 30 days
    "SIGNING_KEY": os.getenv("SECRET_KEY", "your-secret-key"),
    "AUTH_HEADER_TYPES": ("Bearer",),
}
