import axios from 'axios';

const client = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`,
});

// Add a request interceptor to inject the correct token
// adminToken is ONLY used for /admin/* routes to prevent FK violations on student endpoints
client.interceptors.request.use((config) => {
  const isAdminRoute = config.url && config.url.startsWith('/admin');
  const token = isAdminRoute
    ? (localStorage.getItem('adminToken') || localStorage.getItem('token'))
    : (localStorage.getItem('token') || localStorage.getItem('adminToken'));
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default client;
