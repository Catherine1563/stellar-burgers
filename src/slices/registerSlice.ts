import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { registerUserApi, TRegisterData } from '@api';
import { TUser } from '@utils-types';
import { setCookie } from '../utils/cookie';

interface RegisterState {
  user: TUser | null;
  success: boolean;
  isRegisSuccess: boolean;
  error: string | null;
}

const initialState: RegisterState = {
  user: null,
  success: false,
  isRegisSuccess: false,
  error: null
};

export const fetchRegisterUser = createAsyncThunk(
  'auth/register/fetchRegisterUser',
  async (userData: TRegisterData) => {
    const userResponse = await registerUserApi(userData);
    if (userResponse && userResponse.accessToken) {
      setCookie('accessToken', userResponse.accessToken);
      localStorage.setItem('refreshToken', userResponse.refreshToken);
      return userResponse;
    }
    return userResponse;
  }
);

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    resetRegisState: (state) => {
      state.isRegisSuccess = false;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegisterUser.pending, (state) => {
        state.isRegisSuccess = false;
        state.success = false;
        state.error = null;
      })
      .addCase(fetchRegisterUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.success = action.payload.success;
        state.isRegisSuccess = true;
      })
      .addCase(fetchRegisterUser.rejected, (state, action) => {
        state.success = false;
        state.isRegisSuccess = false;
        state.error = action.error.message || 'Something went wrong';
      });
  }
});

export const { resetRegisState } = registerSlice.actions;
export default registerSlice.reducer;
