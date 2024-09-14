import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface feedState {
  ordersFeed: TOrder[];
  feed: {
    total: number;
    totalToday: number;
  };
  isOrdersLoading: boolean;
  error: string | null;
}

const initialState: feedState = {
  ordersFeed: [],
  feed: {
    total: 0,
    totalToday: 0
  },
  isOrdersLoading: false,
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

const addFeedSlice = createSlice({
  name: 'add_feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isOrdersLoading = false;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isOrdersLoading = true;
        const { orders, feed } = action.payload;
        state.ordersFeed = orders;
        state.feed.total = feed.total;
        state.feed.totalToday = feed.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  }
});

export default addFeedSlice.reducer;
