import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface profileModalState {
  orderProfileModal: TOrder | null;
  isLoadingFeed: boolean;
  error: string | null;
}

const initialState: profileModalState = {
  orderProfileModal: null,
  isLoadingFeed: false,
  error: null
};

const profileModalSlice = createSlice({
  name: 'profile_modal',
  initialState,
  reducers: {
    selectOrderByNumber(
      state,
      action: PayloadAction<{ index: number; orders: TOrder[] }>
    ) {
      const { index, orders } = action.payload;
      const number = index;

      state.orderProfileModal =
        orders.find((order) => order.number === number) || null;
    }
  }
});

export const { selectOrderByNumber } = profileModalSlice.actions;
export default profileModalSlice.reducer;
