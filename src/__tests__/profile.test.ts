import { configureStore } from '@reduxjs/toolkit';
import profileReducer, { fetchUser } from '../slices/profileSlice';
import { TUser } from '@utils-types';

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

const mockSuccessResponse = {
  success: true,
  user: mockUser
};

const mockErrorResponse = {
  message: 'Ошибка получения пользователя'
};

describe('profileSlice', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Проверка экшена pending на правильные значения', () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;

    const store = configureStore({
      reducer: { profile: profileReducer }
    });

    store.dispatch(fetchUser());
    const state = store.getState().profile;

    expect(state.loading).toBe(true);
    expect(state.user).toEqual({ email: '', name: '' });
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('Проверка экшена fulfilled на правильные значения', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse)
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { profile: profileReducer }
    });

    await store.dispatch(fetchUser());
    const state = store.getState().profile;

    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.success).toBe(true);
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
      reducer: { profile: profileReducer }
    });

    await store.dispatch(fetchUser());
    const state = store.getState().profile;

    expect(state.success).toBe(false);
    expect(state.loading).toBe(false);
    expect(state.user).toEqual({ email: '', name: '' });
    expect(state.error).toEqual(mockErrorResponse.message);
  });
});
