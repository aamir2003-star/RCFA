/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Optionally fetch user from /api/v1/auth/me using httpOnly cookie
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/v1/auth/me");
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (data) => {
    const response = await axios.post("/api/v1/auth/login", data);
    setUser(response.data.user);
    return response.data;
  };

  const register = async (data) => {
    const response = await axios.post("/api/v1/auth/register", data);
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    await axios.post("/api/v1/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
