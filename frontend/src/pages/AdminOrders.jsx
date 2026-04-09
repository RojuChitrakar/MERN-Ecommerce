import { useEffect, useState } from "react";
import axios from "axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const { data } = await axios.get("/api/orders");
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markDelivered = async (id) => {
    await axios.put(`/api/orders/${id}/deliver`);
    fetchOrders();
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Manage Orders</h2>

      {orders.map((order) => (
        <div
          key={order._id}
          className="border p-4 mb-3 rounded-lg"
        >
          <p className="font-semibold">
            User: {order.user?.name || "N/A"}
          </p>

          <p>Total: ${order.totalPrice}</p>

          <p>
            Status:{" "}
            {order.isDelivered ? (
              <span className="text-green-600">Delivered ✅</span>
            ) : (
              <span className="text-yellow-600">Pending ⏳</span>
            )}
          </p>

          {!order.isDelivered && (
            <button
              onClick={() => markDelivered(order._id)}
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
            >
              Mark as Delivered
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default AdminOrders;