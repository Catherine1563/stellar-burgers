import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { registerUserApi, updateUserApi, TRegisterData } from '@api';
import { TUser } from '@utils-types';

interface RegisterState {
  user: TUser | null;
  success: boolean;
  refreshToken: string;
  accessToken: string;
  isRegisSuccess: boolean;
  error: string | null;
}

const initialState: RegisterState = {
  user: null,
  success: false,
  refreshToken: '',
  accessToken: '',
  isRegisSuccess: false,
  error: null
};

export const fetchRegisterUser = createAsyncThunk(
  'auth/register/fetchRegisterUser',
  async (userData: TRegisterData, thunkAPI) => {
    try {
      const userResponse = await registerUserApi(userData);
      localStorage.setItem('refreshToken', userResponse.refreshToken);
      localStorage.setItem('accessToken', userResponse.accessToken);
      return userResponse;
    } catch (error) {
      console.error('Server error:', error);
      return thunkAPI.rejectWithValue('Failed to fetch register user data');
    }
  }
);

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    resetRegisState: (state) => {
      state.isRegisSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegisterUser.pending, (state) => {
        state.isRegisSuccess = false;
        state.error = null;
      })
      .addCase(fetchRegisterUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.success = action.payload.success;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isRegisSuccess = true;
      })
      .addCase(fetchRegisterUser.rejected, (state, action) => {
        state.success = true;
        state.isRegisSuccess = false;
        state.error = action.payload as string;
      });
  }
});

export const { resetRegisState } = registerSlice.actions;
export default registerSlice.reducer;
