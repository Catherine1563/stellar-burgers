import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface feedModalState {
  orderFeed: TOrder | null;
  feed: {
    total: number;
    totalToday: number;
  };
  error: string | null;
}

const initialState: feedModalState = {
  orderFeed: null,
  feed: {
    total: 0,
    totalToday: 0
  },
  error: null
};

const feedModalSlice = createSlice({
  name: 'feed_modal',
  initialState,
  reducers: {
    selectFeedByNumber(
      state,
      action: PayloadAction<{ index: number; orders: TOrder[] }>
    ) {
      const { index, orders } = action.payload;
      const number = index;

      state.orderFeed = orders.find((order) => order.number === number) || null;
    }
  }
});

export const { selectFeedByNumber } = feedModalSlice.actions;
export default feedModalSlice.reducer;
