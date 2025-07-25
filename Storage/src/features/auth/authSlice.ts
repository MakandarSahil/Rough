// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUserApi, googleLoginApi, loginApi, signupApi } from '../../api/authApi';
import { TokenService } from '../../hooks/useToken';
import { ApiError } from '../../utils/errors';
import { saveToken } from '../../auth/token';
import { OneSignal } from 'react-native-onesignal';

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  isVerified: boolean;
  isLoggedIn: boolean;
  user: User | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  isVerified: false,
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
      const { accessToken, refreshToken, userId, externalId } = await loginApi(email, password);
      await TokenService.setTokens(accessToken, refreshToken);
      await TokenService.setExternalId(externalId);
      return { accessToken, userId, externalId };
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
  async (_, thunkAPI) => {
    try {
      const tokens = await TokenService.getTokens();
      if (!tokens?.refresh_token) {
        // Even if no token, mark as failed to avoid infinite loading
        return thunkAPI.rejectWithValue('No refresh token found');
      }

      const user = await getUserApi();
      return user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await TokenService.clearTokens();
  await TokenService.clearExternalId();
  await OneSignal.logout();
});

export const googleLoginUser = createAsyncThunk(
  'auth/googleLoginUser',
  async (idToken: string, { rejectWithValue }) => {
    try {
      const res = await googleLoginApi(idToken);
      await TokenService.setTokens(res.accessToken, res.refreshToken);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

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
        state.isVerified = true;
        state.user = { id: action.payload.userId, name: '', email: '' };
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = 'failed';
        state.isLoggedIn = false;
        state.isVerified = false;
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
        state.isVerified = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = 'failed';
        state.isLoggedIn = false;
        state.isVerified = false;
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
        state.isVerified = action.payload.isVerified;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = 'failed';
        state.isLoggedIn = false;
        state.isVerified = false;
        state.user = null;
        state.error = action.payload || 'Session expired or invalid. Please log in.';
      })
      // Logout
      .addCase(logoutUser.fulfilled, state => {
        state.isLoggedIn = false;
        state.isVerified = false;
        state.user = null;
        state.loading = 'idle';
        state.error = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;