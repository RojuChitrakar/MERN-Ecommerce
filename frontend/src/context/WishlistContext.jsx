import { createContext, useContext, useState, useEffect } from "react";
import API from "../api";
import { useAuth } from "./AuthContext";
const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // ✅ FETCH FROM BACKEND
  const fetchWishlist = async () => {
    try {
      const { data } = await API.get("/users/wishlist");
      setWishlist(data);
    } catch (error) {
      console.log(error);
    }
  };
const { user } = useAuth();
 useEffect(() => {
  if (user) {
    fetchWishlist();
  } else {
    setWishlist([]);
  }
}, [user]);

  // ✅ TOGGLE (API)
  const toggleWishlist = async (product) => {
  try {
    const exists = wishlist.some((item) => item._id === product._id);

    // 🔥 Optimistic UI update
    if (exists) {
      setWishlist((prev) =>
        prev.filter((item) => item._id !== product._id)
      );
    } else {
      setWishlist((prev) => [...prev, product]);
    }

    // API call
    await API.post(`/users/wishlist/${product._id}`);

  } catch (error) {
    console.log("WISHLIST ERROR:", error.response || error);
  }
};

  const isInWishlist = (id) => {
  return wishlist.some((item) => item._id.toString() === id.toString());
};
  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);