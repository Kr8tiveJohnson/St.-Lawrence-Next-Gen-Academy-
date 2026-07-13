import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:5000/api', // Make sure this matches backend PORT
});

// Add a request interceptor to inject the token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default client;
