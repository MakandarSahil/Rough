import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveToken, removeToken } from '../../auth/token';

interface AuthState {
  isLoggedIn: boolean;
  user: any;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  loading: false,
  error: null,
};

// Mock login
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    // simulate API
    await new Promise((res) => setTimeout(res, 1000));
    const token = 'mock-token';
    const user = { id: 1, name: 'Sahil', email };
    await saveToken(token);
    return { user };
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await removeToken();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Login failed';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      });
  },
});

export default authSlice.reducer;
