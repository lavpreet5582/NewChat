from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404, render
from django.http import JsonResponse

from .models import Message, Channel
from .serializers import MessageSerializer, ChannelSerializer

User = get_user_model()


class ChannelListView(APIView):
    """API to list all chat channels where the user is a member"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        channels = Channel.objects.filter(members=user)
        serializer = ChannelSerializer(channels, many=True)
        return Response(serializer.data)


# 3️⃣ Send a message to a channel
class SendMessageView(APIView):
    """API to send a new message to a channel"""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        channel_name = self.kwargs["channel_name"]
        channel = get_object_or_404(Channel, name=channel_name)
        message_content = request.data.get("message")

        if not message_content:
            return Response({"error": "Message cannot be empty"}, status=400)

        message = Message.objects.create(
            user=request.user, channel=channel, content=message_content
        )
        return Response(MessageSerializer(message).data, status=201)


class MessageHistoryView(APIView):
    """API to fetch message history for a channel"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, channel_name):
        messages = Message.objects.filter(channel__name=channel_name).order_by(
            "timestamp"
        )
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# 5️⃣ Check user presence (online/offline)
def user_presence(request, user_id):
    """API to check if a user is online"""
    user = User.objects.filter(id=user_id).first()
    if user:
        return JsonResponse({"username": user.username, "online": True})
    return JsonResponse({"error": "User not found"}, status=404)


def chat_page(request):
    return render(request, "chat/chat_template.html")
