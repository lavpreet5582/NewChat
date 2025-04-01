from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404, render
from django.http import JsonResponse

from .models import Message, Channel
from .serializers import MessageSerializer, ChannelSerializer

User = get_user_model()


# 1️⃣ List all chat channels
class ChannelListView(generics.ListAPIView):
    """API to list all chat channels"""

    queryset = Channel.objects.all()
    serializer_class = ChannelSerializer
    permission_classes = [permissions.IsAuthenticated]


# 2️⃣ Retrieve messages from a specific channel
class ChannelMessagesView(generics.ListAPIView):
    """API to retrieve all messages from a specific channel"""

    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        channel = get_object_or_404(Channel, name=self.kwargs["channel_name"])
        return Message.objects.filter(channel=channel).order_by("timestamp")


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


# 4️⃣ Fetch chat history for a specific channel
class MessageHistoryView(generics.ListAPIView):
    """API to fetch message history for a channel"""

    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        channel_name = self.kwargs["channel_name"]
        return Message.objects.filter(channel__name=channel_name).order_by("-timestamp")


# 5️⃣ Check user presence (online/offline)
def user_presence(request, user_id):
    """API to check if a user is online"""
    user = User.objects.filter(id=user_id).first()
    if user:
        return JsonResponse({"username": user.username, "online": True})
    return JsonResponse({"error": "User not found"}, status=404)


def chat_page(request):
    return render(request, "chat/chat_template.html")