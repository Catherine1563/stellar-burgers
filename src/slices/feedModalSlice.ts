import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface feedModalState {
  orders: TOrder[];
  orderData: TOrder | null;
  feed: {
    total: number;
    totalToday: number;
  };
  isOrdersLoading: boolean;
  error: string | null;
}

const initialState: feedModalState = {
  orders: [],
  orderData: null,
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

const feedModalSlice = createSlice({
  name: 'feed_modal',
  initialState,
  reducers: {
    setSelectedFeed(state, action: PayloadAction<TOrder | null>) {
      state.orderData = action.payload;
    },
    selectFeedByNumber(state, action: PayloadAction<number>) {
      const number = action.payload;
      state.orderData =
        state.orders.find((order) => order.number === number) || null;
    }
  },
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

export const { setSelectedFeed, selectFeedByNumber } = feedModalSlice.actions;
export default feedModalSlice.reducer;
