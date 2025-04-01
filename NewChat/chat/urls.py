from django.urls import path
from .views import (
    ChannelListView,
    MessageHistoryView,
    SendMessageView,
    user_presence,
    chat_page,
)

urlpatterns = [
    path(
        "api/messages/<str:channel_name>/",
        MessageHistoryView.as_view(),
        name="chat-history",
    ),
    path(
        "api/messages/<str:channel_name>/send/",
        SendMessageView.as_view(),
        name="send-message",
    ),
    path("api/user-presence/<int:user_id>/", user_presence, name="user-presence"),
    path("api/channels/", ChannelListView.as_view(), name="channel-list"),
    path("", chat_page, name="chat"),
]
