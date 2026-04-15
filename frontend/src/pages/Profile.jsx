import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Package, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "../utils/axios.js";

function Profile() {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();

  const [user, setLocalUser] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  
  const { setUser } = useAuth();
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));

    if (storedUser?.address) {
      setAddress(storedUser.address);
    }
  }, []);

  const [editing, setEditing] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (authUser) {
      setLocalUser({
        fullName: authUser.fullName || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
      });

      if (authUser.address) setAddress(authUser.address);
    }
  }, [authUser]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/orders/my");
        setOrders(data);
      } catch (error) {
        console.error("ORDER ERROR:", error);
      }
    };
    fetchOrders();
  }, []);

  const saveProfile = async () => {
    try {
      const { data } = await axios.put("/users/profile", {
        ...user,
        address,
      });

      // ✅ Update local state (IMPORTANT)
      setLocalUser({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
      });

      setAddress(data.address || {});

      // ✅ update localStorage
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="bg-[#f8f4f1] min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-16 flex-1">
        <h1 className="text-4xl font-serif text-gray-800 mb-12">My Account</h1>

        {/* 🔥 MAIN GRID */}
        <div className="grid grid-cols-3 gap-10 items-start">
          {/* ================= LEFT SIDE ================= */}
          <div className="col-span-1 space-y-8">
            {/* PERSONAL INFO */}
            <div className="bg-[#fbf7f4] rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-serif text-gray-800">
                  Personal Information
                </h2>

                <button
                  onClick={() => {
                    if (editing) saveProfile();
                    setEditing(!editing);
                  }}
                  className="text-[#c07c52]"
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
                <div className="space-y-4 text-gray-700">
                  <div className="flex gap-3 items-center">
                    <User className="text-[#c07c52]" />
                    <span>{user.fullName}</span>
                  </div>

                  <div className="flex gap-3 items-center">
                    <Mail className="text-[#c07c52]" />
                    <span>{user.email}</span>
                  </div>

                  <div className="flex gap-3 items-center">
                    <Phone className="text-[#c07c52]" />
                    <span>{user.phone}</span>
                  </div>
                </div>
              )}
            </div>

            {/* SHIPPING ADDRESS */}
            <div className="bg-[#fbf7f4] rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-serif text-gray-800">
                  Shipping Address
                </h2>

                <button
                  onClick={() => {
                    if (isEditingAddress) saveProfile();
                    setIsEditingAddress(!isEditingAddress);
                  }}
                  className="text-[#c07c52]"
                >
                  {isEditingAddress ? "Save" : "Edit"}
                </button>
              </div>

              {!isEditingAddress ? (
                <div className="flex gap-3 text-gray-700">
                  <MapPin className="text-[#c07c52]" />

                  <div className="text-sm">
                    {address.fullName && <p>{address.fullName}</p>}
                    {address.phone && <p>{address.phone}</p>}
                    {address.street && <p>{address.street}</p>}

                    {(address.city || address.state) && (
                      <p>
                        {[address.city, address.state]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}

                    {(address.postalCode || address.country) && (
                      <p>
                        {[address.postalCode, address.country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}

                    {/* 🔥 EMPTY STATE */}
                    {!address.street && (
                      <p className="text-gray-400">No address added yet</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    className="input"
                    placeholder="Full Name"
                    value={address.fullName}
                    onChange={(e) =>
                      setAddress({ ...address, fullName: e.target.value })
                    }
                  />

                  <input
                    className="input"
                    placeholder="Phone"
                    value={address.phone}
                    onChange={(e) =>
                      setAddress({ ...address, phone: e.target.value })
                    }
                  />

                  <input
                    className="input"
                    placeholder="Street"
                    value={address.street}
                    onChange={(e) =>
                      setAddress({ ...address, street: e.target.value })
                    }
                  />

                  <input
                    className="input"
                    placeholder="City"
                    value={address.city}
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                  />

                  <input
                    className="input"
                    placeholder="State"
                    value={address.state}
                    onChange={(e) =>
                      setAddress({ ...address, state: e.target.value })
                    }
                  />

                  <input
                    className="input"
                    placeholder="Postal Code"
                    value={address.postalCode}
                    onChange={(e) =>
                      setAddress({ ...address, postalCode: e.target.value })
                    }
                  />

                  <input
                    className="input"
                    placeholder="Country"
                    value={address.country}
                    onChange={(e) =>
                      setAddress({ ...address, country: e.target.value })
                    }
                  />
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="col-span-2 bg-[#fbf7f4] rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-serif mb-6 flex gap-2 items-center">
              <Package size={18} /> Order History
            </h2>

            {orders.length === 0 ? (
              <p className="text-gray-500">No orders yet</p>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-xl p-5">
                    <div className="flex justify-between mb-3">
                      <span className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>

                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          order.isDelivered
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {order.isDelivered ? "Delivered" : "Pending"}
                      </span>
                    </div>

                    {order.items.map((item, index) => (
                      <div
                        key={item._id || index}
                        className="flex items-center justify-between py-2 border-b last:border-none"
                      >
                        {/* LEFT: IMAGE + NAME */}
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              item.image ||
                              item.product?.images?.[0] ||
                              "/no-image.png"
                            }
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.target.src = "/no-image.png";
                            }}
                          />

                          <div className="text-sm">
                            <p className="text-gray-800">{item.name}</p>
                            <p className="text-gray-500 text-xs">
                              Qty: {item.qty}
                            </p>
                          </div>
                        </div>

                        {/* RIGHT: PRICE */}
                        <span className="text-sm font-medium text-gray-700">
                          Rs {item.price}
                        </span>
                      </div>
                    ))}

                    <div className="text-right mt-3 font-semibold text-[#c07c52]">
                      Total: Rs {order.total}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;
