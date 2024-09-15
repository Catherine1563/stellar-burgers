import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { useEffect, useState } from 'react';
import { fetchIngredients } from '../../slices/allIngredientsCategorySlice';
import { checkTokens } from '../../slices/isLoggedInSlice';
import React from 'react';
import { Preloader } from '@ui';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const location = useLocation();
  const { isLoggedIn, checkingStatus } = useSelector(
    (state) => state.logged_in
  );
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthStatus = async () => {
      await dispatch(checkTokens());
      setIsAuthChecked(true);
    };

    checkAuthStatus();
  }, [dispatch]);

  if (checkingStatus || !isAuthChecked) {
    return <Preloader />;
  }

  if (isLoggedIn) {
    return element;
  } else {
    return <Navigate to={'/login'} state={{ from: location }} replace />;
  }
};

export const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkTokens());
  }, [dispatch]);

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <>
      <div className={styles.app}>
        <AppHeader />
        <Routes location={background || location}>
          <Route path='*' element={<NotFound404 />} />
          <Route path='/' element={<ConstructorPage />} />
          <Route
            path='/ingredients/:id'
            element={
              <div className={styles.detailPageWrap}>
                <h1
                  className={`${styles.detailHeader} text text_type_main-large mt-10 mb-5 pl-5`}
                >
                  Детали ингредиента
                </h1>
                <IngredientDetails />
              </div>
            }
          />
          <Route path='/feed' element={<Feed />} />
          <Route
            path='/feed/:number'
            element={
              <div className={styles.detailPageWrap}>
                <OrderInfo />
              </div>
            }
          />
          <Route
            path='/profile'
            element={<ProtectedRoute element={<Profile />} />}
          />
          <Route
            path='/profile/orders'
            element={<ProtectedRoute element={<ProfileOrders />} />}
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute
                element={
                  <div className={styles.detailPageWrap}>
                    <OrderInfo />
                  </div>
                }
              />
            }
          />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Routes>

        {background && (
          <Routes>
            <Route
              path='/ingredients/:id'
              element={
                <Modal title={'Детали ингредиента'} onClose={handleModalClose}>
                  <IngredientDetails />
                </Modal>
              }
            />
          </Routes>
        )}
        {background && (
          <Routes>
            <Route
              path='/feed/:number'
              element={
                <Modal title={''} onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              }
            />
          </Routes>
        )}
        {background && (
          <Routes>
            <Route
              path='/profile/orders/:number'
              element={
                <Modal title={''} onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              }
            />
          </Routes>
        )}
      </div>
    </>
  );
};

export default App;
