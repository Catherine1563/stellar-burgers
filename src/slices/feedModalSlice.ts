import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface feedModalState {
  orderFeed: TOrder | null;
  feed: {
    total: number;
    totalToday: number;
  };
  isLoadingFeed: boolean;
  error: string | null;
}

const initialState: feedModalState = {
  orderFeed: null,
  feed: {
    total: 0,
    totalToday: 0
  },
  isLoadingFeed: false,
  error: null
};

const feedModalSlice = createSlice({
  name: 'feed_modal',
  initialState,
  reducers: {
    setSelectedFeed(state, action: PayloadAction<TOrder | null>) {
      state.orderFeed = action.payload;
    },
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

export const { setSelectedFeed, selectFeedByNumber } = feedModalSlice.actions;
export default feedModalSlice.reducer;
