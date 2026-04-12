import { createContext, useContext, useState , useEffect} from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo")) || null,
  );

  // ✅ LOGIN (API)
  const login = async (email, password) => {
    const { data } = await axios.post("/api/auth/login", {
      email,
      password,
    });

    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));

    return data; // 🔥 THIS IS THE FIX
  };

  // ✅ REGISTER (API)
  const register = async (userData) => {
    const { data } = await axios.post("/api/auth/register", userData);

    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

  // ✅ LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };
  useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
}, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
