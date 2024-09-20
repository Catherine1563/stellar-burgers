import { configureStore } from '@reduxjs/toolkit';
import orderNumberReducer, {
  fetchOrderByNumber
} from '../slices/orderNumberSlice';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: '1',
  status: 'done',
  name: 'Test Burger',
  createdAt: '2024-09-20T00:00:00Z',
  updatedAt: '2024-09-20T00:00:00Z',
  number: 1,
  ingredients: ['ingredient1', 'ingredient2']
};

const mockErrorResponse = {
  message: 'Ошибка получения заказа'
};

describe('orderNumberSlice', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Проверка экшена pending на правильные значения', () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;

    const store = configureStore({
      reducer: { orderNumber: orderNumberReducer }
    });

    store.dispatch(fetchOrderByNumber(1));
    const state = store.getState().orderNumber;

    expect(state.isLoadingOrders).toBe(false);
    expect(state.orderProfile).toBeNull();
    expect(state.error).toBeNull();
  });

  it('Проверка экшена fulfilled на правильные значения', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            orders: [mockOrder]
          })
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { orderNumber: orderNumberReducer }
    });

    await store.dispatch(fetchOrderByNumber(1));
    const state = store.getState().orderNumber;

    expect(state.isLoadingOrders).toBe(true);
    expect(state.orderProfile).toEqual(mockOrder);
    expect(state.error).toBeNull();
  });

  it('Проверка экшена rejected на правильные значения', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(mockErrorResponse)
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { orderNumber: orderNumberReducer }
    });

    await store.dispatch(fetchOrderByNumber(1));
    const state = store.getState().orderNumber;

    expect(state.isLoadingOrders).toBe(false);
    expect(state.orderProfile).toBeNull();
    expect(state.error).toBe(mockErrorResponse.message);
  });
});
