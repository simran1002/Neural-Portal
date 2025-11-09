import React, { useState, useEffect, useRef } from 'react';
import { conversationsAPI, messagesAPI } from '../services/api';
import VoiceInput from './VoiceInput';
import ConversationSuggestions from './ConversationSuggestions';
import MessageActions from './MessageActions';
import AIBrainIcon from './AIBrainIcon';
import { useTheme } from '../contexts/ThemeContext';

function ChatInterface() {
  const { isDark } = useTheme();
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [voiceTranscript, setVoiceTranscript] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (conversationId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [conversationId]);

  useEffect(() => {
    if (conversationId && messages.length > 0) {
      fetchSuggestions();
    }
  }, [conversationId, messages.length]);

  const fetchSuggestions = async () => {
    try {
      const response = await conversationsAPI.getSuggestions(conversationId);
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const startNewConversation = async () => {
    try {
      setIsLoading(true);
      const response = await conversationsAPI.create();
      setConversationId(response.data.id);
      setMessages([]);
      setIsEnded(false);
      setInputMessage('');
      setSuggestions([]);
    } catch (error) {
      console.error('Error creating conversation:', error);
      alert(`Failed to start new conversation: ${error.response?.data?.detail || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const messageToSend = inputMessage.trim() || voiceTranscript.trim();
    if (!messageToSend || !conversationId || isLoading || isEnded) return;

    setInputMessage('');
    setVoiceTranscript('');
    setIsLoading(true);

    const tempUserMessage = {
      id: Date.now(),
      content: messageToSend,
      sender: 'user',
      timestamp: new Date().toISOString(),
      reactions: {},
      is_bookmarked: false,
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const response = await conversationsAPI.sendMessage(conversationId, messageToSend);
      setMessages((prev) => {
        const updated = prev.filter((msg) => msg.id !== tempUserMessage.id);
        return [
          ...updated,
          { ...response.data.user_message, reactions: {}, is_bookmarked: false },
          { ...response.data.ai_message, reactions: {}, is_bookmarked: false },
        ];
      });
    } catch (error) {
      console.error('Error sending message:', error);
      alert(`Failed to send message: ${error.response?.data?.detail || error.message}`);
      setMessages((prev) => prev.filter((msg) => msg.id !== tempUserMessage.id));
    } finally {
      setIsLoading(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const endConversation = async () => {
    if (!conversationId || isEnded) return;
    if (!window.confirm('End conversation and generate summary?')) return;

    try {
      setIsLoading(true);
      await conversationsAPI.endConversation(conversationId);
      setIsEnded(true);
      alert('Conversation ended. Summary generated!');
    } catch (error) {
      console.error('Error ending conversation:', error);
      alert(`Failed to end conversation: ${error.response?.data?.detail || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateMessage = (messageId, updatedMessage) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? updatedMessage : msg))
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="relative flex flex-col h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
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

      {/* Action Buttons - Floating */}
      <div className="fixed top-20 right-6 z-20 flex flex-col gap-2">
        <button
          onClick={startNewConversation}
          disabled={isLoading}
          className="group relative px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-lg font-semibold text-white overflow-hidden transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(79,70,229,0.5)] backdrop-blur-xl border border-white/10"
          title="New Session"
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">New Session</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
        {conversationId && !isEnded && (
          <button
            onClick={endConversation}
            disabled={isLoading}
            className="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-red-600 rounded-lg font-semibold text-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(244,63,94,0.5)] backdrop-blur-xl border border-white/10"
            title="End Session"
          >
            <span className="hidden sm:inline">End</span>
            <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 py-8">
        {messages.length === 0 && !conversationId && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-2xl">
              <div className="relative mb-8">
                <div className="w-40 h-40 mx-auto bg-gradient-to-br from-emerald-400/20 via-indigo-500/20 to-teal-500/20 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
                  <AIBrainIcon className="w-24 h-24" animated={true} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-indigo-500 to-teal-500 rounded-3xl blur-2xl opacity-30 -z-10 animate-pulse"></div>
              </div>
              <h3 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent mb-4">
                Initialize Neural Link
              </h3>
              <p className="text-indigo-200/70 mb-8 text-lg font-light">
                Establish connection with AI neural network to begin intelligent conversation
              </p>
              <button
                onClick={startNewConversation}
                className="group relative px-10 py-4 bg-gradient-to-r from-emerald-500 via-indigo-600 to-teal-500 rounded-xl font-semibold text-white text-lg overflow-hidden transition-all hover:scale-105 shadow-[0_0_30px_rgba(79,70,229,0.6)] data-stream"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <AIBrainIcon className="w-5 h-5" animated={true} />
                  Activate Neural Interface
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-indigo-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div
              key={message.id || `${message.sender}-${message.timestamp}`}
              className={`flex gap-4 group ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              } animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {message.sender === 'ai' && (
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400/20 via-indigo-500/20 to-teal-500/20 rounded-xl flex items-center justify-center backdrop-blur-xl border border-white/20">
                    <AIBrainIcon className="w-8 h-8" animated={true} />
                  </div>
                </div>
              )}
              <div
                className={`relative max-w-2xl rounded-2xl px-6 py-4 backdrop-blur-xl border ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-br from-emerald-500/20 via-indigo-600/20 to-teal-500/20 border-emerald-400/30'
                    : 'bg-white/5 border-indigo-400/30'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <div className="relative">
                  <div className="whitespace-pre-wrap break-words leading-relaxed text-white/90">
                    {message.content}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-xs text-indigo-300/60 font-['JetBrains_Mono']">
                      {formatTimestamp(message.timestamp)}
                    </div>
                    <MessageActions message={message} onUpdate={(updated) => updateMessage(message.id, updated)} />
                  </div>
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
          ))}
          {isLoading && messages.length > 0 && (
            <div className="flex gap-4 justify-start">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400/20 via-indigo-500/20 to-teal-500/20 rounded-xl flex items-center justify-center backdrop-blur-xl border border-white/20">
                  <AIBrainIcon className="w-8 h-8 animate-spin" animated={false} />
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-indigo-400/30 rounded-2xl px-6 py-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && conversationId && !isEnded && (
        <div className="relative z-10 px-6 pb-4">
          <div className="max-w-4xl mx-auto">
            <ConversationSuggestions
              conversationId={conversationId}
              onSelect={(suggestion) => {
                setInputMessage(suggestion);
                inputRef.current?.focus();
              }}
            />
          </div>
        </div>
      )}

      {/* Input Area */}
      {conversationId && (
        <div className="relative z-10 backdrop-blur-xl bg-white/5 border-t border-white/10 shadow-[0_-8px_32px_0_rgba(31,38,135,0.37)] px-6 py-4">
          <form onSubmit={sendMessage} className="max-w-4xl mx-auto">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-indigo-500/20 to-teal-500/20 rounded-2xl blur-xl"></div>
                <textarea
                  ref={inputRef}
                  value={inputMessage || voiceTranscript}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(e);
                    }
                  }}
                  placeholder={isEnded ? "Session terminated" : "Transmit neural signal..."}
                  disabled={isLoading || isEnded}
                  rows={1}
                  className="relative w-full px-5 py-4 bg-white/10 backdrop-blur-xl border-2 border-indigo-400/30 rounded-2xl focus:outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 disabled:opacity-50 disabled:cursor-not-allowed resize-none max-h-32 overflow-y-auto text-white placeholder-indigo-300/50 font-['JetBrains_Mono'] transition-all"
                  style={{ minHeight: '56px' }}
                />
                {voiceTranscript && (
                  <div className="absolute top-2 right-2 text-xs text-emerald-400 font-['JetBrains_Mono'] flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                    VOICE
                  </div>
                )}
              </div>
              <VoiceInput
                onTranscript={(text, isFinal) => {
                  if (isFinal) {
                    setVoiceTranscript(text);
                    setInputMessage(text);
                  } else {
                    setVoiceTranscript(text);
                  }
                }}
                onError={(error) => console.error('Voice error:', error)}
              />
              <button
                type="submit"
                disabled={(!inputMessage.trim() && !voiceTranscript.trim()) || isLoading || isEnded}
                className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 via-indigo-600 to-teal-500 rounded-2xl font-semibold text-white overflow-hidden transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(79,70,229,0.6)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isLoading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Transmitting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Send</span>
                      </>
                    )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-indigo-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatInterface;
