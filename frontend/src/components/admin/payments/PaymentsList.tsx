import React from "react";
import { AdminPayment, PaymentTransactionStatus } from "../../../types/admin";
import { formatCurrency } from "../../../utils/formatters";
import {
  Calendar,
  CreditCard,
  User,
  Mail,
  Tag,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

interface PaymentsListProps {
  payments: AdminPayment[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onSelectPayment: (payment: AdminPayment) => void;
}

export const PaymentsList: React.FC<PaymentsListProps> = ({
  payments,
  isLoading,
  hasMore,
  onLoadMore,
  onSelectPayment,
}) => {
  if (isLoading && payments.length === 0) {
    return (
      <div className="w-full flex justify-center items-center py-8">
        <div className="animate-pulse flex flex-col space-y-4 w-full">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-200 dark:bg-gray-700 rounded"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          No payments found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeClass = (status: PaymentTransactionStatus) => {
    switch (status) {
      case "succeeded":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-900/50";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/50";
      case "failed":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-900/50";
      case "refunded":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 border-purple-200 dark:border-purple-900/50";
      case "partially_refunded":
        return "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/50";
      case "canceled":
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-900/50";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700";
    }
  };

  const getStatusIcon = (status: PaymentTransactionStatus) => {
    switch (status) {
      case "succeeded":
        return <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>;
      case "pending":
        return <RefreshCw className="h-3 w-3 text-yellow-500 mr-2" />;
      case "failed":
        return <AlertTriangle className="h-3 w-3 text-red-500 mr-2" />;
      case "refunded":
        return <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>;
      case "partially_refunded":
        return <div className="h-3 w-3 rounded-full bg-indigo-500 mr-2"></div>;
      case "canceled":
        return <div className="h-3 w-3 rounded-full bg-gray-500 mr-2"></div>;
      default:
        return <div className="h-3 w-3 rounded-full bg-gray-400 mr-2"></div>;
    }
  };

  const formatCardDetails = (payment: AdminPayment) => {
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

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="sticky top-0 z-10 border-b border-gray-300 dark:border-gray-700 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Transaction ID
              </th>
              <th
                scope="col"
                className="sticky top-0 z-10 border-b border-gray-300 dark:border-gray-700 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="sticky top-0 z-10 border-b border-gray-300 dark:border-gray-700 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Customer
              </th>
              <th
                scope="col"
                className="sticky top-0 z-10 border-b border-gray-300 dark:border-gray-700 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Order
              </th>
              <th
                scope="col"
                className="sticky top-0 z-10 border-b border-gray-300 dark:border-gray-700 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                scope="col"
                className="sticky top-0 z-10 border-b border-gray-300 dark:border-gray-700 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Payment Method
              </th>
              <th
                scope="col"
                className="sticky top-0 z-10 border-b border-gray-300 dark:border-gray-700 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-800">
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                onClick={() => onSelectPayment(payment)}
              >
                <td className="border-b border-gray-200 dark:border-gray-700 py-4 pl-4 pr-3">
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {payment.stripePaymentId.slice(3, 11)}...
                    </div>
                  </div>
                </td>

                <td className="border-b border-gray-200 dark:border-gray-700 py-4 pl-4 pr-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatDate(payment.createdAt)}
                    </div>
                  </div>
                </td>

                <td className="border-b border-gray-200 dark:border-gray-700 py-4 pl-4 pr-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {payment.customerName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <Mail className="h-3 w-3 mr-1 text-gray-400" />
                        <span>{payment.customerEmail}</span>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="border-b border-gray-200 dark:border-gray-700 py-4 pl-4 pr-3">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-gray-500" />
                    <div className="text-sm text-gray-900 dark:text-white">
                      {payment.orderNumber}
                    </div>
                  </div>
                </td>

                <td className="border-b border-gray-200 dark:border-gray-700 py-4 pl-4 pr-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(payment.amount / 100)}
                    {payment.refundedAmount && (
                      <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">
                        ({formatCurrency(payment.refundedAmount / 100)}{" "}
                        refunded)
                      </span>
                    )}
                  </div>
                </td>

                <td className="border-b border-gray-200 dark:border-gray-700 py-4 pl-4 pr-3">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {formatCardDetails(payment)}
                  </div>
                </td>

                <td className="border-b border-gray-200 dark:border-gray-700 py-4 pl-4 pr-3">
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(
                        payment.status
                      )}`}
                    >
                      {getStatusIcon(payment.status)}
                      <span className="capitalize">
                        {payment.status.replace("_", " ")}
                      </span>
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md 
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};
