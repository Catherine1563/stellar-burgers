import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api'; // Убедитесь, что импорт правильный
import { TOrder } from '@utils-types';

interface OrderState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
}

const initialState: OrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const fetchOrder = createAsyncThunk(
  'orders/fetchOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    handleOrderClick(state) {
      state.orderRequest = true;
    },
    resetOrder(state) {
      state.orderRequest = false;
      state.orderModalData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Something went wrong';
      });
  }
});

export const { handleOrderClick, resetOrder } = orderSlice.actions;
export default orderSlice.reducer;
