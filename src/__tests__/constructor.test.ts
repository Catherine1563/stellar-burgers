import addIngredientReducer, {
  handleAddIngredient,
  resetIngredients,
  handleDeleteIngredient,
  handleMoveDownIngredient,
  handleMoveUpIngredient
} from '../slices/addIngredientSlice';
import { TIngredient } from '@utils-types';

describe('Конструктор', () => {
  describe('Проверка на добавление ингредиентов в конструкторе', () => {
    const initialState = {
      bun: undefined,
      arrIngredients: [],
      error: null
    };

    it('должен корректно добавлять ингредиент в state', () => {
      const ingredient: TIngredient = {
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
      };

      const action = handleAddIngredient(ingredient);
      const state = addIngredientReducer(initialState, action);

      expect(state.bun).toEqual({
        _id: '1',
        name: 'Булка',
        price: 100,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png'
      });
    });

    it('должен добавлять ингредиент не являющийся булкой', () => {
      const ingredient: TIngredient = {
        _id: '2',
        name: 'Томат',
        type: 'main',
        proteins: 20,
        fat: 20,
        carbohydrates: 20,
        calories: 20,
        price: 200,
        image: 'https://code.s3.yandex.net/react/code/meat-01.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
      };

      const action = handleAddIngredient(ingredient);
      const state = addIngredientReducer(initialState, action);

      expect(state.arrIngredients.length).toBe(1);
      expect(state.arrIngredients[0]).toEqual(
        expect.objectContaining({
          _id: '2',
          name: 'Томат',
          type: 'main',
          proteins: 20,
          fat: 20,
          carbohydrates: 20,
          calories: 20,
          price: 200,
          image: 'https://code.s3.yandex.net/react/code/meat-01.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
        })
      );
    });
  });

  describe('Проверка на удаление ингредиентов в конструкторе', () => {
    const initialState = {
      bun: undefined,
      arrIngredients: [
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
          image_mobile:
            'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
        }
      ],
      error: null
    };
    it('должен удалять ингредиент не являющийся булкой', () => {
      const action = handleDeleteIngredient({
        ingredient: initialState.arrIngredients[0],
        index: 0
      });
      const state = addIngredientReducer(initialState, action);

      expect(state.arrIngredients.length).toBe(0);
    });
  });
  describe('Проверка на изменения порядка ингредиентов в конструкторе', () => {
    const initialState = {
      bun: undefined,
      arrIngredients: [
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
          image_mobile:
            'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
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
          image_mobile:
            'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
          image_large:
            'https://code.s3.yandex.net/react/code/sauce-02-large.png'
        }
      ],
      error: null
    };
    it('должен перемещать ингредиент выше другого ингредиента', () => {
      const action = handleMoveUpIngredient(1);
      const state = addIngredientReducer(initialState, action);

      expect(state.arrIngredients[0]._id).toBe('3');
      expect(state.arrIngredients[1]._id).toBe('2');
    });

    it('должен перемещать ингредиент ниже другого ингредиента', () => {
      const action = handleMoveDownIngredient(0);
      const state = addIngredientReducer(initialState, action);

      expect(state.arrIngredients[0]._id).toBe('3');
      expect(state.arrIngredients[1]._id).toBe('2');
    });
  });

  describe('Проверка на обнуление ингредиентов в конструкторе', () => {
    const initialState = {
      bun: {
        _id: '1',
        name: 'Булка',
        price: 100,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png'
      },
      arrIngredients: [
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
          image_mobile:
            'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
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
          image_mobile:
            'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
          image_large:
            'https://code.s3.yandex.net/react/code/sauce-02-large.png'
        }
      ],
      error: null
    };
    it('должен возвращать конструктор в первоначальное состояние', () => {
      const action = resetIngredients();
      const state = addIngredientReducer(initialState, action);

      expect(state.bun).toBeUndefined();
      expect(state.arrIngredients).toEqual([]);
    });
  });
});
