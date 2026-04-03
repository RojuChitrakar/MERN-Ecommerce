import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AllProducts from "./pages/AllProducts.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Cart from "./pages/Cart.jsx";
import ProductPage from "./pages/ProductPage.jsx";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<AllProducts />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/cart" element={<Cart />} />
      <Route
        path="/product/:id"
        element={<ProductPage key={window.location.pathname} />}
      />
    </Routes>
  );
}

export default App;
