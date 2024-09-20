import profileModalReducer, {
  selectOrderByNumber
} from '../slices/profileModalSlice';
import { TOrder } from '@utils-types';

describe('Profile modal', () => {
  const initialState = {
    orderProfileModal: null,
    error: null
  };
  it('должен устанавливать выбранный feed по номеру', () => {
    const orders: TOrder[] = [
      {
        _id: '1',
        status: 'done',
        name: 'Order 1',
        createdAt: '2023-09-17T12:34:56.789Z',
        updatedAt: '2023-09-17T12:34:56.789Z',
        number: 12345,
        ingredients: ['ingredient 1', 'ingredient 2']
      }
    ];

    const action = selectOrderByNumber({
      index: 12345,
      orders: orders
    });
    const state = profileModalReducer(initialState, action);

    expect(state.orderProfileModal).toEqual({
      _id: '1',
      status: 'done',
      name: 'Order 1',
      createdAt: '2023-09-17T12:34:56.789Z',
      updatedAt: '2023-09-17T12:34:56.789Z',
      number: 12345,
      ingredients: ['ingredient 1', 'ingredient 2']
    });
  });
});
