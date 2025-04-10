import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  limit,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  where,
  startAfter,
  Timestamp,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { AdminCustomer, CustomerFilterOptions } from '../types/admin';
import toast from 'react-hot-toast';

// Mock customer data for development
const mockCustomers: AdminCustomer[] = [
  {
    id: "cust78901",
    email: "jennifer.smith@example.com",
    displayName: "Jennifer Smith",
    firstName: "Jennifer",
    lastName: "Smith",
    phoneNumber: "206-555-1234",
    dateCreated: new Date(Date.now() - 30 * 86400000).toISOString(), // 30 days ago
    lastLogin: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
    orderCount: 3,
    totalSpent: 248.75,
    lastOrderDate: new Date(Date.now() - 1 * 86400000).toISOString(), // 1 day ago
    addresses: [
      {
        id: "addr1",
        isPrimary: true,
        addressLine1: "123 Main St, Apt 4B",
        city: "Seattle",
        state: "WA",
        zipCode: "98101",
        country: "US"
      }
    ],
    isVerified: true
  },
  {
    id: "cust12345",
    email: "mike.j@example.com",
    displayName: "Michael Johnson",
    firstName: "Michael",
    lastName: "Johnson",
    phoneNumber: "503-555-7890",
    dateCreated: new Date(Date.now() - 60 * 86400000).toISOString(), // 60 days ago
    lastLogin: new Date(Date.now() - 5 * 86400000).toISOString(), // 5 days ago
    orderCount: 1,
    totalSpent: 54.98,
    lastOrderDate: new Date(Date.now() - 7 * 86400000).toISOString(), // 7 days ago
    addresses: [
      {
        id: "addr2",
        isPrimary: true,
        addressLine1: "456 Oak Avenue",
        city: "Portland",
        state: "OR",
        zipCode: "97201",
        country: "US"
      }
    ],
    isVerified: true
  },
  {
    id: "cust45678",
    email: "emily.r@example.com",
    displayName: "Emily Rodriguez",
    firstName: "Emily",
    lastName: "Rodriguez",
    phoneNumber: "415-555-9876",
    dateCreated: new Date(Date.now() - 45 * 86400000).toISOString(), // 45 days ago
    lastLogin: new Date(Date.now() - 1 * 86400000).toISOString(), // 1 day ago
    orderCount: 5,
    totalSpent: 342.50,
    lastOrderDate: new Date(Date.now() - 21 * 86400000).toISOString(), // 21 days ago
    addresses: [
      {
        id: "addr3",
        isPrimary: true,
        addressLine1: "789 Pine St, Suite 300",
        city: "San Francisco",
        state: "CA",
        zipCode: "94103",
        country: "US"
      }
    ],
    isVerified: true
  },
  {
    id: "cust98765",
    email: "david.wong@example.com",
    displayName: "David Wong",
    firstName: "David",
    lastName: "Wong",
    phoneNumber: "312-555-3456",
    dateCreated: new Date(Date.now() - 15 * 86400000).toISOString(), // 15 days ago
    lastLogin: new Date(Date.now() - 6 * 86400000).toISOString(), // 6 days ago
    orderCount: 0,
    totalSpent: 0,
    addresses: [],
    isVerified: true
  },
  {
    id: "cust24680",
    email: "sarah.miller@example.com",
    displayName: "Sarah Miller",
    firstName: "Sarah",
    lastName: "Miller",
    phoneNumber: "650-555-1122",
    dateCreated: new Date(Date.now() - 10 * 86400000).toISOString(), // 10 days ago
    lastLogin: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
    orderCount: 2,
    totalSpent: 148.75,
    lastOrderDate: new Date(Date.now() - 4 * 86400000).toISOString(), // 4 days ago
    addresses: [
      {
        id: "addr4",
        isPrimary: true,
        addressLine1: "555 Market St",
        city: "San Jose",
        state: "CA",
        zipCode: "95113",
        country: "US"
      }
    ],
    isVerified: true
  },
  {
    id: "cust13579",
    email: "alex.thompson@example.com",
    displayName: "Alex Thompson",
    dateCreated: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
    orderCount: 0,
    totalSpent: 0,
    isVerified: false
  }
];

