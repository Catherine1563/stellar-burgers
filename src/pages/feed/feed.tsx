import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { fetchFeed } from '../../slices/addFeedSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const ordersFeed = useSelector((state) => state.add_feed.ordersFeed);
  const isOrdersLoading = useSelector(
    (state) => state.add_feed.isOrdersLoading
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (ordersFeed.length === 0) {
      dispatch(fetchFeed());
    }
  }, [dispatch, ordersFeed.length]);

  if (!isOrdersLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={ordersFeed}
      handleGetFeeds={() => {
        dispatch(fetchFeed());
      }}
    />
  );
};
