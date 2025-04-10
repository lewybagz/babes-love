import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { CustomersFilter } from "../../components/admin/customers/CustomersFilter";
import { CustomersList } from "../../components/admin/customers/CustomersList";
import { CustomerDetailModal } from "../../components/admin/customers/CustomerDetailModal";
import { useAdminCustomers } from "../../hooks/useAdminCustomers";
import { AdminCustomer, CustomerFilterOptions } from "../../types/admin";
import { toast } from "react-hot-toast";

export const CustomersPage = () => {
  const [selectedCustomer, setSelectedCustomer] =
    useState<AdminCustomer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState<CustomerFilterOptions>({});

  const {
    customers,
    loading,
    loadMoreCustomers,
    hasMore,
    error,
    applyFilters,
    addCustomerNotes,
    getCustomerById,
  } = useAdminCustomers();

  useEffect(() => {
    document.title = "Customers Management | Admin Dashboard";
  }, []);

  const handleFilterChange = (newFilters: CustomerFilterOptions) => {
    setFilterOptions(newFilters);
    applyFilters(newFilters);
  };

  const handleViewCustomer = async (customer: AdminCustomer) => {
    try {
      // Get the most up-to-date customer data
      const updatedCustomer = await getCustomerById(customer.id);
      if (updatedCustomer) {
        setSelectedCustomer(updatedCustomer);
        setIsModalOpen(true);
      } else {
        toast.error("Could not find customer details");
      }
    } catch (error) {
      toast.error("Error loading customer details");
      console.error("Error loading customer details:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleAddNotes = async (customerId: string, notes: string) => {
    try {
      await addCustomerNotes(customerId, notes);

      // Update the selected customer with the new notes
      if (selectedCustomer) {
        setSelectedCustomer({
          ...selectedCustomer,
          notes,
        });
      }

      toast.success("Notes updated successfully");
    } catch (error) {
      toast.error("Failed to update notes");
      console.error("Error updating notes:", error);
      throw error; // Re-throw to handle in component
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Customers
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and view details about your store's customers.
          </p>
        </div>

        <div className="px-4 py-5 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <CustomersFilter
            filters={filterOptions}
            onFilterChange={handleFilterChange}
          />

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-md text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <CustomersList
            customers={customers}
            isLoading={loading}
            hasMore={hasMore}
            onLoadMore={() => loadMoreCustomers()}
            onSelectCustomer={handleViewCustomer}
          />
        </div>
      </div>

      <CustomerDetailModal
        customer={selectedCustomer}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddNotes={handleAddNotes}
      />
    </AdminLayout>
  );
};
