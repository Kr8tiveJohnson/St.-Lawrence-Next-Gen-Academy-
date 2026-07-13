import React, { createContext, useContext, useState, useEffect } from "react";
import client from "../api/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Validate token and fetch user
      client.get("/auth/me")
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await client.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (userData) => {
    const res = await client.post("/auth/register", userData);
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const isTeacher = user?.role === "TEACHER" || user?.role === "ADMIN" || user?.role === "MAIN_ADMIN";
  const isAdmin = user?.role === "ADMIN" || user?.role === "MAIN_ADMIN";

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isTeacher, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
