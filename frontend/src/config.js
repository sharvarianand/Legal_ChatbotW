// Environment-aware configuration

// Check if we're in development mode
const isDevelopment = 
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE === 'development') || 
    (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development');

// Base API URL that changes based on environment
export const API_BASE_URL = isDevelopment 
  ? 'http://127.0.0.1:5000/api'
  : '/api'; // In production, use relative path or proper domain

// Other configuration variables
export const CONFIG = {
  maxMessagesPerPage: 50,
  typingIndicatorDelay: 500,
  messageAnimationDuration: 300
};