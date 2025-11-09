"""
Database models for conversations and messages.
"""
from django.db import models
from django.utils import timezone


class Conversation(models.Model):
    """
    Model to store conversation metadata.
    """
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('ended', 'Ended'),
    ]

    title = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    start_timestamp = models.DateTimeField(default=timezone.now)
    end_timestamp = models.DateTimeField(null=True, blank=True)
    summary = models.TextField(blank=True, default='')
    key_topics = models.JSONField(default=list, blank=True, null=True)
    sentiment = models.CharField(max_length=50, blank=True, default='')
    action_items = models.JSONField(default=list, blank=True, null=True)
    share_token = models.CharField(max_length=64, unique=True, null=True, blank=True)
    is_shared = models.BooleanField(default=False)
    parent_conversation = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='branches'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_timestamp']

    def __str__(self):
        return f"{self.title or 'Untitled'} - {self.status}"

    def end_conversation(self):
        """Mark conversation as ended."""
        self.status = 'ended'
        self.end_timestamp = timezone.now()
        self.save()


class Message(models.Model):
    """
    Model to store individual messages in a conversation.
    """
    SENDER_CHOICES = [
        ('user', 'User'),
        ('ai', 'AI'),
    ]

    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    content = models.TextField()
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES)
    timestamp = models.DateTimeField(default=timezone.now)
    parent_message = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='replies'
    )
    reactions = models.JSONField(default=dict, blank=True)
    is_bookmarked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.sender}: {self.content[:50]}"

