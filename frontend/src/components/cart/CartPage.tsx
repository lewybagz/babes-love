import React from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { useAppContext } from "../../context/AppContext"; // Import context hook
import { CartItem } from "../../types"; // Ensure type is imported

// Removed props interface as data comes from context
// interface CartPageProps {
//   items: CartItem[];
//   updateQuantity: (itemId: string, newQuantity: number) => void;
//   removeItem: (itemId: string) => void;
// }

const CartPage: React.FC = () => {
  const { cartItems, updateCartQuantity, removeFromCart, getCartTotals } =
    useAppContext(); // Get state and functions from context

  const { subtotal, tax, shipping } = getCartTotals();
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-8 text-center">
          Your Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center">
            <ShoppingCart
              className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-6"
              strokeWidth={1}
            />
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Your cart is currently empty.
            </p>
            <Link
              to="/products"
              className="inline-block bg-brand hover:bg-brand-600 text-white px-8 py-3 rounded-full font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-lg"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row lg:gap-12">
            <div className="lg:flex-grow space-y-6 mb-10 lg:mb-0">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md transition-shadow hover:shadow-lg"
                >
                  <div className="w-28 h-28 sm:w-24 sm:h-24 flex-shrink-0 mb-4 sm:mb-0 sm:mr-5">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md shadow-sm"
                    />
                  </div>
                  <div className="flex-grow text-center sm:text-left mb-4 sm:mb-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {item.name}
                    </h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <span>Font: {item.customization.font || "Default"}</span>
                      <span className="mx-2">|</span>
                      <span>
                        Style: {item.customization.style || "Default"}
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-brand dark:text-brand-400 mt-2 sm:hidden">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6 flex-shrink-0">
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full overflow-hidden">
                      <button
                        onClick={() =>
                          updateCartQuantity(item.id, item.quantity - 1)
                        }
                        className="p-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-1 text-sm text-gray-800 dark:text-white font-medium min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateCartQuantity(item.id, item.quantity + 1)
                        }
                        className="p-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="text-lg font-semibold text-gray-800 dark:text-white w-20 text-right hidden sm:block">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-150"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:w-1/3 lg:flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md lg:sticky lg:top-24">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5 border-b border-gray-200 dark:border-gray-700 pb-3">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Estimated Tax</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Shipping</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  className="mt-8 block w-full bg-brand hover:bg-brand-600 text-white text-center px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-lg"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
