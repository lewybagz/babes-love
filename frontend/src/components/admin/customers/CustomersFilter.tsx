import React, { useState } from "react";
import { CustomerFilterOptions } from "../../../types/admin";
import { Search, Calendar } from "lucide-react";

interface CustomersFilterProps {
  filters: CustomerFilterOptions;
  onFilterChange: (filters: CustomerFilterOptions) => void;
}

export const CustomersFilter: React.FC<CustomersFilterProps> = ({
  filters,
  onFilterChange,
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || "");
  const [fromDate, setFromDate] = useState<string>(
    filters.dateRange?.from
      ? filters.dateRange.from.toISOString().split("T")[0]
      : ""
  );
  const [toDate, setToDate] = useState<string>(
    filters.dateRange?.to
      ? filters.dateRange.to.toISOString().split("T")[0]
      : ""
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      ...filters,
      searchTerm,
    });
  };

  const handleOrderFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFilterChange({
      ...filters,
      hasOrders: value === "" ? undefined : value === "true",
    });
  };

  const handleDateChange = () => {
    const dateRange = {
      from: fromDate ? new Date(fromDate) : undefined,
      to: toDate ? new Date(toDate) : undefined,
    };

    onFilterChange({
      ...filters,
      dateRange: dateRange.from || dateRange.to ? dateRange : undefined,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFromDate("");
    setToDate("");
    onFilterChange({
      searchTerm: "",
      hasOrders: undefined,
      dateRange: undefined,
    });
  };

  const hasActiveFilters = () => {
    return !!(
      filters.searchTerm ||
      filters.hasOrders !== undefined ||
      (filters.dateRange && (filters.dateRange.from || filters.dateRange.to))
    );
  };

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4 mb-6">
      <form onSubmit={handleSearchSubmit} className="relative flex-grow">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-500" />
          </span>
          <input
            type="text"
            placeholder="Search customers by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        <select
          value={
            filters.hasOrders !== undefined ? String(filters.hasOrders) : ""
          }
          onChange={handleOrderFilterChange}
          className="w-[160px] py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Customers</option>
          <option value="true">Has Orders</option>
          <option value="false">No Orders</option>
        </select>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setTimeout(handleDateChange, 0);
              }}
              className="py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="From"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setTimeout(handleDateChange, 0);
              }}
              className="py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="To"
            />
          </div>
        </div>

        {hasActiveFilters() && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-xs py-2 px-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 
                     text-gray-700 dark:text-gray-200 rounded-md transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};
