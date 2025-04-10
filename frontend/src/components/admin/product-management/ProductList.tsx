import React, { useState } from "react";
import { Product } from "../../../types";
import {
  Edit,
  Trash2,
  MoreVertical,
  Search,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface ProductListProps {
  products: Product[];
  onEdit: (productId: string) => void;
  onDelete: (productId: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category &&
        product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle delete confirmation
  const handleDeleteClick = (productId: string) => {
    setShowDeleteConfirm(productId);
  };

  const confirmDelete = async (productId: string) => {
    await onDelete(productId);
    setShowDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
            placeholder="Search products by name, description, or category"
          />
        </div>
      </div>

      {/* Product List */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300">
            {searchTerm
              ? "No products found matching your search."
              : "No products found. Create your first product!"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Product
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-md object-cover"
                          src={product.imageUrl}
                          alt={product.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {/* Strip HTML tags for preview */}
                          {product.description
                            .replace(/<[^>]*>?/gm, "")
                            .substring(0, 50)}
                          ...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {product.category || "Uncategorized"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      ${product.price.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.available !== false ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200">
                        <XCircle className="mr-1 h-3 w-3" />
                        Hidden
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center space-x-2">
                      <button
                        onClick={() =>
                          window.open(`/products/${product.id}`, "_blank")
                        }
                        className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
                        title="View Product"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onEdit(product.id)}
                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Edit Product"
                      >
                        <Edit className="h-5 w-5" />
                      </button>

                      {showDeleteConfirm === product.id ? (
                        <div className="flex items-center ml-3 bg-red-50 dark:bg-red-900/30 p-1 rounded">
                          <button
                            onClick={() => confirmDelete(product.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-xs font-medium mx-1"
                            title="Confirm Delete"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={cancelDelete}
                            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 text-xs font-medium mx-1"
                            title="Cancel"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleDeleteClick(product.id)}
                          className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete Product"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductList;
