import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc,
  Timestamp,
  startAt,
  endAt 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { AdminOrder, OrderStatus, PaymentStatus, OrderFilterOptions } from '../types/admin';
import toast from 'react-hot-toast';

// Mock orders data for development
const mockOrders: AdminOrder[] = [
  {
    id: "ord12345",
    orderNumber: "BL-22734",
    customerId: "cust78901",
    customerName: "Jennifer Smith",
    customerEmail: "jennifer.smith@example.com",
    items: [
      {
        id: "item1",
        productId: "prod123",
        name: "Personalized Baseball Cap",
        price: 29.99,
        quantity: 2,
        imageUrl: "https://source.unsplash.com/random/100x100?cap",
        customization: {
          font: "Brush Script",
          style: "Cursive"
        }
      },
      {
        id: "item2",
        productId: "prod456",
        name: "Custom T-Shirt",
        price: 24.99,
        quantity: 1,
        imageUrl: "https://source.unsplash.com/random/100x100?tshirt"
      }
    ],
    totalAmount: 84.97,
    status: "pending",
    paymentStatus: "pending",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    shippingInfo: {
      address: "123 Main St, Apt 4B",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "US"
    }
  },
  {
    id: "ord67890",
    orderNumber: "BL-34982",
    customerId: "cust12345",
    customerName: "Michael Johnson",
    customerEmail: "mike.j@example.com",
    items: [
      {
        id: "item3",
        productId: "prod789",
        name: "Embroidered Hoodie",
        price: 49.99,
        quantity: 1,
        imageUrl: "https://source.unsplash.com/random/100x100?hoodie",
        customization: {
          font: "Sans Serif",
          style: "Modern"
        }
      }
    ],
    totalAmount: 54.98, // Including $4.99 shipping
    status: "shipped",
    paymentStatus: "paid",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(), // Updated 3 days ago
    shippingInfo: {
      address: "456 Oak Avenue",
      city: "Portland",
      state: "OR",
      zipCode: "97201",
      country: "US"
    },
    trackingNumber: "USPS1234567890",
    notes: "Customer requested gift wrapping. Package wrapped in blue paper with white ribbon."
  },
  {
    id: "ord54321",
    orderNumber: "BL-56789",
    customerId: "cust45678",
    customerName: "Emily Rodriguez",
    customerEmail: "emily.r@example.com",
    items: [
      {
        id: "item4",
        productId: "prod321",
        name: "Custom Tote Bag",
        price: 19.99,
        quantity: 2,
        imageUrl: "https://source.unsplash.com/random/100x100?tote"
      },
      {
        id: "item5",
        productId: "prod654",
        name: "Personalized Mug",
        price: 14.99,
        quantity: 3,
        imageUrl: "https://source.unsplash.com/random/100x100?mug",
        customization: {
          font: "Serif",
          style: "Classic"
        }
      },
      {
        id: "item6",
        productId: "prod987",
        name: "Custom Phone Case",
        price: 24.99,
        quantity: 1,
        imageUrl: "https://source.unsplash.com/random/100x100?phonecase"
      }
    ],
    totalAmount: 109.94,
    status: "delivered",
    paymentStatus: "paid",
    createdAt: new Date(Date.now() - 21 * 86400000).toISOString(), // 21 days ago
    updatedAt: new Date(Date.now() - 14 * 86400000).toISOString(), // Updated 14 days ago
    shippingInfo: {
      address: "789 Pine St, Suite 300",
      city: "San Francisco",
      state: "CA",
      zipCode: "94103",
      country: "US"
    },
    trackingNumber: "FEDEX9876543210",
    notes: "Delivery confirmed by customer. They were very satisfied with the products."
  }
];

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<OrderFilterOptions>({});
  
  // Load orders with optional filters
  const loadOrders = async (options: OrderFilterOptions = {}) => {
    setLoading(true);
    setError(null);
    try {
      // For development/demo, use mock data
      // In production, you would use the commented out Firestore code
      let filteredOrders = [...mockOrders];
      
      // Apply status filter
      if (options.status) {
        filteredOrders = filteredOrders.filter(order => order.status === options.status);
      }
      
      // Apply payment status filter
      if (options.paymentStatus) {
        filteredOrders = filteredOrders.filter(order => order.paymentStatus === options.paymentStatus);
      }
      
      // Apply date range filter
      if (options.dateRange) {
        if (options.dateRange.from) {
          const fromDate = options.dateRange.from;
          filteredOrders = filteredOrders.filter(order => 
            new Date(order.createdAt) >= fromDate
          );
        }
        
        if (options.dateRange.to) {
          const toDate = options.dateRange.to;
          toDate.setHours(23, 59, 59, 999); // End of day
          filteredOrders = filteredOrders.filter(order => 
            new Date(order.createdAt) <= toDate
          );
        }
      }
      
      // Apply search term filter
      if (options.searchTerm) {
        const search = options.searchTerm.toLowerCase();
        filteredOrders = filteredOrders.filter(order => 
          order.orderNumber.toLowerCase().includes(search) ||
          order.customerName.toLowerCase().includes(search) ||
          order.customerEmail.toLowerCase().includes(search) ||
          (order.trackingNumber && order.trackingNumber.toLowerCase().includes(search))
        );
      }
      
      // Sort by created date descending (newest first)
      filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setOrders(filteredOrders);
      setFilterOptions(options);
      
      /* 
      // Uncomment this section when ready to use Firestore instead of mock data
      const ordersRef = collection(db, 'orders');
      
      // Base query
      let constraints: any[] = [orderBy('createdAt', 'desc')];
      
      // Add filters for order status
      if (options.status) {
        constraints.push(where('status', '==', options.status));
      }
      
      // Add filters for payment status
      if (options.paymentStatus) {
        constraints.push(where('paymentStatus', '==', options.paymentStatus));
      }
      
      // Add date range filters if provided
      if (options.dateRange) {
        if (options.dateRange.from) {
          const fromDate = options.dateRange.from;
          fromDate.setHours(0, 0, 0, 0); // Start of day
          constraints.push(where('createdAt', '>=', Timestamp.fromDate(fromDate)));
        }
        
        if (options.dateRange.to) {
          const toDate = options.dateRange.to;
          toDate.setHours(23, 59, 59, 999); // End of day
          constraints.push(where('createdAt', '<=', Timestamp.fromDate(toDate)));
        }
      }
      
      const q = query(ordersRef, ...constraints);
      const querySnapshot = await getDocs(q);
      
      let fetchedOrders: AdminOrder[] = querySnapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            orderNumber: data.orderNumber || doc.id.substring(0, 8).toUpperCase(),
            customerId: data.userId || '',
            customerName: data.customerName || `${data.customer?.firstName || ''} ${data.customer?.lastName || ''}`,
            customerEmail: data.customerEmail || data.customer?.email || '',
            items: (data.items || []).map((item: any) => ({
              id: item.id || '',
              productId: item.productId || '',
              name: item.name || '',
              price: item.price || 0,
              quantity: item.quantity || 1,
              imageUrl: item.imageUrl || item.image || '',
              customization: item.customization || {}
            })),
            totalAmount: data.total || 0,
            status: data.status || 'pending',
            paymentStatus: data.paymentStatus || 'pending',
            createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
            updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
            shippingInfo: data.shipping || {},
            trackingNumber: data.trackingNumber || '',
            notes: data.notes || ''
          };
        });
      
      // Apply search term filter (client-side)
      if (options.searchTerm) {
        const search = options.searchTerm.toLowerCase();
        fetchedOrders = fetchedOrders.filter(order => 
          order.orderNumber.toLowerCase().includes(search) ||
          order.customerName.toLowerCase().includes(search) ||
          order.customerEmail.toLowerCase().includes(search) ||
          (order.trackingNumber && order.trackingNumber.toLowerCase().includes(search))
        );
      }
      
      setOrders(fetchedOrders);
      setFilterOptions(options);
      */
      
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Update order status
  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
    try {
      setLoading(true);
      
      // For development/demo, update mock data
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status, updatedAt: new Date().toISOString() } 
            : order
        )
      );
      
      /* 
      // Uncomment for Firestore
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { 
        status,
        updatedAt: new Date().toISOString()
      });
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status, updatedAt: new Date().toISOString() } 
            : order
        )
      );
      */
      
      toast.success(`Order status updated to ${status}`);
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('Failed to update order status');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Update payment status
  const updatePaymentStatus = async (orderId: string, paymentStatus: PaymentStatus): Promise<void> => {
    try {
      setLoading(true);
      
      // For development/demo, update mock data
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, paymentStatus, updatedAt: new Date().toISOString() } 
            : order
        )
      );
      
      /* 
      // Uncomment for Firestore
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { 
        paymentStatus,
        updatedAt: new Date().toISOString()
      });
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, paymentStatus, updatedAt: new Date().toISOString() } 
            : order
        )
      );
      */
      
      toast.success(`Payment status updated to ${paymentStatus}`);
    } catch (err) {
      console.error('Error updating payment status:', err);
      toast.error('Failed to update payment status');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Add tracking number
  const addTrackingNumber = async (orderId: string, trackingNumber: string): Promise<void> => {
    try {
      setLoading(true);
      
      // For development/demo, update mock data
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { 
                ...order, 
                trackingNumber, 
                status: 'shipped',
                updatedAt: new Date().toISOString() 
              } 
            : order
        )
      );
      
      /* 
      // Uncomment for Firestore
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { 
        trackingNumber,
        status: 'shipped' as OrderStatus, // Update status to shipped
        updatedAt: new Date().toISOString()
      });
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { 
                ...order, 
                trackingNumber, 
                status: 'shipped',
                updatedAt: new Date().toISOString() 
              } 
            : order
        )
      );
      */
      
      toast.success('Tracking number added and order marked as shipped');
    } catch (err) {
      console.error('Error adding tracking number:', err);
      toast.error('Failed to add tracking number');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Add notes to order
  const addOrderNotes = async (orderId: string, notes: string): Promise<void> => {
    try {
      setLoading(true);
      
      // For development/demo, update mock data
      setOrders(prevOrders => 
        prevOrders.map(order => {
          if (order.id === orderId) {
            const updatedNotes = order.notes 
              ? `${order.notes}\n\n${notes}`
              : notes;
            return { 
              ...order, 
              notes: updatedNotes, 
              updatedAt: new Date().toISOString() 
            };
          }
          return order;
        })
      );
      
      /* 
      // Uncomment for Firestore
      const orderRef = doc(db, 'orders', orderId);
      
      // First get existing notes
      const orderDoc = await getDoc(orderRef);
      const existingNotes = orderDoc.data()?.notes || '';
      
      // Append new note
      const updatedNotes = existingNotes 
        ? `${existingNotes}\n\n${notes}`
        : notes;
        
      await updateDoc(orderRef, { 
        notes: updatedNotes,
        updatedAt: new Date().toISOString()
      });
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, notes: updatedNotes, updatedAt: new Date().toISOString() } 
            : order
        )
      );
      */
      
      toast.success('Order notes updated');
    } catch (err) {
      console.error('Error updating order notes:', err);
      toast.error('Failed to update order notes');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Get a single order by ID
  const getOrderById = async (orderId: string): Promise<AdminOrder | null> => {
    try {
      setLoading(true);
      
      // For development/demo, use mock data
      const order = mockOrders.find(order => order.id === orderId);
      if (!order) {
        toast.error('Order not found');
        return null;
      }
      return order;
      
      /* 
      // Uncomment for Firestore
      const orderRef = doc(db, 'orders', orderId);
      const orderDoc = await getDoc(orderRef);
      
      if (!orderDoc.exists()) {
        toast.error('Order not found');
        return null;
      }
      
      const data = orderDoc.data();
      
      // Convert Firestore Timestamps to ISO strings
      const createdAt = data.createdAt instanceof Timestamp 
        ? data.createdAt.toDate().toISOString() 
        : data.createdAt;
        
      const updatedAt = data.updatedAt instanceof Timestamp 
        ? data.updatedAt.toDate().toISOString() 
        : data.updatedAt;
      
      return {
        id: orderDoc.id,
        orderNumber: data.orderNumber || orderDoc.id.substring(0, 8).toUpperCase(),
        customerId: data.customerId || '',
        customerName: data.customerName || `${data.customer?.firstName || ''} ${data.customer?.lastName || ''}`,
        customerEmail: data.customerEmail || data.customer?.email || '',
        items: data.items || [],
        totalAmount: data.totalAmount || 0,
        status: data.status || 'pending',
        paymentStatus: data.paymentStatus || 'pending',
        createdAt,
        updatedAt,
        shippingInfo: data.shippingInfo || data.shipping || {},
        trackingNumber: data.trackingNumber || '',
        notes: data.notes || '',
      } as AdminOrder;
      */
      
    } catch (err) {
      console.error('Error fetching order:', err);
      toast.error('Failed to fetch order details');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Initial load of orders
  useEffect(() => {
    loadOrders(filterOptions);
  }, []);
  
  // Apply new filters and reload orders
  const applyFilters = (newFilters: OrderFilterOptions) => {
    setFilterOptions(newFilters);
    loadOrders(newFilters);
  };
  
  return {
    orders,
    loading,
    error,
    filterOptions,
    loadOrders,
    applyFilters,
    updateOrderStatus,
    updatePaymentStatus,
    addTrackingNumber,
    addOrderNotes,
    getOrderById
  };
}; 