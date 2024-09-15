import { logoutApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteCookie } from '../utils/cookie';

interface LogoutState {
  isLogout: boolean;
  error: string | null;
}

const initialState: LogoutState = {
  isLogout: false,
  error: null
};

export const featchLogout = createAsyncThunk(
  'auth/logout/featchLogout',
  async () => {
    const response = await logoutApi();
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
    return response;
  }
);

const logoutSlice = createSlice({
  name: 'logout',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(featchLogout.pending, (state) => {
        state.isLogout = false;
        state.error = null;
      })
      .addCase(featchLogout.fulfilled, (state, action) => {
        state.isLogout = action.payload.success;
      })
      .addCase(featchLogout.rejected, (state, action) => {
        state.isLogout = false;
        state.error = action.error.message || 'Something went wrong';
      });
  }
});

export default logoutSlice.reducer;
