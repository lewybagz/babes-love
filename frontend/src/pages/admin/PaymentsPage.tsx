import React, { useState } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { PaymentsFilter } from "../../components/admin/payments/PaymentsFilter";
import { PaymentsList } from "../../components/admin/payments/PaymentsList";
import { PaymentDetailModal } from "../../components/admin/payments/PaymentDetailModal";
import { useAdminPayments } from "../../hooks/useAdminPayments";
import { AdminPayment, PaymentFilterOptions } from "../../types/admin";

export const PaymentsPage: React.FC = () => {
  const {
    payments,
    loading: isLoading,
    hasMore,
    error,
    loadMorePayments: onLoadMore,
    applyFilters,
    processRefund,
    getPaymentById,
  } = useAdminPayments();

  const [selectedPayment, setSelectedPayment] = useState<AdminPayment | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);
  const [filterOptions, setFilterOptions] = useState<PaymentFilterOptions>({});

  const handleFilterChange = (newFilters: PaymentFilterOptions) => {
    setFilterOptions(newFilters);
    applyFilters(newFilters);
  };

  const handleViewPayment = async (paymentId: string) => {
    const payment = await getPaymentById(paymentId);
    if (payment) {
      setSelectedPayment(payment);
      setIsModalOpen(true);
    }
  };

  const handleProcessRefund = async (
    paymentId: string,
    amount: number,
    reason: string
  ) => {
    setIsProcessingRefund(true);
    try {
      const success = await processRefund(paymentId, amount, reason);
      if (success) {
        // Refresh payment details
        const updatedPayment = await getPaymentById(paymentId);
        if (updatedPayment) {
          setSelectedPayment(updatedPayment);
        }
      }
      return success;
    } catch (error) {
      console.error("Failed to process refund:", error);
      return false;
    } finally {
      setIsProcessingRefund(false);
    }
  };

  const handleSelectPayment = (payment: AdminPayment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <PaymentsFilter
              filters={filterOptions}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700">
            <PaymentsList
              payments={payments}
              isLoading={isLoading}
              hasMore={hasMore}
              onLoadMore={onLoadMore}
              onSelectPayment={handleSelectPayment}
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md">
            {error}
          </div>
        )}

        <PaymentDetailModal
          payment={selectedPayment}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onProcessRefund={handleProcessRefund}
          isProcessingRefund={isProcessingRefund}
        />
      </div>
    </AdminLayout>
  );
};
