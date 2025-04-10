import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  limit,
  getDocs,
  doc,
  getDoc,
  where,
  startAfter,
  Timestamp,
  QueryDocumentSnapshot,
  addDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { AdminPayment, AdminRefund, PaymentFilterOptions, PaymentTransactionStatus } from '../types/admin';
import toast from 'react-hot-toast';

// Mock payment data for development
const mockPayments: AdminPayment[] = [
  {
    id: "pay12345",
    stripePaymentId: "pi_3MqN6JHC8b1bkUKy0quVwBHT",
    orderId: "ord12345",
    orderNumber: "BL-22734",
    customerId: "cust78901",
    customerName: "Jennifer Smith",
    customerEmail: "jennifer.smith@example.com",
    amount: 8497,
    currency: "usd",
    status: "succeeded",
    paymentMethod: "card",
    cardBrand: "visa",
    cardLast4: "4242",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), // 1 day ago
    metadata: {
      receiptEmail: "jennifer.smith@example.com"
    }
  },
  {
    id: "pay67890",
    stripePaymentId: "pi_3MqP9KHC8b1bkUKy1aeFRXK2",
    orderId: "ord67890",
    orderNumber: "BL-34982",
    customerId: "cust12345",
    customerName: "Michael Johnson",
    customerEmail: "mike.j@example.com",
    amount: 5498,
    currency: "usd",
    status: "succeeded",
    paymentMethod: "card",
    cardBrand: "mastercard",
    cardLast4: "5556",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), // 7 days ago
    metadata: {
      receiptEmail: "mike.j@example.com"
    }
  },
  {
    id: "pay54321",
    stripePaymentId: "pi_3Mqj7KHC8b1bkUKy7nERsN9i",
    orderId: "ord54321",
    orderNumber: "BL-56789",
    customerId: "cust45678",
    customerName: "Emily Rodriguez",
    customerEmail: "emily.r@example.com",
    amount: 10994,
    currency: "usd",
    status: "succeeded",
    paymentMethod: "card",
    cardBrand: "amex",
    cardLast4: "0005",
    createdAt: new Date(Date.now() - 21 * 86400000).toISOString(), // 21 days ago
    metadata: {
      receiptEmail: "emily.r@example.com"
    }
  },
  {
    id: "pay13579",
    stripePaymentId: "pi_3MrL2JHC8b1bkUKy3sADgKP5",
    orderId: "ord13579",
    orderNumber: "BL-45678",
    customerId: "cust24680",
    customerName: "Sarah Miller",
    customerEmail: "sarah.miller@example.com",
    amount: 7250,
    currency: "usd",
    status: "partially_refunded",
    paymentMethod: "card",
    cardBrand: "visa",
    cardLast4: "9424",
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(), // 14 days ago
    refundedAmount: 2500,
    refunds: [
      {
        id: "re_3MrL2JHC8b1bkUKy3sADgKP5",
        amount: 2500,
        createdAt: new Date(Date.now() - 12 * 86400000).toISOString(), // 12 days ago
        reason: "Partial order cancellation",
        status: "succeeded"
      }
    ],
    metadata: {
      receiptEmail: "sarah.miller@example.com"
    }
  },
  {
    id: "pay24680",
    stripePaymentId: "pi_3MsF6LHC8b1bkUKy9rPKjH72",
    orderId: "ord24680",
    orderNumber: "BL-67890",
    customerId: "cust98765",
    customerName: "David Wong",
    customerEmail: "david.wong@example.com",
    amount: 3599,
    currency: "usd",
    status: "refunded",
    paymentMethod: "card",
    cardBrand: "discover",
    cardLast4: "1117",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), // 5 days ago
    refundedAmount: 3599,
    refunds: [
      {
        id: "re_3MsF6LHC8b1bkUKy9rPKjH72",
        amount: 3599,
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
        reason: "Customer requested cancellation",
        status: "succeeded"
      }
    ],
    metadata: {
      receiptEmail: "david.wong@example.com"
    }
  },
  {
    id: "pay97531",
    stripePaymentId: "pi_3Mt1JKHC8b1bkUKy5eRmNq9V",
    orderId: "ord97531",
    orderNumber: "BL-78901",
    customerId: "cust13579",
    customerName: "Alex Thompson",
    customerEmail: "alex.thompson@example.com",
    amount: 4999,
    currency: "usd",
    status: "failed",
    paymentMethod: "card",
    cardBrand: "visa",
    cardLast4: "0002",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
    error: "Your card was declined.",
    metadata: {
      receiptEmail: "alex.thompson@example.com"
    }
  },
  {
    id: "pay86420",
    stripePaymentId: "pi_3Mt7CJHC8b1bkUKy2qPrVsS8",
    orderId: "ord86420",
    orderNumber: "BL-89012",
    customerId: "cust24680",
    customerName: "Sarah Miller",
    customerEmail: "sarah.miller@example.com",
    amount: 7599,
    currency: "usd",
    status: "pending",
    paymentMethod: "card",
    cardBrand: "unknown",
    createdAt: new Date(Date.now() - 0.5 * 86400000).toISOString(), // 12 hours ago
    metadata: {
      receiptEmail: "sarah.miller@example.com"
    }
  }
];

