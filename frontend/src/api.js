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
    const storage = localStorage.getItem('luxecart-auth-storage');
    if (storage) {
      const parsed = JSON.parse(storage);
      if (parsed?.state?.token) {
        config.headers.Authorization = `Bearer ${parsed.state.token}`;
      }
    }
  } catch (error) {
    // ignore parse errors
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
