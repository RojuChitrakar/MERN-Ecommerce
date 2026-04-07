import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import axios from "axios";

import { BrowserRouter } from "react-router-dom";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";


axios.defaults.baseURL = "http://localhost:5000";
ReactDOM.createRoot(document.getElementById("root")).render(
  <WishlistProvider>
    <CartProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </CartProvider>
  </WishlistProvider>,
);
