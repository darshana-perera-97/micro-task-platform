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
const API_URL = 'http://93.127.129.102:2000/api'
// const API_URL = 'http://localhost:2000/api'

export default API_URL;

