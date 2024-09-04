import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { fetchAllIngredients } from '../../slices/allIngredientsSlice';
import { fetchFeed, selectFeedByNumber } from '../../slices/feedModalSlice';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const { number } = useParams<{ number: string }>();
  const { orderData, isOrdersLoading } = useSelector(
    (state) => state.feed_modal
  );
  const ingredients = useSelector((state) => state.all_ingredients.ingredients);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchAllIngredients());
    }
  }, [dispatch, ingredients.length]);

  useEffect(() => {
    if (!isOrdersLoading && !orderData) {
      dispatch(fetchFeed());
    }
  }, [dispatch, isOrdersLoading, orderData]);

  useEffect(() => {
    if (number) {
      if (!isOrdersLoading) {
        dispatch(selectFeedByNumber(parseInt(number)));
      }
    }
  }, [dispatch, number, isOrdersLoading]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
