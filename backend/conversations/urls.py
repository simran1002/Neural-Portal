"""
URL configuration for conversations app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ConversationViewSet, QueryView, MessageViewSet,
    AnalyticsView, SharedConversationView
)

router = DefaultRouter()
router.register(r'conversations', ConversationViewSet, basename='conversation')
router.register(r'messages', MessageViewSet, basename='message')

urlpatterns = [
    path('', include(router.urls)),
    path('query/', QueryView.as_view(), name='query'),
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
    path('shared/<str:token>/', SharedConversationView.as_view(), name='shared-conversation'),
]

