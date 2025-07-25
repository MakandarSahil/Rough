// src/services/api.ts
import axios from 'axios';
import { refreshAccessToken } from './authApi';
import { ApiError } from '../utils/errors';
import { TokenService } from '../hooks/useToken';

// const API_BASE_URL = 'http://192.168.137.206:3000'; // utakrsh laptop
const API_BASE_URL = 'http://192.168.1.8:3000'; // suyash wifi
// const API_BASE_URL = 'http://192.168.50.32:3000'; // apple lab wifi
// const API_BASE_URL = 'http://192.168.137.74:3000'; // shreyash laptop wifi

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor – attach access token
api.interceptors.request.use(async (config) => {
  const { access_token } = await TokenService.getTokens();
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  return config;
});

// Response interceptor – handle 401 and try refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        console.log(newAccessToken);
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        throw new ApiError('Session expired. Please log in again.', 401);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
