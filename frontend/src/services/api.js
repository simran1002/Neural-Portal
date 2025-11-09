import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const conversationsAPI = {
  // Get all conversations
  getAll: () => api.get('/conversations/'),
  
  // Get conversation by ID
  getById: (id) => api.get(`/conversations/${id}/`),
  
  // Create new conversation
  create: (title = '') => api.post('/conversations/create_conversation/', { title }),
  
  // Send message
  sendMessage: (conversationId, content) => 
    api.post(`/conversations/${conversationId}/send_message/`, { content }),
  
  // End conversation
  endConversation: (conversationId) => 
    api.post(`/conversations/${conversationId}/end_conversation/`),
  
  // Share conversation
  share: (conversationId) => 
    api.post(`/conversations/${conversationId}/share/`),
  
  // Unshare conversation
  unshare: (conversationId) => 
    api.post(`/conversations/${conversationId}/unshare/`),
  
  // Branch conversation
  branch: (conversationId, messageId, title = '') => 
    api.post(`/conversations/${conversationId}/branch/`, { message_id: messageId, title }),
  
  // Export conversation
  export: (conversationId, format = 'json') => 
    api.get(`/conversations/${conversationId}/export/`, { params: { format }, responseType: 'blob' }),
  
  // Get suggestions
  getSuggestions: (conversationId) => 
    api.get(`/conversations/${conversationId}/suggestions/`),
  
  // Get shared conversation
  getShared: (token) => api.get(`/shared/${token}/`),
};

export const messagesAPI = {
  // React to message
  react: (messageId, emoji) => 
    api.post(`/messages/${messageId}/react/`, { emoji }),
  
  // Bookmark message
  bookmark: (messageId) => 
    api.post(`/messages/${messageId}/bookmark/`),
  
  // Reply to message
  reply: (messageId, content) => 
    api.post(`/messages/${messageId}/reply/`, { content }),
};

export const analyticsAPI = {
  // Get analytics
  getAnalytics: (days = 30) => 
    api.get('/analytics/', { params: { days } }),
};

export const queryAPI = {
  // Query past conversations
  query: (query, filters = {}) => 
    api.post('/query/', { query, ...filters }),
};

export default api;

