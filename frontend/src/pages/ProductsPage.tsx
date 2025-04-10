import React, { useState } from "react";
import ProductCard from "../components/products/ProductCard";
import { Search } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const ProductsPage: React.FC = () => {
  const { products } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Our Products
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our collection of handcrafted hats with unique styles and
            fonts.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-400 dark:focus:ring-brand-600 focus:border-transparent dark:text-white transition-all duration-300"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery
                ? "No products found matching your search."
                : "No products available at the moment."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-brand hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 font-medium transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
                description={product.description}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
