import React, { useState, useEffect } from "react";
import { X, CheckCircle, Send, Truck, Edit, Save } from "lucide-react";
import { AdminOrder, OrderStatus, PaymentStatus } from "../../../types/admin";
import { OrderStatusBadge, PaymentStatusBadge } from "./OrderStatusBadge";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
} from "../../../utils/formatters";

interface OrderDetailModalProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onUpdatePaymentStatus: (
    orderId: string,
    status: PaymentStatus
  ) => Promise<void>;
  onAddTrackingNumber: (
    orderId: string,
    trackingNumber: string
  ) => Promise<void>;
  onAddNote: (orderId: string, note: string) => Promise<void>;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onUpdatePaymentStatus,
  onAddTrackingNumber,
  onAddNote,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("pending");
  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    useState<PaymentStatus>("pending");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [note, setNote] = useState("");
  const [isEditingTracking, setIsEditingTracking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
      setSelectedPaymentStatus(order.paymentStatus);
      setTrackingNumber(order.trackingNumber || "");
      setNote("");
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleStatusChange = async () => {
    if (order.id && selectedStatus !== order.status) {
      setIsSubmitting(true);
      try {
        await onUpdateStatus(order.id, selectedStatus);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePaymentStatusChange = async () => {
    if (order.id && selectedPaymentStatus !== order.paymentStatus) {
      setIsSubmitting(true);
      try {
        await onUpdatePaymentStatus(order.id, selectedPaymentStatus);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleTrackingSubmit = async () => {
    if (order.id && trackingNumber && trackingNumber !== order.trackingNumber) {
      setIsSubmitting(true);
      try {
        await onAddTrackingNumber(order.id, trackingNumber);
        setIsEditingTracking(false);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (order.id && note.trim()) {
      setIsSubmitting(true);
      try {
        await onAddNote(order.id, note);
        setNote("");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="px-4 pt-5 pb-4 sm:p-6">
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Order #{order.orderNumber}
                </h3>
                <div className="mt-2 md:mt-0 flex space-x-2">
                  <OrderStatusBadge status={order.status} size="lg" />
                  <PaymentStatusBadge status={order.paymentStatus} size="lg" />
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Placed on {formatDateTime(new Date(order.createdAt))}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Customer & Order Details */}
              <div className="space-y-6 md:col-span-2">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Customer Information
                  </h4>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {order.customerName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {order.customerEmail}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Shipping Address
                  </h4>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <p>{order.shippingInfo.address}</p>
                    <p>
                      {order.shippingInfo.city}, {order.shippingInfo.state}{" "}
                      {order.shippingInfo.postalCode}
                    </p>
                    <p>{order.shippingInfo.country}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Order Items
                  </h4>
                  <div className="border dark:border-gray-700 rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Product
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Price
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Quantity
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {order.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {item.imageUrl && (
                                  <div className="flex-shrink-0 h-10 w-10 mr-3">
                                    <img
                                      className="h-10 w-10 rounded-md object-cover"
                                      src={item.imageUrl}
                                      alt={item.name}
                                    />
                                  </div>
                                )}
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {item.name}
                                  {item.customization && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      {item.customization.font &&
                                        `Font: ${item.customization.font}`}
                                      {item.customization.font &&
                                        item.customization.style &&
                                        ", "}
                                      {item.customization.style &&
                                        `Style: ${item.customization.style}`}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {formatCurrency(item.price)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 font-medium">
                              {formatCurrency(item.price * item.quantity)}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td
                            colSpan={3}
                            className="px-6 py-4 text-right text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Total:
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                            {formatCurrency(order.totalAmount)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Order Management */}
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                    Order Status
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Change Status
                      </label>
                      <div className="flex items-center space-x-2">
                        <select
                          value={selectedStatus}
                          onChange={(e) =>
                            setSelectedStatus(e.target.value as OrderStatus)
                          }
                          className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 text-sm text-gray-700 dark:text-gray-300"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={handleStatusChange}
                          disabled={
                            isSubmitting || selectedStatus === order.status
                          }
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Update
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Payment Status
                      </label>
                      <div className="flex items-center space-x-2">
                        <select
                          value={selectedPaymentStatus}
                          onChange={(e) =>
                            setSelectedPaymentStatus(
                              e.target.value as PaymentStatus
                            )
                          }
                          className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 text-sm text-gray-700 dark:text-gray-300"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                        </select>
                        <button
                          onClick={handlePaymentStatusChange}
                          disabled={
                            isSubmitting ||
                            selectedPaymentStatus === order.paymentStatus
                          }
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                    Tracking Information
                  </h4>
                  {!isEditingTracking && (
                    <div>
                      {order.trackingNumber ? (
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <Truck className="h-4 w-4 inline mr-1" />
                            {order.trackingNumber}
                          </p>
                          <button
                            onClick={() => setIsEditingTracking(true)}
                            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setIsEditingTracking(true)}
                          className="flex items-center text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                        >
                          <Truck className="h-4 w-4 mr-1" />
                          Add tracking number
                        </button>
                      )}
                    </div>
                  )}

                  {isEditingTracking && (
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tracking Number
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 text-sm text-gray-700 dark:text-gray-300"
                          placeholder="Enter tracking number"
                        />
                        <button
                          onClick={handleTrackingSubmit}
                          disabled={isSubmitting || !trackingNumber}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                    Order Notes
                  </h4>

                  <div className="space-y-3 mb-4">
                    {order.notes && (
                      <div className="text-sm text-gray-700 dark:text-gray-300 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                        {order.notes}
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleNoteSubmit}>
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Add Note
                      </label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                        className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 text-sm text-gray-700 dark:text-gray-300"
                        placeholder="Add a note to this order..."
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting || !note.trim()}
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Add Note
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
