"""
AI Integration Service for handling LLM interactions.
Supports OpenAI, Anthropic Claude, Google Gemini, and LM Studio.
"""
import os
import json
from typing import List, Dict, Optional
from django.conf import settings
from conversations.models import Conversation, Message
import requests


class AIService:
    """
    Service class for AI-powered chat and conversation analysis.
    """
    
    def __init__(self):
        self.provider = getattr(settings, 'AI_PROVIDER', 'openai')
        self.openai_key = getattr(settings, 'OPENAI_API_KEY', '')
        self.anthropic_key = getattr(settings, 'ANTHROPIC_API_KEY', '')
        self.google_key = getattr(settings, 'GOOGLE_API_KEY', '')
        self.lm_studio_url = getattr(settings, 'LM_STUDIO_URL', 'http://localhost:1234/v1')
        self.lm_studio_model = getattr(settings, 'LM_STUDIO_MODEL', 'local-model')
    
    def _get_conversation_context(self, conversation_id: int, max_messages: int = 10) -> List[Dict]:
        """
        Retrieve recent messages from a conversation for context.
        """
        conversation = Conversation.objects.get(id=conversation_id)
        messages = conversation.messages.all()[:max_messages]
        
        context = []
        for msg in messages:
            role = 'user' if msg.sender == 'user' else 'assistant'
            context.append({
                'role': role,
                'content': msg.content
            })
        return context
    
    def _call_openai(self, messages: List[Dict], system_prompt: str = None) -> str:
        """Call OpenAI API."""
        try:
            import openai
            import httpx
            
            # Check if API key is set
            if not self.openai_key:
                return "OpenAI API key is not configured. Please set OPENAI_API_KEY in your .env file."
            
            # Create httpx client without proxies to avoid compatibility issues
            http_client = httpx.Client(timeout=30.0)
            
            # Initialize OpenAI client with explicit http_client
            client = openai.OpenAI(
                api_key=self.openai_key,
                http_client=http_client
            )
            
            if system_prompt:
                messages = [{'role': 'system', 'content': system_prompt}] + messages
            
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                temperature=0.7,
                max_tokens=1000
            )
            return response.choices[0].message.content
        except Exception as e:
            # Provide more helpful error message
            error_msg = str(e)
            if not self.openai_key:
                return "Error calling OpenAI: API key is not configured. Please set OPENAI_API_KEY in your .env file."
            # Check for specific error types
            if "quota" in error_msg.lower() or "429" in error_msg or "insufficient_quota" in error_msg:
                return "Error calling OpenAI: You have exceeded your API quota. Please check your OpenAI billing and plan. Consider using LM Studio for local testing or switch to another provider."
            return f"Error calling OpenAI: {error_msg}"
    
    def _call_anthropic(self, messages: List[Dict], system_prompt: str = None) -> str:
        """Call Anthropic Claude API."""
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=self.anthropic_key)
            
            # Convert messages format for Claude
            claude_messages = []
            for msg in messages:
                if msg['role'] != 'system':
                    claude_messages.append(msg)
            
            response = client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=1000,
                system=system_prompt or "You are a helpful AI assistant.",
                messages=claude_messages
            )
            return response.content[0].text
        except Exception as e:
            return f"Error calling Anthropic: {str(e)}"
    
    def _call_google(self, messages: List[Dict], system_prompt: str = None) -> str:
        """Call Google Gemini API."""
        try:
            import google.generativeai as genai
            genai.configure(api_key=self.google_key)
            
            model = genai.GenerativeModel('gemini-pro')
            
            # Combine system prompt and messages
            prompt_parts = []
            if system_prompt:
                prompt_parts.append(system_prompt)
            
            for msg in messages:
                if msg['role'] == 'user':
                    prompt_parts.append(f"User: {msg['content']}")
                elif msg['role'] == 'assistant':
                    prompt_parts.append(f"Assistant: {msg['content']}")
            
            prompt = "\n".join(prompt_parts)
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error calling Google Gemini: {str(e)}"
    
    def _call_lm_studio(self, messages: List[Dict], system_prompt: str = None) -> str:
        """Call LM Studio local API."""
        try:
            if system_prompt:
                messages = [{'role': 'system', 'content': system_prompt}] + messages
            
            model_id = self.lm_studio_model or 'local-model'
            if model_id == 'local-model':
                # Provide warning message to help configure correct model
                return (
                    "LM Studio is running, but no model ID is configured. "
                    "Please set LM_STUDIO_MODEL in your .env file (e.g., openai/gpt-oss-20b) "
                    "or update settings.LM_STUDIO_MODEL to match the model loaded in LM Studio."
                )
            
            response = requests.post(
                f"{self.lm_studio_url}/chat/completions",
                json={
                    'model': model_id,
                    'messages': messages,
                    'temperature': 0.7,
                    'max_tokens': 1000
                },
                timeout=30
            )
            response.raise_for_status()
            data = response.json()
            return data['choices'][0]['message']['content']
        except Exception as e:
            return f"Error calling LM Studio: {str(e)}"
    
    def _call_llm(self, messages: List[Dict], system_prompt: str = None) -> str:
        """
        Unified method to call the configured LLM provider.
        """
        try:
            if self.provider == 'openai' and self.openai_key:
                result = self._call_openai(messages, system_prompt)
                # Check if it's an error message and try fallback
                if result.startswith("Error calling OpenAI"):
                    # If quota exceeded or other error, try fallback
                    if "quota" in result.lower() or "429" in result:
                        return self._get_fallback_response(messages)
                    return result
                return result
            elif self.provider == 'anthropic' and self.anthropic_key:
                result = self._call_anthropic(messages, system_prompt)
                if result.startswith("Error calling Anthropic"):
                    return self._get_fallback_response(messages)
                return result
            elif self.provider == 'google' and self.google_key:
                result = self._call_google(messages, system_prompt)
                if result.startswith("Error calling Google"):
                    return self._get_fallback_response(messages)
                return result
            elif self.provider == 'lm_studio':
                result = self._call_lm_studio(messages, system_prompt)
                if result.startswith("Error calling LM Studio"):
                    return self._get_fallback_response(messages)
                return result
            else:
                # Fallback to a simple response if no provider is configured
                return self._get_fallback_response(messages)
        except Exception as e:
            return self._get_fallback_response(messages)
    
    def _get_fallback_response(self, messages: List[Dict]) -> str:
        """
        Generate a fallback response when AI providers are unavailable.
        """
        # Get the last user message
        last_user_message = None
        for msg in reversed(messages):
            if msg.get('role') == 'user':
                last_user_message = msg.get('content', '')
                break
        
        if not last_user_message:
            last_user_message = "your message"
        
        return f"I understand you said: '{last_user_message}'. However, I'm currently unable to connect to the AI service. Please check your API configuration in the backend/.env file. You can use LM Studio for local testing, or configure OpenAI, Anthropic, or Google Gemini API keys."
    
    def chat(self, conversation_id: int, user_message: str) -> str:
        """
        Generate AI response for a user message in a conversation.
        Maintains conversation context.
        """
        # Get conversation context
        context = self._get_conversation_context(conversation_id, max_messages=10)
        
        # Add current user message
        context.append({
            'role': 'user',
            'content': user_message
        })
        
        system_prompt = "You are a helpful, friendly, and knowledgeable AI assistant. Provide clear, concise, and helpful responses."
        
        return self._call_llm(context, system_prompt)
    
    def generate_title(self, first_message: str) -> str:
        """
        Generate a title for a conversation based on the first message.
        """
        prompt = f"Generate a short, descriptive title (max 5 words) for a conversation that starts with: '{first_message[:100]}'"
        
        messages = [{
            'role': 'user',
            'content': prompt
        }]
        
        title = self._call_llm(messages, "You are a title generator. Return only the title, no explanation.")
        return title.strip().strip('"').strip("'")
    
    def analyze_conversation(self, messages: List[Dict]) -> Dict:
        """
        Analyze a conversation and extract:
        - Summary
        - Key topics
        - Sentiment
        - Action items
        """
        conversation_text = "\n".join([
            f"{msg['sender'].upper()}: {msg['content']}"
            for msg in messages
        ])
        
        analysis_prompt = f"""Analyze the following conversation and provide a JSON response with:
1. summary: A brief summary of the conversation (2-3 sentences)
2. key_topics: List of main topics discussed (array of strings)
3. sentiment: Overall sentiment (positive, neutral, or negative)
4. action_items: List of any action items or decisions made (array of strings)

Conversation:
{conversation_text}

Return only valid JSON in this format:
{{
    "summary": "...",
    "key_topics": ["topic1", "topic2"],
    "sentiment": "positive/neutral/negative",
    "action_items": ["item1", "item2"]
}}"""
        
        messages_list = [{
            'role': 'user',
            'content': analysis_prompt
        }]
        
        response = self._call_llm(
            messages_list,
            "You are a conversation analyst. Return only valid JSON, no additional text."
        )
        
        # Try to parse JSON response
        try:
            # Clean response (remove markdown code blocks if present)
            response = response.strip()
            if response.startswith('```'):
                response = response.split('```')[1]
                if response.startswith('json'):
                    response = response[4:]
            response = response.strip()
            
            analysis = json.loads(response)
            return {
                'summary': analysis.get('summary', ''),
                'key_topics': analysis.get('key_topics', []),
                'sentiment': analysis.get('sentiment', 'neutral'),
                'action_items': analysis.get('action_items', [])
            }
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            return {
                'summary': response[:500] if response else 'No summary available.',
                'key_topics': [],
                'sentiment': 'neutral',
                'action_items': []
            }
    
    def query_past_conversations(
        self,
        query: str,
        conversations: List[Conversation]
    ) -> Dict:
        """
        Answer questions about past conversations using semantic search and AI.
        """
        if not conversations:
            return {
                'answer': "No past conversations found matching your criteria.",
                'relevant_conversations': [],
                'excerpts': []
            }
        
        # Prepare conversation summaries for context
        conversation_contexts = []
        for conv in conversations:
            messages = conv.messages.all()
            messages_text = "\n".join([
                f"{msg.sender}: {msg.content}"
                for msg in messages[:20]  # Limit to first 20 messages
            ])
            
            context = f"Conversation ID: {conv.id}\n"
            context += f"Title: {conv.title or 'Untitled'}\n"
            context += f"Date: {conv.start_timestamp}\n"
            if conv.summary:
                context += f"Summary: {conv.summary}\n"
            context += f"Messages:\n{messages_text}\n"
            
            conversation_contexts.append({
                'id': conv.id,
                'title': conv.title or 'Untitled',
                'context': context
            })
        
        # Combine all contexts
        all_contexts = "\n\n---\n\n".join([
            ctx['context'] for ctx in conversation_contexts
        ])
        
        query_prompt = f"""Based on the following past conversations, answer this question: "{query}"

Past Conversations:
{all_contexts}

Provide:
1. A direct answer to the question
2. Relevant excerpts from conversations that support your answer
3. Reference conversation IDs when mentioning specific conversations

Format your response as JSON:
{{
    "answer": "Your answer here",
    "relevant_conversation_ids": [1, 2],
    "excerpts": [
        {{"conversation_id": 1, "excerpt": "relevant text"}},
        {{"conversation_id": 2, "excerpt": "relevant text"}}
    ]
}}"""
        
        messages_list = [{
            'role': 'user',
            'content': query_prompt
        }]
        
        response = self._call_llm(
            messages_list,
            "You are a conversation intelligence assistant. Analyze past conversations and answer questions about them. Return only valid JSON."
        )
        
        # Parse response
        try:
            response = response.strip()
            if response.startswith('```'):
                response = response.split('```')[1]
                if response.startswith('json'):
                    response = response[4:]
            response = response.strip()
            
            result = json.loads(response)
            
            # Get full conversation details for relevant IDs
            relevant_conversations = []
            for conv_id in result.get('relevant_conversation_ids', []):
                try:
                    conv = Conversation.objects.get(id=conv_id)
                    relevant_conversations.append({
                        'id': conv.id,
                        'title': conv.title or 'Untitled',
                        'start_timestamp': conv.start_timestamp.isoformat(),
                        'summary': conv.summary
                    })
                except Conversation.DoesNotExist:
                    continue
            
            return {
                'answer': result.get('answer', 'Unable to generate answer.'),
                'relevant_conversations': relevant_conversations,
                'excerpts': result.get('excerpts', [])
            }
        except json.JSONDecodeError:
            # Fallback response
            return {
                'answer': response[:1000] if response else 'Unable to process query.',
                'relevant_conversations': [
                    {
                        'id': conv.id,
                        'title': conv.title or 'Untitled',
                        'start_timestamp': conv.start_timestamp.isoformat(),
                        'summary': conv.summary
                    }
                    for conv in conversations[:3]
                ],
                'excerpts': []
            }

