import React from "react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  imageUrl,
  description,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl dark:shadow-gray-900/30 transition-all duration-300 group">
      <Link to={`/products/${id}`}>
        <div className="relative h-64 overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-brand dark:group-hover:text-brand-400 transition-colors">
            {name}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
              {description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              ${price.toFixed(2)}
            </p>
            <button className="px-4 py-2 bg-brand hover:bg-brand-600 text-white rounded-full text-sm font-medium transition-colors duration-300">
              View Details
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
