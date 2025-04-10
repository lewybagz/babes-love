import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import {
  Product,
  CartItem,
  ProductCustomization,
  CustomHatData,
  OrderData,
} from "../types";
import { FIXED_TAX_RATE, calculateTax } from "../hooks/useTaxRate";

// Mock data (should ideally be fetched or managed elsewhere)
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Babes Love Birdies Hat",
    price: 29.99,
    description:
      'Stylish hat with the "Babes Love Birdies" design. Made with premium materials for comfort and durability.',
    imageUrl: "/images/birdiesHat.jpg",
    images: ["/images/birdiesHat.jpg"],
  },
  // Add more mock products if needed
];

// Type guard to check if customization is CustomHatData
function isCustomHat(customization: any): customization is CustomHatData {
  return customization && customization.isCustomHat === true;
}

interface AppContextProps {
  products: Product[];
  cartItems: CartItem[];
  orderData: OrderData | null;
  addToCart: (
    productId: string,
    quantity: number,
    customization: ProductCustomization | CustomHatData
  ) => void;
  updateCartQuantity: (itemId: string, newQuantity: number) => void;
  removeFromCart: (itemId: string) => void;
  handleOrderComplete: (data: OrderData) => void;
  getCartTotals: () => { subtotal: number; tax: number; shipping: number };
  cartItemCount: number;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  // We use useMemo here so the MOCK_PRODUCTS array isn't recreated on every render
  const products = useMemo(() => MOCK_PRODUCTS, []);

  const addToCart = useCallback(
    (
      productId: string,
      quantity: number,
      customization: ProductCustomization | CustomHatData
    ) => {
      // Find base product if it's not a custom hat
      // For custom hats, we might use a placeholder or handle differently
      const product = products.find((p) => p.id === productId);

      // Determine name and price based on whether it's a custom hat
      let itemName: string;
      let itemPrice: number;
      let imageUrl: string;

      if (isCustomHat(customization)) {
        // Use details specific to custom hats
        itemName =
          `${DEFAULT_CONFIG.fixedPrefix} ${customization.customText}`.trim();
        itemPrice = CUSTOM_HAT_PRICE; // Use the fixed custom hat price
        imageUrl = CUSTOM_HAT_IMAGE_URL; // Use the placeholder image
      } else if (product) {
        // Use details from the base product
        itemName = product.name;
        itemPrice = product.price;
        imageUrl = product.imageUrl;
      } else {
        // Handle case where productId is not found and it's not a custom hat
        console.error(`Product with ID ${productId} not found.`);
        return; // Or throw an error
      }

      setCartItems((prevItems) => {
        // Refined check for existing items
        const existingItemIndex = prevItems.findIndex((item) => {
          if (item.productId !== productId) return false;

          // Check customization based on type
          if (isCustomHat(customization) && isCustomHat(item.customization)) {
            // Compare custom hat properties
            return (
              item.customization.font === customization.font &&
              item.customization.color === customization.color &&
              item.customization.customText === customization.customText
            );
          } else if (
            !isCustomHat(customization) &&
            !isCustomHat(item.customization)
          ) {
            // Compare standard product customization (handle potential undefined fields)
            return (
              item.customization?.font === customization?.font &&
              item.customization?.style === customization?.style
              // Add other standard customization checks if needed
            );
          }
          return false; // Mismatched customization types
        });

        if (existingItemIndex > -1) {
          // Update quantity of existing item
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity,
          };
          return updatedItems;
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `cart-${Date.now()}-${productId}-${Math.random()
              .toString(36)
              .substring(2, 7)}`,
            productId,
            name: itemName,
            price: itemPrice,
            quantity,
            imageUrl: imageUrl,
            customization, // Assign the received customization object directly
          };
          return [...prevItems, newItem];
        }
      });
    },
    [products] // Dependency array
  );

  const updateCartQuantity = useCallback(
    (itemId: string, newQuantity: number) => {
      setCartItems(
        (prevItems) =>
          prevItems
            .map((item) =>
              item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
            .filter((item) => item.quantity > 0) // Remove item if quantity is 0 or less
      );
    },
    []
  );

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  // Memoize calculation to avoid recomputing on every render
  const getCartTotals = useCallback(() => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const tax = calculateTax(subtotal);
    const shippingThreshold = 50; // Example free shipping threshold
    const baseShipping = 5.99; // Example base shipping cost
    const shipping =
      subtotal >= shippingThreshold || subtotal === 0 ? 0 : baseShipping;

    return { subtotal, tax, shipping };
  }, [cartItems]);

  const handleOrderComplete = useCallback((data: OrderData) => {
    console.log("Order completed:", data); // Log for debugging
    setOrderData(data);
    setCartItems([]); // Clear cart after successful order
  }, []);

  // Memoize cart count calculation
  const cartItemCount = useMemo(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  // Memoize the context value to prevent unnecessary re-renders of consumers
  const value = useMemo(
    () => ({
      products,
      cartItems,
      orderData,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      handleOrderComplete,
      getCartTotals,
      cartItemCount,
    }),
    [
      products,
      cartItems,
      orderData,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      handleOrderComplete,
      getCartTotals,
      cartItemCount,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
