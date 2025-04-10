import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useAdminProducts } from "../../../hooks/useAdminProducts";
import { AdminProductFormData, ProductTemplate } from "../../../types/admin";
import { Product } from "../../../types";
import {
  AlertCircle,
  Save,
  X,
  Upload,
  RotateCcw,
  CheckCircle,
} from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";

interface ProductFormProps {
  productId: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

// Categories for dropdown
const CATEGORIES = [
  { value: "hats", label: "Hats" },
  { value: "accessories", label: "Accessories" },
  { value: "apparel", label: "Apparel" },
  { value: "custom", label: "Custom" },
];

const ProductForm: React.FC<ProductFormProps> = ({
  productId,
  onSuccess,
  onCancel,
}) => {
  const {
    products,
    templates,
    loading,
    addProduct,
    updateProduct,
    loadFromTemplate,
    saveTemplate,
  } = useAdminProducts();

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  // React hook form setup
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AdminProductFormData>({
    defaultValues: {
      name: "",
      price: 19.99,
      description: "",
      available: true,
      customizationOptions: {
        fonts: true,
        styles: true,
      },
      category: "hats",
    },
  });

  // Load product if editing
  useEffect(() => {
    if (productId) {
      const product = products.find((p) => p.id === productId);
      if (product) {
        setCurrentProduct(product);

        // Set form values
        setValue("name", product.name);
        setValue("price", product.price);
        setValue("description", product.description);
        setValue("available", product.available !== false);
        setValue(
          "customizationOptions",
          product.customizationOptions || {
            fonts: true,
            styles: true,
          }
        );
        setValue("category", product.category || "hats");

        // Load image previews if there are images
        if (product.images && product.images.length > 0) {
          setImagePreviewUrls(product.images);
        }
      }
    } else {
      resetForm();
    }
  }, [productId, products, setValue]);

  // Reset form
  const resetForm = () => {
    reset({
      name: "",
      price: 19.99,
      description: "",
      available: true,
      customizationOptions: {
        fonts: true,
        styles: true,
      },
      category: "hats",
      imageFiles: undefined,
    });
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setCurrentProduct(null);
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages = Array.from(files);
    setSelectedImages((prev) => [...prev, ...newImages]);

    // Create preview URLs
    const newPreviewUrls = newImages.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  // Remove an image from the selection
  const removeImage = (index: number) => {
    // Release the object URL to prevent memory leaks
    if (
      imagePreviewUrls[index] &&
      !currentProduct?.images?.includes(imagePreviewUrls[index])
    ) {
      URL.revokeObjectURL(imagePreviewUrls[index]);
    }

    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const onSubmit = async (data: AdminProductFormData) => {
    try {
      setSaving(true);

      // Add image files to form data
      const formData: AdminProductFormData = {
        ...data,
        imageFiles: selectedImages,
      };

      // Perform create or update
      if (productId) {
        await updateProduct(productId, formData);
      } else {
        await addProduct(formData);
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setSaving(false);
    }
  };

  // Save as template
  const handleSaveAsTemplate = async () => {
    const data = {
      name: currentProduct?.name || "",
      price: currentProduct?.price || 0,
      description: currentProduct?.description || "",
      available: currentProduct?.available !== false,
      customizationOptions: currentProduct?.customizationOptions || {
        fonts: true,
        styles: true,
      },
      category: currentProduct?.category || "hats",
    };

    try {
      setSavingTemplate(true);
      await saveTemplate(data);
    } catch (error) {
      console.error("Error saving template:", error);
    } finally {
      setSavingTemplate(false);
    }
  };

  // Load from template
  const handleLoadTemplate = async (templateId: string) => {
    try {
      const templateData = await loadFromTemplate(templateId);

      // Set form values from template
      setValue("price", templateData.price);
      setValue("description", templateData.description);
      setValue("available", templateData.available);
      setValue("customizationOptions", templateData.customizationOptions);
      setValue("category", templateData.category);
    } catch (error) {
      console.error("Error loading template:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Basic Information
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Enter the core details of your product
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              {...register("name", { required: "Product name is required" })}
              className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 border ${
                errors.name
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:border-brand-500 focus:ring-brand-500"
              } bg-white dark:bg-gray-800 dark:text-white sm:text-sm focus:outline-none focus:ring-1`}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Price ($) *
            </label>
            <input
              type="number"
              id="price"
              step="0.01"
              min="0"
              {...register("price", {
                required: "Price is required",
                min: { value: 0.01, message: "Price must be greater than $0" },
                valueAsNumber: true,
              })}
              className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 border ${
                errors.price
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:border-brand-500 focus:ring-brand-500"
              } bg-white dark:bg-gray-800 dark:text-white sm:text-sm focus:outline-none focus:ring-1`}
              placeholder="19.99"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.price.message}
              </p>
            )}
          </div>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Category *
          </label>
          <select
            id="category"
            {...register("category", { required: "Category is required" })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 dark:text-white"
          >
            {CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Description - TinyMCE Editor */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Description *
          </label>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Description is required" }}
            render={({ field: { onChange, value } }) => (
              <Editor
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY} // Use your TinyMCE API key here
                init={{
                  height: 300,
                  menubar: false,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks | bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  skin: document.documentElement.classList.contains("dark")
                    ? "oxide-dark"
                    : "oxide",
                  content_css: document.documentElement.classList.contains(
                    "dark"
                  )
                    ? "dark"
                    : "default",
                }}
                value={value}
                onEditorChange={onChange}
              />
            )}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Availability */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="available"
              type="checkbox"
              {...register("available")}
              className="focus:ring-brand-500 h-4 w-4 text-brand-600 border-gray-300 dark:border-gray-600 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor="available"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              Product Available
            </label>
            <p className="text-gray-500 dark:text-gray-400">
              Uncheck to hide this product from customers
            </p>
          </div>
        </div>
      </div>

      {/* Customization Options */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Customization Options
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Select which customization options are available for this product
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Font Selection */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="fonts"
                type="checkbox"
                {...register("customizationOptions.fonts")}
                className="focus:ring-brand-500 h-4 w-4 text-brand-600 border-gray-300 dark:border-gray-600 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="fonts"
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                Font Selection
              </label>
              <p className="text-gray-500 dark:text-gray-400">
                Allow customers to select different fonts
              </p>
            </div>
          </div>

          {/* Style Selection */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="styles"
                type="checkbox"
                {...register("customizationOptions.styles")}
                className="focus:ring-brand-500 h-4 w-4 text-brand-600 border-gray-300 dark:border-gray-600 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="styles"
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                Style Selection
              </label>
              <p className="text-gray-500 dark:text-gray-400">
                Allow customers to select different styles
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Images */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Product Images
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Upload high-quality images of your product (first image will be the
            main product image)
          </p>
        </div>

        {/* Image Upload */}
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600 dark:text-gray-400">
              <label
                htmlFor="images"
                className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-brand-600 dark:text-brand-400 hover:text-brand-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-800 focus-within:ring-brand-500"
              >
                <span>Upload images</span>
                <input
                  id="images"
                  name="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </div>

        {/* Image Previews */}
        {imagePreviewUrls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {imagePreviewUrls.map((url, index) => (
              <div
                key={index}
                className="relative rounded-md overflow-hidden h-24 bg-gray-100 dark:bg-gray-700"
              >
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-brand-500 text-white text-xs py-1 text-center">
                    Main Image
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Required validation message */}
        {!productId && imagePreviewUrls.length === 0 && (
          <p className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            At least one product image is required
          </p>
        )}
      </div>

      {/* Templates */}
      <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Templates
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Save or load product configurations as templates
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Save as Template button */}
          {(productId || currentProduct) && (
            <button
              type="button"
              onClick={handleSaveAsTemplate}
              disabled={savingTemplate}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-brand-500 disabled:opacity-50"
            >
              {savingTemplate ? (
                <>
                  <RotateCcw className="animate-spin h-4 w-4 mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save as Template
                </>
              )}
            </button>
          )}

          {/* Load Template dropdown */}
          {templates.length > 0 && (
            <div>
              <select
                onChange={(e) => {
                  if (e.target.value) handleLoadTemplate(e.target.value);
                  e.target.value = ""; // Reset after selection
                }}
                value=""
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 dark:text-white"
              >
                <option value="" disabled>
                  Load from Template
                </option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name || `Template ${template.id.slice(0, 6)}`}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="pt-5 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-brand-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-brand-500 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <>
                <RotateCcw className="animate-spin h-4 w-4 mr-2" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                {productId ? "Update Product" : "Create Product"}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
