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

export const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;
  const isAuthenticated = localStorage.getItem('isAuthenticated');

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <>
      <Routes location={background || location}>
        <Route path='*' element={<NotFound404 />} />
        <Route
          path='/'
          element={
            <div className={styles.app}>
              <AppHeader />
              <ConstructorPage />
            </div>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <div className={styles.app}>
              <AppHeader />
              <div className={styles.detailPageWrap}>
                <h1
                  className={`${styles.detailHeader} text text_type_main-large mt-10 mb-5 pl-5`}
                >
                  Детали ингредиента
                </h1>
                <IngredientDetails />
              </div>
            </div>
          }
        />
        <Route
          path='/feed'
          element={
            <div className={styles.app}>
              <AppHeader />
              <Feed />
            </div>
          }
        />
        <Route
          path='/feed/:number'
          element={
            <div className={styles.app}>
              <AppHeader />
              <div className={styles.detailPageWrap}>
                <OrderInfo />
              </div>
            </div>
          }
        />
        <Route
          path='/profile'
          element={
            isAuthenticated ? (
              <div className={styles.app}>
                <AppHeader />
                <Profile />
              </div>
            ) : (
              <Navigate to='/login' replace />
            )
          }
        />
        <Route
          path='/profile/orders'
          element={
            isAuthenticated ? (
              <div className={styles.app}>
                <AppHeader />
                <ProfileOrders />
              </div>
            ) : (
              <Navigate to='/login' replace />
            )
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            isAuthenticated ? (
              <div className={styles.app}>
                <AppHeader />
                <div className={styles.detailPageWrap}>
                  <OrderInfo />
                </div>
              </div>
            ) : (
              <Navigate to='/login' replace />
            )
          }
        />
        <Route
          path='/login'
          element={
            <div className={styles.app}>
              <AppHeader />
              <Login />
            </div>
          }
        />
        <Route
          path='/register'
          element={
            <div className={styles.app}>
              <AppHeader />
              <Register />
            </div>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <div className={styles.app}>
              <AppHeader />
              <ForgotPassword />
            </div>
          }
        />
        <Route
          path='/reset-password'
          element={
            <div className={styles.app}>
              <AppHeader />
              <ResetPassword />
            </div>
          }
        />
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
    </>
  );
};

export default App;
