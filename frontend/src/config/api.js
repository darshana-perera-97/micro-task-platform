/**
 * API Configuration
 * Centralized configuration for backend API URL
 * 
 * When served from backend:
 * - Use relative path '/api' (same origin)
 * - Or set REACT_APP_API_URL to '/api' in production
 * 
 * When running standalone (development):
 * - Uses 'http://localhost:2000/api' as default
 */
const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:2000/api');

export default API_URL;

