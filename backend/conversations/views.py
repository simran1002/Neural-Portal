"""
API views for conversations and messages.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.http import HttpResponse, JsonResponse
from django.db.models import Count, Q
from django.db.models.functions import TruncDate
import secrets
import json
from datetime import datetime, timedelta
from .models import Conversation, Message
from .serializers import (
    ConversationSerializer,
    ConversationDetailSerializer,
    MessageSerializer,
    CreateConversationSerializer,
    SendMessageSerializer,
    QuerySerializer,
    ReactionSerializer,
    BranchConversationSerializer
)
from ai_integration.services import AIService


class ConversationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing conversations.
    """
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ConversationDetailSerializer
        return ConversationSerializer

    @action(detail=False, methods=['post'])
    def create_conversation(self, request):
        """
        Create a new conversation.
        POST /api/conversations/create_conversation/
        """
        serializer = CreateConversationSerializer(data=request.data)
        if serializer.is_valid():
            title = serializer.validated_data.get('title', '')
            conversation = Conversation.objects.create(title=title or None)
            return Response(
                ConversationSerializer(conversation).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        """
        Send a message in a conversation.
        POST /api/conversations/{id}/send_message/
        """
        conversation = self.get_object()
        serializer = SendMessageSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        content = serializer.validated_data['content']
        
        # Save user message
        user_message = Message.objects.create(
            conversation=conversation,
            content=content,
            sender='user'
        )
        
        # Get AI response
        ai_service = AIService()
        ai_response = ai_service.chat(
            conversation_id=conversation.id,
            user_message=content
        )
        
        # Save AI message
        ai_message = Message.objects.create(
            conversation=conversation,
            content=ai_response,
            sender='ai'
        )
        
        # Update conversation title if it's the first message
        if not conversation.title and conversation.messages.count() == 2:
            title = ai_service.generate_title(content)
            conversation.title = title[:255]
            conversation.save()
        
        return Response({
            'user_message': MessageSerializer(user_message).data,
            'ai_message': MessageSerializer(ai_message).data,
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def end_conversation(self, request, pk=None):
        """
        End a conversation and generate summary.
        POST /api/conversations/{id}/end_conversation/
        """
        conversation = self.get_object()
        
        if conversation.status == 'ended':
            return Response(
                {'error': 'Conversation already ended'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate summary and analysis
        ai_service = AIService()
        messages = conversation.messages.all()
        messages_data = [
            {'sender': msg.sender, 'content': msg.content}
            for msg in messages
        ]
        
        analysis = ai_service.analyze_conversation(messages_data)
        
        # Update conversation with analysis
        conversation.summary = analysis.get('summary', '')
        conversation.key_topics = analysis.get('key_topics', [])
        conversation.sentiment = analysis.get('sentiment', '')
        conversation.action_items = analysis.get('action_items', [])
        conversation.end_conversation()
        
        return Response(
            ConversationDetailSerializer(conversation).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        """Generate share token for conversation."""
        conversation = self.get_object()
        if not conversation.share_token:
            conversation.share_token = secrets.token_urlsafe(32)
            conversation.is_shared = True
            conversation.save()
        share_url = f"{request.scheme}://{request.get_host()}/shared/{conversation.share_token}"
        return Response({
            'share_token': conversation.share_token,
            'share_url': share_url
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def unshare(self, request, pk=None):
        """Remove share token from conversation."""
        conversation = self.get_object()
        conversation.share_token = None
        conversation.is_shared = False
        conversation.save()
        return Response({'message': 'Conversation unshared'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def branch(self, request, pk=None):
        """Create a branch from a specific message."""
        conversation = self.get_object()
        serializer = BranchConversationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        message_id = serializer.validated_data['message_id']
        title = serializer.validated_data.get('title', '')
        
        try:
            parent_message = Message.objects.get(id=message_id, conversation=conversation)
        except Message.DoesNotExist:
            return Response({'error': 'Message not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Create new conversation branch
        branch = Conversation.objects.create(
            title=title or f"Branch: {conversation.title or 'Untitled'}",
            parent_conversation=conversation
        )
        
        # Copy messages up to the branch point
        messages_to_copy = conversation.messages.filter(timestamp__lte=parent_message.timestamp)
        for msg in messages_to_copy:
            Message.objects.create(
                conversation=branch,
                content=msg.content,
                sender=msg.sender,
                timestamp=msg.timestamp
            )
        
        return Response(
            ConversationSerializer(branch).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['get'])
    def export(self, request, pk=None):
        """Export conversation in various formats."""
        conversation = self.get_object()
        format_type = request.query_params.get('format', 'json')
        
        if format_type == 'json':
            data = ConversationDetailSerializer(conversation).data
            response = HttpResponse(
                json.dumps(data, indent=2, default=str),
                content_type='application/json'
            )
            response['Content-Disposition'] = f'attachment; filename="conversation_{conversation.id}.json"'
            return response
        
        elif format_type == 'markdown':
            md_content = f"# {conversation.title or 'Untitled Conversation'}\n\n"
            md_content += f"**Status:** {conversation.status}\n"
            md_content += f"**Started:** {conversation.start_timestamp}\n"
            if conversation.end_timestamp:
                md_content += f"**Ended:** {conversation.end_timestamp}\n"
            md_content += f"\n## Summary\n\n{conversation.summary}\n\n"
            
            if conversation.key_topics:
                md_content += "## Key Topics\n\n"
                for topic in conversation.key_topics:
                    md_content += f"- {topic}\n"
                md_content += "\n"
            
            md_content += "## Messages\n\n"
            for msg in conversation.messages.all():
                sender_label = "**You:**" if msg.sender == 'user' else "**AI:**"
                md_content += f"{sender_label} {msg.content}\n\n"
            
            response = HttpResponse(md_content, content_type='text/markdown')
            response['Content-Disposition'] = f'attachment; filename="conversation_{conversation.id}.md"'
            return response
        
        elif format_type == 'pdf':
            # For PDF, we'll return JSON with instructions to generate PDF on frontend
            # or use a library like reportlab
            return Response({'error': 'PDF export requires additional setup'}, 
                          status=status.HTTP_501_NOT_IMPLEMENTED)
        
        return Response({'error': 'Invalid format'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def suggestions(self, request, pk=None):
        """Get conversation suggestions based on context."""
        conversation = self.get_object()
        ai_service = AIService()
        
        # Get recent messages for context
        recent_messages = conversation.messages.all()[:5]
        context = "\n".join([f"{msg.sender}: {msg.content[:100]}" for msg in recent_messages])
        
        prompt = f"""Based on this conversation context, suggest 3-5 relevant follow-up questions or topics:
        
{context}

Return only a JSON array of suggestions, no other text:
["suggestion1", "suggestion2", "suggestion3"]"""
        
        messages_list = [{'role': 'user', 'content': prompt}]
        response = ai_service._call_llm(messages_list, "You are a helpful assistant that suggests conversation topics.")
        
        try:
            suggestions = json.loads(response)
            if not isinstance(suggestions, list):
                suggestions = [suggestions]
        except:
            suggestions = [
                "Tell me more about this topic",
                "What are the next steps?",
                "Can you provide examples?"
            ]
        
        return Response({'suggestions': suggestions}, status=status.HTTP_200_OK)


class QueryView(APIView):
    """
    API view for querying past conversations.
    POST /api/query/
    """
    def post(self, request):
        serializer = QuerySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        query = serializer.validated_data['query']
        date_from = serializer.validated_data.get('date_from')
        date_to = serializer.validated_data.get('date_to')
        conversation_ids = serializer.validated_data.get('conversation_ids')
        
        # Filter conversations
        conversations = Conversation.objects.filter(status='ended')
        
        if date_from:
            conversations = conversations.filter(start_timestamp__gte=date_from)
        if date_to:
            conversations = conversations.filter(start_timestamp__lte=date_to)
        if conversation_ids:
            conversations = conversations.filter(id__in=conversation_ids)
        
        # Get AI response about past conversations
        ai_service = AIService()
        response = ai_service.query_past_conversations(
            query=query,
            conversations=list(conversations)
        )
        
        return Response(response, status=status.HTTP_200_OK)


class MessageViewSet(viewsets.ModelViewSet):
    """ViewSet for managing messages."""
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    @action(detail=True, methods=['post'])
    def react(self, request, pk=None):
        """Add reaction to a message."""
        message = self.get_object()
        serializer = ReactionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        emoji = serializer.validated_data['emoji']
        reactions = message.reactions or {}
        reactions[emoji] = reactions.get(emoji, 0) + 1
        message.reactions = reactions
        message.save()
        
        return Response(MessageSerializer(message).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def bookmark(self, request, pk=None):
        """Toggle bookmark on a message."""
        message = self.get_object()
        message.is_bookmarked = not message.is_bookmarked
        message.save()
        return Response(MessageSerializer(message).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        """Reply to a message (create threaded conversation)."""
        parent_message = self.get_object()
        serializer = SendMessageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        content = serializer.validated_data['content']
        conversation = parent_message.conversation
        
        # Create user message as reply
        user_message = Message.objects.create(
            conversation=conversation,
            content=content,
            sender='user',
            parent_message=parent_message
        )
        
        # Get AI response
        ai_service = AIService()
        ai_response = ai_service.chat(
            conversation_id=conversation.id,
            user_message=content
        )
        
        # Create AI reply
        ai_message = Message.objects.create(
            conversation=conversation,
            content=ai_response,
            sender='ai',
            parent_message=parent_message
        )
        
        return Response({
            'user_message': MessageSerializer(user_message).data,
            'ai_message': MessageSerializer(ai_message).data,
        }, status=status.HTTP_201_CREATED)


class AnalyticsView(APIView):
    """API view for conversation analytics."""
    
    def get(self, request):
        """Get conversation statistics and trends."""
        # Date range (default: last 30 days)
        days = int(request.query_params.get('days', 30))
        date_from = timezone.now() - timedelta(days=days)
        
        # Total conversations
        total_conversations = Conversation.objects.count()
        active_conversations = Conversation.objects.filter(status='active').count()
        ended_conversations = Conversation.objects.filter(status='ended').count()
        
        # Conversations over time
        conversations_by_date = Conversation.objects.filter(
            start_timestamp__gte=date_from
        ).annotate(
            date=TruncDate('start_timestamp')
        ).values('date').annotate(
            count=Count('id')
        ).order_by('date')
        
        # Messages over time
        messages_by_date = Message.objects.filter(
            timestamp__gte=date_from
        ).annotate(
            date=TruncDate('timestamp')
        ).values('date').annotate(
            count=Count('id')
        ).order_by('date')
        
        # Top topics
        all_topics = []
        for conv in Conversation.objects.filter(key_topics__isnull=False):
            if conv.key_topics:
                all_topics.extend(conv.key_topics)
        
        topic_counts = {}
        for topic in all_topics:
            topic_counts[topic] = topic_counts.get(topic, 0) + 1
        
        top_topics = sorted(topic_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        
        # Sentiment distribution
        sentiment_counts = Conversation.objects.filter(
            sentiment__isnull=False
        ).exclude(sentiment='').values('sentiment').annotate(
            count=Count('id')
        )
        
        # Average conversation length
        avg_length = Conversation.objects.annotate(
            msg_count=Count('messages')
        ).aggregate(
            avg=Count('messages', distinct=True)
        )['avg'] or 0
        
        return Response({
            'summary': {
                'total_conversations': total_conversations,
                'active_conversations': active_conversations,
                'ended_conversations': ended_conversations,
                'average_message_count': avg_length
            },
            'conversations_over_time': list(conversations_by_date),
            'messages_over_time': list(messages_by_date),
            'top_topics': [{'topic': topic, 'count': count} for topic, count in top_topics],
            'sentiment_distribution': list(sentiment_counts)
        }, status=status.HTTP_200_OK)


class SharedConversationView(APIView):
    """API view for accessing shared conversations."""
    
    def get(self, request, token):
        """Get shared conversation by token."""
        try:
            conversation = Conversation.objects.get(share_token=token, is_shared=True)
            return Response(
                ConversationDetailSerializer(conversation).data,
                status=status.HTTP_200_OK
            )
        except Conversation.DoesNotExist:
            return Response(
                {'error': 'Shared conversation not found'},
                status=status.HTTP_404_NOT_FOUND
            )

