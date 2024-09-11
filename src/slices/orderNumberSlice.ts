import { getOrderByNumberApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface OrderState {
  orderProfile: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orderProfile: null,
  isLoading: false,
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
  reducers: {
    clearOrder(state) {
      state.orderProfile = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderProfile = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  }
});

export const { clearOrder } = orderNumberSlice.actions;
export default orderNumberSlice.reducer;
