import React, { useState, useEffect } from 'react';
import { conversationsAPI } from '../services/api';

function ConversationSuggestions({ conversationId, onSelect }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (conversationId) {
      fetchSuggestions();
    }
  }, [conversationId]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await conversationsAPI.getSuggestions(conversationId);
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!conversationId || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="relative mb-4">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-indigo-500/20 to-teal-500/20 rounded-2xl blur-xl"></div>
      <div className="relative backdrop-blur-xl bg-white/5 border-2 border-indigo-400/30 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 via-indigo-500 to-teal-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-indigo-300">Neural Suggestions</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {loading ? (
            <div className="text-sm text-indigo-300/60 font-['JetBrains_Mono']">Loading Patterns...</div>
          ) : (
            suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => onSelect && onSelect(suggestion)}
                className="group relative px-4 py-2 bg-white/5 backdrop-blur-sm text-indigo-200 rounded-lg text-sm hover:bg-gradient-to-r hover:from-emerald-500/20 hover:via-indigo-500/20 hover:to-teal-500/20 transition-all border border-indigo-400/20 hover:border-emerald-400/50 font-light"
              >
                <span className="relative z-10">{suggestion}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ConversationSuggestions;
