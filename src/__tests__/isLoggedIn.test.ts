import { configureStore } from '@reduxjs/toolkit';
import isLoggedInReducer, { checkTokens } from '../slices/isLoggedInSlice';

const mockSuccessResponse = {
  success: true,
  accessToken: 'mockAccessToken',
  refreshToken: 'mockRefreshToken'
};

const mockErrorResponse = {
  message: 'Ошибка недействительный токен'
};

describe('isLoggedInSlice', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
  });

  it('Проверка экшена pending на правильные значения', () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;

    const store = configureStore({
      reducer: { isLoggedIn: isLoggedInReducer }
    });

    store.dispatch(checkTokens());
    const state = store.getState().isLoggedIn;

    expect(state.checkingStatus).toBe(true);
    expect(state.isLoggedIn).toBe(false);
    expect(state.error).toBeNull();
  });

  it('Проверка экшена fulfilled на правильные значения с токеном', async () => {
    localStorage.setItem('refreshToken', 'validRefreshToken');

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse)
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { isLoggedIn: isLoggedInReducer }
    });

    await store.dispatch(checkTokens());
    const state = store.getState().isLoggedIn;

    expect(state.isLoggedIn).toBe(true);
    expect(state.checkingStatus).toBe(false);
    expect(state.error).toBeNull();
  });

  it('Проверка экшена fulfilled на правильные значения без токена', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse)
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { isLoggedIn: isLoggedInReducer }
    });

    await store.dispatch(checkTokens());
    const state = store.getState().isLoggedIn;

    expect(state.isLoggedIn).toBe(false);
    expect(state.checkingStatus).toBe(false);
    expect(state.error).toBeNull();
  });

  it('Проверка экшена rejected на правильные значения', async () => {
    localStorage.setItem('refreshToken', 'invalidRefreshToken');

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(mockErrorResponse)
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { isLoggedIn: isLoggedInReducer }
    });

    await store.dispatch(checkTokens());
    const state = store.getState().isLoggedIn;

    expect(state.isLoggedIn).toBe(false);
    expect(state.checkingStatus).toBe(false);
    expect(state.error).toEqual(mockErrorResponse.message);
  });
});
