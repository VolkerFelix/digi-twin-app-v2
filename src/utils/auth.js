/**
 * Get the JWT token from local storage
 * @returns {string|null} The stored JWT token or null if not found
 */
export const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };
  
  /**
   * Save the JWT token to local storage
   * @param {string} token - The JWT token to save
   */
  export const saveAuthToken = (token) => {
    localStorage.setItem('authToken', token);
  };
  
  /**
   * Remove the JWT token from local storage
   */
  export const removeAuthToken = () => {
    localStorage.removeItem('authToken');
  };
  
  /**
   * Check if the user is authenticated
   * @returns {boolean} True if a token exists
   */
  export const isAuthenticated = () => {
    return !!getAuthToken();
  };
  
  /**
   * Get authentication headers for API requests
   * @returns {Object} Headers object with Authorization
   */
  export const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };
  
  /**
   * Parse the JWT token and extract user information
   * @returns {Object|null} User information from the token or null if invalid
   */
  export const getUserFromToken = () => {
    const token = getAuthToken();
    if (!token) return null;
    
    try {
      // JWT tokens have 3 parts: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      // Decode the payload (middle part)
      const payload = JSON.parse(atob(parts[1]));
      
      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        removeAuthToken(); // Token expired, remove it
        return null;
      }
      
      return {
        id: payload.sub, // subject (user ID)
        username: payload.username,
        exp: payload.exp
      };
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      return null;
    }
  };