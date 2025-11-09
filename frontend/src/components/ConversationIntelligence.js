import React, { useState } from 'react';
import { queryAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import AIBrainIcon from './AIBrainIcon';

function ConversationIntelligence() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isDark } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await queryAPI.query(query);
      setResponse(result.data);
    } catch (err) {
      console.error('Error querying conversations:', err);
      setError('Failed to process query. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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
        <div className="mb-10 text-center">
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-emerald-400/20 via-indigo-500/20 to-teal-500/20 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
              <AIBrainIcon className="w-20 h-20" animated={true} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-indigo-500 to-teal-500 rounded-3xl blur-2xl opacity-30 -z-10 animate-pulse"></div>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent tracking-tight mb-4">
            Intelligence Matrix
          </h1>
          <p className="text-indigo-300/70 text-lg font-light">
            Query the AI about your archived neural logs
          </p>
        </div>

        {/* Query Form */}
        <div className="relative backdrop-blur-xl bg-white/5 border-2 border-indigo-400/30 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-8 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-indigo-500/20 to-teal-500/20 rounded-2xl blur-xl -z-10"></div>
          <form onSubmit={handleSubmit} className="relative">
            <label htmlFor="query" className="block text-sm font-semibold text-indigo-300 mb-4 font-['JetBrains_Mono']">
              Enter your query:
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <textarea
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., 'What were the key decisions from my meetings last month?' or 'Summarize discussions about project X from last week.'"
                rows={4}
                className="flex-1 px-5 py-4 bg-white/10 backdrop-blur-xl border-2 border-indigo-400/30 rounded-xl focus:outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 text-white placeholder-indigo-300/50 font-['JetBrains_Mono'] resize-none transition-all"
              />
              <button
                type="submit"
                disabled={!query.trim() || loading}
                className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 via-indigo-600 to-teal-500 text-white rounded-xl font-semibold overflow-hidden transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(79,70,229,0.6)] self-end sm:self-auto"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <AIBrainIcon className="w-5 h-5" animated={false} />
                      <span>Initiate Query</span>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-indigo-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="relative backdrop-blur-xl bg-red-900/30 border-2 border-red-500/50 rounded-xl p-6 mb-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-300 font-semibold">{error}</p>
            </div>
          </div>
        )}

        {/* Response */}
        {response && (
          <div className="space-y-6 animate-fade-in">
            {/* Answer */}
            <div className="relative backdrop-blur-xl bg-white/5 border-2 border-indigo-400/30 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-8">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10 rounded-2xl blur-xl -z-10"></div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400/20 via-indigo-500/20 to-teal-500/20 rounded-xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-[0_0_20px_rgba(79,70,229,0.5)]">
                  <AIBrainIcon className="w-8 h-8" animated={true} />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent">AI Response</h2>
              </div>
              <div className="prose max-w-none">
                <p className="text-indigo-200/90 leading-relaxed whitespace-pre-wrap font-light">{response.answer || response.response}</p>
              </div>
            </div>

            {/* Relevant Conversations */}
            {response.relevant_conversations && response.relevant_conversations.length > 0 && (
              <div className="relative backdrop-blur-xl bg-white/5 border-2 border-indigo-400/30 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-8">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10 rounded-2xl blur-xl -z-10"></div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent mb-6">
                  Relevant Logs ({response.relevant_conversations.length})
                </h2>
                <div className="space-y-4">
                  {response.relevant_conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className="relative backdrop-blur-sm bg-white/5 border-2 border-indigo-400/20 rounded-xl p-5 hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer group"
                    >
                      <h3 className="font-bold text-white mb-2 text-lg group-hover:text-emerald-300 transition-colors">
                        {conv.title || 'Untitled Log'}
                      </h3>
                      {conv.summary && (
                        <p className="text-sm text-indigo-200/70 mb-3 font-light">{conv.summary}</p>
                      )}
                      <p className="text-xs text-indigo-300/60 font-['JetBrains_Mono']">
                        {formatDate(conv.start_timestamp)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Excerpts */}
            {response.excerpts && response.excerpts.length > 0 && (
              <div className="relative backdrop-blur-xl bg-white/5 border-2 border-indigo-400/30 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-8">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10 rounded-2xl blur-xl -z-10"></div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent mb-6">Relevant Excerpts</h2>
                <div className="space-y-4">
                  {response.excerpts.map((excerpt, idx) => (
                    <div
                      key={idx}
                      className="relative backdrop-blur-sm bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10 border border-emerald-400/30 rounded-xl p-5"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-indigo-600 text-white text-xs font-semibold rounded-full font-['JetBrains_Mono']">
                          Log #{excerpt.conversation_id}
                        </span>
                      </div>
                      <p className="text-indigo-200/90 leading-relaxed font-light">{excerpt.excerpt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Example Queries */}
        {!response && !loading && (
          <div className="relative backdrop-blur-xl bg-white/5 border-2 border-indigo-400/30 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-8 mt-6">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10 rounded-2xl blur-xl -z-10"></div>
            <h3 className="text-lg font-semibold text-indigo-300 mb-4">Example Queries</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                "What did I discuss about travel last week?",
                "What are the main topics I've been talking about?",
                "What decisions or action items came up in my conversations?",
                "Show me conversations about specific topics"
              ].map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(example)}
                  className="text-left px-4 py-3 bg-white/5 backdrop-blur-sm hover:bg-gradient-to-r hover:from-emerald-500/20 hover:via-indigo-500/20 hover:to-teal-500/20 border border-indigo-400/20 hover:border-emerald-400/50 rounded-lg transition-all text-sm text-indigo-200 font-light"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConversationIntelligence;
