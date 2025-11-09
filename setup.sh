#!/bin/bash

# Setup script for AI Chat Portal

echo "🚀 Setting up AI Chat Portal..."

# Backend setup
echo "📦 Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env file with your configuration"
fi

# Run migrations
echo "Running database migrations..."
python manage.py migrate

echo "✅ Backend setup complete!"
echo ""

# Frontend setup
cd ../frontend
echo "📦 Setting up frontend..."

# Install Node dependencies
echo "Installing Node dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    echo "REACT_APP_API_URL=http://localhost:8000/api" > .env
fi

echo "✅ Frontend setup complete!"
echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure your database in backend/.env"
echo "2. Configure your AI provider in backend/.env"
echo "3. Start backend: cd backend && source venv/bin/activate && python manage.py runserver"
echo "4. Start frontend: cd frontend && npm start"
echo ""
echo "To create sample data:"
echo "cd backend && source venv/bin/activate && python manage.py create_sample_data"

