import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AllProducts from "./pages/AllProducts.jsx";
import Wishlist from "./pages/Wishlist.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<AllProducts />}/>
      <Route path="/wishlist" element={<Wishlist />} />
    </Routes>
  );
}

export default App;