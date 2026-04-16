import { createContext, useContext, useState, useEffect } from "react";
import API from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo")) || null
  );

  // ✅ LOGIN
  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", {
      email,
      password,
    });

    setUser(data);

    // 🔥 FIXED KEY
    localStorage.setItem("userInfo", JSON.stringify(data));

    return data;
  };

  // ✅ REGISTER
  const register = async (userData) => {
    const { data } = await API.post("/auth/register", userData);

    // 🔥 FIXED KEY
    localStorage.setItem("userInfo", JSON.stringify(data));

    setUser(data);
  };

  // ✅ LOGOUT
  const logout = () => {
    setUser(null);

    // 🔥 FIXED KEY
    localStorage.removeItem("userInfo");
  };

  // ✅ LOAD USER ON REFRESH
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);