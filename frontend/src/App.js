import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import ChatInterface from './components/ChatInterface';
import ConversationsDashboard from './components/ConversationsDashboard';
import ConversationDetail from './components/ConversationDetail';
import ConversationIntelligence from './components/ConversationIntelligence';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SharedConversationView from './components/SharedConversationView';
import Navigation from './components/Navigation';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
          <Navigation />
          <Routes>
            <Route path="/" element={<ChatInterface />} />
            <Route path="/conversations" element={<ConversationsDashboard />} />
            <Route path="/conversations/:id" element={<ConversationDetail />} />
            <Route path="/intelligence" element={<ConversationIntelligence />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/shared/:token" element={<SharedConversationView />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

