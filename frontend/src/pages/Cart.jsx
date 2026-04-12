import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Trash2, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQty } = useCart();

  const subtotal = cart.reduce((acc, item) => {
    if (!item.product) return acc;
    return acc + item.product.price * item.qty;
  }, 0);

  const shipping = 120;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!user) navigate("/login");
    else navigate("/checkout");
  };

  return (
    <div className="bg-[#f8f4f1] min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-16 flex-1">

        <h1 className="text-4xl font-serif text-gray-800 mb-14">
          Your Cart
        </h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center py-20">
            <ShoppingBag size={60} className="text-gray-300 mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-12 items-start">

            {/* LEFT */}
            <div className="col-span-2 space-y-6">

              {cart.map((item, index) => {
                if (!item.product) return null;

                return (
                  <div
                    key={item.product._id || index}
                    className="w-full bg-[#fbf7f4] rounded-2xl px-6 py-5 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
                  >
                    <div className="flex items-center gap-6">

                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 rounded-xl object-cover"
                      />

                      <div>
                        <p className="text-base font-medium text-gray-800">
                          {item.product.name}
                        </p>

                        {/* ✅ NPR FIX */}
                        <p className="text-[#c07c52] text-sm mt-1">
                          Rs {item.product.price}
                        </p>

                        <div className="flex items-center gap-3 mt-3">

                          <button
                            onClick={() =>
                              updateQty(
                                item.product._id,
                                Math.max(1, item.qty - 1)
                              )
                            }
                            className="w-9 h-9 rounded-full bg-[#efe7e2]"
                          >
                            −
                          </button>

                          <span className="text-sm w-4 text-center">
                            {item.qty}
                          </span>

                          <button
                            onClick={() =>
                              updateQty(item.product._id, item.qty + 1)
                            }
                            className="w-9 h-9 rounded-full bg-[#efe7e2]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        removeFromCart(item.product._id)
                      }
                      className="text-gray-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* RIGHT SUMMARY */}
            <div className="w-[340px] bg-[#f3ede8] rounded-2xl p-7 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">

              <h2 className="text-xl font-serif text-gray-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 text-sm text-gray-600">

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs {subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Rs {shipping}</span>
                </div>

                <hr />

                <div className="flex justify-between text-base font-medium text-gray-800">
                  <span>Total</span>
                  <span className="text-[#c07c52] text-lg">
                    Rs {total}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-7 bg-[#c07c52] text-white py-3.5 rounded-full"
              >
                Proceed to Checkout
              </button>

              <p
  onClick={() => navigate("/products")}
  className="text-center text-sm text-gray-500 mt-5 cursor-pointer hover:underline"
>
  Continue Shopping
</p>
            </div>

          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Cart;