export const useAdminCustomers = () => {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<CustomerFilterOptions>({});
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Load customers with optional filters
  const loadCustomers = async (options: CustomerFilterOptions = {}, pageSize: number = 50) => {
    setLoading(true);
    setError(null);
    try {
      // For development/demo, use mock data
      let filteredCustomers = [...mockCustomers];
      
      // Apply search filter
      if (options.searchTerm) {
        const search = options.searchTerm.toLowerCase();
        filteredCustomers = filteredCustomers.filter(customer => 
          customer.email.toLowerCase().includes(search) ||
          customer.displayName.toLowerCase().includes(search) ||
          customer.firstName?.toLowerCase().includes(search) ||
          customer.lastName?.toLowerCase().includes(search) ||
          customer.phoneNumber?.includes(search)
        );
      }
      
      // Filter by order status
      if (options.hasOrders !== undefined) {
        filteredCustomers = filteredCustomers.filter(customer => 
          options.hasOrders ? customer.orderCount > 0 : customer.orderCount === 0
        );
      }
      
      // Apply date range filter
      if (options.dateRange) {
        if (options.dateRange.from) {
          const fromDate = options.dateRange.from;
          filteredCustomers = filteredCustomers.filter(customer => 
            new Date(customer.dateCreated) >= fromDate
          );
        }
        
        if (options.dateRange.to) {
          const toDate = options.dateRange.to;
          toDate.setHours(23, 59, 59, 999); // End of day
          filteredCustomers = filteredCustomers.filter(customer => 
            new Date(customer.dateCreated) <= toDate
          );
        }
      }
      
      // Sort by date created (newest first)
      filteredCustomers.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
      
      // Limit to pageSize
      const paginatedCustomers = filteredCustomers.slice(0, pageSize);
      
      setCustomers(paginatedCustomers);
      setFilterOptions(options);
      setHasMore(filteredCustomers.length > pageSize);
      
      /* 
      // Uncomment this section when ready to use Firestore
      const customersRef = collection(db, 'users');
      
      // Start building query
      let constraints: any[] = [orderBy('createdAt', 'desc'), limit(pageSize)];
      
      // Add search filter using compound queries if needed
      if (options.hasOrders === true) {
        constraints.push(where('orderCount', '>', 0));
      } else if (options.hasOrders === false) {
        constraints.push(where('orderCount', '==', 0));
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
      
      const q = query(customersRef, ...constraints);
      const querySnapshot = await getDocs(q);
      
      // Set last document for pagination
      if (!querySnapshot.empty) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(querySnapshot.docs.length === pageSize);
      } else {
        setLastVisible(null);
        setHasMore(false);
      }
      
      let fetchedCustomers: AdminCustomer[] = [];
      
      for (const docSnapshot of querySnapshot.docs) {
        const userData = docSnapshot.data();
        
        // Convert Firestore Timestamp to ISO string
        const dateCreated = userData.createdAt instanceof Timestamp 
          ? userData.createdAt.toDate().toISOString() 
          : userData.createdAt || new Date().toISOString();
        
        const lastLogin = userData.lastLogin instanceof Timestamp 
          ? userData.lastLogin.toDate().toISOString() 
          : userData.lastLogin;
        
        const lastOrderDate = userData.lastOrderDate instanceof Timestamp 
          ? userData.lastOrderDate.toDate().toISOString() 
          : userData.lastOrderDate;
        
        const customer: AdminCustomer = {
          id: docSnapshot.id,
          email: userData.email || '',
          displayName: userData.displayName || '',
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          phoneNumber: userData.phoneNumber || '',
          dateCreated,
          lastLogin,
          orderCount: userData.orderCount || 0,
          totalSpent: userData.totalSpent || 0,
          lastOrderDate,
          addresses: userData.addresses || [],
          notes: userData.notes || '',
          isVerified: userData.emailVerified || false
        };
        
        // Apply client-side text search if needed
        if (options.searchTerm) {
          const searchTerm = options.searchTerm.toLowerCase();
          if (
            customer.email.toLowerCase().includes(searchTerm) ||
            customer.displayName.toLowerCase().includes(searchTerm) ||
            customer.firstName.toLowerCase().includes(searchTerm) ||
            customer.lastName.toLowerCase().includes(searchTerm) ||
            customer.phoneNumber.includes(searchTerm)
          ) {
            fetchedCustomers.push(customer);
          }
        } else {
          fetchedCustomers.push(customer);
        }
      }
      
      setCustomers(fetchedCustomers);
      setFilterOptions(options);
      */
      
    } catch (err) {
      console.error('Error loading customers:', err);
      setError('Failed to load customers. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Load more customers (pagination)
  const loadMoreCustomers = async (pageSize: number = 50) => {
    if (!hasMore || loadingMore) return;
    
    setLoadingMore(true);
    try {
      // For development/demo, simulate loading more with mock data
      const moreCustomers = [...mockCustomers];
      const currentLength = customers.length;
      
      // Apply the same filters as initial load
      let filteredCustomers = [...moreCustomers];
      
      if (filterOptions.searchTerm) {
        const search = filterOptions.searchTerm.toLowerCase();
        filteredCustomers = filteredCustomers.filter(customer => 
          customer.email.toLowerCase().includes(search) ||
          customer.displayName.toLowerCase().includes(search) ||
          customer.firstName?.toLowerCase().includes(search) ||
          customer.lastName?.toLowerCase().includes(search) ||
          customer.phoneNumber?.includes(search)
        );
      }
      
      if (filterOptions.hasOrders !== undefined) {
        filteredCustomers = filteredCustomers.filter(customer => 
          filterOptions.hasOrders ? customer.orderCount > 0 : customer.orderCount === 0
        );
      }
      
      if (filterOptions.dateRange) {
        if (filterOptions.dateRange.from) {
          const fromDate = filterOptions.dateRange.from;
          filteredCustomers = filteredCustomers.filter(customer => 
            new Date(customer.dateCreated) >= fromDate
          );
        }
        
        if (filterOptions.dateRange.to) {
          const toDate = filterOptions.dateRange.to;
          toDate.setHours(23, 59, 59, 999); // End of day
          filteredCustomers = filteredCustomers.filter(customer => 
            new Date(customer.dateCreated) <= toDate
          );
        }
      }
      
      // Sort and paginate
      filteredCustomers.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
      
      // Slice the additional customers
      const nextPageCustomers = filteredCustomers.slice(currentLength, currentLength + pageSize);
      
      // For demo, we'll pretend there are no more after this
      setHasMore(false);
      
      setCustomers(prev => [...prev, ...nextPageCustomers]);
      
      /* 
      // Uncomment for Firestore
      if (!lastVisible) {
        setHasMore(false);
        return;
      }
      
      const customersRef = collection(db, 'users');
      
      // Start building query with pagination
      let constraints: any[] = [
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(pageSize)
      ];
      
      // Add filters similar to initial load
      if (filterOptions.hasOrders === true) {
        constraints.push(where('orderCount', '>', 0));
      } else if (filterOptions.hasOrders === false) {
        constraints.push(where('orderCount', '==', 0));
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
      
      const q = query(customersRef, ...constraints);
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(querySnapshot.docs.length === pageSize);
      } else {
        setLastVisible(null);
        setHasMore(false);
      }
      
      let fetchedCustomers: AdminCustomer[] = [];
      
      // Process results similar to initial load...
      
      setCustomers(prev => [...prev, ...fetchedCustomers]);
      */
      
    } catch (err) {
      console.error('Error loading more customers:', err);
      toast.error('Failed to load more customers');
    } finally {
      setLoadingMore(false);
    }
  };
  
  // Add notes to customer
  const addCustomerNotes = async (customerId: string, notes: string): Promise<void> => {
    try {
      setLoading(true);
      
      // For development/demo, update mock data
      setCustomers(prevCustomers => 
        prevCustomers.map(customer => {
          if (customer.id === customerId) {
            const updatedNotes = customer.notes 
              ? `${customer.notes}\n\n${notes}`
              : notes;
            return { 
              ...customer, 
              notes: updatedNotes
            };
          }
          return customer;
        })
      );
      
      /* 
      // Uncomment for Firestore
      const customerRef = doc(db, 'users', customerId);
      
      // First get existing notes
      const customerDoc = await getDoc(customerRef);
      const existingNotes = customerDoc.data()?.notes || '';
      
      // Append new note
      const updatedNotes = existingNotes 
        ? `${existingNotes}\n\n${notes}`
        : notes;
        
      await updateDoc(customerRef, { 
        notes: updatedNotes,
        updatedAt: new Date().toISOString()
      });
      
      // Update local state
      setCustomers(prevCustomers => 
        prevCustomers.map(customer => 
          customer.id === customerId 
            ? { ...customer, notes: updatedNotes } 
            : customer
        )
      );
      */
      
      toast.success('Customer notes updated');
    } catch (err) {
      console.error('Error updating customer notes:', err);
      toast.error('Failed to update customer notes');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Get a single customer by ID
  const getCustomerById = async (customerId: string): Promise<AdminCustomer | null> => {
    try {
      setLoading(true);
      
      // For development/demo, use mock data
      const customer = mockCustomers.find(customer => customer.id === customerId);
      if (!customer) {
        toast.error('Customer not found');
        return null;
      }
      return customer;
      
      /* 
      // Uncomment for Firestore
      const customerRef = doc(db, 'users', customerId);
      const customerDoc = await getDoc(customerRef);
      
      if (!customerDoc.exists()) {
        toast.error('Customer not found');
        return null;
      }
      
      const userData = customerDoc.data();
      
      // Convert Firestore timestamps
      const dateCreated = userData.createdAt instanceof Timestamp 
        ? userData.createdAt.toDate().toISOString() 
        : userData.createdAt || new Date().toISOString();
      
      const lastLogin = userData.lastLogin instanceof Timestamp 
        ? userData.lastLogin.toDate().toISOString() 
        : userData.lastLogin;
      
      const lastOrderDate = userData.lastOrderDate instanceof Timestamp 
        ? userData.lastOrderDate.toDate().toISOString() 
        : userData.lastOrderDate;
      
      return {
        id: customerDoc.id,
        email: userData.email || '',
        displayName: userData.displayName || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phoneNumber: userData.phoneNumber || '',
        dateCreated,
        lastLogin,
        orderCount: userData.orderCount || 0,
        totalSpent: userData.totalSpent || 0,
        lastOrderDate,
        addresses: userData.addresses || [],
        notes: userData.notes || '',
        isVerified: userData.emailVerified || false
      };
      */
      
    } catch (err) {
      console.error('Error fetching customer:', err);
      toast.error('Failed to fetch customer details');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Initial load of customers
  useEffect(() => {
    loadCustomers(filterOptions);
  }, []);
  
  // Apply new filters and reload customers
  const applyFilters = (newFilters: CustomerFilterOptions) => {
    setFilterOptions(newFilters);
    loadCustomers(newFilters);
  };
  
  return {
    customers,
    loading,
    loadingMore,
    error,
    hasMore,
    filterOptions,
    loadCustomers,
    loadMoreCustomers,
    applyFilters,
    addCustomerNotes,
    getCustomerById
  };
}; 