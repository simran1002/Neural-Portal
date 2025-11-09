import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import AIBrainIcon from './AIBrainIcon';

function AnalyticsDashboard() {
  const { isDark } = useTheme();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getAnalytics(days);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      alert('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <AIBrainIcon className="w-16 h-16 animate-spin" animated={false} />
          </div>
          <p className="text-indigo-300/70 font-['JetBrains_Mono'] text-lg">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-block mb-4">
            <div className="relative">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent tracking-tight">
                Analytics Matrix
              </h1>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-indigo-400 to-teal-400 blur-2xl opacity-30 -z-10"></div>
            </div>
          </div>
          <p className="text-indigo-300/70 text-lg font-light mb-6">Insights into your neural network activity</p>
          
          {/* Date Range Selector */}
          <div className="flex justify-center gap-2">
            {[7, 30, 90, 365].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-4 py-2 rounded-lg transition-all font-semibold backdrop-blur-xl border ${
                  days === d
                    ? 'bg-gradient-to-r from-emerald-500 via-indigo-600 to-teal-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)] border-white/20'
                    : 'bg-white/5 text-indigo-300 border-indigo-400/30 hover:bg-white/10 hover:border-emerald-400/50'
                }`}
              >
                {d} Days
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="relative backdrop-blur-xl bg-white/5 border-2 border-indigo-400/30 rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10 rounded-xl blur-xl -z-10"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-300/70 font-['JetBrains_Mono'] mb-2">Total Logs</p>
                <p className="text-3xl font-bold text-emerald-400 mt-2">
                  {analytics.summary.total_conversations}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400/20 via-indigo-500/20 to-teal-500/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/10">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="relative backdrop-blur-xl bg-white/5 border-2 border-indigo-400/30 rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10 rounded-xl blur-xl -z-10"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-300/70 font-['JetBrains_Mono'] mb-2">Active</p>
                <p className="text-3xl font-bold text-green-400 mt-2">
                  {analytics.summary.active_conversations}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400/20 via-indigo-500/20 to-teal-500/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/10">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="relative backdrop-blur-xl bg-white/5 border-2 border-indigo-400/30 rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10 rounded-xl blur-xl -z-10"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-300/70 font-['JetBrains_Mono'] mb-2">Archived</p>
                <p className="text-3xl font-bold text-indigo-400 mt-2">
                  {analytics.summary.ended_conversations}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400/20 via-indigo-500/20 to-teal-500/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/10">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>

          <div className="relative backdrop-blur-xl bg-white/5 border-2 border-indigo-400/30 rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10 rounded-xl blur-xl -z-10"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-300/70 font-['JetBrains_Mono'] mb-2">Avg Transmissions</p>
                <p className="text-3xl font-bold text-teal-400 mt-2">
                  {Math.round(analytics.summary.average_message_count || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400/20 via-indigo-500/20 to-teal-500/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/10">
                <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Conversations Over Time */}
          <div className="relative backdrop-blur-xl bg-white/5 border-2 border-indigo-400/30 rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10 rounded-xl blur-xl -z-10"></div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent mb-4">Logs Over Time</h2>
            <div className="h-64 flex items-end justify-between gap-2">
              {analytics.conversations_over_time.map((item, idx) => {
                const maxCount = Math.max(...analytics.conversations_over_time.map(i => i.count), 1);
                const height = (item.count / maxCount) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-emerald-500 to-indigo-600 rounded-t transition-all hover:from-emerald-600 hover:to-indigo-700 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                      style={{ height: `${height}%` }}
                      title={`${item.date}: ${item.count}`}
                    ></div>
                    <span className="text-xs text-indigo-300/60 font-['JetBrains_Mono'] mt-2 transform -rotate-45 origin-top-left">
                      {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Messages Over Time */}
          <div className="relative backdrop-blur-xl bg-white/5 border-2 border-indigo-400/30 rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10 rounded-xl blur-xl -z-10"></div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent mb-4">Transmissions Over Time</h2>
            <div className="h-64 flex items-end justify-between gap-2">
              {analytics.messages_over_time.map((item, idx) => {
                const maxCount = Math.max(...analytics.messages_over_time.map(i => i.count), 1);
                const height = (item.count / maxCount) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-teal-500 to-indigo-600 rounded-t transition-all hover:from-teal-600 hover:to-indigo-700 shadow-[0_0_10px_rgba(20,184,166,0.3)]"
                      style={{ height: `${height}%` }}
                      title={`${item.date}: ${item.count}`}
                    ></div>
                    <span className="text-xs text-indigo-300/60 font-['JetBrains_Mono'] mt-2 transform -rotate-45 origin-top-left">
                      {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Topics */}
        <div className="relative backdrop-blur-xl bg-white/5 border-2 border-indigo-400/30 rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-6 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10 rounded-xl blur-xl -z-10"></div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent mb-4">Top Neural Topics</h2>
          <div className="space-y-3">
            {analytics.top_topics.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-indigo-400/20 hover:border-emerald-400/50 transition-all">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-lg font-bold text-indigo-400 w-8 font-['JetBrains_Mono']">{idx + 1}</span>
                  <span className="text-indigo-200 flex-1 font-light">#{item.topic}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-indigo-900/30 rounded-full h-2 border border-indigo-400/20">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-indigo-600 h-2 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                      style={{ width: `${(item.count / analytics.top_topics[0].count) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-emerald-400 w-8 text-right font-['JetBrains_Mono']">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Distribution */}
        {analytics.sentiment_distribution && analytics.sentiment_distribution.length > 0 && (
          <div className="relative backdrop-blur-xl bg-white/5 border-2 border-indigo-400/30 rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10 rounded-xl blur-xl -z-10"></div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent mb-4">Sentiment Distribution</h2>
            <div className="flex gap-4">
              {analytics.sentiment_distribution.map((item, idx) => {
                const total = analytics.sentiment_distribution.reduce((sum, i) => sum + i.count, 0);
                const percentage = (item.count / total) * 100;
                const colors = {
                  positive: 'from-green-500 to-emerald-600',
                  negative: 'from-rose-500 to-red-600',
                  neutral: 'from-indigo-500 to-indigo-600'
                };
                return (
                  <div key={idx} className="flex-1 backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-indigo-400/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-indigo-300 capitalize font-['JetBrains_Mono']">
                        {item.sentiment}
                      </span>
                      <span className="text-sm font-bold text-emerald-400 font-['JetBrains_Mono']">{item.count}</span>
                    </div>
                    <div className="w-full bg-indigo-900/30 rounded-full h-4 border border-indigo-400/20">
                      <div
                        className={`bg-gradient-to-r ${colors[item.sentiment] || 'from-indigo-500 to-indigo-600'} h-4 rounded-full transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)]`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalyticsDashboard;

