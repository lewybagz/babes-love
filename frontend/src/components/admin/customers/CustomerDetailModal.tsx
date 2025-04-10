import React, { useState } from "react";
import { AdminCustomer, Address } from "../../../types/admin";
import { formatCurrency } from "../../../utils/formatters";
import {
  X,
  Calendar,
  Mail,
  Phone,
  ShoppingBag,
  DollarSign,
  MapPin,
  Edit,
  Save,
  Plus,
} from "lucide-react";

interface CustomerDetailModalProps {
  customer: AdminCustomer | null;
  isOpen: boolean;
  onClose: () => void;
  onAddNotes: (customerId: string, notes: string) => Promise<void>;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  isOpen,
  onClose,
  onAddNotes,
}) => {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !customer) return null;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleEditNotes = () => {
    setNotes(customer.notes || "");
    setEditingNotes(true);
  };

  const handleSaveNotes = async () => {
    setLoading(true);
    try {
      await onAddNotes(customer.id, notes);
      setEditingNotes(false);
    } catch (error) {
      console.error("Error saving notes:", error);
    } finally {
      setLoading(false);
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
          className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg md:max-w-xl w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Customer Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6">
            <div className="flex flex-col sm:flex-row mb-6 gap-4">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                      {(customer.firstName?.[0] || "") +
                        (customer.lastName?.[0] || "")}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {customer.displayName ||
                        `${customer.firstName || ""} ${
                          customer.lastName || ""
                        }`.trim() ||
                        customer.email.split("@")[0]}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {customer.id}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Email
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {customer.email}
                      </p>
                    </div>
                  </div>
                  {customer.phoneNumber && (
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Phone
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {customer.phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Account Created
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {formatDate(customer.dateCreated)}
                      </p>
                    </div>
                  </div>
                  {customer.lastLogin && (
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Last Login
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {formatDate(customer.lastLogin)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-gray-700 pt-4 sm:pt-0 sm:pl-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-base font-medium text-gray-900 dark:text-white">
                    Order Summary
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start">
                    <ShoppingBag className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Total Orders
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {customer.orderCount}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <DollarSign className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Total Spent
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {formatCurrency(customer.totalSpent)}
                      </p>
                    </div>
                  </div>
                  {customer.lastOrderDate && (
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Last Order
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {formatDate(customer.lastOrderDate)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {customer.addresses && customer.addresses.length > 0 && (
              <div className="mb-6">
                <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                  Addresses
                </h4>
                <div className="space-y-3">
                  {customer.addresses.map((address: Address) => (
                    <div
                      key={address.id}
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-md"
                    >
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                        <div>
                          {address.isPrimary && (
                            <span className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md mb-1">
                              Primary
                            </span>
                          )}
                          <p className="text-sm text-gray-900 dark:text-white">
                            {address.addressLine1}
                            {address.addressLine2 && (
                              <span>, {address.addressLine2}</span>
                            )}
                          </p>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {address.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-base font-medium text-gray-900 dark:text-white">
                  Notes
                </h4>
                <button
                  onClick={handleEditNotes}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {customer.notes ? (
                    <Edit className="h-4 w-4 mr-1" />
                  ) : (
                    <Plus className="h-4 w-4 mr-1" />
                  )}
                  {customer.notes ? "Edit Notes" : "Add Notes"}
                </button>
              </div>

              {editingNotes ? (
                <div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Add notes about this customer..."
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={() => setEditingNotes(false)}
                      className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNotes}
                      disabled={loading}
                      className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50"
                    >
                      {loading ? (
                        "Saving..."
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-700 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-900 rounded-md min-h-[80px]">
                  {customer.notes || "No notes."}
                </p>
              )}
            </div>
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
