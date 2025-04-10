import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

// Define interface for Order (adjust based on your actual Order model)
interface Order {
  _id: string;
  createdAt: string;
  totalAmount: number;
  isPaid: boolean;
  isDelivered: boolean;
  orderItems: {
    product: {
      _id: string;
      name: string;
      images?: string[];
    };
    quantity: number;
    price: number; // Assuming price per item is stored or calculated
  }[];
}

const OrderHistoryPage: React.FC = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      if (!token) {
        setError("Authentication required.");
        setIsLoading(false);
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        // Use the correct endpoint from your backend
        const response = await axios.get("/api/orders/myorders", config);
        setOrders(response.data);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError(
          err.response?.data?.message || "Failed to load order history."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Order History</h1>

      {isLoading && <p className="dark:text-gray-300">Loading orders...</p>}
      {error && (
        <p className="text-red-500 dark:text-red-400">Error: {error}</p>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <p className="dark:text-gray-400">You haven't placed any orders yet.</p>
      )}

      {!isLoading && !error && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-800 shadow rounded-lg p-4"
            >
              <div className="flex justify-between items-center mb-3 flex-wrap">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Order ID: {order._id}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="font-semibold text-lg dark:text-white">
                  Total: ${order.totalAmount.toFixed(2)}
                </p>
              </div>
              <div className="mb-3">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    order.isPaid
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                  }`}
                >
                  {order.isPaid ? "Paid" : "Pending Payment"}
                </span>
                <span
                  className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                    order.isDelivered
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {order.isDelivered ? "Delivered" : "Processing"}
                </span>
              </div>
              <div>
                <h3 className="text-md font-semibold mb-2 dark:text-gray-200">
                  Items:
                </h3>
                <ul className="space-y-2">
                  {order.orderItems.map((item, index) => (
                    <li
                      key={`${item.product._id}-${index}`}
                      className="flex items-center space-x-3"
                    >
                      {item.product.images &&
                        item.product.images.length > 0 && (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                      <div className="flex-grow">
                        <p className="text-sm font-medium dark:text-gray-300">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold dark:text-gray-300">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
