import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/axios.js";

function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ SHIPPING STATE
  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  // ✅ PAYMENT METHOD
  const [paymentMethod, setPaymentMethod] = useState("esewa");

  // ✅ CALCULATIONS
  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.qty,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  // 🔐 PROTECT ROUTE
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: location } });
    }
  }, [user, navigate, location]);

  // 🔥 AUTO-FILL FROM PROFILE
  useEffect(() => {
    if (user?.address) {
      const fullName = user.address.fullName || "";
      const nameParts = fullName.split(" ");

      setShipping({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.address.phone || "",
        address: user.address.street || "",
        city: user.address.city || "",
        state: user.address.state || "",
        zip: user.address.postalCode || "",
      });
    } else {
      setShipping((prev) => ({
        ...prev,
        email: user?.email || "",
      }));
    }
  }, [user]);

  if (!user) return null;

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  // ✅ PLACE ORDER
  const handlePlaceOrder = async () => {
    const { firstName, lastName, phone, address, city, state, zip } = shipping;

    if (!firstName || !lastName || !phone || !address || !city || !state || !zip) {
      alert("⚠️ Please fill all shipping details before placing order");
      return;
    }

    try {
      const { data } = await axios.post("/orders", {
        cartItems: cart,
        shippingAddress: {
          fullName: `${firstName} ${lastName}`,
          phone,
          street: address,
          city,
          state,
          postalCode: zip,
          country: "Nepal",
        },
        paymentMethod,
        total,
      });

      clearCart();

      navigate("/order-success", {
        state: { orderId: data._id },
      });

    } catch (error) {
      console.error("ORDER ERROR:", error.response?.data || error.message);
      alert("Order failed");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        
        {/* 🔵 LEFT SIDE */}
        <div className="md:col-span-2 space-y-6">

          {/* SHIPPING */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

            <div className="grid grid-cols-2 gap-4">

              <input
                name="firstName"
                placeholder="First Name"
                value={shipping.firstName || ""}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="lastName"
                placeholder="Last Name"
                value={shipping.lastName || ""}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="email"
                value={shipping.email}
                readOnly
                className="border p-2 rounded col-span-2 bg-gray-100"
              />

              <input
                name="phone"
                placeholder="Phone"
                value={shipping.phone || ""}
                onChange={handleChange}
                className="border p-2 rounded col-span-2"
              />

              <input
                name="address"
                placeholder="Address"
                value={shipping.address || ""}
                onChange={handleChange}
                className="border p-2 rounded col-span-2"
              />

              <input
                name="city"
                placeholder="City"
                value={shipping.city || ""}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="state"
                placeholder="State"
                value={shipping.state || ""}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="zip"
                placeholder="ZIP Code"
                value={shipping.zip || ""}
                onChange={handleChange}
                className="border p-2 rounded col-span-2"
              />
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

            <div className="space-y-3">
              {[
                { label: "eSewa", value: "esewa" },
                { label: "Khalti", value: "khalti" },
                { label: "IME Pay", value: "ime" },
                { label: "Cash on Delivery", value: "cod" },
              ].map((method) => (
                <label
                  key={method.value}
                  className={`flex items-center gap-3 border p-3 rounded-lg cursor-pointer ${
                    paymentMethod === method.value
                      ? "border-blue-600 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>{method.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 🔵 RIGHT SIDE */}
        <div className="bg-white p-6 rounded-xl shadow h-fit sticky top-24">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          {cart.map((item) => (
            <div key={item.product._id} className="flex justify-between mb-3">
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.qty}</p>
              </div>
              <span>₹{(item.product.price * item.qty).toFixed(2)}</span>
            </div>
          ))}

          <hr className="my-4" />

          <div className="space-y-2 text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">FREE</span>
            </div>

            <div className="flex justify-between">
              <span>Tax (10%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>

            <hr />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;