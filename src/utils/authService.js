import { saveAuthToken, removeAuthToken, getAuthToken, isAuthenticated } from './auth';

/**
 * API endpoint for login
 * @type {string}
 */
const LOGIN_ENDPOINT = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/login`
  : '/login';

/**
 * API endpoint for registration
 * @type {string}
 */
const REGISTER_ENDPOINT = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/register_user`
  : '/register_user';

/**
 * Authenticate user with username and password
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Authentication result
 */
export const login = async (username, password) => {
  try {
    const response = await fetch(LOGIN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    
    // Save token to local storage
    if (data.token) {
      saveAuthToken(data.token);
      return { success: true, data };
    } else {
      throw new Error('No token received from server');
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Register a new user
 * @param {string} username - User's username
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Registration result
 */
export const register = async (username, email, password) => {
  try {
    const response = await fetch(REGISTER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Registration failed');
    }

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Log out the current user
 * @returns {Object} - Logout result
 */
export const logout = () => {
  try {
    removeAuthToken();
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if the current session is valid
 * @returns {Promise<Object>} - Session validation result
 */
export const validateSession = async () => {
  if (!isAuthenticated()) {
    return { valid: false };
  }
  
  try {
    // We can add a specific endpoint to validate tokens if needed
    // For now, we'll just check if the token exists and is not expired
    // A more robust implementation would verify with the backend
    
    const token = getAuthToken();
    if (!token) {
      return { valid: false };
    }
    
    // Check token expiration by decoding it
    // JWT tokens are in format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      removeAuthToken();
      return { valid: false };
    }
    
    try {
      // Decode payload (second part)
      const payload = JSON.parse(atob(parts[1]));
      
      // Check expiration time
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        removeAuthToken();
        return { valid: false, error: 'Token expired' };
      }
      
      return { valid: true, user: { id: payload.sub, username: payload.username } };
    } catch (e) {
      removeAuthToken();
      return { valid: false, error: 'Invalid token format' };
    }
  } catch (error) {
    console.error('Session validation error:', error);
    return { valid: false, error: error.message };
  }
};