import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AllProducts from "./pages/AllProducts.jsx";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<AllProducts />}/>
    </Routes>
  );
}

export default App;