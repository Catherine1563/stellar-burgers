import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { fetchAllIngredients } from '../../slices/allIngredientsSlice';
import {
  clearFeed,
  fetchFeed,
  selectFeedByNumber
} from '../../slices/feedModalSlice';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { clearOrder, fetchOrderByNumber } from '../../slices/orderNumberSlice';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const ingredients = useSelector((state) => state.all_ingredients.ingredients);
  const orderFeed = useSelector((state) => state.feed_modal.orderFeed);
  const orderProfile = useSelector((state) => state.order_number.orderProfile);
  const dispatch = useDispatch();

  const isFeedRoute = useMemo(
    () => location.pathname.startsWith('/feed'),
    [location.pathname]
  );
  const isProfileRoute = useMemo(
    () => location.pathname.startsWith('/profile/order'),
    [location.pathname]
  );

  useEffect(() => {
    if (number) {
      if (isFeedRoute) {
        dispatch(clearFeed());
        dispatch(fetchFeed());
        dispatch(selectFeedByNumber(parseInt(number)));
      } else if (isProfileRoute) {
        dispatch(clearOrder());
        dispatch(fetchOrderByNumber(parseInt(number)));
      }
    }
  }, [dispatch, number, isFeedRoute, isProfileRoute]);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchAllIngredients());
    }
  }, [dispatch, ingredients.length]);

  const orderData = isFeedRoute
    ? orderFeed
    : isProfileRoute
      ? orderProfile
      : null;

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
