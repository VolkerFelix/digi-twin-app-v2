const DEV_API_URL = 'http://localhost:8080'; // Local development
const PROD_API_URL = ''; // Your production URL when deployed

// Select the appropriate base URL based on environment
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? PROD_API_URL 
  : DEV_API_URL;

// Auth endpoints
export const AUTH_ENDPOINTS = {
  login: `${API_BASE_URL}/login`,
  register: `${API_BASE_URL}/register_user`,
};

// Health data endpoints
export const HEALTH_ENDPOINTS = {
  upload: `${API_BASE_URL}/health/upload_health`,
  fetch: `${API_BASE_URL}/health/data`,
};

// WebSocket endpoint
export const WS_ENDPOINT = process.env.NODE_ENV === 'production'
  ? `wss://${window.location.host}/ws` 
  : `ws://${DEV_API_URL.replace('http://', '')}/ws`;