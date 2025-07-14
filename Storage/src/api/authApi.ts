import axios from 'axios';
import { getToken } from '../auth/token';

const API_BASE = 'https://your-api-url.com'; // Replace with your actual backend

export const loginApi = async (email: string, password: string) => {
  const res = await axios.post(`${API_BASE}/login`, { email, password });
  return res.data;
};

export const signupApi = async (name: string, email: string, password: string) => {
  const res = await axios.post(`${API_BASE}/signup`, { name, email, password });
  return res.data;
};

export const getUserProfileApi = async () => {
  const token = await getToken();
  const res = await axios.get(`${API_BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
