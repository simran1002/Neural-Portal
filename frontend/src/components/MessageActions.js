import React, { useState } from 'react';
import { messagesAPI } from '../services/api';

function MessageActions({ message, onUpdate }) {
  const [showReactions, setShowReactions] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const emojis = ['👍', '❤️', '😊', '🎉', '💡', '🔥'];

  const handleReaction = async (emoji) => {
    try {
      const response = await messagesAPI.react(message.id, emoji);
      if (onUpdate) {
        onUpdate(response.data);
      }
      setShowReactions(false);
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      setIsBookmarking(true);
      const response = await messagesAPI.bookmark(message.id);
      if (onUpdate) {
        onUpdate(response.data);
      }
    } catch (error) {
      console.error('Error bookmarking:', error);
    } finally {
      setIsBookmarking(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
      {/* Reactions */}
      <div className="relative">
        <button
          onClick={() => setShowReactions(!showReactions)}
          className="p-1.5 text-indigo-300/60 hover:text-emerald-400 transition-colors rounded-lg hover:bg-white/5"
          title="Add reaction"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        {showReactions && (
          <div className="absolute bottom-full left-0 mb-2 backdrop-blur-xl bg-white/10 border-2 border-indigo-400/30 rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-2 flex gap-1 z-10">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className="p-2 hover:bg-white/10 rounded-lg text-xl transition-all hover:scale-125"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Existing Reactions */}
      {message.reactions && Object.keys(message.reactions).length > 0 && (
        <div className="flex gap-1">
          {Object.entries(message.reactions).map(([emoji, count]) => (
            <span
              key={emoji}
              className="px-2 py-1 bg-gradient-to-r from-emerald-500/20 to-indigo-500/20 backdrop-blur-sm rounded-full text-xs flex items-center gap-1 border border-emerald-400/30"
            >
              <span>{emoji}</span>
              <span className="text-indigo-300 font-['JetBrains_Mono']">{count}</span>
            </span>
          ))}
        </div>
      )}

      {/* Bookmark */}
      <button
        onClick={handleBookmark}
        disabled={isBookmarking}
        className={`p-1.5 transition-all rounded-lg hover:bg-white/5 ${
          message.is_bookmarked
            ? 'text-yellow-400'
            : 'text-indigo-300/60 hover:text-yellow-400'
        }`}
        title={message.is_bookmarked ? 'Remove bookmark' : 'Bookmark'}
      >
        <svg className="w-4 h-4" fill={message.is_bookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>
    </div>
  );
}

export default MessageActions;
