"use client";

import { createContext, useState, useContext } from 'react';

// Default state
const defaultLoginState = {
  login: false,
  id : '',
  username: 'guest',
  name: 'guest',
  password: '',
};

const LoginContext = createContext({
  ...defaultLoginState,
  setLoginData: () => {},
  logout: () => {},
});

// Provider
export const LoginProvider = ({ children }) => {
  const [loginData, setLoginData] = useState(defaultLoginState);

  // logout
  const logout = () => {
    setLoginData(defaultLoginState);
  };

  return (
    <LoginContext.Provider value={{ ...loginData, setLoginData, logout }}>
      {children}
    </LoginContext.Provider>
  );
};
export const useLogin = () => useContext(LoginContext);