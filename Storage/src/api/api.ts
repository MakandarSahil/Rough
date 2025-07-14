import axios from 'axios';
import { getToken } from '../auth/token';

const api = axios.create({
  baseURL: 'https://your-api.com', // or mock server
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
