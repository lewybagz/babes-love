import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  deleteDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "./AuthContext";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  customizations?: Record<string, string | number | boolean>;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  updateCartItem: (id: string, quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  subtotal: number;
}

interface CartProviderProps {
  children: ReactNode;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, isAuthenticated } = useAuth();

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Load cart from Firebase when user changes
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    const loadCart = async () => {
      setIsLoading(true);

      try {
        if (isAuthenticated && currentUser) {
          // For logged-in users, get cart from Firestore
          const userCartRef = doc(db, "carts", currentUser.uid);

          unsubscribe = onSnapshot(userCartRef, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              setCartItems(data.items || []);
            } else {
              // Create an empty cart for the user
              setDoc(userCartRef, { items: [] });
              setCartItems([]);
            }
            setIsLoading(false);
          });
        } else {
          // For guest users, get cart from localStorage
          const localCart = localStorage.getItem("guestCart");
          if (localCart) {
            setCartItems(JSON.parse(localCart));
          } else {
            setCartItems([]);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        setIsLoading(false);
      }
    };

    loadCart();

    // Cleanup subscription
    return () => unsubscribe();
  }, [currentUser, isAuthenticated]);

  // Save guest cart to localStorage when it changes
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("guestCart", JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  // Add item to cart
  const addToCart = async (item: CartItem) => {
    try {
      // Check if item already exists in cart
      const existingItemIndex = cartItems.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...cartItems];
        updatedItems[existingItemIndex].quantity += item.quantity;

        if (isAuthenticated && currentUser) {
          const userCartRef = doc(db, "carts", currentUser.uid);
          await updateDoc(userCartRef, {
            items: updatedItems,
          });
        } else {
          setCartItems(updatedItems);
        }
      } else {
        // Add new item
        if (isAuthenticated && currentUser) {
          const userCartRef = doc(db, "carts", currentUser.uid);
          await updateDoc(userCartRef, {
            items: arrayUnion(item),
          });
        } else {
          setCartItems((prev) => [...prev, item]);
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  // Update cart item quantity
  const updateCartItem = async (id: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(id);
        return;
      }

      const updatedItems = cartItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );

      if (isAuthenticated && currentUser) {
        const userCartRef = doc(db, "carts", currentUser.uid);
        await updateDoc(userCartRef, {
          items: updatedItems,
        });
      } else {
        setCartItems(updatedItems);
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  };

  // Remove item from cart
  const removeFromCart = async (id: string) => {
    try {
      if (isAuthenticated && currentUser) {
        const userCartRef = doc(db, "carts", currentUser.uid);
        const itemToRemove = cartItems.find((item) => item.id === id);

        if (itemToRemove) {
          await updateDoc(userCartRef, {
            items: arrayRemove(itemToRemove),
          });
        }
      } else {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      if (isAuthenticated && currentUser) {
        const userCartRef = doc(db, "carts", currentUser.uid);
        await updateDoc(userCartRef, {
          items: [],
        });
      } else {
        setCartItems([]);
        localStorage.removeItem("guestCart");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  };

  const value = {
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    isLoading,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
