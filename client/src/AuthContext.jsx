import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => decodeToken(localStorage.getItem("token")));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setUser(decodeToken(token));
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  useEffect(() => {
    if (user?.exp) {
      const timeLeft = user.exp * 1000 - Date.now();
      if (timeLeft <= 0) {
        logout();
      } else {
        const timeout = setTimeout(() => logout(), timeLeft);
        return () => clearTimeout(timeout);
      }
    }
  }, [user]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

const decodeToken = (token) => {
  if (!token) return null;
  try {
    const base64 = token.split(".")[1];
    return JSON.parse(atob(base64));
  } catch (err) {
    return null;
  }
};

export const useAuth = () => useContext(AuthContext);
