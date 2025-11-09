"""
Serializers for Conversation and Message models.
"""
from rest_framework import serializers
from .models import Conversation, Message


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for Message model."""
    replies_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = ['id', 'content', 'sender', 'timestamp', 'parent_message', 'reactions', 'is_bookmarked', 'replies_count']
        read_only_fields = ['id', 'timestamp']
    
    def get_replies_count(self, obj):
        return obj.replies.count()


class ConversationSerializer(serializers.ModelSerializer):
    """Serializer for Conversation model with message count."""
    message_count = serializers.SerializerMethodField()
    branches_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = [
            'id', 'title', 'status', 'start_timestamp', 
            'end_timestamp', 'summary', 'message_count',
            'key_topics', 'sentiment', 'action_items',
            'share_token', 'is_shared', 'parent_conversation', 'branches_count'
        ]
        read_only_fields = ['id', 'start_timestamp', 'end_timestamp', 'share_token']

    def get_message_count(self, obj):
        return obj.messages.count()
    
    def get_branches_count(self, obj):
        return obj.branches.count()


class ConversationDetailSerializer(serializers.ModelSerializer):
    """Serializer for Conversation with full message history."""
    messages = MessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Conversation
        fields = [
            'id', 'title', 'status', 'start_timestamp', 
            'end_timestamp', 'summary', 'messages',
            'key_topics', 'sentiment', 'action_items'
        ]
        read_only_fields = ['id', 'start_timestamp', 'end_timestamp']


class CreateConversationSerializer(serializers.Serializer):
    """Serializer for creating a new conversation."""
    title = serializers.CharField(max_length=255, required=False, allow_blank=True)


class SendMessageSerializer(serializers.Serializer):
    """Serializer for sending a message."""
    content = serializers.CharField()
    conversation_id = serializers.IntegerField(required=False)


class QuerySerializer(serializers.Serializer):
    """Serializer for querying past conversations."""
    query = serializers.CharField()
    date_from = serializers.DateTimeField(required=False)
    date_to = serializers.DateTimeField(required=False)
    conversation_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False
    )


class ReactionSerializer(serializers.Serializer):
    """Serializer for adding reactions to messages."""
    emoji = serializers.CharField(max_length=10)


class BranchConversationSerializer(serializers.Serializer):
    """Serializer for branching a conversation."""
    message_id = serializers.IntegerField()
    title = serializers.CharField(max_length=255, required=False, allow_blank=True)

