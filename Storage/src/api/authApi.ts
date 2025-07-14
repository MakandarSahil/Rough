// src/api/authApi.ts
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import { ApiError } from '../utils/errors'; // Import the custom error class

const API_BASE = 'http://backend-ip-address:5000/api'; // <--- IMPORTANT: Replace with your actual Node.js backend URL

// Helper to get authorization headers
const getAuthHeaders = async () => {
  const token = await EncryptedStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const loginApi = async (email: string, password: string) => {
  try {
    const res = await axios.post(`${API_BASE}/login`, { email, password });
    if (!res.data.token || !res.data.user) {
      throw new ApiError('Invalid response from server during login');
    }
    return res.data;
  } catch (err: any) {
    if (axios.isAxiosError(err) && err.response) {
      throw new ApiError(err.response.data.message || 'Login failed', err.response.status);
    }
    throw new ApiError(err.message || 'An unknown error occurred during login');
  }
};

export const signupApi = async (name: string, email: string, password: string) => {
  try {
    const res = await axios.post(`${API_BASE}/signup`, { name, email, password });
    if (!res.data.token || !res.data.user) {
      throw new ApiError('Invalid response from server during signup');
    }
    return res.data;
  } catch (err: any) {
    if (axios.isAxiosError(err) && err.response) {
      throw new ApiError(err.response.data.message || 'Signup failed', err.response.status);
    }
    throw new ApiError(err.message || 'An unknown error occurred during signup');
  }
};

export const getUserApi = async () => {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) {
      throw new ApiError('Authentication token missing. Please log in.', 401);
    }

    const res = await axios.get(`${API_BASE}/me`, { headers });
    if (!res.data.name || !res.data.email) {
      throw new ApiError('Invalid user data received from server');
    }
    return res.data;
  } catch (err: any) {
    if (axios.isAxiosError(err) && err.response) {
      // Specifically handle 401/403 for token issues
      if (err.response.status === 401 || err.response.status === 403) {
        throw new ApiError('Your session has expired. Please log in again.', err.response.status);
      }
      throw new ApiError(err.response.data.message || 'Failed to fetch user data', err.response.status);
    }
    throw new ApiError(err.message || 'An unknown error occurred while fetching user data');
  }
};