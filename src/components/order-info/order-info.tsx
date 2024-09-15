import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { fetchAllIngredients } from '../../slices/allIngredientsSlice';
import { selectFeedByNumber } from '../../slices/feedModalSlice';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrderByNumber } from '../../slices/orderNumberSlice';
import { fetchFeed } from '../../slices/addFeedSlice';
import { selectOrderByNumber } from '../../slices/profileModalSlice';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const ingredients = useSelector((state) => state.all_ingredients.ingredients);
  const orderFeed = useSelector((state) => state.feed_modal.orderFeed);
  const orderProfile = useSelector((state) => state.order_number.orderProfile);
  const orderProfileModal = useSelector(
    (state) => state.profile_modal.orderProfileModal
  );
  const ordersFeed = useSelector((state) => state.add_feed.ordersFeed);
  const ordersProfile = useSelector(
    (state) => state.orders_profile.ordersProfile
  );
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
      const parsedNumber = parseInt(number);

      if (isFeedRoute) {
        if (ordersFeed.length === 0) {
          dispatch(fetchFeed());
        }
        dispatch(
          selectFeedByNumber({ index: parsedNumber, orders: ordersFeed })
        );
      } else if (isProfileRoute) {
        if (ordersProfile.length === 0) {
          dispatch(fetchOrderByNumber(parsedNumber));
        } else {
          dispatch(
            selectOrderByNumber({ index: parsedNumber, orders: ordersProfile })
          );
        }
      }
    }
  }, [dispatch, number, isFeedRoute, isProfileRoute, ordersFeed]);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchAllIngredients());
    }
  }, [dispatch, ingredients.length]);

  const orderData = isFeedRoute
    ? orderFeed
    : isProfileRoute && ordersProfile.length > 0
      ? orderProfileModal
      : isProfileRoute && ordersProfile.length === 0
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
