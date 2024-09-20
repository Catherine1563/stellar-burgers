import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer, {
  fetchIngredients
} from '../slices/allIngredientsCategorySlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 10,
    price: 100,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '2',
    name: 'Томат',
    type: 'main',
    proteins: 20,
    fat: 20,
    carbohydrates: 20,
    calories: 20,
    price: 200,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  },
  {
    _id: '3',
    name: 'Барбекю соус',
    type: 'sauce',
    proteins: 30,
    fat: 30,
    carbohydrates: 30,
    calories: 30,
    price: 300,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
  }
];
const mockErrorResponse = 'Ошибка получения ингредиентов';

describe('ingredientsCategorySlice', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Проверка экшена pending на правильные значения', () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;

    const store = configureStore({
      reducer: { ingredients: ingredientsReducer }
    });

    store.dispatch(fetchIngredients());
    const state = store.getState().ingredients;

    expect(state.isLoading).toBe(true);
    expect(state.buns).toEqual([]);
    expect(state.mains).toEqual([]);
    expect(state.sauces).toEqual([]);
    expect(state.error).toBeNull();
  });

  it('Проверка экшена fulfilled на правильные значения', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockIngredients
          })
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { ingredients: ingredientsReducer }
    });

    await store.dispatch(fetchIngredients());
    const state = store.getState().ingredients;

    expect(state.isLoading).toBe(false);
    expect(state.buns).toEqual([mockIngredients[0]]);
    expect(state.mains).toEqual([mockIngredients[1]]);
    expect(state.sauces).toEqual([mockIngredients[2]]);
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
      reducer: { ingredients: ingredientsReducer }
    });

    await store.dispatch(fetchIngredients());
    const state = store.getState().ingredients;

    expect(state.isLoading).toBe(false);
    expect(state.buns).toEqual([]);
    expect(state.mains).toEqual([]);
    expect(state.sauces).toEqual([]);
    expect(state.error).toBe(mockErrorResponse);
  });
});
