import { configureStore } from '@reduxjs/toolkit';
import orderReducer, {
  fetchOrder,
  handleOrderClick,
  resetOrder
} from '../slices/orderSlice';
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
  message: 'Ошибка получения заказов'
};

describe('orderSlice', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Проверка экшена pending', () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;

    const store = configureStore({
      reducer: { order: orderReducer }
    });

    store.dispatch(fetchOrder(['ingredient1', 'ingredient2']));
    const state = store.getState().order;

    expect(state.orderRequest).toBe(true);
    expect(state.orderModalData).toBeNull();
    expect(state.error).toBeNull();
  });

  it('Проверка экшена fulfilled на правильные значения', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            order: mockOrder
          })
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { order: orderReducer }
    });

    await store.dispatch(fetchOrder(['ingredient1', 'ingredient2']));
    const state = store.getState().order;

    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(mockOrder);
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
      reducer: { order: orderReducer }
    });

    await store.dispatch(fetchOrder(['ingredient1', 'ingredient2']));
    const state = store.getState().order;

    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toBeNull();
    expect(state.error).toBe(mockErrorResponse.message);
  });

  it('Проверка экшена handleOrderClick на правильные значения', () => {
    const store = configureStore({
      reducer: { order: orderReducer }
    });

    store.dispatch(handleOrderClick());
    const state = store.getState().order;

    expect(state.orderRequest).toBe(true);
  });

  it('Проверка экшена resetOrder на правильные значения', () => {
    const store = configureStore({
      reducer: { order: orderReducer }
    });

    store.dispatch(handleOrderClick());
    store.dispatch(fetchOrder(['ingredient1', 'ingredient2']));
    store.dispatch(resetOrder());

    const state = store.getState().order;

    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toBeNull();
    expect(state.error).toBeNull();
  });
});
