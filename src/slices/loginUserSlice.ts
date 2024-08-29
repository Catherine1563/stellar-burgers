import { loginUserApi, TLoginData } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

export type LoginState = {
  user: TUser | null;
  success: boolean;
  isAuthSuccess: boolean;
  error: string | null;
};

const initialState: LoginState = {
  user: null,
  success: false,
  isAuthSuccess: false,
  error: null
};

export const featchloginUser = createAsyncThunk(
  'auth/featchloginUser',
  async (loginData: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(loginData);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('accessToken', response.accessToken);
      return response;
    } catch (error) {
      console.error('Server error:', error);
      return rejectWithValue(error);
    }
  }
);

export const loginUserSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    resetLoginState: (state) => {
      state.isAuthSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(featchloginUser.pending, (state) => {
        state.success = false;
        state.isAuthSuccess = false;
        state.error = null;
      })
      .addCase(featchloginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.success = action.payload.success;
        state.isAuthSuccess = true;
      })
      .addCase(featchloginUser.rejected, (state, action) => {
        state.success = false;
        state.isAuthSuccess = false;
        state.error = action.payload as string;
      });
  }
});

export const { resetLoginState } = loginUserSlice.actions;
export default loginUserSlice.reducer;
