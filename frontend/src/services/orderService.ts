import { 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Timestamp,
  doc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { CartItem } from '../context/CartContext';
import { calculateTax } from '../hooks/useTaxRate';

export interface OrderData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethod: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCVV?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  orderData: OrderData;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

// Create a new order
export const createOrder = async (
  userId: string,
  items: CartItem[],
  orderData: OrderData
): Promise<Order> => {
  try {
    // Calculate order totals
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = calculateTax(subtotal); // Use the common tax calculation
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;
    
    // Create timestamp
    const timestamp = new Date().toISOString();
    
    // Create order object
    const orderObj = {
      userId,
      items,
      orderData,
      status: 'pending',
      subtotal,
      tax,
      shipping,
      total,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    // Add to Firestore
    const docRef = await addDoc(collection(db, 'orders'), orderObj);
    
    // Return the complete order with ID
    return {
      id: docRef.id,
      ...orderObj
    } as Order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Get user orders
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (orderId: string): Promise<Order> => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);
    
    if (!orderDoc.exists()) {
      throw new Error('Order not found');
    }
    
    return {
      id: orderDoc.id,
      ...orderDoc.data()
    } as Order;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (
  orderId: string, 
  status: Order['status']
): Promise<Order> => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    
    await updateDoc(orderRef, {
      status,
      updatedAt: new Date().toISOString()
    });
    
    // Get the updated order
    const updatedOrder = await getOrderById(orderId);
    return updatedOrder;
  } catch (error) {
    console.error(`Error updating order ${orderId}:`, error);
    throw error;
  }
};

// Get all orders (admin only)
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

export default {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders
}; 