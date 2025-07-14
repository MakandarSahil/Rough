// ✅ authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, signupApi, getUserProfileApi } from '../../api/authApi';
import { saveToken, removeToken } from '../../auth/token';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const { token, user } = await loginApi(email, password);
    await saveToken(token);
    return user;
  },
);

export const signupUser = createAsyncThunk(
  'auth/signup',
  async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    const { token, user } = await signupApi(name, email, password);
    await saveToken(token);
    return user;
  },
);

export const fetchUser = createAsyncThunk('auth/fetchUser', async () => {
  return await getUserProfileApi();
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await removeToken();
});

interface User {
  name: string;
  email: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.isLoggedIn = false;
        state.user = null;
      });
  },
});

export default authSlice.reducer;
