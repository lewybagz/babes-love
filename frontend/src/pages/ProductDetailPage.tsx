import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CustomizationOption, ProductCustomization, Product } from "../types";
import { useAppContext } from "../context/AppContext";
import ProductDetail from "../components/products/ProductDetail";
import CustomizationPanel from "../components/products/CustomizationPanel";

// Mock font and style options (aligned with CustomizationOption type)
const FONT_OPTIONS: CustomizationOption[] = [
  {
    id: "font-1",
    type: "font",
    value: "font-arial",
    label: "Arial",
    name: "Arial",
    preview: "Arial, sans-serif",
  },
  {
    id: "font-2",
    type: "font",
    value: "font-georgia",
    label: "Georgia",
    name: "Georgia",
    preview: "Georgia, serif",
  },
  {
    id: "font-3",
    type: "font",
    value: "font-verdana",
    label: "Verdana",
    name: "Verdana",
    preview: "Verdana, sans-serif",
  },
  {
    id: "font-4",
    type: "font",
    value: "font-courier",
    label: "Courier",
    name: "Courier",
    preview: "'Courier New', monospace",
  },
];

const STYLE_OPTIONS: CustomizationOption[] = [
  {
    id: "style-1",
    type: "style",
    value: "style-classic",
    label: "Classic",
    name: "Classic",
  },
  {
    id: "style-2",
    type: "style",
    value: "style-vintage",
    label: "Vintage",
    name: "Vintage",
  },
  {
    id: "style-3",
    type: "style",
    value: "style-modern",
    label: "Modern",
    name: "Modern",
  },
  {
    id: "style-4",
    type: "style",
    value: "style-sporty",
    label: "Sporty",
    name: "Sporty",
  },
];

const ProductDetailPage: React.FC = () => {
  const { products, addToCart } = useAppContext();
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  // Find the product by ID from context
  const product = products.find((p) => p.id === productId);

  // State for customization selection (remains local to this page)
  const [selectedFont, setSelectedFont] = useState<string>(
    FONT_OPTIONS[0]?.value || ""
  );
  const [selectedStyle, setSelectedStyle] = useState<string>(
    STYLE_OPTIONS[0]?.value || ""
  );

  // Handler to pass down to ProductDetail
  const handleAddToCartWrapper = (
    productId: string, // This comes from ProductDetail
    quantity: number,
    customizations: ProductCustomization // This comes from ProductDetail component state
  ) => {
    // Add the selected font/style labels from this page's state
    const finalCustomization: ProductCustomization = {
      ...customizations, // Includes quantity from ProductDetail
      font:
        FONT_OPTIONS.find((f) => f.value === selectedFont)?.label ||
        selectedFont,
      style:
        STYLE_OPTIONS.find((s) => s.value === selectedStyle)?.label ||
        selectedStyle,
    };
    addToCart(productId, quantity, finalCustomization);
    navigate("/cart"); // Navigate to cart after adding
  };

  // Handle product not found (Keep this check here in the page component)
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center bg-gray-50 dark:bg-gray-900">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Product Not Found
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          The product you're looking for does not exist or has been removed.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="inline-block bg-brand hover:bg-brand-600 text-white px-6 py-2 rounded-full font-medium transition-colors duration-300"
        >
          View All Products
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Product Detail Component */}
          <div className="lg:col-span-2">
            {/* Pass the found product and the handler down */}
            <ProductDetail
              product={product} // Pass the whole product object
              addToCartHandler={handleAddToCartWrapper} // Pass the wrapper function
            />
          </div>

          {/* Customization Panel Component */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
            <CustomizationPanel
              productName={product.name}
              fonts={FONT_OPTIONS}
              styles={STYLE_OPTIONS}
              selectedFont={selectedFont}
              selectedStyle={selectedStyle}
              onFontSelect={setSelectedFont}
              onStyleSelect={setSelectedStyle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
