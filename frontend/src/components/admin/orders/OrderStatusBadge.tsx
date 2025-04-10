import React from "react";
import { OrderStatus, PaymentStatus } from "../../../types/admin";
import {
  Clock,
  Truck,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard,
} from "lucide-react";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md" | "lg";
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: "sm" | "md" | "lg";
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  size = "md",
}) => {
  // Determine badge style based on status
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return {
          icon: (
            <Clock
              className={size === "sm" ? "h-3 w-3 mr-1" : "h-4 w-4 mr-1.5"}
            />
          ),
          bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
          textColor: "text-yellow-800 dark:text-yellow-200",
          label: "Pending",
        };
      case "processing":
        return {
          icon: (
            <Package
              className={size === "sm" ? "h-3 w-3 mr-1" : "h-4 w-4 mr-1.5"}
            />
          ),
          bgColor: "bg-blue-100 dark:bg-blue-900/30",
          textColor: "text-blue-800 dark:text-blue-200",
          label: "Processing",
        };
      case "shipped":
        return {
          icon: (
            <Truck
              className={size === "sm" ? "h-3 w-3 mr-1" : "h-4 w-4 mr-1.5"}
            />
          ),
          bgColor: "bg-purple-100 dark:bg-purple-900/30",
          textColor: "text-purple-800 dark:text-purple-200",
          label: "Shipped",
        };
      case "delivered":
        return {
          icon: (
            <CheckCircle
              className={size === "sm" ? "h-3 w-3 mr-1" : "h-4 w-4 mr-1.5"}
            />
          ),
          bgColor: "bg-green-100 dark:bg-green-900/30",
          textColor: "text-green-800 dark:text-green-200",
          label: "Delivered",
        };
      case "cancelled":
        return {
          icon: (
            <XCircle
              className={size === "sm" ? "h-3 w-3 mr-1" : "h-4 w-4 mr-1.5"}
            />
          ),
          bgColor: "bg-red-100 dark:bg-red-900/30",
          textColor: "text-red-800 dark:text-red-200",
          label: "Cancelled",
        };
      default:
        return {
          icon: (
            <AlertCircle
              className={size === "sm" ? "h-3 w-3 mr-1" : "h-4 w-4 mr-1.5"}
            />
          ),
          bgColor: "bg-gray-100 dark:bg-gray-800",
          textColor: "text-gray-800 dark:text-gray-200",
          label: "Unknown",
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses =
    size === "sm"
      ? "text-xs px-2 py-0.5"
      : size === "lg"
      ? "text-sm px-3 py-1.5"
      : "text-xs px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.bgColor} ${config.textColor} ${sizeClasses}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({
  status,
  size = "md",
}) => {
  // Determine badge style based on payment status
  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case "pending":
        return {
          icon: (
            <CreditCard
              className={size === "sm" ? "h-3 w-3 mr-1" : "h-4 w-4 mr-1.5"}
            />
          ),
          bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
          textColor: "text-yellow-800 dark:text-yellow-200",
          label: "Pending",
        };
      case "paid":
        return {
          icon: (
            <CheckCircle
              className={size === "sm" ? "h-3 w-3 mr-1" : "h-4 w-4 mr-1.5"}
            />
          ),
          bgColor: "bg-green-100 dark:bg-green-900/30",
          textColor: "text-green-800 dark:text-green-200",
          label: "Paid",
        };
      case "failed":
        return {
          icon: (
            <XCircle
              className={size === "sm" ? "h-3 w-3 mr-1" : "h-4 w-4 mr-1.5"}
            />
          ),
          bgColor: "bg-red-100 dark:bg-red-900/30",
          textColor: "text-red-800 dark:text-red-200",
          label: "Failed",
        };
      case "refunded":
        return {
          icon: (
            <CreditCard
              className={size === "sm" ? "h-3 w-3 mr-1" : "h-4 w-4 mr-1.5"}
            />
          ),
          bgColor: "bg-gray-100 dark:bg-gray-800",
          textColor: "text-gray-800 dark:text-gray-200",
          label: "Refunded",
        };
      default:
        return {
          icon: (
            <AlertCircle
              className={size === "sm" ? "h-3 w-3 mr-1" : "h-4 w-4 mr-1.5"}
            />
          ),
          bgColor: "bg-gray-100 dark:bg-gray-800",
          textColor: "text-gray-800 dark:text-gray-200",
          label: "Unknown",
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses =
    size === "sm"
      ? "text-xs px-2 py-0.5"
      : size === "lg"
      ? "text-sm px-3 py-1.5"
      : "text-xs px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.bgColor} ${config.textColor} ${sizeClasses}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};
