import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect, useState } from 'react';
import { fetchFeed } from '../../slices/addFeedSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const orders = useSelector((state) => state.add_feed.orders);
  const isOrdersLoading = useSelector(
    (state) => state.add_feed.isOrdersLoading
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (orders.length === 0) {
      dispatch(fetchFeed());
    }
  }, [dispatch, orders.length]);

  if (isOrdersLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(fetchFeed());
      }}
    />
  );
};
