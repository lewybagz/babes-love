import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { Product } from '../types';
import { AdminProductFormData, ProductTemplate } from '../types/admin';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

// Mock product data for development purposes
const mockProducts: Product[] = [
  {
    id: 'mock-product-1',
    name: 'Custom Embroidered Baseball Cap',
    price: 29.99,
    description: `<p>Our premium embroidered baseball caps are perfect for adding your personalized touch. Made from high-quality cotton twill with a structured 6-panel design, these caps provide both style and comfort.</p>
    <p>Features:</p>
    <ul>
      <li>100% cotton twill construction</li>
      <li>Adjustable snapback closure</li>
      <li>Structured 6-panel design</li>
      <li>Pre-curved visor</li>
      <li>Available in multiple colors</li>
      <li>Custom embroidery up to 5000 stitches</li>
    </ul>`,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-cap-main.jpg?alt=media',
    images: [
      'https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-cap-main.jpg?alt=media',
      'https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-cap-angle.jpg?alt=media',
      'https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-cap-back.jpg?alt=media'
    ],
    available: true,
    customizationOptions: {
      fonts: true,
      styles: true
    },
    category: 'hats'
  },
  {
    id: 'mock-product-2',
    name: 'Personalized T-Shirt',
    price: 24.99,
    description: `<p>Express yourself with our premium personalized t-shirts. Made from soft, breathable cotton, these shirts are perfect for everyday wear.</p>
    <p>Features:</p>
    <ul>
      <li>100% ring-spun cotton</li>
      <li>Pre-shrunk fabric</li>
      <li>Seamless collar</li>
      <li>Double-needle stitched sleeves and hem</li>
      <li>Available in multiple colors and sizes</li>
      <li>Custom printing with vibrant, fade-resistant inks</li>
    </ul>`,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-tshirt-main.jpg?alt=media',
    images: [
      'https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-tshirt-main.jpg?alt=media',
      'https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-tshirt-back.jpg?alt=media',
      'https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-tshirt-detail.jpg?alt=media'
    ],
    available: true,
    customizationOptions: {
      fonts: true,
      styles: true
    },
    category: 'apparel'
  },
  {
    id: 'mock-product-3',
    name: 'Custom Embroidered Hoodie',
    price: 49.99,
    description: `<p>Stay warm and stylish with our premium embroidered hoodies. Crafted from a soft cotton-polyester blend, these hoodies offer comfort and durability.</p>
    <p>Features:</p>
    <ul>
      <li>50% cotton, 50% polyester blend</li>
      <li>Pill-resistant air jet yarn</li>
      <li>Double-lined hood with matching drawstring</li>
      <li>Front pouch pocket</li>
      <li>Ribbed cuffs and waistband</li>
      <li>Custom embroidery up to 7000 stitches</li>
    </ul>`,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-hoodie-main.jpg?alt=media',
    images: [
      'https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-hoodie-main.jpg?alt=media',
      'https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-hoodie-side.jpg?alt=media',
      'https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-hoodie-back.jpg?alt=media'
    ],
    available: true,
    customizationOptions: {
      fonts: true,
      styles: true
    },
    category: 'apparel'
  },
  {
    id: 'mock-product-4',
    name: 'Custom Tote Bag',
    price: 19.99,
    description: `<p>Carry your essentials in style with our durable custom tote bags. Perfect for shopping, beach trips, or everyday use.</p>
    <p>Features:</p>
    <ul>
      <li>100% cotton canvas</li>
      <li>Reinforced handles</li>
      <li>Interior pocket</li>
      <li>14" x 16" size with 4" gusset</li>
      <li>Available in multiple colors</li>
      <li>Custom printing or embroidery available</li>
    </ul>`,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-tote-main.jpg?alt=media',
    images: [
      'https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-tote-main.jpg?alt=media',
      'https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-tote-inside.jpg?alt=media',
      'https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-tote-folded.jpg?alt=media'
    ],
    available: true,
    customizationOptions: {
      fonts: true,
      styles: true
    },
    category: 'accessories'
  },
  {
    id: 'mock-product-5',
    name: 'Personalized Mug',
    price: 14.99,
    description: `<p>Start your day right with our personalized ceramic mugs. Perfect for coffee, tea, or hot chocolate.</p>
    <p>Features:</p>
    <ul>
      <li>11oz ceramic construction</li>
      <li>Dishwasher and microwave safe</li>
      <li>Glossy finish</li>
      <li>Comfortable C-handle</li>
      <li>Custom printing with vibrant, fade-resistant inks</li>
      <li>Available in white, black, and colored interior options</li>
    </ul>`,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-mug-main.jpg?alt=media',
    images: [
      'https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-mug-main.jpg?alt=media',
      'https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-mug-angle.jpg?alt=media',
      'https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-mug-boxed.jpg?alt=media'
    ],
    available: true,
    customizationOptions: {
      fonts: true,
      styles: true
    },
    category: 'accessories'
  },
  {
    id: 'mock-product-6',
    name: 'Custom Phone Case',
    price: 24.99,
    description: `<p>Protect your phone with style using our custom phone cases. Durable, slim-fitting, and designed for everyday use.</p>
    <p>Features:</p>
    <ul>
      <li>Impact-resistant polycarbonate shell</li>
      <li>Slim, lightweight design</li>
      <li>Precise cutouts for ports and buttons</li>
      <li>Raised edges for screen protection</li>
      <li>Available for iPhone and Samsung Galaxy models</li>
      <li>Custom printing with scratch-resistant, UV-cured ink</li>
    </ul>`,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-phonecase-main.jpg?alt=media',
    images: [
      'https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-phonecase-main.jpg?alt=media',
      'https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-phonecase-side.jpg?alt=media',
      'https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-phonecase-angle.jpg?alt=media'
    ],
    available: true,
    customizationOptions: {
      fonts: true,
      styles: true
    },
    category: 'accessories'
  }
];

