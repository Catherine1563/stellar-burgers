import { logoutApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

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
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutApi();
      if (!response.success) {
        throw new Error('Logout failed');
      }
      return response;
    } catch (error) {
      console.error('Server error:', error);
      return rejectWithValue(error);
    }
  }
);

const logoutSlice = createSlice({
  name: 'logout',
  initialState,
  reducers: {
    resetLogoutState: (state) => {
      state.isLogout = true;
    }
  },
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
        state.error = action.payload as string;
      });
  }
});

export const { resetLogoutState } = logoutSlice.actions;
export default logoutSlice.reducer;
