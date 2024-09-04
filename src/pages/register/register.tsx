import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { refreshToken, registerUserApi, TRegisterData } from '@api';
import { fetchRegisterUser } from '../../slices/registerSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { getCookie, setCookie } from '../../utils/cookie';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const success = useSelector((state) => state.register.success);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
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
      window.location.reload();
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
