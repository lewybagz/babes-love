import React, { useState } from "react";
import { AdminPayment, AdminRefund } from "../../../types/admin";
import { formatCurrency } from "../../../utils/formatters";
import {
  X,
  Calendar,
  CreditCard,
  User,
  Tag,
  RefreshCw,
  AlertTriangle,
  DollarSign,
  ArrowDownLeft,
  ExternalLink,
} from "lucide-react";

interface PaymentDetailModalProps {
  payment: AdminPayment | null;
  isOpen: boolean;
  onClose: () => void;
  onProcessRefund: (
    paymentId: string,
    amount: number,
    reason: string
  ) => Promise<boolean>;
  isProcessingRefund: boolean;
}

export const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({
  payment,
  isOpen,
  onClose,
  onProcessRefund,
  isProcessingRefund,
}) => {
  const [isRefundOpen, setIsRefundOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState<string>("");
  const [refundReason, setRefundReason] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !payment) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "succeeded":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
      case "pending":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
      case "failed":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
      case "refunded":
        return "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20";
      case "partially_refunded":
        return "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20";
      case "canceled":
        return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "succeeded":
        return <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>;
      case "pending":
        return <RefreshCw className="h-4 w-4 text-yellow-500 mr-2" />;
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />;
      case "refunded":
        return <div className="h-4 w-4 rounded-full bg-purple-500 mr-2"></div>;
      case "partially_refunded":
        return <div className="h-4 w-4 rounded-full bg-indigo-500 mr-2"></div>;
      case "canceled":
        return <div className="h-4 w-4 rounded-full bg-gray-500 mr-2"></div>;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-400 mr-2"></div>;
    }
  };

  const formatCardDetails = () => {
    if (
      payment.paymentMethod !== "card" ||
      !payment.cardBrand ||
      !payment.cardLast4
    ) {
      return "N/A";
    }

    let brandName =
      payment.cardBrand.charAt(0).toUpperCase() + payment.cardBrand.slice(1);
    if (payment.cardBrand === "amex") {
      brandName = "American Express";
    }

    return `${brandName} •••• ${payment.cardLast4}`;
  };

  const calculateRemainingAmount = () => {
    const refunded = payment.refundedAmount || 0;
    return payment.amount - refunded;
  };

  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate refund amount
    const amount = parseFloat(refundAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid refund amount");
      return;
    }

    // Convert to cents for Stripe
    const amountInCents = Math.round(amount * 100);
    const remainingAmount = calculateRemainingAmount();

    if (amountInCents > remainingAmount) {
      setError(
        `Refund amount cannot exceed the remaining amount: ${formatCurrency(
          remainingAmount / 100
        )}`
      );
      return;
    }

    // Process refund
    const success = await onProcessRefund(
      payment.id,
      amountInCents,
      refundReason
    );
    if (success) {
      setIsRefundOpen(false);
      setRefundAmount("");
      setRefundReason("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Payment Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6">
            {/* Header with status */}
            <div
              className={`flex justify-between items-center mb-6 p-3 rounded-md ${getStatusClass(
                payment.status
              )}`}
            >
              <div className="flex items-center">
                {getStatusIcon(payment.status)}
                <span className="font-medium capitalize">
                  {payment.status.replace("_", " ")}
                </span>
              </div>
              <div className="text-lg font-medium">
                {formatCurrency(payment.amount / 100)}
                {payment.currency.toUpperCase()}
              </div>
            </div>

            {/* Main information grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Transaction Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CreditCard className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Transaction ID
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white font-mono">
                        {payment.stripePaymentId}
                      </p>
                      <a
                        href={`https://dashboard.stripe.com/payments/${payment.stripePaymentId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center mt-1"
                      >
                        View in Stripe Dashboard{" "}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Date
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {formatDate(payment.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <DollarSign className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Payment Method
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {formatCardDetails()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Order Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Tag className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Order Number
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {payment.orderNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <User className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Customer
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {payment.customerName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {payment.customerEmail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Refund details if any */}
            {payment.refunds && payment.refunds.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Refund History
                </h4>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-3">
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {payment.refunds.map((refund: AdminRefund) => (
                      <div
                        key={refund.id}
                        className="py-3 first:pt-0 last:pb-0"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <ArrowDownLeft className="h-4 w-4 mr-2 text-purple-500 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-900 dark:text-white flex items-center">
                                {formatCurrency(refund.amount / 100)}
                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                  ({formatDate(refund.createdAt)})
                                </span>
                              </p>
                              {refund.reason && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  Reason: {refund.reason}
                                </p>
                              )}
                            </div>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              refund.status === "succeeded"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                                : "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400"
                            }`}
                          >
                            {refund.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Error message if payment failed */}
            {payment.status === "failed" && payment.error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-md">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-300">
                      Payment Failed
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-400">
                      {payment.error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Refund form */}
            {isRefundOpen ? (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Process Refund
                </h4>
                <form onSubmit={handleRefundSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="refundAmount"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Refund Amount (
                      {formatCurrency(calculateRemainingAmount() / 100)}{" "}
                      available)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                      </span>
                      <input
                        type="number"
                        id="refundAmount"
                        step="0.01"
                        min="0.01"
                        max={calculateRemainingAmount() / 100}
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(e.target.value)}
                        className="pl-8 w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md 
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="refundReason"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Reason for Refund
                    </label>
                    <textarea
                      id="refundReason"
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={3}
                      placeholder="Provide a reason for this refund..."
                    />
                  </div>
                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm rounded-md">
                      {error}
                    </div>
                  )}
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsRefundOpen(false)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessingRefund}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isProcessingRefund ? "Processing..." : "Process Refund"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              // Refund button (only show if payment can be refunded)
              <>
                {["succeeded", "partially_refunded"].includes(payment.status) &&
                  calculateRemainingAmount() > 0 && (
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => setIsRefundOpen(true)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
                      >
                        <ArrowDownLeft className="h-4 w-4 mr-2" />
                        Issue Refund
                      </button>
                    </div>
                  )}
              </>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
