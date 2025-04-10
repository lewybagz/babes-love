import React, { useState, useMemo, useCallback } from "react";
import { useAppContext } from "../../context/AppContext";
import { CustomizerConfig, CustomHatData } from "../../types";
import { ShoppingCart, XCircle } from "lucide-react";
import HatPreview3D from "./HatPreview3D"; // Import the 3D preview component

// Placeholder config - move to a config file or fetch from backend later
const DEFAULT_CONFIG: CustomizerConfig = {
  fonts: ["Arial", "Times New Roman", "Verdana", "Brush Script MT", "Pacifico"],
  colors: [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Red", hex: "#FF0000" },
    { name: "Blue", hex: "#0000FF" },
    { name: "Green", hex: "#008000" },
    { name: "Yellow", hex: "#FFFF00" },
    { name: "Pink", hex: "#FFC0CB" },
    { name: "Purple", hex: "#800080" },
  ],
  minQuantity: 50,
  maxTextLength: 15,
  maxWords: 2,
  fixedPrefix: "Babes Love",
};

// Base price for custom hats (can also be part of config)
const CUSTOM_HAT_PRICE = 34.99;
// Placeholder image URL (can be removed if 3D preview is primary)
// const CUSTOM_HAT_IMAGE_URL = "/images/custom-hat-placeholder.jpg";

