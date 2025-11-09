import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { conversationsAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import AIBrainIcon from './AIBrainIcon';

function SharedConversationView() {
  const { token } = useParams();
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    fetchSharedConversation();
  }, [token]);

  const fetchSharedConversation = async () => {
    try {
      setLoading(true);
      const response = await conversationsAPI.getShared(token);
      setConversation(response.data);
    } catch (error) {
      console.error('Error fetching shared conversation:', error);
      alert('Failed to load shared conversation');
    } finally {
      setLoading(false);
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
          <p className="text-indigo-300/70 font-['JetBrains_Mono'] text-lg">Accessing Shared Neural Log...</p>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen relative bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent mb-2">Neural Log Not Found</h2>
          <p className="text-indigo-300/70">This shared neural log may have been removed or the link is invalid.</p>
        </div>
      </div>
    );
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
        <div className="relative backdrop-blur-xl bg-white/5 border-2 border-indigo-400/30 rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-6 mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10 rounded-xl blur-xl -z-10"></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400/20 via-indigo-500/20 to-teal-500/20 rounded-xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-[0_0_20px_rgba(79,70,229,0.5)]">
              <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent">Shared Neural Log</h1>
              <p className="text-sm text-indigo-300/70 font-['JetBrains_Mono']">This neural log has been shared with you</p>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            {conversation.title || 'Untitled Log'}
          </h2>
          <p className="text-sm text-indigo-300/70 font-['JetBrains_Mono']">
            Initiated: {formatTimestamp(conversation.start_timestamp)}
          </p>
        </div>

        {/* Summary */}
        {conversation.summary && (
          <div className="relative backdrop-blur-xl bg-white/5 border-2 border-indigo-400/30 rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-6 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10 rounded-xl blur-xl -z-10"></div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400/20 via-indigo-500/20 to-teal-500/20 rounded-xl flex items-center justify-center backdrop-blur-xl border border-white/20">
                <AIBrainIcon className="w-8 h-8" animated={true} />
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent">Summary</h3>
            </div>
            <p className="text-indigo-200/90 font-light">{conversation.summary}</p>
          </div>
        )}

        {/* Messages */}
        <div className="relative backdrop-blur-xl bg-white/5 border-2 border-indigo-400/30 rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10 rounded-xl blur-xl -z-10"></div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent mb-6">Transmissions</h2>
          <div className="space-y-6">
            {conversation.messages && conversation.messages.length > 0 ? (
              conversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  } animate-fade-in`}
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
              <p className="text-indigo-300/70 text-center">No transmissions in this neural log.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SharedConversationView;

