import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// Create Context
const AuthContext = createContext();

// Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );
  const [loading, setLoading] = useState(true);

  // On mount: if a token exists in localStorage, decode it to restore user state
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setUser({
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role,
        });
        setToken(storedToken);
      } catch (err) {
        // token invalid/expired — clear it
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
      }
    }
    setLoading(false);
  }, []);

  // Login Function
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);

    localStorage.setItem("token", jwtToken);
  };

  // Logout Function
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook
export function useAuth() {
  return useContext(AuthContext);
}