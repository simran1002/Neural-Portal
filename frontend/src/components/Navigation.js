import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import AIBrainIcon from './AIBrainIcon';

function Navigation() {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Neural Chat', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { path: '/conversations', label: 'Archive', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { path: '/intelligence', label: 'Intelligence', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
    { path: '/analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  ];

  return (
    <nav className="relative backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400/20 via-indigo-500/20 to-teal-500/20 rounded-lg flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-[0_0_20px_rgba(79,70,229,0.5)] group-hover:scale-110 transition-transform">
                  <AIBrainIcon className="w-7 h-7" animated={true} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-indigo-500 to-teal-500 rounded-lg blur-lg opacity-50 -z-10 group-hover:opacity-75 transition-opacity"></div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent tracking-tight">
                  Neural Portal
                </span>
                <p className="text-xs text-indigo-300/50 font-['JetBrains_Mono'] -mt-1">v2.0.1</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-lg transition-all font-semibold text-sm ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-emerald-500 via-indigo-600 to-teal-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)]'
                    : 'text-indigo-300/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive(item.path) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-indigo-600 to-emerald-500 rounded-lg blur opacity-50 -z-10"></div>
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.label}
                </span>
              </Link>
            ))}
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-lg text-indigo-300/70 hover:text-white hover:bg-white/5 transition-all border border-white/10 hover:border-indigo-400/50"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
