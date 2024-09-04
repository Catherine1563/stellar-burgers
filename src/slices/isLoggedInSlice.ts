import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { refreshToken } from '@api';

interface IsLoggedInState {
  isLoggedIn: boolean;
  checkingStatus: boolean;
  error: string | null;
}

const initialState: IsLoggedInState = {
  isLoggedIn: false,
  checkingStatus: true,
  error: null
};

export const checkTokens = createAsyncThunk(
  'logged_in/checkTokens',
  async () => {
    const refToken = localStorage.getItem('refreshToken');

    if (!refToken) {
      return false;
    }
    const response = await refreshToken();
    return response.success;
  }
);

const isLoggedInSlice = createSlice({
  name: 'logged_in',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkTokens.pending, (state) => {
        state.checkingStatus = true;
      })
      .addCase(
        checkTokens.fulfilled,
        (state, action: PayloadAction<boolean>) => {
          state.isLoggedIn = action.payload;
          state.checkingStatus = false;
        }
      )
      .addCase(checkTokens.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.checkingStatus = false;
        state.error = action.payload as string;
      });
  }
});

export default isLoggedInSlice.reducer;
