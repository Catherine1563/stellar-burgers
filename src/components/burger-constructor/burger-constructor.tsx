import { FC, useMemo } from 'react';
import { BurgerConstructorUI } from '@ui';
import { resetIngredients } from '../../slices/addIngredientSlice';
import {
  fetchOrder,
  handleOrderClick,
  resetOrder
} from '../../slices/orderSlice';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const { bun, arrIngredients } = useSelector((state) => state.add_ingredient);
  const { orderModalData, orderRequest } = useSelector((state) => state.order);
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.logged_in.isLoggedIn);
  const dispatch = useDispatch();
  const constructorItems = {
    bun: bun,
    ingredients: arrIngredients
  };

  const onOrderClick = () => {
    if (isLoggedIn) {
      if (constructorItems.bun && constructorItems.ingredients.length > 0) {
        const ingredientsIds = [
          constructorItems.bun ? constructorItems.bun._id : null,
          ...constructorItems.ingredients.map((ingredient) => ingredient._id),
          constructorItems.bun ? constructorItems.bun._id : null
        ].filter((id) => id !== null);

        if (ingredientsIds.length > 1 && !orderRequest) {
          dispatch(handleOrderClick());
          dispatch(fetchOrder(ingredientsIds));
        }
      }
    } else {
      navigate('/login');
    }
  };

  const closeOrderModal = () => {
    dispatch(resetOrder());
    dispatch(resetIngredients());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce<number>((s, v) => s + v.price, 0),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
