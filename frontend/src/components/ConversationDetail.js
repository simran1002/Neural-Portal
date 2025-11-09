import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { conversationsAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import AIBrainIcon from './AIBrainIcon';

function ConversationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ending, setEnding] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    fetchConversation();
  }, [id]);

  const fetchConversation = async () => {
    try {
      setLoading(true);
      const response = await conversationsAPI.getById(id);
      setConversation(response.data);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      alert('Failed to load conversation');
      navigate('/conversations');
    } finally {
      setLoading(false);
    }
  };

  const handleEndConversation = async () => {
    if (!window.confirm('Are you sure you want to end this conversation? A summary will be generated.')) return;

    try {
      setEnding(true);
      await conversationsAPI.endConversation(id);
      await fetchConversation(); // Refresh to get updated summary
      alert('Conversation ended. Summary generated!');
    } catch (error) {
      console.error('Error ending conversation:', error);
      alert('Failed to end conversation');
    } finally {
      setEnding(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen relative bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <AIBrainIcon className="w-16 h-16 animate-spin" animated={false} />
          </div>
          <p className="text-indigo-300/70 font-['JetBrains_Mono'] text-lg">Loading Neural Log...</p>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return null;
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.2),transparent_50%)]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>
        {/* Neural Network Pattern */}
        <div className="neural-network"></div>
        {/* Circuit Board Pattern */}
        <div className="circuit-pattern"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/conversations')}
            className="text-emerald-400 hover:text-emerald-300 mb-4 flex items-center gap-2 font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Neural Archive
          </button>
          <div className="relative backdrop-blur-xl bg-white/5 border-2 border-indigo-400/30 rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-6 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10 rounded-xl blur-xl -z-10"></div>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent mb-3">
                  {conversation.title || 'Untitled Log'}
                </h1>
                <div className="flex items-center gap-4 text-sm text-indigo-300/70 font-['JetBrains_Mono']">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatTimestamp(conversation.start_timestamp)}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold font-['JetBrains_Mono'] ${
                      conversation.status === 'active'
                        ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                        : 'bg-indigo-500/20 text-indigo-400 border border-indigo-400/30'
                    }`}
                  >
                    {conversation.status === 'active' ? '● Active' : '■ Archived'}
                  </span>
                  {conversation.messages && (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {conversation.messages.length} transmissions
                    </div>
                  )}
                </div>
              </div>
              {conversation.status === 'active' && (
                <button
                  onClick={handleEndConversation}
                  disabled={ending}
                  className="px-4 py-2 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-lg hover:from-rose-600 hover:to-red-700 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(244,63,94,0.5)] hover:scale-105 flex items-center gap-2 font-semibold"
                >
                  {ending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Terminating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>End Session</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Summary Section */}
        {conversation.summary && (
          <div className="relative backdrop-blur-xl bg-white/5 border-2 border-indigo-400/30 rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-6 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10 rounded-xl blur-xl -z-10"></div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400/20 via-indigo-500/20 to-teal-500/20 rounded-xl flex items-center justify-center backdrop-blur-xl border border-white/20">
                <AIBrainIcon className="w-8 h-8" animated={true} />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent">Summary</h2>
            </div>
            <p className="text-indigo-200/90 leading-relaxed font-light">{conversation.summary}</p>
          </div>
        )}

        {/* Analysis Section */}
        {(conversation.key_topics?.length > 0 ||
          conversation.sentiment ||
          conversation.action_items?.length > 0) && (
          <div className="relative backdrop-blur-xl bg-white/5 border-2 border-indigo-400/30 rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-6 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10 rounded-xl blur-xl -z-10"></div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Neural Analysis
            </h2>
            <div className="space-y-6">
              {conversation.key_topics && conversation.key_topics.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-indigo-300 mb-3 font-['JetBrains_Mono']">KEY TOPICS</h3>
                  <div className="flex flex-wrap gap-2">
                    {conversation.key_topics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-indigo-500/20 text-emerald-300 rounded-lg text-sm font-light border border-emerald-400/30 backdrop-blur-sm"
                      >
                        #{topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {conversation.sentiment && (
                <div>
                  <h3 className="text-sm font-semibold text-indigo-300 mb-3 font-['JetBrains_Mono']">SENTIMENT</h3>
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold font-['JetBrains_Mono'] ${
                      conversation.sentiment === 'positive'
                        ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                        : conversation.sentiment === 'negative'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-400/30'
                        : 'bg-indigo-500/20 text-indigo-400 border border-indigo-400/30'
                    }`}
                  >
                    {conversation.sentiment === 'positive' && (
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                    )}
                    {conversation.sentiment === 'negative' && (
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                      </svg>
                    )}
                    {conversation.sentiment.toUpperCase()}
                  </span>
                </div>
              )}
              {conversation.action_items && conversation.action_items.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-indigo-300 mb-3 font-['JetBrains_Mono']">ACTION ITEMS</h3>
                  <ul className="space-y-2">
                    {conversation.action_items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 p-3 backdrop-blur-sm bg-white/5 rounded-lg border border-indigo-400/20 hover:border-emerald-400/50 transition-all">
                        <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-emerald-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 font-['JetBrains_Mono']">
                          {idx + 1}
                        </div>
                        <span className="text-indigo-200 flex-1 font-light">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="relative backdrop-blur-xl bg-white/5 border-2 border-indigo-400/30 rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10 rounded-xl blur-xl -z-10"></div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Transmissions ({conversation.messages?.length || 0})
          </h2>
          <div className="space-y-6">
            {conversation.messages && conversation.messages.length > 0 ? (
              conversation.messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  } animate-fade-in`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {message.sender === 'ai' && (
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400/20 via-indigo-500/20 to-teal-500/20 rounded-xl flex items-center justify-center backdrop-blur-xl border border-white/20">
                        <AIBrainIcon className="w-8 h-8" animated={true} />
                      </div>
                    </div>
                  )}
                  <div
                    className={`relative max-w-2xl rounded-2xl px-5 py-4 backdrop-blur-xl border ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-br from-emerald-500/20 via-indigo-600/20 to-teal-500/20 border-emerald-400/30'
                        : 'bg-white/5 border-indigo-400/30'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words leading-relaxed text-white/90 font-light">{message.content}</div>
                    <div
                      className={`text-xs mt-3 font-['JetBrains_Mono'] ${
                        message.sender === 'user' ? 'text-emerald-200/70' : 'text-indigo-300/60'
                      }`}
                    >
                      {formatTimestamp(message.timestamp)}
                    </div>
                  </div>
                  {message.sender === 'user' && (
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-emerald-500 to-teal-500 rounded-xl flex items-center justify-center border border-white/20">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-indigo-300/70">No transmissions in this neural log.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConversationDetail;
