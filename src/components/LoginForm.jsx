
import React, { useState } from 'react';
import { login, register } from '../utils/authService';

const LoginForm = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isLogin) {
        // Handle login
        const result = await login(username, password);
        if (result.success) {
          setSuccessMessage('Login successful!');
          // Notify parent component
          if (onLoginSuccess) {
            onLoginSuccess(result.data.token);
          }
        } else {
          setError(result.error || 'Login failed. Please check your credentials.');
        }
      } else {
        // Handle registration
        if (!email.includes('@')) {
          setError('Please enter a valid email address');
          setLoading(false);
          return;
        }
        
        const result = await register(username, email, password);
        if (result.success) {
          setSuccessMessage('Registration successful! You can now log in.');
          // Switch to login form
          setIsLogin(true);
        } else {
          setError(result.error || 'Registration failed. Please try again.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
        {isLogin ? 'Log In to Your Account' : 'Create an Account'}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-gray-700 mb-2">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        
        {!isLogin && (
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        )}
        
        <div>
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Processing...' : isLogin ? 'Log In' : 'Register'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <button
          onClick={toggleForm}
          className="text-indigo-600 hover:text-indigo-800 text-sm"
        >
          {isLogin
            ? "Don't have an account? Register"
            : 'Already have an account? Log In'}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;