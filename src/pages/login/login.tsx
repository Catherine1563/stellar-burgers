import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../services/store';
import { TLoginData } from '@api';
import { featchloginUser } from '../../slices/loginUserSlice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const success = useSelector((state: RootState) => state.login.success);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (email !== '' || password !== '') {
      const userData: TLoginData = {
        email: email,
        password: password
      };
      dispatch(featchloginUser(userData));
    }
  };

  useEffect(() => {
    if (success) {
      localStorage.setItem('isAuthenticated', success.toString());
      navigate('/');
    }
  }, [success, navigate]);

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
