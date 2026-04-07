import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

function Checkout() {
  const { cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handlePlaceOrder = () => {
    const orderId =
      "#" + Math.random().toString(36).substring(2, 10).toUpperCase();

    navigate("/order-success", {
      state: { orderId },
    });
  };

  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: location } });
    }
  }, [user, navigate, location]);

  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        {/* USER INFO */}
        <div className="bg-white p-5 rounded-xl shadow mb-6">
          <h2 className="font-semibold mb-2">User Info</h2>
          <p>{user.name}</p>
          <p>{user.email}</p>
        </div>

        {/* ORDER ITEMS */}
        <div className="bg-white p-5 rounded-xl shadow mb-6">
          <h2 className="font-semibold mb-4">Order Items</h2>

          {cart.map((item) => (
            <div key={item.id} className="flex justify-between mb-2">
              <span>{item.name}</span>
              <span>
                {item.qty} x ${item.price}
              </span>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Total</h2>
          <p className="text-xl font-bold">${total.toFixed(2)}</p>

          <button
            onClick={handlePlaceOrder}
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
