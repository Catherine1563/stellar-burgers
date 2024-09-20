import feedModalReducer, { selectFeedByNumber } from '../slices/feedModalSlice';
import { TOrder } from '@utils-types';

describe('Feed modal', () => {
  const initialState = {
    orderFeed: null,
    feed: {
      total: 0,
      totalToday: 0
    },
    isLoadingFeed: false,
    error: null
  };
  it('должен устанавливать выбранный feed по номеру', () => {
    const orders: TOrder[] = [
      {
        _id: '1',
        status: 'done',
        name: 'Order 1',
        createdAt: '2023-09-17T12:34:56.789Z',
        updatedAt: '2023-09-17T12:34:56.789Z',
        number: 12345,
        ingredients: ['ingredient 1', 'ingredient 2']
      }
    ];

    const action = selectFeedByNumber({
      index: 12345,
      orders: orders
    });
    const state = feedModalReducer(initialState, action);

    expect(state.orderFeed).toEqual({
      _id: '1',
      status: 'done',
      name: 'Order 1',
      createdAt: '2023-09-17T12:34:56.789Z',
      updatedAt: '2023-09-17T12:34:56.789Z',
      number: 12345,
      ingredients: ['ingredient 1', 'ingredient 2']
    });
  });
});