export const useAdminPayments = () => {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<PaymentFilterOptions>({});
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Load payments with optional filters
  const loadPayments = async (options: PaymentFilterOptions = {}, pageSize: number = 50) => {
    setLoading(true);
    setError(null);
    try {
      // For development/demo, use mock data
      let filteredPayments = [...mockPayments];
      
      // Apply search filter
      if (options.searchTerm) {
        const search = options.searchTerm.toLowerCase();
        filteredPayments = filteredPayments.filter(payment => 
          payment.customerName.toLowerCase().includes(search) ||
          payment.customerEmail.toLowerCase().includes(search) ||
          payment.orderNumber.toLowerCase().includes(search) ||
          payment.stripePaymentId.toLowerCase().includes(search)
        );
      }
      
      // Filter by status
      if (options.status) {
        filteredPayments = filteredPayments.filter(payment => 
          payment.status === options.status
        );
      }
      
      // Apply date range filter
      if (options.dateRange) {
        if (options.dateRange.from) {
          const fromDate = options.dateRange.from;
          filteredPayments = filteredPayments.filter(payment => 
            new Date(payment.createdAt) >= fromDate
          );
        }
        
        if (options.dateRange.to) {
          const toDate = options.dateRange.to;
          toDate.setHours(23, 59, 59, 999); // End of day
          filteredPayments = filteredPayments.filter(payment => 
            new Date(payment.createdAt) <= toDate
          );
        }
      }
      
      // Sort by date created (newest first)
      filteredPayments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      // Limit to pageSize
      const paginatedPayments = filteredPayments.slice(0, pageSize);
      
      setPayments(paginatedPayments);
      setFilterOptions(options);
      setHasMore(filteredPayments.length > pageSize);
      
      /* 
      // Uncomment this section when ready to use Firestore
      const paymentsRef = collection(db, 'payments');
      
      // Start building query
      let constraints: any[] = [orderBy('createdAt', 'desc'), limit(pageSize)];
      
      // Add status filter if provided
      if (options.status) {
        constraints.push(where('status', '==', options.status));
      }
      
      // Add date range filters if provided
      if (options.dateRange?.from) {
        const fromDate = options.dateRange.from;
        fromDate.setHours(0, 0, 0, 0); // Start of day
        constraints.push(where('createdAt', '>=', Timestamp.fromDate(fromDate)));
      }
      
      if (options.dateRange?.to) {
        const toDate = options.dateRange.to;
        toDate.setHours(23, 59, 59, 999); // End of day
        constraints.push(where('createdAt', '<=', Timestamp.fromDate(toDate)));
      }
      
      const q = query(paymentsRef, ...constraints);
      const querySnapshot = await getDocs(q);
      
      // Set last document for pagination
      if (!querySnapshot.empty) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(querySnapshot.docs.length === pageSize);
      } else {
        setLastVisible(null);
        setHasMore(false);
      }
      
      let fetchedPayments: AdminPayment[] = [];
      
      for (const docSnapshot of querySnapshot.docs) {
        const paymentData = docSnapshot.data();
        
        // Convert Firestore Timestamp to ISO string
        const createdAt = paymentData.createdAt instanceof Timestamp 
          ? paymentData.createdAt.toDate().toISOString() 
          : paymentData.createdAt;
        
        const payment: AdminPayment = {
          id: docSnapshot.id,
          stripePaymentId: paymentData.stripePaymentId,
          orderId: paymentData.orderId,
          orderNumber: paymentData.orderNumber,
          customerId: paymentData.customerId,
          customerName: paymentData.customerName,
          customerEmail: paymentData.customerEmail,
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: paymentData.status,
          paymentMethod: paymentData.paymentMethod,
          cardBrand: paymentData.cardBrand,
          cardLast4: paymentData.cardLast4,
          createdAt,
          metadata: paymentData.metadata,
          refundedAmount: paymentData.refundedAmount,
          refunds: paymentData.refunds,
          error: paymentData.error
        };
        
        // Apply client-side text search if needed
        if (options.searchTerm) {
          const searchTerm = options.searchTerm.toLowerCase();
          if (
            payment.customerName.toLowerCase().includes(searchTerm) ||
            payment.customerEmail.toLowerCase().includes(searchTerm) ||
            payment.orderNumber.toLowerCase().includes(searchTerm) ||
            payment.stripePaymentId.toLowerCase().includes(searchTerm)
          ) {
            fetchedPayments.push(payment);
          }
        } else {
          fetchedPayments.push(payment);
        }
      }
      
      setPayments(fetchedPayments);
      setFilterOptions(options);
      */
      
    } catch (err) {
      console.error('Error loading payments:', err);
      setError('Failed to load payments. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Load more payments (pagination)
  const loadMorePayments = async (pageSize: number = 50) => {
    if (!hasMore || loadingMore) return;
    
    setLoadingMore(true);
    try {
      // For development/demo, simulate loading more with mock data
      const morePayments = [...mockPayments];
      const currentLength = payments.length;
      
      // Apply the same filters as initial load
      let filteredPayments = [...morePayments];
      
      if (filterOptions.searchTerm) {
        const search = filterOptions.searchTerm.toLowerCase();
        filteredPayments = filteredPayments.filter(payment => 
          payment.customerName.toLowerCase().includes(search) ||
          payment.customerEmail.toLowerCase().includes(search) ||
          payment.orderNumber.toLowerCase().includes(search) ||
          payment.stripePaymentId.toLowerCase().includes(search)
        );
      }
      
      if (filterOptions.status) {
        filteredPayments = filteredPayments.filter(payment => 
          payment.status === filterOptions.status
        );
      }
      
      if (filterOptions.dateRange) {
        if (filterOptions.dateRange.from) {
          const fromDate = filterOptions.dateRange.from;
          filteredPayments = filteredPayments.filter(payment => 
            new Date(payment.createdAt) >= fromDate
          );
        }
        
        if (filterOptions.dateRange.to) {
          const toDate = filterOptions.dateRange.to;
          toDate.setHours(23, 59, 59, 999); // End of day
          filteredPayments = filteredPayments.filter(payment => 
            new Date(payment.createdAt) <= toDate
          );
        }
      }
      
      // Sort and paginate
      filteredPayments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      // Slice the additional payments
      const nextPagePayments = filteredPayments.slice(currentLength, currentLength + pageSize);
      
      // For demo, we'll pretend there are no more after this
      setHasMore(false);
      
      setPayments(prev => [...prev, ...nextPagePayments]);
      
      /* 
      // Uncomment for Firestore
      if (!lastVisible) {
        setHasMore(false);
        return;
      }
      
      const paymentsRef = collection(db, 'payments');
      
      // Start building query with pagination
      let constraints: any[] = [
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(pageSize)
      ];
      
      // Add filters similar to initial load
      if (filterOptions.status) {
        constraints.push(where('status', '==', filterOptions.status));
      }
      
      if (filterOptions.dateRange?.from) {
        const fromDate = filterOptions.dateRange.from;
        fromDate.setHours(0, 0, 0, 0);
        constraints.push(where('createdAt', '>=', Timestamp.fromDate(fromDate)));
      }
      
      if (filterOptions.dateRange?.to) {
        const toDate = filterOptions.dateRange.to;
        toDate.setHours(23, 59, 59, 999);
        constraints.push(where('createdAt', '<=', Timestamp.fromDate(toDate)));
      }
      
      const q = query(paymentsRef, ...constraints);
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(querySnapshot.docs.length === pageSize);
      } else {
        setLastVisible(null);
        setHasMore(false);
      }
      
      let fetchedPayments: AdminPayment[] = [];
      
      // Process results similar to initial load...
      
      setPayments(prev => [...prev, ...fetchedPayments]);
      */
      
    } catch (err) {
      console.error('Error loading more payments:', err);
      toast.error('Failed to load more payments');
    } finally {
      setLoadingMore(false);
    }
  };
  
  // Get a single payment by ID
  const getPaymentById = async (paymentId: string): Promise<AdminPayment | null> => {
    try {
      setLoading(true);
      
      // For development/demo, use mock data
      const payment = mockPayments.find(payment => payment.id === paymentId);
      if (!payment) {
        toast.error('Payment not found');
        return null;
      }
      return payment;
      
      /* 
      // Uncomment for Firestore
      const paymentRef = doc(db, 'payments', paymentId);
      const paymentDoc = await getDoc(paymentRef);
      
      if (!paymentDoc.exists()) {
        toast.error('Payment not found');
        return null;
      }
      
      const paymentData = paymentDoc.data();
      
      // Convert Firestore timestamps
      const createdAt = paymentData.createdAt instanceof Timestamp 
        ? paymentData.createdAt.toDate().toISOString() 
        : paymentData.createdAt;
        
      return {
        id: paymentDoc.id,
        stripePaymentId: paymentData.stripePaymentId,
        orderId: paymentData.orderId,
        orderNumber: paymentData.orderNumber,
        customerId: paymentData.customerId,
        customerName: paymentData.customerName,
        customerEmail: paymentData.customerEmail,
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: paymentData.status,
        paymentMethod: paymentData.paymentMethod,
        cardBrand: paymentData.cardBrand,
        cardLast4: paymentData.cardLast4,
        createdAt,
        metadata: paymentData.metadata,
        refundedAmount: paymentData.refundedAmount,
        refunds: paymentData.refunds,
        error: paymentData.error
      };
      */
      
    } catch (err) {
      console.error('Error fetching payment:', err);
      toast.error('Failed to fetch payment details');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Process refund for a payment
  const processRefund = async (
    paymentId: string, 
    amount: number, 
    reason: string
  ): Promise<boolean> => {
    setLoadingAction(true);
    try {
      // For development/demo, update mock data
      const paymentIndex = mockPayments.findIndex(p => p.id === paymentId);
      if (paymentIndex === -1) {
        toast.error('Payment not found');
        return false;
      }
      
      const payment = mockPayments[paymentIndex];
      
      // Validate refund amount
      if (amount <= 0) {
        toast.error('Refund amount must be greater than 0');
        return false;
      }
      
      if (payment.status === 'refunded') {
        toast.error('Payment has already been fully refunded');
        return false;
      }
      
      if (payment.status === 'failed' || payment.status === 'canceled') {
        toast.error('Cannot refund a failed or canceled payment');
        return false;
      }
      
      // Calculate currently refunded amount
      const currentRefundedAmount = payment.refundedAmount || 0;
      
      // Ensure the total refund doesn't exceed the payment amount
      if (currentRefundedAmount + amount > payment.amount) {
        toast.error('Refund amount exceeds the remaining amount');
        return false;
      }
      
      // Create refund object
      const refund: AdminRefund = {
        id: `re_${Date.now().toString(36)}`,
        amount,
        createdAt: new Date().toISOString(),
        reason,
        status: 'succeeded'
      };
      
      // Create new refunds array if it doesn't exist
      const updatedRefunds = payment.refunds ? [...payment.refunds, refund] : [refund];
      
      // Update refunded amount
      const updatedRefundedAmount = currentRefundedAmount + amount;
      
      // Determine new payment status
      let newStatus: PaymentTransactionStatus = payment.status;
      if (updatedRefundedAmount === payment.amount) {
        newStatus = 'refunded';
      } else if (updatedRefundedAmount > 0) {
        newStatus = 'partially_refunded';
      }
      
      // Update the payment in the mock data
      const updatedPayment = {
        ...payment,
        status: newStatus,
        refundedAmount: updatedRefundedAmount,
        refunds: updatedRefunds
      };
      
      mockPayments[paymentIndex] = updatedPayment;
      
      // Update the payment in the state
      setPayments(prev => 
        prev.map(p => p.id === paymentId ? updatedPayment : p)
      );
      
      /* 
      // Uncomment for integration with Stripe and Firestore
      
      // First, call your backend API to process the refund through Stripe
      const response = await fetch('/api/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: payment.stripePaymentId,
          amount,
          reason,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to process refund');
        return false;
      }
      
      const refundData = await response.json();
      
      // Update the payment record in Firestore
      const paymentRef = doc(db, 'payments', paymentId);
      const paymentDoc = await getDoc(paymentRef);
      
      if (!paymentDoc.exists()) {
        toast.error('Payment not found in database');
        return false;
      }
      
      const paymentData = paymentDoc.data();
      
      // Create refund object using data from Stripe
      const refund: AdminRefund = {
        id: refundData.id,
        amount: refundData.amount,
        createdAt: new Date(refundData.created * 1000).toISOString(),
        reason: refundData.reason || reason,
        status: refundData.status
      };
      
      // Create new refunds array if it doesn't exist
      const updatedRefunds = paymentData.refunds ? [...paymentData.refunds, refund] : [refund];
      
      // Update refunded amount
      const updatedRefundedAmount = (paymentData.refundedAmount || 0) + amount;
      
      // Determine new payment status
      let newStatus: PaymentTransactionStatus = paymentData.status;
      if (updatedRefundedAmount === paymentData.amount) {
        newStatus = 'refunded';
      } else if (updatedRefundedAmount > 0) {
        newStatus = 'partially_refunded';
      }
      
      // Update the payment in Firestore
      await updateDoc(paymentRef, {
        status: newStatus,
        refundedAmount: updatedRefundedAmount,
        refunds: updatedRefunds,
        updatedAt: new Date().toISOString()
      });
      
      // Update the payment in the state
      setPayments(prev => 
        prev.map(p => {
          if (p.id === paymentId) {
            return {
              ...p,
              status: newStatus,
              refundedAmount: updatedRefundedAmount,
              refunds: updatedRefunds
            };
          }
          return p;
        })
      );
      */
      
      toast.success('Refund processed successfully');
      return true;
    } catch (err) {
      console.error('Error processing refund:', err);
      toast.error('Failed to process refund');
      return false;
    } finally {
      setLoadingAction(false);
    }
  };
  
  // Initial load of payments
  useEffect(() => {
    loadPayments(filterOptions);
  }, []);
  
  // Apply new filters and reload payments
  const applyFilters = (newFilters: PaymentFilterOptions) => {
    setFilterOptions(newFilters);
    loadPayments(newFilters);
  };
  
  return {
    payments,
    loading,
    loadingMore,
    loadingAction,
    error,
    hasMore,
    filterOptions,
    loadPayments,
    loadMorePayments,
    applyFilters,
    getPaymentById,
    processRefund
  };
}; 