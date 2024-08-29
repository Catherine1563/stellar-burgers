import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface ordersProfileState {
  orders: TOrder[];
  isOrdersLoading: boolean;
  error: string | null;
}

const initialState: ordersProfileState = {
  orders: [],
  isOrdersLoading: false,
  error: null
};

export const fetchOrdersProfile = createAsyncThunk(
  'orders/fetchOrdersProfile',
  async (_, thunkAPI) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (error) {
      console.error('Server error:', error);
      return thunkAPI.rejectWithValue('Failed to fetch orders profile');
    }
  }
);

const ordersProfileSlice = createSlice({
  name: 'all_orders_profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersProfile.pending, (state) => {
        state.isOrdersLoading = true;
      })
      .addCase(fetchOrdersProfile.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrdersProfile.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.error = action.payload as string;
      });
  }
});

export default ordersProfileSlice.reducer;
