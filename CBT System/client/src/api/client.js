import axios from 'axios';

// Default to main academy server on port 5000 (which hosts /api/cbt), or dedicated CBT server on 5001
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const client = axios.create({
  baseURL: `${API_BASE}/api`,
});

// Auto-capture token from URL hash (#token=...) or query param to support seamless handover
// Using hash (#token=...) prevents sending large tokens over HTTP headers (avoids HTTP 431)
const hashStr = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
const hashParams = new URLSearchParams(hashStr);
const searchParams = new URLSearchParams(window.location.search);
const incomingToken = hashParams.get('token') || searchParams.get('token');
if (incomingToken) {
  localStorage.setItem('token', incomingToken);
  window.history.replaceState({}, document.title, window.location.pathname);
}

// Request interceptor to inject JWT token
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
