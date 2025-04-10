import React from "react";
import { Eye, FileEdit, FilePenLine } from "lucide-react";
import { AdminOrder, OrderFilterOptions } from "../../../types/admin";
import { OrderStatusBadge, PaymentStatusBadge } from "./OrderStatusBadge";
import { formatCurrency, formatDate } from "../../../utils/formatters";

interface OrdersListProps {
  orders: AdminOrder[];
  isLoading: boolean;
  onViewOrder: (orderId: string) => void;
  onEditOrder: (orderId: string) => void;
}

export const OrdersList: React.FC<OrdersListProps> = ({
  orders,
  isLoading,
  onViewOrder,
  onEditOrder,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-pulse flex flex-col w-full">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-3"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No orders found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Try adjusting your filters or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="sticky top-0 z-10 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
              Order
            </th>
            <th className="sticky top-0 z-10 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
              Customer
            </th>
            <th className="sticky top-0 z-10 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
              Date
            </th>
            <th className="sticky top-0 z-10 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
              Total
            </th>
            <th className="sticky top-0 z-10 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
              Status
            </th>
            <th className="sticky top-0 z-10 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
              Payment
            </th>
            <th className="sticky top-0 z-10 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-gray-100 pr-4">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="border-b border-gray-200 dark:border-gray-700 py-4 pl-4 pr-3">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 dark:text-white">
                    #{order.orderNumber}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </td>
              <td className="border-b border-gray-200 dark:border-gray-700 px-3 py-4">
                <div className="flex flex-col">
                  <span className="text-gray-900 dark:text-white">
                    {order.customerName}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {order.customerEmail}
                  </span>
                </div>
              </td>
              <td className="border-b border-gray-200 dark:border-gray-700 px-3 py-4 text-gray-900 dark:text-white">
                {formatDate(new Date(order.createdAt))}
              </td>
              <td className="border-b border-gray-200 dark:border-gray-700 px-3 py-4 text-gray-900 dark:text-white font-medium">
                {formatCurrency(order.totalAmount)}
              </td>
              <td className="border-b border-gray-200 dark:border-gray-700 px-3 py-4">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="border-b border-gray-200 dark:border-gray-700 px-3 py-4">
                <PaymentStatusBadge status={order.paymentStatus} />
              </td>
              <td className="border-b border-gray-200 dark:border-gray-700 px-3 py-4 text-right space-x-2">
                <button
                  onClick={() => onViewOrder(order.id)}
                  className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-md bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  View
                </button>
                <button
                  onClick={() => onEditOrder(order.id)}
                  className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-md bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FilePenLine className="h-3.5 w-3.5 mr-1" />
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
