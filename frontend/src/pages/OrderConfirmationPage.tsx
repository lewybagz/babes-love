import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext"; // Import context hook
import { CheckCircle, Package } from "lucide-react"; // Icons

// Remove props interface as data comes from context
// interface OrderConfirmationPageProps {
//   orderNumber: string;
//   customerEmail: string;
// }

const OrderConfirmationPage: React.FC = () => {
  const { orderData } = useAppContext(); // Get orderData from context
  const navigate = useNavigate();

  // Redirect to homepage if orderData is null (e.g., page accessed directly)
  useEffect(() => {
    if (!orderData) {
      console.warn("Order data not found, redirecting to home.");
      navigate("/");
    }
  }, [orderData, navigate]);

  // Render placeholder or loading state while redirecting or if orderData is null
  if (!orderData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Loading confirmation...
        </p>
      </div>
    );
  }

  // Generate a simple order number based on timestamp for display
  // In a real app, this would likely come from the backend response stored in orderData
  const displayOrderNumber = `BL-${Date.now().toString().slice(-8)}`;
  const customerEmail = orderData.customer?.email || "your email address";

  return (
    <div className="container mx-auto px-4 py-16 text-center bg-gray-50 dark:bg-gray-900">
      <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Thank You For Your Order!
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
        Your order{" "}
        <span className="font-semibold text-gray-800 dark:text-white">
          #{displayOrderNumber}
        </span>{" "}
        has been placed successfully.
      </p>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        A confirmation email has been sent to{" "}
        <span className="font-semibold text-gray-800 dark:text-white">
          {customerEmail}
        </span>
        .
      </p>

      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-10 text-left">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Package className="w-5 h-5 mr-2 text-brand dark:text-brand-400" />
          Order Summary
        </h2>
        {/* Basic order summary - could be enhanced if items/totals were stored in orderData */}
        <div className="space-y-2 text-gray-700 dark:text-gray-300">
          <p>
            Order Number:{" "}
            <span className="font-medium">#{displayOrderNumber}</span>
          </p>
          <p>
            Customer:{" "}
            <span className="font-medium">
              {orderData.customer.firstName} {orderData.customer.lastName}
            </span>
          </p>
          <p>
            Email:{" "}
            <span className="font-medium">{orderData.customer.email}</span>
          </p>
          {/* Add more details if available and needed */}
        </div>
      </div>

      <Link
        to="/products"
        className="inline-block bg-brand hover:bg-brand-600 text-white px-8 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300 text-lg"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderConfirmationPage;
