# AI Chat Portal with Conversation Intelligence

A full-stack web application for intelligent chat management and conversation analysis. Built with Django REST Framework backend and React frontend.

## Features

### Core Features
- **Real-time Chat**: Interactive conversation with LLM (OpenAI, Claude, Gemini, or LM Studio)
- **Conversation Management**: Store, organize, and archive conversations
- **Conversation Intelligence**: Ask questions about past conversations using AI
- **Semantic Search**: Find conversations by meaning, not just keywords
- **AI Analysis**: Automatic summaries, key topics, sentiment analysis, and action items extraction
- **Clean UI**: Modern, responsive chat interface with Tailwind CSS

### Technical Implementation
- RESTful API architecture
- Real-time messaging capabilities
- Efficient database queries and indexing
- AI-powered natural language processing
- Responsive and intuitive user interface
- Proper error handling and validation

## Tech Stack

### Backend
- Django 4.2.7
- Django REST Framework 3.14.0
- PostgreSQL
- Python 3.8+

### Frontend
- React 18.2.0
- React Router 6.20.0
- Tailwind CSS 3.3.6
- Axios for API calls

### AI Integration
- Supports multiple providers:
  - OpenAI (GPT-3.5-turbo)
  - Anthropic Claude
  - Google Gemini
  - LM Studio (local LLM hosting)

## Project Structure

```
Ergosphere/
├── backend/
│   ├── chatportal/          # Django project settings
│   ├── conversations/        # Conversations app (models, views, serializers)
│   ├── ai_integration/       # AI service module
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API service layer
│   │   └── App.js
│   ├── public/
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- PostgreSQL 12 or higher
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

5. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE chatportal_db;
   ```

6. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

7. **Create superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

8. **Start development server:**
   ```bash
   python manage.py runserver
   ```

The backend will be running at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file (optional):**
   ```bash
   echo "REACT_APP_API_URL=http://localhost:8000/api" > .env
   ```

4. **Start development server:**
   ```bash
   npm start
   ```

The frontend will be running at `http://localhost:3000`

## AI Provider Configuration

### Option 1: OpenAI
1. Get API key from https://platform.openai.com/
2. Set in `.env`:
   ```
   AI_PROVIDER=openai
   OPENAI_API_KEY=your-api-key-here
   ```

### Option 2: Anthropic Claude
1. Get API key from https://console.anthropic.com/
2. Set in `.env`:
   ```
   AI_PROVIDER=anthropic
   ANTHROPIC_API_KEY=your-api-key-here
   ```

### Option 3: Google Gemini
1. Get API key from https://makersuite.google.com/app/apikey
2. Set in `.env`:
   ```
   AI_PROVIDER=google
   GOOGLE_API_KEY=your-api-key-here
   ```

### Option 4: LM Studio (Recommended for Local Development)
1. Download and install LM Studio from https://lmstudio.ai/
2. Start a local server (usually runs on port 1234)
3. Set in `.env`:
   ```
   AI_PROVIDER=lm_studio
   LM_STUDIO_URL=http://localhost:1234/v1
   ```

## API Documentation

### Base URL
```
http://localhost:8000/api
```

### Endpoints

#### 1. Get All Conversations
```
GET /api/conversations/
```
Returns a list of all conversations with basic information.