// Mock product templates
const mockTemplates: ProductTemplate[] = [
  {
    id: 'mock-template-1',
    name: 'Standard Apparel Template',
    price: 24.99,
    description: 'Base template for apparel products with standard customization options.',
    available: true,
    customizationOptions: {
      fonts: true,
      styles: true
    },
    category: 'apparel'
  },
  {
    id: 'mock-template-2',
    name: 'Headwear Template',
    price: 29.99,
    description: 'Template for hats and headwear with embroidery options.',
    available: true,
    customizationOptions: {
      fonts: true,
      styles: true
    },
    category: 'hats'
  },
  {
    id: 'mock-template-3',
    name: 'Accessories Template',
    price: 19.99,
    description: 'Template for small accessories with custom printing.',
    available: true,
    customizationOptions: {
      fonts: true,
      styles: true
    },
    category: 'accessories'
  }
];

export const useAdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [templates, setTemplates] = useState<ProductTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        // Check if we should use mock data for development
        const useMockData = process.env.NODE_ENV === 'development';
        
        if (useMockData) {
          // Use mock data in development
          console.log('Using mock product data for development');
          setProducts(mockProducts);
          setTemplates(mockTemplates);
          setError(null);
          setLoading(false);
          return;
        }
        
        // Otherwise, load from Firestore
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(productsData);
        
        // Load templates
        const templatesSnapshot = await getDocs(collection(db, 'productTemplates'));
        const templatesData = templatesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ProductTemplate[];
        setTemplates(templatesData);
        
        setError(null);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please try again.');
        toast.error('Failed to load products');
        
        // Fallback to mock data if there's an error loading from Firestore
        if (process.env.NODE_ENV === 'development') {
          console.log('Falling back to mock product data');
          setProducts(mockProducts);
          setTemplates(mockTemplates);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Upload product images and return URLs
  const uploadProductImages = async (files: File[]): Promise<string[]> => {
    try {
      const uploadPromises = files.map(async (file) => {
        const fileId = uuidv4();
        const fileExtension = file.name.split('.').pop();
        const fileName = `${fileId}.${fileExtension}`;
        const storageRef = ref(storage, `products/${fileName}`);
        
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
      });

      return Promise.all(uploadPromises);
    } catch (err) {
      console.error('Error uploading images:', err);
      throw new Error('Failed to upload product images');
    }
  };

  // Add new product
  const addProduct = async (productData: AdminProductFormData): Promise<string> => {
    try {
      setLoading(true);
      
      // For development mode with mock data, just add to local state
      if (process.env.NODE_ENV === 'development') {
        // Create a mock product ID
        const mockId = `mock-product-${Date.now()}`;
        
        // Create a mock image URL (in a real scenario, these would be uploaded)
        const mockImageUrls = productData.imageFiles.length > 0 
          ? ['https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-new-product.jpg?alt=media']
          : [];
          
        // Create new mock product
        const newProduct: Product = {
          id: mockId,
          name: productData.name,
          price: Number(productData.price),
          description: productData.description,
          imageUrl: mockImageUrls[0] || 'https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-new-product.jpg?alt=media',
          images: mockImageUrls.length > 0 ? mockImageUrls : ['https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-new-product.jpg?alt=media'],
          available: productData.available,
          customizationOptions: productData.customizationOptions,
          category: productData.category,
        };
        
        // Update local state
        setProducts(prev => [...prev, newProduct]);
        
        toast.success('Product added successfully (mock)');
        return mockId;
      }
      
      // For production, use Firestore
      // Upload images
      const imageUrls = await uploadProductImages(productData.imageFiles);
      
      if (!imageUrls.length) {
        throw new Error('No images were uploaded');
      }
      
      // Prepare product data
      const newProduct = {
        name: productData.name,
        price: Number(productData.price),
        description: productData.description,
        imageUrl: imageUrls[0], // First image is the main image
        images: imageUrls,
        available: productData.available,
        customizationOptions: productData.customizationOptions,
        category: productData.category,
        createdAt: new Date().toISOString(),
      };
      
      // Add to Firestore
      const docRef = await addDoc(collection(db, 'products'), newProduct);
      
      // Update local state
      setProducts(prev => [
        ...prev, 
        { ...newProduct, id: docRef.id } as Product
      ]);
      
      toast.success('Product added successfully');
      return docRef.id;
    } catch (err) {
      console.error('Error adding product:', err);
      toast.error('Failed to add product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update existing product
  const updateProduct = async (productId: string, productData: AdminProductFormData): Promise<void> => {
    try {
      setLoading(true);
      
      // For development mode with mock data, just update local state
      if (process.env.NODE_ENV === 'development' && productId.startsWith('mock-')) {
        // Get the current product
        const currentProduct = products.find(p => p.id === productId);
        
        if (!currentProduct) {
          throw new Error('Product not found');
        }
        
        // Create a mock image URL for any new files
        let updatedImages = [...currentProduct.images];
        if (productData.imageFiles && productData.imageFiles.length > 0) {
          // Add a mock image URL for each new file
          const mockNewImages = Array(productData.imageFiles.length).fill('https://firebasestorage.googleapis.com/v0/b/babeslove-e1632.appspot.com/o/products/mock-updated-image.jpg?alt=media');
          updatedImages = [...updatedImages, ...mockNewImages];
        }
        
        // Update the product in local state
        const updatedProduct: Product = {
          ...currentProduct,
          name: productData.name,
          price: Number(productData.price),
          description: productData.description,
          imageUrl: updatedImages[0],
          images: updatedImages,
          available: productData.available,
          customizationOptions: productData.customizationOptions,
          category: productData.category,
        };
        
        setProducts(prev => 
          prev.map(p => p.id === productId ? updatedProduct : p)
        );
        
        toast.success('Product updated successfully (mock)');
        return;
      }
      
      // For production, use Firestore
      const productRef = doc(db, 'products', productId);
      const productDoc = await getDoc(productRef);
      
      if (!productDoc.exists()) {
        throw new Error('Product not found');
      }
      
      const currentProduct = productDoc.data() as Product;
      let imageUrls = currentProduct.images || [];
      
      // Upload new images if provided
      if (productData.imageFiles && productData.imageFiles.length > 0) {
        const newImageUrls = await uploadProductImages(productData.imageFiles);
        imageUrls = [...imageUrls, ...newImageUrls];
      }
      
      // Update product data
      const updatedProduct = {
        name: productData.name,
        price: Number(productData.price),
        description: productData.description,
        imageUrl: imageUrls[0], // First image is main image
        images: imageUrls,
        available: productData.available,
        customizationOptions: productData.customizationOptions,
        category: productData.category,
        updatedAt: new Date().toISOString(),
      };
      
      await updateDoc(productRef, updatedProduct);
      
      // Update local state
      setProducts(prev => 
        prev.map(p => p.id === productId ? { ...p, ...updatedProduct } : p)
      );
      
      toast.success('Product updated successfully');
    } catch (err) {
      console.error('Error updating product:', err);
      toast.error('Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (productId: string): Promise<void> => {
    try {
      setLoading(true);
      
      // For development mode with mock data, just update local state
      if (process.env.NODE_ENV === 'development' && productId.startsWith('mock-')) {
        // Remove from local state
        setProducts(prev => prev.filter(p => p.id !== productId));
        
        toast.success('Product deleted successfully (mock)');
        return;
      }
      
      // For production, use Firestore
      // Get product to delete its images
      const productRef = doc(db, 'products', productId);
      const productDoc = await getDoc(productRef);
      
      if (!productDoc.exists()) {
        throw new Error('Product not found');
      }
      
      const product = productDoc.data() as Product;
      
      // Delete images from storage
      if (product.images && product.images.length) {
        const deletePromises = product.images.map(async (imageUrl) => {
          try {
            // Get the path from URL and delete from storage
            const imagePath = imageUrl.split('/o/')[1].split('?')[0].replace(/%2F/g, '/');
            const imageRef = ref(storage, decodeURIComponent(imagePath));
            await deleteObject(imageRef);
          } catch (err) {
            console.error(`Failed to delete image: ${imageUrl}`, err);
          }
        });
        
        await Promise.all(deletePromises);
      }
      
      // Delete product document
      await deleteDoc(productRef);
      
      // Update local state
      setProducts(prev => prev.filter(p => p.id !== productId));
      
      toast.success('Product deleted successfully');
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('Failed to delete product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Save product template
  const saveTemplate = async (templateData: Omit<ProductTemplate, 'id'>): Promise<string> => {
    try {
      // For development mode with mock data, just update local state
      if (process.env.NODE_ENV === 'development') {
        const mockId = `mock-template-${Date.now()}`;
        
        const newTemplate: ProductTemplate = {
          id: mockId,
          ...templateData
        };
        
        setTemplates(prev => [...prev, newTemplate]);
        
        toast.success('Template saved successfully (mock)');
        return mockId;
      }
      
      // For production, use Firestore
      const docRef = await addDoc(collection(db, 'productTemplates'), {
        ...templateData,
        createdAt: new Date().toISOString()
      });
      
      const newTemplate = {
        id: docRef.id,
        ...templateData
      } as ProductTemplate;
      
      setTemplates(prev => [...prev, newTemplate]);
      
      toast.success('Template saved successfully');
      return docRef.id;
    } catch (err) {
      console.error('Error saving template:', err);
      toast.error('Failed to save template');
      throw err;
    }
  };

  // Load product from template
  const loadFromTemplate = async (templateId: string): Promise<Omit<AdminProductFormData, 'imageFiles'>> => {
    try {
      // For development mode with mock data, find in local state
      if (process.env.NODE_ENV === 'development' && templateId.startsWith('mock-')) {
        const template = templates.find(t => t.id === templateId);
        
        if (!template) {
          throw new Error('Template not found');
        }
        
        return {
          name: '',  // Don't copy name, as it should be unique
          price: template.price,
          description: template.description,
          available: template.available,
          customizationOptions: template.customizationOptions,
          category: template.category as any,
          templateId: template.id
        };
      }
      
      // For production, use Firestore
      const templateRef = doc(db, 'productTemplates', templateId);
      const templateDoc = await getDoc(templateRef);
      
      if (!templateDoc.exists()) {
        throw new Error('Template not found');
      }
      
      const template = templateDoc.data() as ProductTemplate;
      
      return {
        name: '',  // Don't copy name, as it should be unique
        price: template.price,
        description: template.description,
        available: template.available,
        customizationOptions: template.customizationOptions,
        category: template.category as any,
        templateId: template.id
      };
    } catch (err) {
      console.error('Error loading from template:', err);
      toast.error('Failed to load template');
      throw err;
    }
  };

  return {
    products,
    templates,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    saveTemplate,
    loadFromTemplate
  };
}; 