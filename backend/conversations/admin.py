from django.contrib import admin
from .models import Conversation, Message


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'start_timestamp', 'end_timestamp']
    list_filter = ['status', 'start_timestamp']
    search_fields = ['title', 'summary']


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['conversation', 'sender', 'timestamp', 'content_preview']
    list_filter = ['sender', 'timestamp']
    search_fields = ['content']

    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content'