**Response:**
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Travel Planning",
      "status": "ended",
      "start_timestamp": "2024-01-15T10:00:00Z",
      "end_timestamp": "2024-01-15T10:30:00Z",
      "summary": "Discussion about travel plans...",
      "message_count": 12,
      "key_topics": ["travel", "japan"],
      "sentiment": "positive",
      "action_items": []
    }
  ]
}
```

#### 2. Get Conversation Detail
```
GET /api/conversations/{id}/
```
Returns a specific conversation with full message history.

**Response:**
```json
{
  "id": 1,
  "title": "Travel Planning",
  "status": "ended",
  "start_timestamp": "2024-01-15T10:00:00Z",
  "end_timestamp": "2024-01-15T10:30:00Z",
  "summary": "Discussion about travel plans...",
  "key_topics": ["travel", "japan"],
  "sentiment": "positive",
  "action_items": [],
  "messages": [
    {
      "id": 1,
      "content": "Hello!",
      "sender": "user",
      "timestamp": "2024-01-15T10:00:00Z"
    },
    {
      "id": 2,
      "content": "Hi! How can I help you?",
      "sender": "ai",
      "timestamp": "2024-01-15T10:00:01Z"
    }
  ]
}
```

#### 3. Create New Conversation
```
POST /api/conversations/create_conversation/
```
Creates a new conversation.

**Request Body:**
```json
{
  "title": "Optional Title"
}
```

**Response:**
```json
{
  "id": 2,
  "title": "Optional Title",
  "status": "active",
  "start_timestamp": "2024-01-15T11:00:00Z",
  "end_timestamp": null,
  "summary": "",
  "message_count": 0
}
```

#### 4. Send Message
```
POST /api/conversations/{id}/send_message/
```
Sends a message in a conversation and gets AI response.

**Request Body:**
```json
{
  "content": "Tell me about Japan"
}
```

**Response:**
```json
{
  "user_message": {
    "id": 3,
    "content": "Tell me about Japan",
    "sender": "user",
    "timestamp": "2024-01-15T11:05:00Z"
  },
  "ai_message": {
    "id": 4,
    "content": "Japan is a fascinating country...",
    "sender": "ai",
    "timestamp": "2024-01-15T11:05:02Z"
  }
}
```

#### 5. End Conversation
```
POST /api/conversations/{id}/end_conversation/
```
Ends a conversation and generates AI summary and analysis.

**Response:**
```json
{
  "id": 1,
  "title": "Travel Planning",
  "status": "ended",
  "summary": "The conversation discussed travel plans to Japan...",
  "key_topics": ["travel", "japan", "itinerary"],
  "sentiment": "positive",
  "action_items": ["Book flights", "Research hotels"]
}
```

#### 6. Query Past Conversations
```
POST /api/query/
```
Query AI about past conversations.

**Request Body:**
```json
{
  "query": "What did I discuss about travel last week?",
  "date_from": "2024-01-01T00:00:00Z",
  "date_to": "2024-01-31T23:59:59Z",
  "conversation_ids": [1, 2, 3]
}
```

**Response:**
```json
{
  "answer": "Based on your past conversations, you discussed travel plans to Japan...",
  "relevant_conversations": [
    {
      "id": 1,
      "title": "Travel Planning",
      "start_timestamp": "2024-01-15T10:00:00Z",
      "summary": "Discussion about travel plans..."
    }
  ],
  "excerpts": [
    {
      "conversation_id": 1,
      "excerpt": "We discussed visiting Tokyo and Kyoto..."
    }
  ]
}
```

## Database Schema

### Conversations Table
- `id`: Primary key
- `title`: Conversation title (auto-generated or user-provided)
- `status`: 'active' or 'ended'
- `start_timestamp`: When conversation started
- `end_timestamp`: When conversation ended (nullable)
- `summary`: AI-generated summary
- `key_topics`: JSON array of key topics
- `sentiment`: Overall sentiment (positive/neutral/negative)
- `action_items`: JSON array of action items
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Messages Table
- `id`: Primary key
- `conversation`: Foreign key to Conversations
- `content`: Message content
- `sender`: 'user' or 'ai'
- `timestamp`: Message timestamp
- `created_at`: Creation timestamp

## Architecture Diagram

```
┌─────────────┐
│   React     │
│  Frontend   │
└──────┬──────┘
       │ HTTP/REST
       │
┌──────▼──────────────────┐
│  Django REST Framework   │
│  (API Layer)             │
└──────┬───────────────────┘
       │
┌──────▼──────────┐    ┌──────────────┐
│   PostgreSQL    │    │  AI Service  │
│   Database      │    │  (OpenAI/    │
│                 │    │   Claude/    │
│  Conversations  │    │   Gemini/    │
│  Messages       │    │   LM Studio) │
└─────────────────┘    └──────────────┘
```

## User Flow

1. User starts a new conversation
2. User chats with the AI about a specific topic
3. Conversation continues with multiple messages
4. User ends the conversation
5. System automatically generates summary and extracts key points
6. Later, user asks "What did I discuss about travel last week?"
7. System uses semantic search to find relevant conversations
8. AI provides intelligent response with excerpts from past conversations
9. User can view full conversation details

## Sample Conversations

### Example 1: Travel Planning
**User:** "I'm planning a trip to Japan. Can you help me?"
**AI:** "Absolutely! I'd be happy to help you plan your trip to Japan. What would you like to know?"
**User:** "What are the must-visit places in Tokyo?"
**AI:** "Tokyo has many amazing places to visit..."

**Analysis:**
- Summary: Discussion about travel plans to Japan, focusing on Tokyo attractions
- Key Topics: ["travel", "japan", "tokyo", "tourism"]
- Sentiment: Positive
- Action Items: ["Research Tokyo attractions", "Plan itinerary"]

### Example 2: Technical Discussion
**User:** "How do I implement authentication in Django?"
**AI:** "Django provides several ways to implement authentication..."
**User:** "What about JWT tokens?"
**AI:** "For JWT tokens, you can use django-rest-framework-simplejwt..."

**Analysis:**
- Summary: Technical discussion about Django authentication and JWT implementation
- Key Topics: ["django", "authentication", "jwt", "web development"]
- Sentiment: Neutral
- Action Items: ["Implement JWT authentication", "Review Django docs"]

## Testing

### Backend Testing
```bash
cd backend
python manage.py test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## Deployment

### Backend Deployment
1. Set `DEBUG=False` in settings
2. Configure proper `ALLOWED_HOSTS`
3. Set up PostgreSQL database
4. Run migrations
5. Collect static files: `python manage.py collectstatic`
6. Use a WSGI server like Gunicorn

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Serve `build/` directory with a web server (Nginx, Apache, etc.)
3. Configure API URL in environment variables

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists

### AI API Issues
- Verify API keys are set correctly
- Check API provider status
- For LM Studio, ensure local server is running

### CORS Issues
- Ensure `CORS_ALLOWED_ORIGINS` includes frontend URL
- Check Django CORS middleware is installed

## License

This project is created for assignment purposes.

## Contact

For questions or issues, please contact: devgods99@gmail.com

Screenshot from 2025-11-09 23-19-02.png
Screenshot from 2025-11-09 23-19-16.png
Screenshot from 2025-11-09 23-19-25.png
Screenshot from 2025-11-09 23-19-33.png
Screenshot from 2025-11-09 23-19-41.png
Screenshot from 2025-11-09 23-19-44.png
Screenshot from 2025-11-09 23-20-04.png