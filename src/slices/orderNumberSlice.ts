import { getOrderByNumberApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface OrderState {
  orderProfile: TOrder | null;
  isLoadingOrders: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orderProfile: null,
  isLoadingOrders: false,
  error: null
};

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (orderNumber: number) => {
    const response = await getOrderByNumberApi(orderNumber);
    return response.orders[0];
  }
);

const orderNumberSlice = createSlice({
  name: 'order_number',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoadingOrders = false;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoadingOrders = true;
        state.orderProfile = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoadingOrders = false;
        state.error = action.error.message || 'Something went wrong';
      });
  }
});

export default orderNumberSlice.reducer;
