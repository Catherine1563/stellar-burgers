import { configureStore } from '@reduxjs/toolkit';
import addFeedReducer, { fetchFeed } from '../slices/addFeedSlice';
import { TOrder } from '@utils-types';

const mockOrders: TOrder[] = [
  {
    _id: '1',
    status: 'done',
    name: 'Order 1',
    createdAt: '2023-09-17T12:34:56.789Z',
    updatedAt: '2023-09-17T12:34:56.789Z',
    number: 12345,
    ingredients: ['ingredient 1', 'ingredient 2']
  },
  {
    _id: '2',
    status: 'done',
    name: 'Order 2',
    createdAt: '2023-09-17T12:34:56.789Z',
    updatedAt: '2023-09-17T12:34:56.789Z',
    number: 67890,
    ingredients: ['ingredient 1', 'ingredient 2', 'ingredient 2']
  }
];
const mockFeedStats = {
  total: 100,
  totalToday: 20
};

const mockErrorResponse = 'Ошибка получения заказов';

describe('feedSlice', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Проверка экшена pending на правильные значения', () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;

    const store = configureStore({
      reducer: { feed: addFeedReducer }
    });

    store.dispatch(fetchFeed());
    const state = store.getState().feed;

    expect(state.isOrdersLoading).toBe(true);
    expect(state.ordersFeed).toEqual([]);
    expect(state.feed.total).toBe(0);
    expect(state.feed.totalToday).toBe(0);
    expect(state.error).toBeNull();
  });

  it('Проверка экшена fulfilled на правильные значения', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            orders: mockOrders,
            total: mockFeedStats.total,
            totalToday: mockFeedStats.totalToday
          })
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { feed: addFeedReducer }
    });

    await store.dispatch(fetchFeed());
    const state = store.getState().feed;

    expect(state.isOrdersLoading).toBe(false);
    expect(state.ordersFeed).toEqual(mockOrders);
    expect(state.feed.total).toEqual(mockFeedStats.total);
    expect(state.feed.totalToday).toEqual(mockFeedStats.totalToday);
    expect(state.error).toBeNull();
  });

  it('Проверка экшена rejected на правильные значения', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () =>
          Promise.resolve({ success: false, message: mockErrorResponse })
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { feed: addFeedReducer }
    });

    await store.dispatch(fetchFeed());
    const state = store.getState().feed;

    expect(state.isOrdersLoading).toBe(false);
    expect(state.ordersFeed).toEqual([]);
    expect(state.feed.total).toBe(0);
    expect(state.feed.totalToday).toBe(0);
    expect(state.error).toBe(mockErrorResponse);
  });
});
