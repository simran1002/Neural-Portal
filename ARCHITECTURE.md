# Architecture Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Chat UI    │  │ Conversations│  │ Intelligence │      │
│  │  Component   │  │  Dashboard   │  │    Page      │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │               │
│         └─────────────────┼──────────────────┘               │
│                           │                                   │
│                    ┌──────▼──────┐                            │
│                    │  API Service │                            │
│                    │   (Axios)    │                            │
│                    └──────┬───────┘                            │
└───────────────────────────┼───────────────────────────────────┘
                            │ HTTP/REST API
┌───────────────────────────▼───────────────────────────────────┐
│                      Backend Layer                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Django REST Framework                      │   │
│  │  ┌──────────────┐  ┌──────────────┐                 │   │
│  │  │ Conversations│  │   Query API  │                 │   │
│  │  │   ViewSet    │  │     View     │                 │   │
│  │  └──────┬───────┘  └──────┬───────┘                 │   │
│  │         │                 │                          │   │
│  │  ┌──────▼─────────────────▼───────┐                 │   │
│  │  │      Serializers & Models      │                 │   │
│  │  └─────────────────────────────────┘                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                   │
│         ┌──────────────────┼──────────────────┐               │
│         │                  │                  │               │
│  ┌──────▼──────┐  ┌───────▼──────┐  ┌───────▼──────┐       │
│  │ PostgreSQL  │  │  AI Service  │  │   File       │       │
│  │  Database   │  │   Module     │  │   Storage    │       │
│  │             │  │              │  │              │       │
│  │ Conversations│  │  - Chat      │  │  (Future)    │       │
│  │  Messages    │  │  - Summary   │  │              │       │
│  │              │  │  - Analysis  │  │              │       │
│  │              │  │  - Query     │  │              │       │
│  └──────────────┘  └───────┬──────┘  └──────────────┘       │
└─────────────────────────────┼─────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   AI Providers    │
                    │                   │
                    │  ┌─────────────┐  │
                    │  │   OpenAI    │  │
                    │  └─────────────┘  │
                    │  ┌─────────────┐  │
                    │  │  Anthropic  │  │
                    │  └─────────────┘  │
                    │  ┌─────────────┐  │
                    │  │   Google    │  │
                    │  └─────────────┘  │
                    │  ┌─────────────┐  │
                    │  │  LM Studio  │  │
                    │  └─────────────┘  │
                    └───────────────────┘
```

## Data Flow

### 1. Chat Flow
```
User Input → Frontend → API Request → Django View
                                    ↓
                            AI Service (Chat)
                                    ↓
                            LLM Provider
                                    ↓
                            Save Messages
                                    ↓
                            Return Response → Frontend → Display
```

### 2. Conversation End Flow
```
User Clicks "End" → API Request → Django View
                                ↓
                        Get All Messages
                                ↓
                        AI Service (Analyze)
                                ↓
                        LLM Provider
                                ↓
                        Extract: Summary, Topics, Sentiment, Actions
                                ↓
                        Update Conversation
                                ↓
                        Return Analysis → Frontend → Display
```

### 3. Query Flow
```
User Query → API Request → Django View
                          ↓
                  Filter Conversations
                          ↓
                  AI Service (Query)
                          ↓
                  Prepare Context
                          ↓
                  LLM Provider
                          ↓
                  Generate Answer + Excerpts
                          ↓
                  Return Response → Frontend → Display
```

## Component Details

### Backend Components

#### 1. Models (`conversations/models.py`)
- **Conversation**: Stores conversation metadata
  - Title, status, timestamps
  - AI-generated summary, topics, sentiment, action items
- **Message**: Stores individual messages
  - Content, sender (user/ai), timestamp
  - Foreign key to Conversation

#### 2. Views (`conversations/views.py`)
- **ConversationViewSet**: Handles CRUD operations
  - `create_conversation`: Create new conversation
  - `send_message`: Send message and get AI response
  - `end_conversation`: End conversation and generate summary
- **QueryView**: Handles intelligence queries

#### 3. AI Service (`ai_integration/services.py`)
- **AIService**: Unified interface for AI operations
  - `chat()`: Real-time chat with context
  - `analyze_conversation()`: Generate summary and analysis
  - `query_past_conversations()`: Answer questions about past chats
  - Supports multiple providers (OpenAI, Claude, Gemini, LM Studio)

### Frontend Components

#### 1. ChatInterface (`components/ChatInterface.js`)
- Real-time chat UI
- Message display with timestamps
- Start/end conversation controls
- Message input and sending

#### 2. ConversationsDashboard (`components/ConversationsDashboard.js`)
- List all conversations
- Search functionality
- Click to view details

#### 3. ConversationDetail (`components/ConversationDetail.js`)
- View full conversation
- Display summary and analysis
- Show all messages

#### 4. ConversationIntelligence (`components/ConversationIntelligence.js`)
- Query interface
- Display AI responses
- Show relevant conversations and excerpts

## Database Schema

### Conversations Table
```sql
CREATE TABLE conversations_conversation (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    status VARCHAR(10) CHECK (status IN ('active', 'ended')),
    start_timestamp TIMESTAMP,
    end_timestamp TIMESTAMP,
    summary TEXT,
    key_topics JSONB DEFAULT '[]',
    sentiment VARCHAR(50),
    action_items JSONB DEFAULT '[]',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Messages Table
```sql
CREATE TABLE conversations_message (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations_conversation(id),
    content TEXT,
    sender VARCHAR(10) CHECK (sender IN ('user', 'ai')),
    timestamp TIMESTAMP,
    created_at TIMESTAMP
);
```

## API Design

### RESTful Principles
- **GET**: Retrieve resources (conversations, messages)
- **POST**: Create resources or trigger actions (create conversation, send message, end conversation, query)

### Response Format
- Consistent JSON structure
- Error handling with appropriate HTTP status codes
- Pagination for list endpoints

## Security Considerations

1. **CORS**: Configured for frontend origin only
2. **Input Validation**: Serializers validate all inputs
3. **SQL Injection**: Django ORM prevents SQL injection
4. **API Keys**: Stored in environment variables, not in code

## Scalability Considerations

1. **Database Indexing**: Timestamps and foreign keys are indexed
2. **Pagination**: List endpoints support pagination
3. **Caching**: Can be added for frequently accessed conversations
4. **Async Processing**: Conversation analysis can be moved to background tasks

## Future Enhancements

1. **WebSocket Support**: Real-time bidirectional communication
2. **File Uploads**: Support for document attachments
3. **User Authentication**: Multi-user support
4. **Conversation Export**: PDF, JSON, Markdown formats
5. **Advanced Analytics**: Conversation trends, insights dashboard
6. **Semantic Search**: Vector embeddings for better search

