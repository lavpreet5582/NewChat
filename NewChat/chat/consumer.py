import logging
from urllib.parse import parse_qs
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken

User = get_user_model()

# Setting up logging
logger = logging.getLogger(__name__)


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["channel_name"]
        self.room_group_name = f"chat_{self.room_name}"

        # Authenticate user using JWT token from query params
        query_string = parse_qs(self.scope["query_string"].decode())
        token = query_string.get("token", [None])[0]

        if token:
            try:
                access_token = AccessToken(token)
                self.scope["user"] = await self.get_user(access_token["user_id"])
                logger.info(f"Authenticated user: {self.scope['user'].username}")
            except Exception as e:
                logger.error(f"Error decoding token: {str(e)}")
                self.scope["user"] = None
        else:
            logger.warning("No token provided")

        if self.scope["user"] and self.scope["user"].is_authenticated:
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()
        else:
            logger.warning("User not authenticated or invalid token")
            await self.close()

    @database_sync_to_async
    def get_user(self, user_id):
        return User.objects.get(id=user_id)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        logger.info(f"User disconnected from {self.room_group_name}")

    async def receive(self, text_data):
        if not text_data:  # Check if text_data is empty
            return  # Ignore empty messages

        try:
            data = json.loads(text_data)  # Try parsing JSON
        except json.JSONDecodeError:
            return  # Ignore invalid JSON messages

        user = self.scope.get("user")
        message = data.get("message", "")
        print(f"[receive] Broadcasting to group {self.room_group_name}: {message}")

        if user and user.is_authenticated:
            await self.save_message(user, message)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": message,
                    "user": user.username,
                },
            )

    async def chat_message(self, event):
        print(f"[chat_message] Sending to WebSocket: {event}")
        await self.send(
            text_data=json.dumps(
                {
                    "message": event["message"],
                    "user": event["user"],
                }
            )
        )

    @database_sync_to_async
    def save_message(self, user, message):
        from .models import Channel, Message

        try:
            channel = Channel.objects.get(name=self.room_name)
        except Channel.DoesNotExist:
            logger.error(f"Channel {self.room_name} does not exist.")
            return

        Message.objects.create(user=user, channel=channel, content=message)
        logger.info(f"Message saved: {message}")
