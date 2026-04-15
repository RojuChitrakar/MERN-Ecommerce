import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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

  const [paymentMethod, setPaymentMethod] = useState("esewa");

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.qty,
    0
  );

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: location } });
    }
  }, [user]);

  useEffect(() => {
    if (user?.address) {
      const nameParts = user.address.fullName?.split(" ") || [];

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
    }
  }, [user]);

  if (!user) return null;

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    const { firstName, lastName, phone, address, city, state, zip } = shipping;

    if (!firstName || !lastName || !phone || !address || !city || !state || !zip) {
      alert("Please fill all details");
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
      console.error(error);
    }
  };

  return (
    <div className="bg-[#f8f4f1] min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-16 grid md:grid-cols-3 gap-10 flex-1">

        {/* LEFT SIDE */}
        <div className="md:col-span-2 space-y-8">

          {/* SHIPPING */}
          <div className="bg-[#fbf7f4] p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-serif mb-6 text-gray-800">
              Shipping Information
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <input name="firstName" placeholder="First Name"
                value={shipping.firstName}
                onChange={handleChange}
                className="input" />

              <input name="lastName" placeholder="Last Name"
                value={shipping.lastName}
                onChange={handleChange}
                className="input" />

              <input name="email" value={shipping.email}
                readOnly
                className="input col-span-2 bg-[#efe7e2]" />

              <input name="phone" placeholder="Phone"
                value={shipping.phone}
                onChange={handleChange}
                className="input col-span-2" />

              <input name="address" placeholder="Address"
                value={shipping.address}
                onChange={handleChange}
                className="input col-span-2" />

              <input name="city" placeholder="City"
                value={shipping.city}
                onChange={handleChange}
                className="input" />

              <input name="state" placeholder="State"
                value={shipping.state}
                onChange={handleChange}
                className="input" />

              <input name="zip" placeholder="Postal Code"
                value={shipping.zip}
                onChange={handleChange}
                className="input col-span-2" />
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-[#fbf7f4] p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-serif mb-6 text-gray-800">
              Payment Method
            </h2>

            <div className="space-y-3">
              {[
                { label: "eSewa", value: "esewa" },
                { label: "Khalti", value: "khalti" },
                { label: "IME Pay", value: "ime" },
                { label: "Cash on Delivery", value: "cod" },
              ].map((method) => (
                <label
                  key={method.value}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${
                    paymentMethod === method.value
                      ? "bg-[#efe7e2] border border-[#c07c52]"
                      : "bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  {method.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-[#f3ede8] p-6 rounded-2xl shadow-sm h-fit sticky top-24">

          <h2 className="text-xl font-serif mb-6 text-gray-800">
            Order Summary
          </h2>

          {cart.map((item) => (
            <div key={item.product._id} className="flex justify-between mb-4">

              <div className="flex gap-3">
                <img
                  src={item.product.images?.[0] || "/placeholder.png"}
                  className="w-12 h-12 rounded-lg object-cover"
                />

                <div>
                  <p className="text-sm font-medium">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.qty}
                  </p>
                </div>
              </div>

              <span className="text-sm">
                Rs {(item.product.price * item.qty).toFixed(2)}
              </span>
            </div>
          ))}

          <hr className="my-4" />

          <div className="space-y-2 text-gray-600 text-sm">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs {subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax (10%)</span>
              <span>Rs {tax.toFixed(2)}</span>
            </div>

            <hr />

            <div className="flex justify-between text-lg font-semibold text-[#c07c52]">
              <span>Total</span>
              <span>Rs {total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="mt-6 w-full bg-[#c07c52] text-white py-3 rounded-full hover:opacity-90 transition"
          >
            Place Order
          </button>
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default Checkout;