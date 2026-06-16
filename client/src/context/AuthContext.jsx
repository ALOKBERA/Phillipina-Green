import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      const storedUsername = localStorage.getItem('username');
      if (token) {
        setIsAuthenticated(true);
        setUsername(storedUsername || '');
      }
      setLoading(false);
    };
    checkToken();
  }, []);

  const login = async (inputUsername, password) => {
    try {
      const res = await api.post('/api/auth/login', { username: inputUsername, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username || inputUsername);
      setIsAuthenticated(true);
      setUsername(res.data.username || inputUsername);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  };

  const register = async (inputUsername, password) => {
    try {
      const res = await api.post('/api/auth/register', { username: inputUsername, password });
      return { success: true, message: res.data.message };
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error on server:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setIsAuthenticated(false);
      setUsername('');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
