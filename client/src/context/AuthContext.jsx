import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "cars_token";
const USER_KEY = "cars_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = localStorage.getItem(USER_KEY);
    if (u) setUser(JSON.parse(u));
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
