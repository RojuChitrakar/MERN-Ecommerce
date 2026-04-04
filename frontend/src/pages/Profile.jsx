import Navbar from "../components/Navbar";
import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Phone, MapPin, Package } from "lucide-react";

function Profile() {
  const [user, setUser] = useState({
    name: "Roju Chitrakar",
    email: "roju@gmail.com",
    phone: "+9779866264853",
  });

  const [address, setAddress] = useState("");
  const [editing, setEditing] = useState(false);

  // 🔥 SAMPLE ORDER DATA (replace later with backend)
  const orders = [
    {
      id: "ORD123",
      date: "April 10, 2026",
      total: 129.99,
      status: "Delivered",
      items: ["Running Shoes", "Yoga Mat"],
    },
    {
      id: "ORD124",
      date: "April 15, 2026",
      total: 79.99,
      status: "Pending",
      items: ["Wireless Headphones"],
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <div className="grid md:grid-cols-3 gap-8">

          {/* 🟡 LEFT SIDE */}
          <div className="space-y-6">

            {/* PERSONAL INFO */}
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Personal Information</h2>

                <button
                  onClick={() => setEditing(!editing)}
                  className="text-blue-600 text-sm"
                >
                  {editing ? "Save" : "Edit"}
                </button>
              </div>

              {editing ? (
                <div className="space-y-3">
                  <input
                    value={user.name}
                    onChange={(e) =>
                      setUser({ ...user, name: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                  <input
                    value={user.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                  <input
                    value={user.phone}
                    onChange={(e) =>
                      setUser({ ...user, phone: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              ) : (
                <div className="space-y-3 text-gray-600">
                  <p className="flex items-center gap-2">
                    <User size={16} /> {user.name}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail size={16} /> {user.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={16} /> {user.phone}
                  </p>
                </div>
              )}
            </div>

            {/* ADDRESS */}
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <h2 className="font-semibold text-lg mb-3">
                Shipping Address
              </h2>

              {address ? (
                <p className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} /> {address}
                </p>
              ) : (
                <p className="text-gray-500 mb-3">
                  No address saved yet
                </p>
              )}

              <input
                placeholder="Enter address"
                className="w-full border px-3 py-2 rounded mt-2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* QUICK LINKS */}
            <div className="bg-white p-5 rounded-xl shadow-sm space-y-3">
              <h2 className="font-semibold text-lg">Quick Links</h2>

              <Link to="/wishlist" className="block hover:text-blue-600">
                ❤️ My Wishlist
              </Link>

              <Link to="/cart" className="block hover:text-blue-600">
                🛒 Shopping Cart
              </Link>

              <button className="text-red-500 mt-2">
                Logout
              </button>
            </div>

          </div>

          {/* 🔵 RIGHT SIDE - ORDER HISTORY */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm">

            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Package size={20} />
              Order History
            </h2>

            {orders.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">
                  No orders yet
                </p>

                <Link to="/products">
                  <button className="bg-blue-600 text-white px-5 py-2 rounded">
                    Browse Products
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">

                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border p-4 rounded-lg"
                  >
                    <div className="flex justify-between mb-2">
                      <p className="font-semibold">
                        {order.id}
                      </p>

                      <span
                        className={`text-sm px-2 py-1 rounded ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <p className="text-gray-500 text-sm">
                      {order.date}
                    </p>

                    <p className="text-sm mt-2">
                      Items: {order.items.join(", ")}
                    </p>

                    <p className="font-semibold mt-2">
                      Total: ${order.total}
                    </p>
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