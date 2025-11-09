import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { conversationsAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import AIBrainIcon from './AIBrainIcon';

function ConversationsDashboard() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await conversationsAPI.getAll();
      setConversations(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      alert('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const query = searchQuery.toLowerCase();
    return (
      (conv.title || '').toLowerCase().includes(query) ||
      (conv.summary || '').toLowerCase().includes(query) ||
      (conv.key_topics || []).some(topic => topic.toLowerCase().includes(query))
    );
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'TODAY';
    if (diffDays === 1) return 'YESTERDAY';
    if (diffDays < 7) return `${diffDays}D AGO`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.2),transparent_50%)]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-block mb-4">
            <div className="relative">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent tracking-tight">
                Neural Archive
              </h1>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-indigo-400 to-teal-400 blur-2xl opacity-30 -z-10"></div>
            </div>
          </div>
          <p className="text-indigo-300/70 text-lg font-['JetBrains_Mono']">Accessing Conversation Database...</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-indigo-500/20 to-teal-500/20 rounded-2xl blur-xl"></div>
          <div className="relative flex items-center gap-4 px-6 py-4 bg-white/5 backdrop-blur-xl border-2 border-indigo-400/30 rounded-2xl focus-within:border-emerald-400/50 transition-all">
            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search neural patterns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-indigo-300/50 font-['JetBrains_Mono'] text-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-indigo-400 hover:text-emerald-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Conversations Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <AIBrainIcon className="w-16 h-16 animate-spin" animated={false} />
              </div>
              <p className="text-indigo-300/70 font-['JetBrains_Mono'] text-lg">Loading Neural Data...</p>
            </div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-32">
            <div className="relative inline-block mb-8">
              <div className="w-40 h-40 bg-gradient-to-br from-emerald-400/20 via-indigo-500/20 to-teal-500/20 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
                <AIBrainIcon className="w-24 h-24" animated={true} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-indigo-500 to-teal-500 rounded-3xl blur-2xl opacity-30 -z-10 animate-pulse"></div>
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent mb-4">
              No Neural Patterns Detected
            </h3>
            <p className="text-indigo-200/70 mb-8 font-light">
              {searchQuery ? 'Try different search parameters' : 'Initialize new neural link to begin'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate('/')}
                className="group relative px-10 py-4 bg-gradient-to-r from-emerald-500 via-indigo-600 to-teal-500 rounded-xl font-semibold text-white text-lg overflow-hidden transition-all hover:scale-105 shadow-[0_0_30px_rgba(79,70,229,0.6)] data-stream"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <AIBrainIcon className="w-5 h-5" animated={true} />
                  Activate Neural Interface
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-indigo-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredConversations.map((conversation, idx) => (
              <div
                key={conversation.id}
                onClick={() => navigate(`/conversations/${conversation.id}`)}
                className="group relative cursor-pointer"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Card Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-indigo-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Main Card */}
                <div className="relative backdrop-blur-xl bg-white/5 border-2 border-indigo-400/30 rounded-2xl p-6 hover:border-emerald-400/50 transition-all hover:scale-105 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
                  {/* Status Indicator */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold font-['JetBrains_Mono'] ${
                      conversation.status === 'active'
                        ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                        : 'bg-indigo-500/20 text-indigo-400 border border-indigo-400/30'
                    }`}>
                      {conversation.status === 'active' ? '● Active' : '■ Archived'}
                    </div>
                    <div className="text-xs text-indigo-300/60 font-['JetBrains_Mono']">
                      #{conversation.id.toString().padStart(4, '0')}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                    {conversation.title || 'Unnamed Session'}
                  </h3>

                  {/* Summary */}
                  {conversation.summary && (
                    <p className="text-indigo-200/70 text-sm mb-4 line-clamp-3 font-light">
                      {conversation.summary}
                    </p>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-indigo-300/60 mb-4 font-['JetBrains_Mono']">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatDate(conversation.start_timestamp)}
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {conversation.message_count || 0} MSGS
                    </div>
                  </div>

                  {/* Topics */}
                  {conversation.key_topics && conversation.key_topics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {conversation.key_topics.slice(0, 3).map((topic, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gradient-to-r from-emerald-500/20 to-indigo-500/20 text-emerald-300 text-xs rounded-lg border border-emerald-400/30 font-['JetBrains_Mono']"
                          >
                            {topic}
                          </span>
                        ))}
                        {conversation.key_topics.length > 3 && (
                          <span className="px-2 py-1 text-indigo-300/60 text-xs font-['JetBrains_Mono']">
                            +{conversation.key_topics.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                  {/* Hover Arrow */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10 node-connection">
                    <span className="text-xs text-indigo-300/50 font-['JetBrains_Mono']">Click to Access</span>
                    <svg className="w-5 h-5 text-emerald-400 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ConversationsDashboard;
