from django.utils.timezone import localtime
from rest_framework import serializers
from .models import Channel, Message
from accounts.serializers import UserSerializer


class ChannelSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Channel
        fields = ["id", "name", "members", "created_at"]


class MessageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    timestamp = serializers.SerializerMethodField()

    def get_timestamp(self, obj):
        return localtime(obj.timestamp).strftime("%Y-%m-%d %H:%M:%S")

    class Meta:
        model = Message
        fields = ["id", "user", "channel", "content", "timestamp"]
