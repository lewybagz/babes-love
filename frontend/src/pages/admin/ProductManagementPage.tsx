import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminProducts } from "../../hooks/useAdminProducts";
import ProductForm from "../../components/admin/product-management/ProductForm";
import ProductList from "../../components/admin/product-management/ProductList";
import { ChevronDown, ChevronUp, Plus, Settings } from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";

const ProductManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { products, loading, error, deleteProduct } = useAdminProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const handleAddNewClick = () => {
    setEditingProductId(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditProduct = (productId: string) => {
    setEditingProductId(productId);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProductId(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProductId(null);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Title and Add Product Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Product Inventory
          </h1>
          <button
            onClick={handleAddNewClick}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </button>
        </div>

        {/* Product Form Section */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {editingProductId ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showForm ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="p-6">
              <ProductForm
                productId={editingProductId}
                onSuccess={handleFormSuccess}
                onCancel={handleFormClose}
              />
            </div>
          </div>
        )}

        {/* Product List */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Products
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {products.length} items
            </div>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="spinner"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Loading products...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500 dark:text-red-400">
                {error}
              </div>
            ) : (
              <ProductList
                products={products}
                onEdit={handleEditProduct}
                onDelete={deleteProduct}
              />
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductManagementPage;
