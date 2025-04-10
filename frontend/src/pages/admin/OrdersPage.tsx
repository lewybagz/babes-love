import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminOrders } from "../../hooks/useAdminOrders";
import { OrdersFilter } from "../../components/admin/orders/OrdersFilter";
import { OrdersList } from "../../components/admin/orders/OrdersList";
import { OrderDetailModal } from "../../components/admin/orders/OrderDetailModal";
import { AdminLayout } from "../../components/admin/AdminLayout";
import {
  AdminOrder,
  OrderFilterOptions,
  OrderStatus,
  PaymentStatus,
} from "../../types/admin";
import toast from "react-hot-toast";

const AdminOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [filterOptions, setFilterOptions] = useState<OrderFilterOptions>({
    searchTerm: "",
    status: undefined,
    paymentStatus: undefined,
    dateRange: undefined,
  });

  const {
    orders,
    loading: isLoading,
    error,
    loadOrders,
    updateOrderStatus,
    updatePaymentStatus,
    addTrackingNumber,
    addOrderNotes,
    getOrderById,
  } = useAdminOrders();

  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleFilterChange = (newFilters: OrderFilterOptions) => {
    setFilterOptions(newFilters);
    loadOrders(newFilters);
  };

  const handleViewOrder = async (orderId: string) => {
    try {
      const order = await getOrderById(orderId);
      if (order) {
        setSelectedOrder(order);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      toast.error("Failed to load order details");
    }
  };

  const handleEditOrder = (orderId: string) => {
    navigate(`/admin/orders/${orderId}/edit`);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success(`Order status updated to ${status}`);

      // Update the selected order with the new status
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          status,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const handleUpdatePaymentStatus = async (
    orderId: string,
    paymentStatus: PaymentStatus
  ) => {
    try {
      await updatePaymentStatus(orderId, paymentStatus);
      toast.success(`Payment status updated to ${paymentStatus}`);

      // Update the selected order with the new payment status
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          paymentStatus,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      toast.error("Failed to update payment status");
    }
  };

  const handleAddTrackingNumber = async (
    orderId: string,
    trackingNumber: string
  ) => {
    try {
      await addTrackingNumber(orderId, trackingNumber);
      toast.success("Tracking number added and order marked as shipped");

      // Update the selected order with the new tracking number and status
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          trackingNumber,
          status: "shipped",
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      toast.error("Failed to add tracking number");
    }
  };

  const handleAddNote = async (orderId: string, note: string) => {
    try {
      await addOrderNotes(orderId, note);
      toast.success("Note added to order");

      // Update the selected order with the new note
      if (selectedOrder && selectedOrder.id === orderId) {
        const updatedNotes = selectedOrder.notes
          ? `${selectedOrder.notes}\n\n${note}`
          : note;
        setSelectedOrder({
          ...selectedOrder,
          notes: updatedNotes,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      toast.error("Failed to add note");
    }
  };

  useEffect(() => {
    loadOrders(filterOptions);
  }, []);

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
            Orders
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-md mb-6">
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <OrdersFilter
              filters={filterOptions}
              onFilterChange={handleFilterChange}
            />

            <OrdersList
              orders={orders}
              isLoading={isLoading}
              onViewOrder={handleViewOrder}
              onEditOrder={handleEditOrder}
            />
          </div>
        </div>

        <OrderDetailModal
          order={selectedOrder}
          isOpen={isDetailModalOpen}
          onClose={handleCloseModal}
          onUpdateStatus={handleUpdateStatus}
          onUpdatePaymentStatus={handleUpdatePaymentStatus}
          onAddTrackingNumber={handleAddTrackingNumber}
          onAddNote={handleAddNote}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
