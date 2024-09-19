import { configureStore } from '@reduxjs/toolkit';
import ordersProfileReducer, {
  fetchOrdersProfile
} from '../slices/ordersProfileSlice';
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
const mockErrorResponse = 'Ошибка получения заказов';

describe('ordersProfileSlice', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Проверка экшена pending на правильные значения', () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;

    const store = configureStore({
      reducer: { orders: ordersProfileReducer }
    });

    store.dispatch(fetchOrdersProfile());
    const state = store.getState().orders;

    expect(state.isOrdersLoading).toBe(true);
    expect(state.ordersProfile).toEqual([]);
    expect(state.error).toBeNull();
  });

  it('Проверка экшена fulfilled на правильные значения', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            orders: mockOrders
          })
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { orders: ordersProfileReducer }
    });

    await store.dispatch(fetchOrdersProfile());
    const state = store.getState().orders;

    expect(state.isOrdersLoading).toBe(false);
    expect(state.ordersProfile).toEqual(mockOrders);
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
      reducer: { orders: ordersProfileReducer }
    });

    await store.dispatch(fetchOrdersProfile());
    const state = store.getState().orders;

    expect(state.isOrdersLoading).toBe(false);
    expect(state.ordersProfile).toEqual([]);
    expect(state.error).toBe(mockErrorResponse);
  });
});
