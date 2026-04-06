import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Load users from localStorage
  const getUsers = () => JSON.parse(localStorage.getItem('ft_users') || '{}');

  const register = (name, email, password) => {
    const users = getUsers();
    if (users[email]) return { success: false, error: 'Email already registered' };
    users[email] = { name, email, password, profile: { age: '', weight: '', height: '' } };
    localStorage.setItem('ft_users', JSON.stringify(users));
    return { success: true };
  };

  const login = (email, password) => {
    const users = getUsers();
    if (!users[email]) return { success: false, error: 'No account found with this email' };
    if (users[email].password !== password) return { success: false, error: 'Incorrect password' };
    setCurrentUser(users[email]);
    setIsLoggedIn(true);
    // DO NOT persist session — ask for login on every reload
    return { success: true };
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  // Per-user data key helper
  const dataKey = (key) => `ft_${currentUser?.email}_${key}`;

  const getData = (key, fallback) => {
    if (!currentUser) return fallback;
    const raw = localStorage.getItem(dataKey(key));
    return raw !== null ? JSON.parse(raw) : fallback;
  };

  const setData = (key, value) => {
    if (!currentUser) return;
    localStorage.setItem(dataKey(key), JSON.stringify(value));
  };

  return (
    <AppContext.Provider value={{ isLoggedIn, currentUser, register, login, logout, getData, setData }}>
      {children}
    </AppContext.Provider>
  );
}

AppProvider.propTypes = { children: PropTypes.node.isRequired };

export function useApp() { return useContext(AppContext); }