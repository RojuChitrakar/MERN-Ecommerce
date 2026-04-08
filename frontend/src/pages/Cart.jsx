import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Trash2, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { cart, removeFromCart, updateQty } = useCart();

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.qty, 0);

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {/* 🟡 EMPTY STATE */}
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24">
            {/* ICON */}
            <ShoppingBag size={80} className="text-gray-300 mb-6" />

            {/* TITLE */}
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              Your cart is empty
            </h2>

            {/* TEXT */}
            <p className="text-gray-500 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>

            {/* BUTTON */}
            <Link to="/products">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* 🟡 LEFT: CART ITEMS */}
            <div className="md:col-span-2 space-y-6">
              {cart.map((item) => (
                <div
                  key={item.product._id}
                  className="bg-white p-5 rounded-xl shadow-sm flex gap-6 items-center"
                >
                  {/* IMAGE */}
                  <img
                    src={item.product.image}
                    className="w-28 h-28 object-cover rounded-lg"
                  />

                  {/* DETAILS */}
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{item.product.name}</h2>

                    <p className="text-sm text-gray-500 capitalize">
                      {item.category}
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>

                    {/* QTY */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() =>
                          updateQty(item.product._id, Math.max(1, item.qty - 1))
                        }
                        className="px-3 py-1 border rounded-lg hover:bg-gray-100"
                      >
                        -
                      </button>

                      <span>{item.qty}</span>

                      <button
                        onClick={() => updateQty(item.product._id, item.qty + 1)}
                        className="px-3 py-1 border rounded-lg hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="flex flex-col items-end gap-4">
                    <button onClick={() => removeFromCart(item.product._id)}>
                      <Trash2 className="text-red-500 hover:scale-110 transition" />
                    </button>

                    <span className="text-lg font-semibold">${item.product.price}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 🔵 RIGHT: SUMMARY */}
            <div className="bg-white p-6 rounded-xl shadow-sm h-fit sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>

                <p className="text-green-600 text-sm">
                  You’ve qualified for free shipping!
                </p>

                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <hr />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* BUTTONS */}
              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Proceed to Checkout
              </button>

              <Link to="/products">
                <button className="w-full mt-3 border py-3 rounded-lg hover:bg-gray-100 transition">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
