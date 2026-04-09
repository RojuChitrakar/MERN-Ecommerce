import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // ✅ FETCH CART FROM BACKEND
  const fetchCart = async () => {
    try {
      const { data } = await axios.get("/api/users/cart");
      setCart(data);
    } catch (error) {
      console.error("Fetch cart error:", error);
    }
  };

  // ✅ ADD TO CART
  const addToCart = async (product, qty = 1) => {
    try {
      const { data } = await axios.post("/api/users/cart", {
        productId: product._id,
        qty,
      });

      setCart(data);
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  // ✅ REMOVE FROM CART
  const removeFromCart = async (id) => {
    try {
      const { data } = await axios.delete(`/api/users/cart/${id}`);
      setCart(data);
    } catch (error) {
      console.error("Remove error:", error);
    }
  };

  // ✅ UPDATE QUANTITY
  const updateQty = async (id, qty) => {
    try {
      const { data } = await axios.put(`/api/users/cart/${id}`, { qty });
      setCart(data);
    } catch (error) {
      console.error("Update qty error:", error);
    }
  };
  const clearCart = () => {
  setCart([]);
};

  // ✅ LOAD CART ON APP START
  const { user } = useAuth();

  useEffect(() => {
    if (user && !user.isAdmin) {
      fetchCart();
    }
  }, [user]);
  
  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQty, fetchCart , clearCart}}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
