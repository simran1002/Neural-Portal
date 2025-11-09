import React from 'react';

function AIBrainIcon({ className = "w-12 h-12", animated = true }) {
  return (
    <svg 
      className={`${className} ${animated ? 'ai-brain' : ''}`}
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Neural Network Nodes */}
      <circle cx="30" cy="30" r="4" fill="url(#gradient1)" opacity="0.8">
        {animated && <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />}
      </circle>
      <circle cx="50" cy="20" r="4" fill="url(#gradient2)" opacity="0.8">
        {animated && <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.3s" repeatCount="indefinite" />}
      </circle>
      <circle cx="70" cy="30" r="4" fill="url(#gradient3)" opacity="0.8">
        {animated && <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.6s" repeatCount="indefinite" />}
      </circle>
      <circle cx="25" cy="50" r="4" fill="url(#gradient1)" opacity="0.8">
        {animated && <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.2s" repeatCount="indefinite" />}
      </circle>
      <circle cx="50" cy="50" r="5" fill="url(#gradient2)" opacity="0.9">
        {animated && <animate attributeName="r" values="5;6;5" dur="2s" repeatCount="indefinite" />}
      </circle>
      <circle cx="75" cy="50" r="4" fill="url(#gradient3)" opacity="0.8">
        {animated && <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.4s" repeatCount="indefinite" />}
      </circle>
      <circle cx="30" cy="70" r="4" fill="url(#gradient1)" opacity="0.8">
        {animated && <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.5s" repeatCount="indefinite" />}
      </circle>
      <circle cx="50" cy="80" r="4" fill="url(#gradient2)" opacity="0.8">
        {animated && <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.7s" repeatCount="indefinite" />}
      </circle>
      <circle cx="70" cy="70" r="4" fill="url(#gradient3)" opacity="0.8">
        {animated && <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.1s" repeatCount="indefinite" />}
      </circle>

      {/* Connection Lines */}
      <line x1="30" y1="30" x2="50" y2="20" stroke="url(#gradientLine)" strokeWidth="1" opacity="0.4" />
      <line x1="50" y1="20" x2="70" y2="30" stroke="url(#gradientLine)" strokeWidth="1" opacity="0.4" />
      <line x1="30" y1="30" x2="25" y2="50" stroke="url(#gradientLine)" strokeWidth="1" opacity="0.4" />
      <line x1="70" y1="30" x2="75" y2="50" stroke="url(#gradientLine)" strokeWidth="1" opacity="0.4" />
      <line x1="25" y1="50" x2="50" y2="50" stroke="url(#gradientLine)" strokeWidth="1.5" opacity="0.5" />
      <line x1="50" y1="50" x2="75" y2="50" stroke="url(#gradientLine)" strokeWidth="1.5" opacity="0.5" />
      <line x1="25" y1="50" x2="30" y2="70" stroke="url(#gradientLine)" strokeWidth="1" opacity="0.4" />
      <line x1="75" y1="50" x2="70" y2="70" stroke="url(#gradientLine)" strokeWidth="1" opacity="0.4" />
      <line x1="30" y1="70" x2="50" y2="80" stroke="url(#gradientLine)" strokeWidth="1" opacity="0.4" />
      <line x1="50" y1="80" x2="70" y2="70" stroke="url(#gradientLine)" strokeWidth="1" opacity="0.4" />
      <line x1="50" y1="20" x2="50" y2="50" stroke="url(#gradientLine)" strokeWidth="1.5" opacity="0.5" />
      <line x1="50" y1="50" x2="50" y2="80" stroke="url(#gradientLine)" strokeWidth="1.5" opacity="0.5" />

      {/* Gradients */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id="gradientLine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#4f46e5" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default AIBrainIcon;

