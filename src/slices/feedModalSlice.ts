import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface feedModalState {
  orders: TOrder[];
  orderFeed: TOrder | null;
  feed: {
    total: number;
    totalToday: number;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: feedModalState = {
  orders: [],
  orderFeed: null,
  feed: {
    total: 0,
    totalToday: 0
  },
  isLoading: false,
  error: null
};

export const fetchFeed = createAsyncThunk('/orders/all/fetchFeed', async () => {
  const feeds = await getFeedsApi();
  return {
    orders: feeds.orders,
    feed: {
      total: feeds.total,
      totalToday: feeds.totalToday
    }
  };
});

const feedModalSlice = createSlice({
  name: 'feed_modal',
  initialState,
  reducers: {
    setSelectedFeed(state, action: PayloadAction<TOrder | null>) {
      state.orderFeed = action.payload;
    },
    selectFeedByNumber(state, action: PayloadAction<number>) {
      const number = action.payload;
      state.orderFeed =
        state.orders.find((order) => order.number === number) || null;
    },
    clearFeed(state) {
      state.orderFeed = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        const { orders, feed } = action.payload;
        state.orders = orders;
        state.feed.total = feed.total;
        state.feed.totalToday = feed.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  }
});

export const { setSelectedFeed, selectFeedByNumber, clearFeed } =
  feedModalSlice.actions;
export default feedModalSlice.reducer;
