import { configureStore } from '@reduxjs/toolkit';
import loginUserReducer, {
  featchloginUser,
  resetLoginState
} from '../slices/loginUserSlice';
import { TLoginData } from '@api';

const mockUser: TLoginData = {
  email: 'test@example.com',
  password: 'password123'
};
const mockErrorResponse = {
  message: 'Ошибка получении пользователя'
};

describe('loginUserSlice', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Проверка экшена pending на правильные значения', () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;

    const store = configureStore({
      reducer: { login: loginUserReducer }
    });

    store.dispatch(featchloginUser(mockUser));
    const state = store.getState().login;

    expect(state.success).toBe(false);
    expect(state.user).toBeNull();
    expect(state.error).toBeNull();
  });

  it('Проверка экшена fulfilled на правильные значения', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            accessToken: 'mockAccessToken',
            refreshToken: 'mockRefreshToken',
            user: { email: 'test@example.com', name: 'Test' }
          })
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { login: loginUserReducer }
    });

    await store.dispatch(featchloginUser(mockUser));
    const state = store.getState().login;

    expect(state.success).toBe(true);
    expect(state.user).toEqual({ email: 'test@example.com', name: 'Test' });
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
      reducer: { login: loginUserReducer }
    });

    await store.dispatch(featchloginUser(mockUser));
    const state = store.getState().login;

    expect(state.success).toBe(false);
    expect(state.user).toBeNull();
    expect(state.error).toEqual(mockErrorResponse.message);
  });

  it('Проверка экшена resetLoginState на правильные значения', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            accessToken: 'mockAccessToken',
            refreshToken: 'mockRefreshToken',
            user: { email: 'test@example.com', name: 'Test' }
          })
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { login: loginUserReducer }
    });

    await store.dispatch(featchloginUser(mockUser));
    let state = store.getState().login;

    expect(state.success).toBe(true);
    expect(state.user).toEqual({ email: 'test@example.com', name: 'Test' });
    expect(state.error).toBeNull();

    store.dispatch(resetLoginState());
    state = store.getState().login;

    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });
});
