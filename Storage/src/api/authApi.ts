// src/api/authApi.ts
import axios from 'axios'; // Import the axios library
import api from './api'; // Import the configured axios instance
import { TokenService } from '../hooks/useToken';
import { ApiError } from '../utils/errors';
import { User } from '../features/auth/authSlice';

// Note: We no longer need API_BASE or getAuthHeaders since they're handled by the api service

export const loginApi = async (email: string, password: string) => {
  try {
    const res = await api.post('/auth/login', { email, password });
    if (!res.data.accessToken || !res.data.id) {
      throw new ApiError('Invalid response from server during login');
    }
    return {
      msg: res.data.msg,
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
      userId: res.data.id 
    };
  } catch (err: any) {
    console.log('login error', err);
    if (axios.isAxiosError(err) && err.response) {
      throw new ApiError(
        err.response.data.message || 'Login failed',
        err.response.status,
      );
    }
    throw new ApiError(err.message || 'An unknown error occurred during login');
  }
};

export const googleLoginApi = async (idToken: string) => {
  try {
    const res = await api.post('/auth/google', { idToken });

    if (!res.data.accessToken || !res.data.id) {
      throw new ApiError('Invalid response from server during Google login');
    }

    console.log(res);

    return {
      msg: res.data.msg,
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
      userId: res.data.id
    };
  } catch (err: any) {
    console.log('Google login error', err);
    if (axios.isAxiosError(err) && err.response) {
      throw new ApiError(
        err.response.data.message || 'Google Login failed',
        err.response.status
      );
    }
    throw new ApiError(err.message || 'An unknown error occurred during Google login');
  }
};

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const { refresh_token } = await TokenService.getTokens();
    if (!refresh_token) throw new ApiError('No refresh token available');

    const res = await api.post('/auth/refresh', {
      refreshToken: refresh_token,
    });

    const newAccessToken = res.data.accessToken;
    if (!newAccessToken) {
      throw new ApiError('Failed to get new access token from refresh');
    }

    // Save the new access token, keep existing refresh token
    await TokenService.setTokens(newAccessToken, refresh_token);

    return newAccessToken;
  } catch (err: any) {
    console.error('Error refreshing token:', err);
    await TokenService.clearTokens(); // optional: clear tokens on failure
    throw err;
  }
};

export const signupApi = async (
  name: string,
  email: string,
  password: string,
): Promise<{ msg: string; user: User }> => {
  try {
    const res = await api.post('/auth/register', {
      name,
      email,
      password,
    });
    if (res.status !== 201 || !res.data.msg) {
      throw new ApiError('Invalid response from server during signup');
    }
    
    return {
      msg: res.data.msg,
      user: res.data.data
    };
  } catch (err: any) {
    console.log('signup error', err);
    if (axios.isAxiosError(err) && err.response) {
      throw new ApiError(
        err.response.data.message || 'Signup failed',
        err.response.status,
      );
    }
    throw new ApiError(
      err.message || 'An unknown error occurred during signup',
    );
  }
};

export const getUserApi = async () => {
  try {
    const res = await api.get('/auth/me');
    console.log(res)
    
    if (!res.data.msg || res.data.isVerified === undefined) {
      throw new ApiError('Invalid response format from server');
    }
    
    if (!res.data.isVerified) {
      throw new ApiError(res.data.msg || 'User verification failed', 401);
    }
    
    return {
      isVerified: res.data.isVerified
    };
  } catch (err: any) {
    if (axios.isAxiosError(err) && err.response) { // Use axios.isAxiosError
      if (err.response.status === 401) {
        throw new ApiError(
          err.response.data.msg || 'Your session has expired. Please log in again.',
          err.response.status,
        );
      }
      throw new ApiError(
        err.response.data.msg || 'Failed to fetch user data',
        err.response.status,
      );
    }
    throw new ApiError(
      err.message || 'An unknown error occurred while fetching user data',
    );
  }
};