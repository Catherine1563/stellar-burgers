import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface feedState {
  orders: TOrder[];
  feed: {
    total: number;
    totalToday: number;
  };
  isOrdersLoading: boolean;
  error: string | null;
}

const initialState: feedState = {
  orders: [],
  feed: {
    total: 0,
    totalToday: 0
  },
  isOrdersLoading: false,
  error: null
};

export const fetchFeed = createAsyncThunk(
  '/orders/all/fetchFeed',
  async (_, thunkAPI) => {
    try {
      const feeds = await getFeedsApi();
      return {
        orders: feeds.orders,
        feed: {
          total: feeds.total,
          totalToday: feeds.totalToday
        }
      };
    } catch (error) {
      console.error('Server error:', error);
      return thunkAPI.rejectWithValue('Failed to fetch orders');
    }
  }
);

const addFeedSlice = createSlice({
  name: 'add_feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isOrdersLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        const { orders, feed } = action.payload;
        state.orders = orders;
        state.feed.total = feed.total;
        state.feed.totalToday = feed.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.error = action.payload as string;
      });
  }
});

export default addFeedSlice.reducer;
