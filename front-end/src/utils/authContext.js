"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    isLoggedIn: false,
    id: null,
    name: '',
    username: '',
    level: '',
    password: ''
  });
  const [loading, setLoading] = useState(true);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem('mie_hoog_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser({
            isLoggedIn: true,
            ...userData
          });
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('mie_hoog_user');
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // Login function
  const login = (userData) => {
    const userInfo = {
      id: userData.id,
      name: userData.name,
      username: userData.username,
      level: userData.level,
      password: userData.password
    };

    setUser({
      isLoggedIn: true,
      ...userInfo
    });

    // Save to localStorage
    localStorage.setItem('mie_hoog_user', JSON.stringify(userInfo));
  };

  // Logout function
  const logout = () => {
    setUser({
      isLoggedIn: false,
      id: null,
      name: '',
      username: '',
      level: '',
      password: ''
    });

    // Remove from localStorage
    localStorage.removeItem('mie_hoog_user');
  };

  // Check if user has specific level
  const hasLevel = (requiredLevel) => {
    return user.isLoggedIn && user.level === requiredLevel;
  };

  // Check if user has admin or kasir level
  const hasAdminOrKasirLevel = () => {
    return user.isLoggedIn && (user.level === 'admin' || user.level === 'kasir');
  };

  const value = {
    user,
    login,
    logout,
    hasLevel,
    hasAdminOrKasirLevel,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};