import React, { createContext, useState, useContext, useEffect } from "react";
import apiService from "../api/apiService";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        if (decodedUser.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          return null;
        }
        return decodedUser;
      } catch (error) {
        console.error("Failed to decode token", error);
        localStorage.removeItem("token");
      }
    }
    return null;
  });

  const signin = async (email, password) => {
    try {
      const response = await apiService.post("/authentications/login", {
        email,
        password,
      });
      const { token, role } = response;
      localStorage.setItem("token", token);
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);
      localStorage.setItem("role", role);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
      const decodedUser = jwtDecode(token);
      if (decodedUser.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        setUser(null);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Failed to decode token", error);
      localStorage.removeItem("token");
      setUser(null);
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        if (decodedUser.exp * 1000 > Date.now()) {
          setUser(decodedUser);
        } else {
          signout();
        }
      } catch (error) {
        console.error("Error decoding token on app load", error);
        signout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, signin, signout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
