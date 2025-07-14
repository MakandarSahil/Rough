import axios from 'axios';
import { getToken } from '../auth/token';

const API = axios.create({
  baseURL: 'http://your-backend-url.com/api',
  timeout: 5000,
});

API.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
