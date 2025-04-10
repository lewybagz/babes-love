import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product, ProductCustomization } from "../../types";
import { ChevronLeft, Minus, Plus, ShoppingCart, Info } from "lucide-react";
import { FIXED_TAX_RATE } from "../../hooks/useTaxRate";

interface ProductDetailProps {
  product: Product;
  addToCartHandler: (
    productId: string,
    quantity: number,
    customizations: ProductCustomization
  ) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  addToCartHandler,
}) => {
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    const customizationData: ProductCustomization = {
      font: "",
      style: "",
      quantity: quantity,
    };
    addToCartHandler(product.id, quantity, customizationData);
  };

  const { name, price, description, images } = product;

  // Calculate prices for preview
  const subtotal = price * quantity;
  const totalWithTax = subtotal * (1 + FIXED_TAX_RATE);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 sm:p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand dark:hover:text-brand-400 transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </button>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          <div className="mb-8 lg:mb-0">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 mb-4">
              <img
                src={images[selectedImage]}
                alt={`${name} - view ${selectedImage + 1}`}
                className="w-full h-full object-center object-cover transition-opacity duration-300 ease-in-out"
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border-2 p-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-brand-500 ${
                    selectedImage === index
                      ? "border-brand dark:border-brand-400 ring-2 ring-brand-300 dark:ring-brand-500"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`${name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover rounded-sm"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {name}
            </h1>

            <div className="mt-3">
              <p className="text-3xl text-gray-900 dark:text-white">
                ${price.toFixed(2)}
              </p>
              {/* Price Preview (Conditional) */}
              {quantity > 1 && (
                <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    Total: ${totalWithTax.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <Info size={12} className="mr-1" />
                    Tax included
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div
                className="space-y-6 text-base text-gray-700 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>

            <form className="mt-6">
              <div className="mb-8">
                <label
                  htmlFor="quantity-selector"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Quantity
                </label>
                <div
                  id="quantity-selector"
                  className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md w-fit shadow-sm"
                >
                  <button
                    type="button"
                    className="px-3 py-2 rounded-l-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span
                    className="px-4 py-2 text-center font-medium text-gray-900 dark:text-white border-l border-r border-gray-300 dark:border-gray-600"
                    aria-live="polite"
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="px-3 py-2 rounded-r-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-10 flex">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full max-w-xs flex items-center justify-center py-3 px-8 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800 focus:ring-brand-500 transition-colors duration-200 disabled:opacity-70"
                >
                  <ShoppingCart
                    className="-ml-1 mr-2 h-5 w-5"
                    aria-hidden="true"
                  />
                  Add to Cart
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
