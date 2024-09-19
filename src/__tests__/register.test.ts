import { configureStore } from '@reduxjs/toolkit';
import registerReducer, {
  fetchRegisterUser,
  resetRegisState
} from '../slices/registerSlice';
import { TRegisterData } from '@api';

const mockUser: TRegisterData = {
  email: 'test@example.com',
  name: 'Test',
  password: 'password123'
};
const mockErrorResponse = {
  message: 'Ошибка получения пользователя'
};

describe('registerSlice', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Проверка экшена pending на правельные значения', () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;

    const store = configureStore({
      reducer: { register: registerReducer }
    });

    store.dispatch(fetchRegisterUser(mockUser));
    const state = store.getState().register;

    expect(state.success).toBe(false);
    expect(state.user).toBeNull();
    expect(state.error).toBeNull();
  });

  it('Проверка экшена fulfilled на правельные значения', async () => {
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
      reducer: { register: registerReducer }
    });

    await store.dispatch(fetchRegisterUser(mockUser));
    const state = store.getState().register;

    expect(state.success).toBe(true);
    expect(state.user).toEqual({ email: 'test@example.com', name: 'Test' });
    expect(state.error).toBeNull();
  });

  it('Проверка экшена rejected на правельные значения', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(mockErrorResponse)
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { register: registerReducer }
    });

    await store.dispatch(fetchRegisterUser(mockUser));
    const state = store.getState().register;

    expect(state.success).toBe(false);
    expect(state.user).toBeNull();
    expect(state.error).toEqual(mockErrorResponse.message);
  });

  it('Проверка экшена resetRegisState на правельные значения', async () => {
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
      reducer: { register: registerReducer }
    });

    await store.dispatch(fetchRegisterUser(mockUser));
    let state = store.getState().register;

    expect(state.success).toBe(true);
    expect(state.user).toEqual({ email: 'test@example.com', name: 'Test' });
    expect(state.error).toBeNull();

    store.dispatch(resetRegisState());
    state = store.getState().register;

    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });
});
