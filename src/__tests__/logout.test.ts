import { configureStore } from '@reduxjs/toolkit';
import logoutReducer, { featchLogout } from '../slices/logoutSlice';

const mockErrorResponse = {
  message: 'Ошибка получения токена'
};

describe('logoutSlice', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Проверка экшена pending на правильные значения', () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;

    const store = configureStore({
      reducer: { logout: logoutReducer }
    });

    store.dispatch(featchLogout());
    const state = store.getState().logout;

    expect(state.isLogout).toBe(false);
    expect(state.error).toBeNull();
  });

  it('Проверка экшена fulfilled на правильные значения', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true
          })
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { logout: logoutReducer }
    });

    await store.dispatch(featchLogout());
    const state = store.getState().logout;

    expect(state.isLogout).toBe(true);
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
      reducer: { logout: logoutReducer }
    });

    await store.dispatch(featchLogout());
    const state = store.getState().logout;

    expect(state.isLogout).toBe(false);
    expect(state.error).toEqual(mockErrorResponse.message);
  });
});
