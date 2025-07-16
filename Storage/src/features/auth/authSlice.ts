// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUserApi, loginApi, signupApi } from '../../api/authApi';
import { saveToken, removeToken, getToken } from '../../auth/token';
import { ApiError } from '../../utils/errors'; // Import ApiError

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
      await saveToken(refreshToken);
      return userId;
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
    {
      name,
      email,
      password,
    }: { name: string; email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const { msg, user } = await signupApi(name, email, password);
      return user;
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
      const token = await getToken();
      if (!token) {
        // No token, so not logged in. This is not an error but a state.
        // We reject to ensure the `rejected` case is hit to clear state.
        return rejectWithValue('No authentication token found.');
      }
      const user = await getUserApi();
      return user;
    } catch (error) {
      // If getUserApi fails (e.g., token expired/invalid), remove token and clear state.
      await removeToken();
      const errorMessage =
        error instanceof ApiError
          ? error.message
          : 'Failed to retrieve user session.';
      return rejectWithValue(errorMessage);
    }
  },
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await removeToken();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // You can add a reducer here to clear the error state manually if needed
    clearAuthError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Login
      .addCase(loginUser.pending, state => {
        state.loading = 'pending';
        state.error = null; // Clear previous errors
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.isLoggedIn = true;
        state.user = action.payload;
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
        state.error = null; // Clear previous errors
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.isLoggedIn = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = 'failed';
        state.isLoggedIn = false;
        state.user = null;
        state.error = action.payload || 'Signup failed. Please try again.';
      })
      // Fetch User (on app load/refresh)
      .addCase(fetchUser.pending, state => {
        state.loading = 'pending';
        state.error = null; // Clear previous errors
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
        state.error =
          action.payload || 'Session expired or invalid. Please log in.';
      })
      // Logout
      .addCase(logoutUser.fulfilled, state => {
        state.isLoggedIn = false;
        state.user = null;
        state.loading = 'idle';
        state.error = null; // Clear any errors on logout
      });
  },
});

export const { clearAuthError } = authSlice.actions; // Export action to clear error
export default authSlice.reducer;
