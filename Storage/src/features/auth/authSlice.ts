// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUserApi, loginApi, signupApi } from '../../api/authApi';
import { TokenService } from '../../hooks/useToken';
import { ApiError } from '../../utils/errors';

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  loading: 'idle',
  error: null,
};

// Async thunks for API calls
export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const { accessToken, refreshToken, userId } = await loginApi(email, password);
      await TokenService.setTokens(accessToken, refreshToken);
      return { accessToken, userId };
    } catch (error) {
      const errorMessage =
        error instanceof ApiError
          ? error.message
          : 'An unexpected error occurred during login.';
      return rejectWithValue(errorMessage);
    }
  },
);

export const signupUser = createAsyncThunk(
  'auth/signup',
  async (
    { name, email, password }: { name: string; email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const { msg, user } = await signupApi(name, email, password);
      return { msg, user };
    } catch (error) {
      const errorMessage =
        error instanceof ApiError
          ? error.message
          : 'An unexpected error occurred during signup.';
      return rejectWithValue(errorMessage);
    }
  },
);

export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const { refresh_token } = await TokenService.getTokens();
      if (!refresh_token) {
        return rejectWithValue('No authentication token found.');
      }
      const user = await getUserApi();
      return user;
    } catch (error) {
      await TokenService.clearTokens();
      const errorMessage =
        error instanceof ApiError
          ? error.message
          : 'Failed to retrieve user session.';
      return rejectWithValue(errorMessage);
    }
  },
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await TokenService.clearTokens();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Login
      .addCase(loginUser.pending, state => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.isLoggedIn = true;
        state.user = { id: action.payload.userId, name: '', email: '' }; // Adjust according to your actual user data
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = 'failed';
        state.isLoggedIn = false;
        state.user = null;
        state.error = action.payload || 'Login failed. Please try again.';
      })
      // Signup
      .addCase(signupUser.pending, state => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = 'failed';
        state.isLoggedIn = false;
        state.user = null;
        state.error = action.payload || 'Signup failed. Please try again.';
      })
      // Fetch User
      .addCase(fetchUser.pending, state => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.isLoggedIn = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = 'failed';
        state.isLoggedIn = false;
        state.user = null;
        state.error = action.payload || 'Session expired or invalid. Please log in.';
      })
      // Logout
      .addCase(logoutUser.fulfilled, state => {
        state.isLoggedIn = false;
        state.user = null;
        state.loading = 'idle';
        state.error = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;