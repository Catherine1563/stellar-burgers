import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../services/store';
import { TRegisterData } from '@api';
import { fetchRegisterUser } from '../../slices/registerSlice';
import { Navigate, useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const success = useSelector((state: RootState) => state.register.success);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (userName !== '' || email !== '' || password !== '') {
      const userData: TRegisterData = {
        email: email,
        name: userName,
        password: password
      };
      dispatch(fetchRegisterUser(userData));
    }
  };
  useEffect(() => {
    if (success) {
      navigate('/');
      localStorage.setItem('isAuthenticated', success.toString());
    }
  }, [success, navigate]);

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
