// import { createContext, useContext, useState, useEffect } from "react";
// import { useAuth } from "./AuthContext";
// import API from "../api";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);
//   // const {user} = useAuth();
//   // ✅ FETCH CART FROM BACKEND
//   const fetchCart = async () => {
//   try {
//     const { data } = await API.get("/users/cart");

//     // 🔥 FIX STOCK MISMATCH
//     const fixedCart = data.map((item) => {
//       const stock = item.product?.countInStock || 0;

//       if (item.qty > stock) {
//         return {
//           ...item,
//           qty: stock,
//         };
//       }

//       return item;
//     });

//     setCart(fixedCart);

//   } catch (error) {
//     console.error("Fetch cart error:", error);
//   }
// };

//   // ✅ ADD TO CART
//   const addToCart = async (product, qty = 1) => {
//     try {
//       const { data } = await API.post("/users/cart", {
//         productId: product._id,
//         qty,
//       });

//       setCart(data);
//     } catch (error) {
//       console.error("Add to cart error:", error);

//       alert(error.response?.data?.message || "Failed to add item to cart");
//     }
//   };

//   // ✅ REMOVE FROM CART
//   const removeFromCart = async (id) => {
//     try {
//       const { data } = await API.delete(`/users/cart/${id}`);
//       setCart(data);
//     } catch (error) {
//       console.error("Remove error:", error);
//     }
//   };

//   // ✅ UPDATE QUANTITY
//   const updateQty = async (id, qty) => {
//     try {
//       const { data } = await API.put(`/users/cart/${id}`, { qty });
//       setCart(data);
//     } catch (error) {
//   console.error("Update qty error:", error);

//   alert(
//     error.response?.data?.message || "Cannot update quantity"
//   );
// }
//   };
//   const clearCart = () => {
//     setCart([]);
//   };

//   // ✅ LOAD CART ON APP START
//   const { user } = useAuth();

//   useEffect(() => {
//     if (user && !user.isAdmin) {
//       fetchCart();
//     }
//   }, [user]);

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         addToCart,
//         removeFromCart,
//         updateQty,
//         fetchCart,
//         clearCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);


import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import API from "../api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  // ✅ FETCH CART FROM BACKEND
  const fetchCart = async () => {
    try {
      const { data } = await API.get("/users/cart");

      const fixedCart = data.map((item) => {
        const stock = item.product?.countInStock || 0;

        if (item.qty > stock) {
          return { ...item, qty: stock };
        }

        return item;
      });

      setCart(fixedCart);
    } catch (error) {
      console.error("Fetch cart error:", error);
    }
  };

  // ✅ ADD TO CART
  const addToCart = async (product, qty = 1) => {
    // 🟢 GUEST USER
    if (!user) {
      try {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const exist = cart.find((item) => item._id === product._id);

        if (exist) {
          const newQty = exist.qty + qty;

          if (newQty > product.countInStock) {
            alert(`Only ${product.countInStock} items available`);
            return;
          }

          exist.qty = newQty;
        } else {
          if (qty > product.countInStock) {
            alert(`Only ${product.countInStock} items available`);
            return;
          }

          cart.push({ ...product, qty });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        setCart(cart);
      } catch (error) {
        console.error("Guest cart error:", error);
      }

      return;
    }

    // 🔵 LOGGED-IN USER
    try {
      const { data } = await API.post("/users/cart", {
        productId: product._id,
        qty,
      });

      setCart(data);
    } catch (error) {
      console.error("Add to cart error:", error);
      alert(error.response?.data?.message || "Failed to add item to cart");
    }
  };

  // ✅ REMOVE FROM CART
  const removeFromCart = async (id) => {
    // 🟢 GUEST USER
    if (!user) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart = cart.filter((item) => item._id !== id);

      localStorage.setItem("cart", JSON.stringify(cart));
      setCart(cart);
      return;
    }

    // 🔵 LOGGED-IN USER
    try {
      const { data } = await API.delete(`/users/cart/${id}`);
      setCart(data);
    } catch (error) {
      console.error("Remove error:", error);
    }
  };

  // ✅ UPDATE QUANTITY
  const updateQty = async (id, qty) => {
    // 🟢 GUEST USER
    if (!user) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      cart = cart.map((item) =>
        item._id === id ? { ...item, qty } : item
      );

      localStorage.setItem("cart", JSON.stringify(cart));
      setCart(cart);
      return;
    }

    // 🔵 LOGGED-IN USER
    try {
      const { data } = await API.put(`/users/cart/${id}`, { qty });
      setCart(data);
    } catch (error) {
      console.error("Update qty error:", error);
      alert(error.response?.data?.message || "Cannot update quantity");
    }
  };

  // ✅ CLEAR CART
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  useEffect(() => {
    if (user && !user.isAdmin) {
      fetchCart();
    } else {
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(localCart);
    }
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        fetchCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);