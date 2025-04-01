from urllib.parse import parse_qs
from django.contrib.auth.models import AnonymousUser
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model

User = get_user_model()

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # Extract token from query params
        query_string = parse_qs(scope["query_string"].decode())
        token = query_string.get("token", [None])[0]

        # Validate JWT token
        scope["user"] = await self.get_user(token)
        return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def get_user(self, token):
        if not token:
            return AnonymousUser()

        try:
            decoded_token = AccessToken(token)
            return User.objects.get(id=decoded_token["user_id"])
        except Exception:
            return AnonymousUser()
