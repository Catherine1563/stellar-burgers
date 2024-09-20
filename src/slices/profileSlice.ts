import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { getUserApi } from '@api';

interface ProfileState {
  user: TUser;
  success: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  user: {
    email: '',
    name: ''
  },
  success: false,
  loading: false,
  error: null
};

export const fetchUser = createAsyncThunk('auth/user/fetchUser', async () => {
  const userResponse = await getUserApi();
  return userResponse;
});

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.success = action.payload.success;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  }
});

export default profileSlice.reducer;
