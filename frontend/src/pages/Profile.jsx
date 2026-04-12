import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Package } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "../utils/axios.js";

function Profile() {
  const { user: authUser, logout, setUser } = useAuth(); // ✅ FIXED
  const navigate = useNavigate();

  const [user, setLocalUser] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [editing, setEditing] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [orders, setOrders] = useState([]);

  // 🔥 LOAD USER + ADDRESS (FIXED SINGLE EFFECT)
  useEffect(() => {
    if (authUser) {
      setLocalUser({
        fullName: authUser.fullName || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
      });

      if (authUser.address) {
        setAddress(authUser.address);
      }
    }
  }, [authUser]);

  // 🔥 FETCH ORDERS
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/orders/my");
        setOrders(data);
      } catch (error) {
        console.error("ORDER ERROR:", error.response?.data || error.message);
      }
    };

    fetchOrders();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // 🔥 SAVE PROFILE (NO RELOAD)
  const saveProfile = async () => {
    try {
      const { data } = await axios.put("/users/profile", {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: address,
      });

      // ✅ UPDATE GLOBAL STATE
      setUser(data);

      // ✅ UPDATE STORAGE
      localStorage.setItem("userInfo", JSON.stringify(data));

      alert("Profile updated!");

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <div className="grid md:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="space-y-6">

            {/* PERSONAL INFO */}
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <div className="flex justify-between mb-4">
                <h2 className="font-semibold text-lg">Personal Information</h2>

                <button
                  onClick={() => {
                    if (editing) saveProfile();
                    setEditing(!editing);
                  }}
                  className="text-blue-600 text-sm"
                >
                  {editing ? "Save" : "Edit"}
                </button>
              </div>

              {editing ? (
                <div className="space-y-3">
                  <input
                    value={user.fullName}
                    onChange={(e) =>
                      setLocalUser({ ...user, fullName: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />

                  <input
                    value={user.email}
                    onChange={(e) =>
                      setLocalUser({ ...user, email: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />

                  <input
                    value={user.phone}
                    onChange={(e) =>
                      setLocalUser({ ...user, phone: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              ) : (
                <div className="space-y-3 text-gray-600">
                  <p><User size={16}/> {user.fullName}</p>
                  <p><Mail size={16}/> {user.email}</p>
                  <p><Phone size={16}/> {user.phone}</p>
                </div>
              )}
            </div>

            {/* ADDRESS */}
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <div className="flex justify-between mb-4">
                <h2 className="font-semibold text-lg">Shipping Address</h2>

                <button
                  onClick={() => {
                    if (isEditingAddress) saveProfile();
                    setIsEditingAddress(!isEditingAddress);
                  }}
                  className="text-blue-600 text-sm"
                >
                  {isEditingAddress ? "Save" : "Edit"}
                </button>
              </div>

              {isEditingAddress ? (
                <div className="grid gap-3">
                  <input placeholder="Full Name" value={address.fullName}
                    onChange={(e)=>setAddress({...address, fullName:e.target.value})}
                    className="border px-3 py-2 rounded"/>

                  <input placeholder="Phone" value={address.phone}
                    onChange={(e)=>setAddress({...address, phone:e.target.value})}
                    className="border px-3 py-2 rounded"/>

                  <input placeholder="Street" value={address.street}
                    onChange={(e)=>setAddress({...address, street:e.target.value})}
                    className="border px-3 py-2 rounded"/>

                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="City" value={address.city}
                      onChange={(e)=>setAddress({...address, city:e.target.value})}
                      className="border px-3 py-2 rounded"/>

                    <input placeholder="State" value={address.state}
                      onChange={(e)=>setAddress({...address, state:e.target.value})}
                      className="border px-3 py-2 rounded"/>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="Postal Code" value={address.postalCode}
                      onChange={(e)=>setAddress({...address, postalCode:e.target.value})}
                      className="border px-3 py-2 rounded"/>

                    <input placeholder="Country" value={address.country}
                      onChange={(e)=>setAddress({...address, country:e.target.value})}
                      className="border px-3 py-2 rounded"/>
                  </div>
                </div>
              ) : (
                <div className="text-gray-600">
                  <p>{address.fullName}</p>
                  <p>{address.phone}</p>
                  <p>{address.street}</p>
                  <p>{address.city}, {address.state}</p>
                  <p>{address.postalCode}, {address.country}</p>
                </div>
              )}
            </div>

            {/* QUICK LINKS */}
            <div className="bg-white p-5 rounded-xl shadow-sm space-y-3">
              <h2 className="font-semibold text-lg">Quick Links</h2>

              <Link to="/wishlist" className="block">My Wishlist</Link>
              <Link to="/cart" className="block">Shopping Cart</Link>

              <button onClick={handleLogout} className="text-red-500">
                Logout
              </button>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm">
  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
    <Package size={20} /> Order History
  </h2>

  {orders.length === 0 ? (
    <p className="text-gray-500">No orders yet</p>
  ) : (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order._id}
          className="border rounded-xl p-5 hover:shadow-md transition"
        >
          {/* 🔝 ORDER HEADER */}
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-semibold">{order._id}</p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">Date</p>
              <p>
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                order.isDelivered
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {order.isDelivered ? "Delivered" : "Pending"}
            </span>
          </div>

          {/* 📦 ITEMS */}
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 border rounded-lg p-3"
              >
                {/* 🖼 IMAGE */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />

                {/* 📝 DETAILS */}
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.qty}
                  </p>
                </div>

                {/* 💰 PRICE */}
                <p className="font-semibold">₹{item.price}</p>
              </div>
            ))}
          </div>

          {/* 💳 TOTAL */}
          <div className="flex justify-end mt-4 border-t pt-3">
            <p className="text-lg font-bold">
              Total: ₹{order.total}
            </p>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

        </div>
      </div>
    </div>
  );
}

export default Profile;