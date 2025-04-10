import React from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";
import { CartItem } from "../../types";

interface CartProps {
  items: CartItem[];
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
}

const Cart: React.FC<CartProps> = ({ items, updateQuantity, removeItem }) => {
  // Calculate subtotal
  const subtotal = items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // Estimated tax (e.g., 8.25%)
  const taxRate = 0.0825;
  const tax = subtotal * taxRate;

  // Shipping (free over $50)
  const shippingThreshold = 50;
  const baseShipping = 5.99;
  const shipping = subtotal >= shippingThreshold ? 0 : baseShipping;

  // Total
  const total = subtotal + tax + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-6">Your cart is empty</p>
          <Link
            to="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center p-4 border-b border-gray-200 last:border-b-0"
                >
                  <div className="w-24 h-24 flex-shrink-0 mr-4 mb-4 sm:mb-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      Font: {item.customization.font}, Style:{" "}
                      {item.customization.style}
                    </p>
                    <div className="flex flex-wrap items-center justify-between mt-2">
                      <div className="flex items-center mr-4">
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="mx-2 w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center">
                        <p className="text-lg font-medium text-gray-900 mr-4">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          className="text-gray-500 hover:text-red-500"
                          onClick={() => removeItem(item.id)}
                        >
                          <span className="sr-only">Remove</span>
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (estimated)</span>
                  <span className="text-gray-900">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Link
                to="/checkout"
                className="w-full block py-3 px-4 bg-blue-600 text-white text-center rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/products"
                className="w-full block py-3 px-4 bg-white text-gray-800 text-center rounded-md font-medium border border-gray-300 mt-3 hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
