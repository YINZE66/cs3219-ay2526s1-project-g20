// src/services/userService.js
import axios from 'axios';

// Base URL of your user service (configure this in .env)
const API_BASE_URL = process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:8000';

// Create an axios instance with auth token attached to requests
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include JWT token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userService = {
  // Fetch current user's profile from the user service
  async getCurrentUser() {
    const response = await api.get('/profile');
    return response.data;
  },

  // Logout: Clear token and redirect (handled in component)
  logout() {
    localStorage.removeItem('access_token');
  },
};