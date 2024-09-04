import { loginUserApi, TLoginData } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { setCookie } from '../utils/cookie';

export type LoginState = {
  user: TUser | null;
  success: boolean;
  error: string | null;
};

const initialState: LoginState = {
  user: null,
  success: false,
  error: null
};

export const featchloginUser = createAsyncThunk(
  'auth/featchloginUser',
  async (loginData: TLoginData) => {
    const userResponse = await loginUserApi(loginData);
    if (userResponse && userResponse.accessToken) {
      setCookie('accessToken', userResponse.accessToken);
      localStorage.setItem('refreshToken', userResponse.refreshToken);
      return userResponse;
    }
    return userResponse;
  }
);

export const loginUserSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    resetLoginState: (state) => {
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(featchloginUser.pending, (state) => {
        state.success = false;
        state.error = null;
      })
      .addCase(featchloginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.success = action.payload.success;
      })
      .addCase(featchloginUser.rejected, (state, action) => {
        state.success = false;
        state.error = action.error.message || 'Something went wrong';
      });
  }
});

export const { resetLoginState } = loginUserSlice.actions;
export default loginUserSlice.reducer;
