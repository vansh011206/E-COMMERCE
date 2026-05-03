import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the JWT token if available
api.interceptors.request.use((config) => {
  try {
    let token = null;
    
    // First check user auth token
    const userStorage = localStorage.getItem('luxecart-auth-storage');
    if (userStorage) {
      const parsed = JSON.parse(userStorage);
      if (parsed?.state?.token) {
        token = parsed.state.token;
      }
    }
    
    // If no user token, check admin auth token in sessionStorage
    if (!token) {
      const adminStorage = sessionStorage.getItem('admin-store');
      if (adminStorage) {
        const parsedAdmin = JSON.parse(adminStorage);
        if (parsedAdmin?.state?.adminToken) {
          token = parsedAdmin.state.adminToken;
        }
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    // ignore parse errors
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
