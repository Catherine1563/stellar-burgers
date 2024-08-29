import { getUserApi, refreshToken } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { getCookie } from '../utils/cookie';

interface ProfileState {
  user: TUser;
  success: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  user: {
    name: '',
    email: ''
  },
  success: false,
  loading: false,
  error: null
};

export const refreshUserToken = createAsyncThunk(
  'auth/token/refreshToken',
  async (_, thunkAPI) => {
    try {
      const refreshData = await refreshToken();
      return refreshData;
    } catch (error) {
      console.error('Server error:', error);
      return thunkAPI.rejectWithValue('Failed to refresh token');
    }
  }
);

export const fetchUser = createAsyncThunk(
  'auth/user/fetchUser',
  async (_, thunkAPI) => {
    try {
      const token = getCookie('accessToken');
      if (!token) {
        await thunkAPI.dispatch(refreshUserToken());
      }
      const userResponse = await getUserApi();
      return userResponse;
    } catch (error) {
      console.error('Server error:', error);
      return thunkAPI.rejectWithValue('Failed to fetch user data');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateUser(state, action: PayloadAction<TUser>) {
      state.user = action.payload;
    }
  },
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
        state.error = action.payload as string;
      });
  }
});

export default profileSlice.reducer;
