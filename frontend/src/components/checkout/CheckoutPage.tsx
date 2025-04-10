import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { OrderData } from "../../types";
import {
  Lock,
  CheckCircle,
  ShoppingCart,
  ArrowLeft,
  User,
  Mail,
  Home,
  CreditCard,
  Calendar,
  ShieldCheck,
  Loader2,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

// Utility function for basic validation
const validateField = (name: string, value: string): string => {
  if (!value.trim()) return "This field is required";
  if (name === "email" && !/\S+@\S+\.\S+/.test(value))
    return "Invalid email address";
  if (name === "zipCode" && !/^\d{5}(-\d{4})?$/.test(value))
    return "Invalid ZIP code (e.g., 12345 or 12345-6789)";
  if (
    name === "phone" &&
    !/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value)
  )
    return "Invalid phone number";
  if (name === "cardNumber" && !/^\d{13,19}$/.test(value.replace(/\s/g, "")))
    return "Invalid card number";
  if (name === "expiryDate" && !/^(0[1-9]|1[0-2])\s*\/?\s*(\d{2})$/.test(value))
    return "Invalid expiry date (MM/YY)";
  if (name === "cvv" && !/^\d{3,4}$/.test(value)) return "Invalid CVV";

  return "";
};

const CheckoutPage: React.FC = () => {
  const { cartItems, getCartTotals, handleOrderComplete } = useAppContext();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OrderData>({
    customer: { firstName: "", lastName: "", email: "", phone: "" },
    shipping: { address: "", city: "", state: "", zipCode: "", country: "USA" },
    payment: { cardHolder: "", cardNumber: "", expiryDate: "", cvv: "" },
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { subtotal, tax, shipping } = getCartTotals();
  const total = subtotal + tax + shipping;

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !isProcessing && !showSuccess) {
      navigate("/cart");
    }
  }, [cartItems, navigate, isProcessing, showSuccess]);

  const handleInputChange = (
    category: keyof OrderData,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleBlur = (
    category: keyof OrderData,
    field: string,
    value: string
  ) => {
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateStep = (step: number): boolean => {
    let isValid = true;
    const newErrors: Record<string, string> = {};
    const fieldsToValidate: { category: keyof OrderData; field: string }[] = [];

    if (step === 1) {
      fieldsToValidate.push(
        ...(Object.keys(formData.customer).map((field) => ({
          category: "customer",
          field,
        })) as { category: "customer"; field: string }[])
      );
    }
    if (step === 2) {
      fieldsToValidate.push(
        ...(Object.keys(formData.shipping).map((field) => ({
          category: "shipping",
          field,
        })) as { category: "shipping"; field: string }[])
      );
    }
    if (step === 3) {
      fieldsToValidate.push(
        ...(Object.keys(formData.payment).map((field) => ({
          category: "payment",
          field,
        })) as { category: "payment"; field: string }[])
      );
    }

    fieldsToValidate.forEach(({ category, field }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const value = (formData[category] as any)[field];
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors((prev) => ({ ...prev, ...newErrors }));
    if (!isValid) {
      toast.error(
        `Please fix the errors in the ${
          ["Customer", "Shipping", "Payment"][step - 1]
        } Information section.`
      );
    }
    return isValid;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) {
      return;
    }

    setIsProcessing(true);
    setErrors({}); // Clear errors before final submission
    console.log("Submitting order:", formData);

    setTimeout(() => {
      handleOrderComplete(formData); // Pass the complete formData object
      setIsProcessing(false);
      setShowSuccess(true);

      setTimeout(() => {
        navigate("/order-confirmation");
      }, 2000);
    }, 1500);
  };

  // --- Render Logic ---
  if (showSuccess) {
    // Success State
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="container mx-auto max-w-md text-center py-16">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Redirecting you to the confirmation page...
          </p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    // Empty Cart State
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="container mx-auto max-w-md text-center py-16">
          <ShoppingCart
            className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6"
            strokeWidth={1}
          />
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Your cart is empty.
          </p>
          <Link
            to="/products"
            className="inline-block bg-brand hover:bg-brand-600 text-white px-8 py-3 rounded-full font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-lg"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Main Checkout UI
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header & Progress */}
        <div className="mb-10">
          <div className="mb-4">
            <Link
              to="/cart"
              className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-brand dark:hover:text-brand-400 transition-colors w-fit"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Cart
            </Link>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-6 text-center">
            Checkout
          </h1>
          {/* Progress Indicator */}
          <div className="flex items-center justify-center max-w-xl mx-auto">
            {["Customer", "Shipping", "Payment"].map((label, index) => {
              const step = index + 1;
              const isActive = step === currentStep;
              const isCompleted = step < currentStep;
              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                        isActive
                          ? "bg-brand border-brand text-white scale-110"
                          : isCompleted
                          ? "bg-brand/30 border-brand/50 text-brand"
                          : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : step}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium transition-colors duration-300 ${
                        isActive
                          ? "text-brand dark:text-brand-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {step < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-colors duration-300 ${
                        isCompleted
                          ? "bg-brand/50"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    ></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Main Content: Form + Summary */}
        <div className="flex flex-col lg:flex-row lg:gap-12">
          {/* Form Section (Step-based) */}
          <div className="lg:flex-grow mb-10 lg:mb-0">
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg">
              {/* Step 1: Customer Info */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 border-b dark:border-gray-700 pb-3">
                    Customer Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                    <div className="relative">
                      <label htmlFor="firstName" className="checkout-label">
                        First Name
                      </label>
                      <User className="input-icon" />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.customer.firstName}
                        onChange={(e) =>
                          handleInputChange(
                            "customer",
                            "firstName",
                            e.target.value
                          )
                        }
                        onBlur={(e) =>
                          handleBlur("customer", "firstName", e.target.value)
                        }
                        className={`checkout-input pl-10 ${
                          errors.firstName ? "border-red-500" : ""
                        }`}
                        required
                        placeholder="Jane"
                      />
                      {errors.firstName && (
                        <p className="error-message">{errors.firstName}</p>
                      )}
                    </div>
                    <div className="relative">
                      <label htmlFor="lastName" className="checkout-label">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.customer.lastName}
                        onChange={(e) =>
                          handleInputChange(
                            "customer",
                            "lastName",
                            e.target.value
                          )
                        }
                        onBlur={(e) =>
                          handleBlur("customer", "lastName", e.target.value)
                        }
                        className={`checkout-input ${
                          errors.lastName ? "border-red-500" : ""
                        }`}
                        required
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="error-message">{errors.lastName}</p>
                      )}
                    </div>
                    <div className="relative sm:col-span-2">
                      <label htmlFor="email" className="checkout-label">
                        Email Address
                      </label>
                      <Mail className="input-icon" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.customer.email}
                        onChange={(e) =>
                          handleInputChange("customer", "email", e.target.value)
                        }
                        onBlur={(e) =>
                          handleBlur("customer", "email", e.target.value)
                        }
                        className={`checkout-input pl-10 ${
                          errors.email ? "border-red-500" : ""
                        }`}
                        required
                        placeholder="you@example.com"
                      />
                      {errors.email && (
                        <p className="error-message">{errors.email}</p>
                      )}
                    </div>
                    <div className="relative sm:col-span-2">
                      <label htmlFor="phone" className="checkout-label">
                        Phone Number
                      </label>
                      {/* Consider adding a phone icon */}
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.customer.phone}
                        onChange={(e) =>
                          handleInputChange("customer", "phone", e.target.value)
                        }
                        onBlur={(e) =>
                          handleBlur("customer", "phone", e.target.value)
                        }
                        className={`checkout-input ${
                          errors.phone ? "border-red-500" : ""
                        }`}
                        required
                        placeholder="(123) 456-7890"
                      />
                      {errors.phone && (
                        <p className="error-message">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="checkout-button"
                    >
                      Continue to Shipping
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping Info */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 border-b dark:border-gray-700 pb-3">
                    Shipping Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                    <div className="relative sm:col-span-2">
                      <label htmlFor="address" className="checkout-label">
                        Street Address
                      </label>
                      <Home className="input-icon" />
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.shipping.address}
                        onChange={(e) =>
                          handleInputChange(
                            "shipping",
                            "address",
                            e.target.value
                          )
                        }
                        onBlur={(e) =>
                          handleBlur("shipping", "address", e.target.value)
                        }
                        className={`checkout-input pl-10 ${
                          errors.address ? "border-red-500" : ""
                        }`}
                        required
                        placeholder="123 Main St"
                      />
                      {errors.address && (
                        <p className="error-message">{errors.address}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="city" className="checkout-label">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.shipping.city}
                        onChange={(e) =>
                          handleInputChange("shipping", "city", e.target.value)
                        }
                        onBlur={(e) =>
                          handleBlur("shipping", "city", e.target.value)
                        }
                        className={`checkout-input ${
                          errors.city ? "border-red-500" : ""
                        }`}
                        required
                        placeholder="Anytown"
                      />
                      {errors.city && (
                        <p className="error-message">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="state" className="checkout-label">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.shipping.state}
                        onChange={(e) =>
                          handleInputChange("shipping", "state", e.target.value)
                        }
                        onBlur={(e) =>
                          handleBlur("shipping", "state", e.target.value)
                        }
                        className={`checkout-input ${
                          errors.state ? "border-red-500" : ""
                        }`}
                        required
                        placeholder="CA"
                      />
                      {errors.state && (
                        <p className="error-message">{errors.state}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="zipCode" className="checkout-label">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.shipping.zipCode}
                        onChange={(e) =>
                          handleInputChange(
                            "shipping",
                            "zipCode",
                            e.target.value
                          )
                        }
                        onBlur={(e) =>
                          handleBlur("shipping", "zipCode", e.target.value)
                        }
                        className={`checkout-input ${
                          errors.zipCode ? "border-red-500" : ""
                        }`}
                        required
                        placeholder="90210"
                        inputMode="numeric"
                        pattern="\d{5}(-\d{4})?"
                      />
                      {errors.zipCode && (
                        <p className="error-message">{errors.zipCode}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="country" className="checkout-label">
                        Country
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.shipping.country}
                        onChange={(e) =>
                          handleInputChange(
                            "shipping",
                            "country",
                            e.target.value
                          )
                        }
                        className={`checkout-input ${
                          errors.country ? "border-red-500" : ""
                        }`}
                        required
                      >
                        {/* Add more countries if needed */}
                        <option value="USA">United States</option>
                        <option value="CAN">Canada</option>
                      </select>
                      {errors.country && (
                        <p className="error-message">{errors.country}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-8 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="checkout-button-secondary"
                    >
                      Back to Customer Info
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="checkout-button"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Info */}
              {currentStep === 3 && (
                <form onSubmit={handleSubmit}>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 border-b dark:border-gray-700 pb-3">
                    Payment Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-6 gap-y-5">
                    <div className="relative sm:col-span-4">
                      <label htmlFor="cardHolder" className="checkout-label">
                        Cardholder Name
                      </label>
                      <User className="input-icon" />
                      <input
                        type="text"
                        id="cardHolder"
                        name="cardHolder"
                        value={formData.payment.cardHolder}
                        onChange={(e) =>
                          handleInputChange(
                            "payment",
                            "cardHolder",
                            e.target.value
                          )
                        }
                        onBlur={(e) =>
                          handleBlur("payment", "cardHolder", e.target.value)
                        }
                        className={`checkout-input pl-10 ${
                          errors.cardHolder ? "border-red-500" : ""
                        }`}
                        required
                        placeholder="Jane M. Doe"
                      />
                      {errors.cardHolder && (
                        <p className="error-message">{errors.cardHolder}</p>
                      )}
                    </div>
                    <div className="relative sm:col-span-4">
                      <label htmlFor="cardNumber" className="checkout-label">
                        Card Number
                      </label>
                      <CreditCard className="input-icon" />
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.payment.cardNumber}
                        onChange={(e) =>
                          handleInputChange(
                            "payment",
                            "cardNumber",
                            e.target.value
                          )
                        }
                        onBlur={(e) =>
                          handleBlur("payment", "cardNumber", e.target.value)
                        }
                        className={`checkout-input pl-10 ${
                          errors.cardNumber ? "border-red-500" : ""
                        }`}
                        required
                        placeholder="•••• •••• •••• ••••"
                        inputMode="numeric"
                        pattern="[\d ]{16,22}"
                      />
                      {errors.cardNumber && (
                        <p className="error-message">{errors.cardNumber}</p>
                      )}
                    </div>
                    <div className="relative sm:col-span-2">
                      <label htmlFor="expiryDate" className="checkout-label">
                        Expiry Date (MM / YY)
                      </label>
                      <Calendar className="input-icon" />
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.payment.expiryDate}
                        onChange={(e) =>
                          handleInputChange(
                            "payment",
                            "expiryDate",
                            e.target.value
                          )
                        }
                        onBlur={(e) =>
                          handleBlur("payment", "expiryDate", e.target.value)
                        }
                        className={`checkout-input pl-10 ${
                          errors.expiryDate ? "border-red-500" : ""
                        }`}
                        required
                        placeholder="MM / YY"
                        inputMode="numeric"
                        pattern="(0[1-9]|1[0-2])\s*\/?\s*([0-9]{2})"
                      />
                      {errors.expiryDate && (
                        <p className="error-message">{errors.expiryDate}</p>
                      )}
                    </div>
                    <div className="relative sm:col-span-2">
                      <label htmlFor="cvv" className="checkout-label">
                        CVV
                      </label>
                      <Lock className="input-icon" />
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.payment.cvv}
                        onChange={(e) =>
                          handleInputChange("payment", "cvv", e.target.value)
                        }
                        onBlur={(e) =>
                          handleBlur("payment", "cvv", e.target.value)
                        }
                        className={`checkout-input pl-10 ${
                          errors.cvv ? "border-red-500" : ""
                        }`}
                        required
                        placeholder="•••"
                        inputMode="numeric"
                        pattern="\d{3,4}"
                      />
                      {errors.cvv && (
                        <p className="error-message">{errors.cvv}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <ShieldCheck className="w-5 h-5 mr-2 text-green-600 dark:text-green-500 flex-shrink-0" />
                    <span>Your payment information is processed securely.</span>
                  </div>
                  <div className="mt-8 flex flex-col sm:flex-row-reverse sm:justify-between sm:items-center gap-4">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="checkout-button w-full sm:w-auto"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />{" "}
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5 mr-2.5" /> Place Order ($
                          {total.toFixed(2)})
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={prevStep}
                      className="checkout-button-secondary w-full sm:w-auto"
                    >
                      Back to Shipping
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-1/3 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5 border-b border-gray-200 dark:border-gray-700 pb-3">
                  Order Summary
                </h2>
                <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-3 -mr-3 custom-scrollbar">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-start text-sm">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md mr-4 flex-shrink-0 shadow-sm"
                      />
                      <div className="flex-grow">
                        <p className="text-gray-800 dark:text-white font-medium leading-tight">
                          {item.name}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                          {item.customization.font || "Default"} /{" "}
                          {item.customization.style || "Default"}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium ml-3 flex-shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Tax</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Shipping</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Inject utility styles
const CHECKOUT_STYLE_ID = "checkout-page-styles";
if (!document.getElementById(CHECKOUT_STYLE_ID)) {
  const CheckoutStyles = `
    .checkout-label {
      @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5;
    }
    .checkout-input {
      @apply w-full appearance-none relative block px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:focus:ring-brand-400 dark:focus:border-brand-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors sm:text-sm;
    }
    .checkout-input.pl-10 {
      padding-left: 2.5rem; /* Ensure padding for icon */
    }
    .input-icon {
       @apply absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 z-10 pointer-events-none;
    }
    .error-message {
      @apply text-red-500 text-xs mt-1;
    }
    .checkout-button {
       @apply inline-flex items-center justify-center bg-brand hover:bg-brand-600 text-white px-6 py-2.5 rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-base disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-md;
    }
     .checkout-button-secondary {
       @apply inline-flex items-center justify-center bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-6 py-2.5 rounded-full font-semibold shadow-sm hover:shadow transition-all duration-300 text-base disabled:opacity-60 disabled:cursor-not-allowed;
    }
    /* Scrollbar styling */
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; border: 3px solid transparent; }
    .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #4b5563; }
    .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
    .dark .custom-scrollbar { scrollbar-color: #4b5563 transparent; }
  `;

  const styleSheet = document.createElement("style");
  styleSheet.id = CHECKOUT_STYLE_ID;
  styleSheet.type = "text/css";
  styleSheet.innerText = CheckoutStyles;
  document.head.appendChild(styleSheet);
}

export default CheckoutPage;
