import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  featured?: boolean;
  inStock: boolean;
  customizationOptions?: Array<{
    name: string;
    type: 'text' | 'select' | 'color' | 'checkbox';
    required: boolean;
    options?: string[];
  }>;
  createdAt: string;
  updatedAt: string;
}

// Fetch products with pagination and filtering
export const getProducts = async (
  pageSize = 10,
  lastVisible: QueryDocumentSnapshot<DocumentData> | null = null,
  category?: string,
  featured?: boolean,
  searchQuery?: string
) => {
  try {
    const productsRef = collection(db, 'products');
    
    // Build query with filters
    let baseQuery = query(productsRef, orderBy('createdAt', 'desc'));
    
    if (category) {
      baseQuery = query(baseQuery, where('category', '==', category));
    }
    
    if (featured !== undefined) {
      baseQuery = query(baseQuery, where('featured', '==', featured));
    }
    
    // Apply pagination
    let finalQuery = baseQuery;
    if (pageSize) {
      finalQuery = query(finalQuery, limit(pageSize));
    }
    
    if (lastVisible) {
      finalQuery = query(finalQuery, startAfter(lastVisible));
    }
    
    const querySnapshot = await getDocs(finalQuery);
    
    // Get the last document for next pagination
    const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    // Convert docs to products
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    
    // Apply search filter client-side if query exists
    // Note: For better performance, consider using a dedicated search service like Algolia
    if (searchQuery && searchQuery.trim() !== '') {
      const searchLower = searchQuery.toLowerCase();
      return {
        products: products.filter(product => 
          product.name.toLowerCase().includes(searchLower) || 
          product.description.toLowerCase().includes(searchLower)
        ),
        lastVisible: lastVisibleDoc
      };
    }
    
    return {
      products,
      lastVisible: lastVisibleDoc
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get a single product by ID
export const getProductById = async (id: string): Promise<Product> => {
  try {
    const productRef = doc(db, 'products', id);
    const productDoc = await getDoc(productRef);
    
    if (!productDoc.exists()) {
      throw new Error('Product not found');
    }
    
    return {
      id: productDoc.id,
      ...productDoc.data()
    } as Product;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

// Get featured products
export const getFeaturedProducts = async (limit = 4): Promise<Product[]> => {
  try {
    const { products } = await getProducts(limit, null, undefined, true);
    return products;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (
  category: string,
  pageSize = 10,
  lastVisible: QueryDocumentSnapshot<DocumentData> | null = null
) => {
  try {
    return await getProducts(pageSize, lastVisible, category);
  } catch (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    throw error;
  }
};

// Admin Functions

// Add a new product (admin only)
export const addProduct = async (
  productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  imageFiles?: File[]
): Promise<Product> => {
  try {
    // Add timestamps
    const timestamp = new Date().toISOString();
    const data = {
      ...productData,
      createdAt: timestamp,
      updatedAt: timestamp,
      images: []
    };
    
    // Add product to Firestore
    const docRef = await addDoc(collection(db, 'products'), data);
    
    // Upload images if provided
    const imageUrls: string[] = [];
    
    if (imageFiles && imageFiles.length > 0) {
      for (const file of imageFiles) {
        const imageRef = ref(storage, `products/${docRef.id}/${file.name}`);
        await uploadBytes(imageRef, file);
        const imageUrl = await getDownloadURL(imageRef);
        imageUrls.push(imageUrl);
      }
      
      // Update product with image URLs
      await updateDoc(doc(db, 'products', docRef.id), {
        images: imageUrls
      });
    }
    
    // Return the new product
    return {
      id: docRef.id,
      ...data,
      images: imageUrls
    };
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Update a product (admin only)
export const updateProduct = async (
  id: string,
  productData: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>,
  imageFiles?: File[],
  deleteImageUrls?: string[]
): Promise<Product> => {
  try {
    // Update timestamp
    const data = {
      ...productData,
      updatedAt: new Date().toISOString()
    };
    
    // Get current product
    const productRef = doc(db, 'products', id);
    const productDoc = await getDoc(productRef);
    
    if (!productDoc.exists()) {
      throw new Error('Product not found');
    }
    
    const currentProduct = {
      id: productDoc.id,
      ...productDoc.data()
    } as Product;
    
    // Handle image deletions
    let remainingImages = [...currentProduct.images];
    
    if (deleteImageUrls && deleteImageUrls.length > 0) {
      for (const imageUrl of deleteImageUrls) {
        try {
          // Get the path from URL and delete from storage
          const imagePath = imageUrl.split('/o/')[1].split('?')[0].replace(/%2F/g, '/');
          const imageRef = ref(storage, decodeURIComponent(imagePath));
          await deleteObject(imageRef);
          
          // Remove from remaining images
          remainingImages = remainingImages.filter(url => url !== imageUrl);
        } catch (error) {
          console.error(`Error deleting image ${imageUrl}:`, error);
        }
      }
    }
    
    // Handle new image uploads
    const newImageUrls: string[] = [];
    
    if (imageFiles && imageFiles.length > 0) {
      for (const file of imageFiles) {
        const imageRef = ref(storage, `products/${id}/${file.name}`);
        await uploadBytes(imageRef, file);
        const imageUrl = await getDownloadURL(imageRef);
        newImageUrls.push(imageUrl);
      }
    }
    
    // Update product with all updates
    const finalData = {
      ...data,
      images: [...remainingImages, ...newImageUrls]
    };
    
    await updateDoc(productRef, finalData);
    
    // Return updated product
    return {
      ...currentProduct,
      ...finalData,
      id // Ensure id is not overwritten
    };
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
};

// Delete a product (admin only)
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    // Get product images to delete
    const productRef = doc(db, 'products', id);
    const productDoc = await getDoc(productRef);
    
    if (productDoc.exists()) {
      const product = productDoc.data() as Product;
      
      // Delete images from storage
      if (product.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
          try {
            // Get the path from URL and delete from storage
            const imagePath = imageUrl.split('/o/')[1].split('?')[0].replace(/%2F/g, '/');
            const imageRef = ref(storage, decodeURIComponent(imagePath));
            await deleteObject(imageRef);
          } catch (error) {
            console.error(`Error deleting image ${imageUrl}:`, error);
          }
        }
      }
    }
    
    // Delete product document
    await deleteDoc(productRef);
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
};

export default {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getProductsByCategory,
  addProduct,
  updateProduct,
  deleteProduct
}; 