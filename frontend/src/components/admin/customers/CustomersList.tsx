import React from "react";
import { AdminCustomer } from "../../../types/admin";
import { formatCurrency } from "../../../utils/formatters";
import { Calendar, Clipboard, Mail, Phone, ShoppingBag } from "lucide-react";

interface CustomersListProps {
  customers: AdminCustomer[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onSelectCustomer: (customer: AdminCustomer) => void;
}

export const CustomersList: React.FC<CustomersListProps> = ({
  customers,
  isLoading,
  hasMore,
  onLoadMore,
  onSelectCustomer,
}) => {
  if (isLoading && customers.length === 0) {
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

  if (customers.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          No customers found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
                Customer
              </th>
              <th
                scope="col"
                className="sticky top-0 z-10 border-b border-gray-300 dark:border-gray-700 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Contact
              </th>
              <th
                scope="col"
                className="sticky top-0 z-10 border-b border-gray-300 dark:border-gray-700 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Created
              </th>
              <th
                scope="col"
                className="sticky top-0 z-10 border-b border-gray-300 dark:border-gray-700 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Orders
              </th>
              <th
                scope="col"
                className="sticky top-0 z-10 border-b border-gray-300 dark:border-gray-700 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Total Spent
              </th>
              <th
                scope="col"
                className="sticky top-0 z-10 border-b border-gray-300 dark:border-gray-700 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Last Order
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-800">
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                onClick={() => onSelectCustomer(customer)}
              >
                <td className="border-b border-gray-200 dark:border-gray-700 py-4 pl-4 pr-3">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {(customer.firstName?.[0] || "") +
                          (customer.lastName?.[0] || "")}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {customer.displayName ||
                          `${customer.firstName || ""} ${
                            customer.lastName || ""
                          }`.trim() ||
                          customer.email.split("@")[0]}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Clipboard className="h-3 w-3 mr-1" />
                        <span>{customer.id}</span>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="border-b border-gray-200 dark:border-gray-700 px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white flex items-center">
                    <Mail className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{customer.email}</span>
                  </div>
                  {customer.phoneNumber && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <Phone className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{customer.phoneNumber}</span>
                    </div>
                  )}
                </td>

                <td className="border-b border-gray-200 dark:border-gray-700 px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{formatDate(customer.dateCreated)}</span>
                  </div>
                </td>

                <td className="border-b border-gray-200 dark:border-gray-700 px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {customer.orderCount}
                    </span>
                  </div>
                </td>

                <td className="border-b border-gray-200 dark:border-gray-700 px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {formatCurrency(customer.totalSpent)}
                  </div>
                </td>

                <td className="border-b border-gray-200 dark:border-gray-700 px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {formatDate(customer.lastOrderDate)}
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
