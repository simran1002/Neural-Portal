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


![alt text](<Screenshot from 2025-11-09 23-19-16.png>) ![alt text](<Screenshot from 2025-11-09 23-19-44.png>) ![alt text](<Screenshot from 2025-11-09 23-19-41.png>) ![alt text](<Screenshot from 2025-11-09 23-20-04.png>) ![alt text](<Screenshot from 2025-11-09 23-19-25.png>) ![alt text](<Screenshot from 2025-11-09 23-19-02.png>) ![alt text](<Screenshot from 2025-11-09 23-19-33.png>)