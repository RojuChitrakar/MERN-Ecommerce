import { useEffect, useState } from "react";
import API from "../api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders");
      setOrders(data);
    } catch (error) {
      console.error("ORDER FETCH ERROR:", error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markDelivered = async (id) => {
    try {
      await API.put(`/orders/${id}/deliver`);
      fetchOrders();
    } catch (error) {
      console.error("DELIVER ERROR:", error.message);
    }
  };

  // 🔍 FILTER + SEARCH
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.user?.fullName
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      order.items?.some((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );

    const matchesFilter =
      filter === "all"
        ? true
        : filter === "delivered"
        ? order.isDelivered
        : !order.isDelivered;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Orders</h2>

        <div className="flex gap-3">
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search by user or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded-lg w-64"
          />

          {/* FILTER */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="all">All</option>
            <option value="delivered">Delivered</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">

          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="text-gray-600 text-left">
                <th className="p-3">User</th>
                <th className="p-3">Items</th>
                <th className="p-3">Total</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border-t hover:bg-gray-50">

                  {/* USER */}
                  <td className="p-3 font-medium">
                    {order.user?.fullName || "Unknown"}
                  </td>

                  {/* ITEMS */}
                  <td className="p-3">
                    <div className="max-h-20 overflow-y-auto space-y-1">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          {item.image && (
                            <img
                              src={item.image}
                              className="w-6 h-6 rounded object-cover"
                            />
                          )}
                          <span>
                            {item.name} × {item.qty}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* TOTAL */}
                  <td className="p-3 font-medium">
                    ₹{order.total}
                  </td>

                  {/* PAYMENT */}
                  <td className="p-3 capitalize text-gray-600">
                    {order.paymentMethod}
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.isDelivered
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {order.isDelivered ? "Delivered" : "Pending"}
                    </span>
                  </td>

                  {/* DATE */}
                  <td className="p-3 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  {/* ACTION */}
                  <td className="p-3">
                    {!order.isDelivered && (
                      <button
                        onClick={() => markDelivered(order._id)}
                        className="border px-3 py-1 rounded-lg text-sm hover:bg-gray-100"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}

export default AdminOrders;