import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  // Called after OTP verification sets localStorage directly
  // This syncs the context state from localStorage
  const syncUser = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('user'));
      setUser(stored);
    } catch {}
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updated) => {
    const merged = { ...user, ...updated };
    localStorage.setItem('user', JSON.stringify(merged));
    setUser(merged);
  };

  // Also expose a simple setter for pages that handle their own token/user storage
  const setUserFromStorage = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('user'));
      if (stored) setUser(stored);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{
      user, logout, updateUser, setUserFromStorage,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
