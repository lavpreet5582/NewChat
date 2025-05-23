from django.urls import re_path
from .consumer import ChatConsumer
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

websocket_urlpatterns = [
    re_path(r"^ws/chat/(?P<channel_name>\w+)/$", ChatConsumer.as_asgi()),
]
