from urllib.parse import parse_qs
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.channel_name = self.scope["url_route"]["kwargs"]["channel_name"]
        self.room_group_name = f"chat_{self.channel_name}"

        # Authenticate user using JWT token from query params
        query_string = parse_qs(self.scope["query_string"].decode())
        token = query_string.get("token", [None])[0]

        if token:
            try:
                access_token = AccessToken(token)
                self.scope["user"] = await self.get_user(access_token["user_id"])
            except Exception:
                self.scope["user"] = None

        if self.scope["user"] and self.scope["user"].is_authenticated:
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()
        else:
            await self.close()

    @database_sync_to_async
    def get_user(self, user_id):
        User = get_user_model()
        return User.objects.get(id=user_id)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        if not text_data:  # Check if text_data is empty
            return  # Ignore empty messages

        try:
            data = json.loads(text_data)  # Try parsing JSON
        except json.JSONDecodeError:
            return  # Ignore invalid JSON messages

        user = self.scope.get("user")
        message = data.get("message", "")

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

        channel = Channel.objects.get(name=self.channel_name)
        Message.objects.create(user=user, channel=channel, content=message)