const CustomHatDesigner: React.FC = () => {
  const { addToCart } = useAppContext();
  const [font, setFont] = useState(DEFAULT_CONFIG.fonts[0]);
  const [color, setColor] = useState(DEFAULT_CONFIG.colors[0]);
  const [customText, setCustomText] = useState("");
  const [quantity, setQuantity] = useState(DEFAULT_CONFIG.minQuantity);
  const [error, setError] = useState<string | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setError(null);

    if (newText.length > DEFAULT_CONFIG.maxTextLength) {
      setError(
        `Text cannot exceed ${DEFAULT_CONFIG.maxTextLength} characters.`
      );
      // Optionally trim or prevent further input
      // setCustomText(newText.substring(0, DEFAULT_CONFIG.maxTextLength));
      return; // Prevent setting state if invalid
    }

    const words = newText.trim().split(/\s+/).filter(Boolean); // filter(Boolean) removes empty strings from split
    if (words.length > DEFAULT_CONFIG.maxWords) {
      setError(`Text cannot exceed ${DEFAULT_CONFIG.maxWords} words.`);
      // Optionally trim words
      // setCustomText(words.slice(0, DEFAULT_CONFIG.maxWords).join(' '));
      return; // Prevent setting state if invalid
    }

    setCustomText(newText);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      setQuantity(newQuantity);
      if (newQuantity < DEFAULT_CONFIG.minQuantity) {
        setError(`Minimum quantity is ${DEFAULT_CONFIG.minQuantity}.`);
      } else {
        setError(null);
      }
    } else if (e.target.value === "") {
      setQuantity(0); // Allow clearing the input
      setError(`Minimum quantity is ${DEFAULT_CONFIG.minQuantity}.`);
    } else {
      setQuantity(0); // Handle invalid input like 'e'
      setError(`Minimum quantity is ${DEFAULT_CONFIG.minQuantity}.`);
    }
  };

  const validateAndAddToCart = () => {
    setError(null);
    const trimmedText = customText.trim();
    const words = trimmedText.split(/\s+/).filter(Boolean);

    if (quantity < DEFAULT_CONFIG.minQuantity) {
      setError(`Minimum order quantity is ${DEFAULT_CONFIG.minQuantity}.`);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      return;
    }
    if (trimmedText === "") {
      setError("Custom text cannot be empty.");
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      return;
    }
    if (trimmedText.length > DEFAULT_CONFIG.maxTextLength) {
      setError(
        `Text cannot exceed ${DEFAULT_CONFIG.maxTextLength} characters.`
      );
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      return;
    }
    if (words.length > DEFAULT_CONFIG.maxWords) {
      setError(`Text cannot exceed ${DEFAULT_CONFIG.maxWords} words.`);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      return;
    }

    const customHatData: CustomHatData = {
      isCustomHat: true,
      font,
      color: color.hex,
      customText: trimmedText,
    };

    // Use a unique ID format for custom hats in the cart
    // The backend might generate a proper SKU later
    const cartItemId = `custom-hat-${font}-${color.name}-${trimmedText.replace(
      /\s+/g,
      "-"
    )}-${Date.now()}`;

    // For adding to cart, we need a placeholder product representation
    // or adjust addToCart to handle items without a direct productId lookup
    // Using a placeholder product ID for now
    const PLACEHOLDER_PRODUCT_ID = "CUSTOM_HAT";
    const customHatName = `${DEFAULT_CONFIG.fixedPrefix} ${trimmedText}`;

    // Assuming addToCart can handle this structure (may need adjustment)
    addToCart(PLACEHOLDER_PRODUCT_ID, quantity, customHatData);

    // Use toast or similar for feedback instead of console.log
    console.log("Added custom hat to cart:", customHatData, quantity);
    alert("Custom hats added to cart!"); // Simple feedback for now

    // Reset form after successful addition
    setCustomText("");
    setQuantity(DEFAULT_CONFIG.minQuantity);
    setFont(DEFAULT_CONFIG.fonts[0]);
    setColor(DEFAULT_CONFIG.colors[0]);
    setError(null);
  };

  const finalHatText = `${DEFAULT_CONFIG.fixedPrefix} ${customText}`.trim(); // Trim whitespace
  const isAddToCartDisabled =
    !!error ||
    quantity < DEFAULT_CONFIG.minQuantity ||
    customText.trim() === "";

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Design Your Custom Hat
      </h2>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Preview Section - Using HatPreview3D */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white text-center">
            Live Preview
          </h3>
          <HatPreview3D
            font={font}
            colorHex={color.hex}
            text={finalHatText}
            // hatModelUrl="/models/your-hat.glb" // Pass if needed, handled internally now
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Use mouse to rotate/zoom
          </p>
        </div>

        {/* Options Section */}
        <div className="space-y-6">
          {/* Font Selection */}
          <div>
            <label
              htmlFor="font-select"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Font Style
            </label>
            <select
              id="font-select"
              value={font}
              onChange={(e) => setFont(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md shadow-sm"
            >
              {DEFAULT_CONFIG.fonts.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Font Color
            </label>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_CONFIG.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  title={c.name}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-150 outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-brand-500 ${
                    color.hex === c.hex
                      ? "ring-2 ring-offset-2 dark:ring-offset-gray-800 ring-brand-500 border-brand-600"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-500"
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  <span className="sr-only">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Text Input */}
          <div>
            <label
              htmlFor="custom-text"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Custom Text (after "{DEFAULT_CONFIG.fixedPrefix}")
            </label>
            <input
              type="text"
              id="custom-text"
              value={customText}
              onChange={handleTextChange}
              // Removed maxLength here, validation handles it
              placeholder="e.g., Golf Crew"
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Max {DEFAULT_CONFIG.maxWords} words,{" "}
              {DEFAULT_CONFIG.maxTextLength} characters.
            </p>
          </div>

          {/* Quantity Input */}
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Quantity (Min: {DEFAULT_CONFIG.minQuantity})
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity === 0 ? "" : quantity}
              onChange={handleQuantityChange}
              min={1}
              placeholder={String(DEFAULT_CONFIG.minQuantity)}
              className="mt-1 block w-24 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Error Message & Add to Cart Button */}
      <div className="mt-8 text-center">
        {error && (
          <div className="mb-4 inline-flex items-center bg-red-100 dark:bg-red-900/80 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-2 rounded-md text-sm shadow">
            <XCircle size={16} className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <div>
          {" "}
          {/* Added div for button and price alignment */}
          <button
            type="button"
            onClick={validateAndAddToCart}
            disabled={isAddToCartDisabled}
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-brand-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Custom Hats to Cart
          </button>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Total Price: $
            {(
              CUSTOM_HAT_PRICE *
              (quantity >= DEFAULT_CONFIG.minQuantity ? quantity : 0)
            ).toFixed(2)}
            {quantity > 0 && quantity < DEFAULT_CONFIG.minQuantity && (
              <span className="text-red-500 dark:text-red-400 ml-2">
                (Min Qty: {DEFAULT_CONFIG.minQuantity})
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomHatDesigner;
