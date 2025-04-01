from django.contrib import admin
from .models import Channel, Message


class ChannelAdmin(admin.ModelAdmin):
    list_display = ("name", "created_at")
    search_fields = ("name",)
    raw_id_fields = ("members",)  # Use raw_id_fields for ManyToManyField


class MessageAdmin(admin.ModelAdmin):
    list_display = ("user", "channel", "content", "timestamp")
    search_fields = ("content", "user__username", "channel__name")
    raw_id_fields = ("user", "channel")  # ForeignKey fields with raw ID input


admin.site.register(Channel, ChannelAdmin)
admin.site.register(Message, MessageAdmin)
