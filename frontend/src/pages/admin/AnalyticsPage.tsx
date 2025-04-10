import React, { useState } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { useAdminAnalytics } from "../../hooks/useAdminAnalytics";
import {
  TimePeriod,
  KpiCardData,
  SalesDataPoint,
  TopProductData,
} from "../../types/admin";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import {
  ArrowUp,
  ArrowDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
} from "lucide-react";
import { format } from "date-fns";
import CustomerActivityChart from "../../components/admin/analytics/CustomerActivityChart";

// Helper to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

// --- Reusable Components ---

interface KpiCardProps {
  data: KpiCardData;
}

const KpiCard: React.FC<KpiCardProps> = ({ data }) => {
  const { title, value, change, changePeriod, description } = data;
  const isPositiveChange = change !== undefined && change >= 0;

  let IconComponent = DollarSign; // Default
  if (title.includes("Orders")) IconComponent = ShoppingCart;
  if (title.includes("Items") || title.includes("Product"))
    IconComponent = Package;
  if (title.includes("Customer")) IconComponent = Users;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
        <IconComponent className="h-6 w-6 text-gray-400 dark:text-gray-500" />
      </div>
      <div className="flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
        {change !== undefined && (
          <span
            className={`ml-2 flex items-baseline text-sm font-semibold ${
              isPositiveChange
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {isPositiveChange ? (
              <ArrowUp className="h-4 w-4 self-center flex-shrink-0" />
            ) : (
              <ArrowDown className="h-4 w-4 self-center flex-shrink-0" />
            )}
            <span className="sr-only">
              {" "}
              {isPositiveChange ? "Increased" : "Decreased"} by{" "}
            </span>
            {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>
      {changePeriod && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {changePeriod}
        </p>
      )}
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      )}
    </div>
  );
};

interface SalesChartProps {
  data: SalesDataPoint[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  if (!data || data.length === 0)
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-10">
        No sales data available for this period.
      </p>
    );

  // Format date for XAxis based on data (detect if monthly or daily)
  const dateFormat = data[0]?.date.length === 7 ? "MMM yy" : "MMM d";
  const formattedData = data.map((d) => ({
    ...d,
    formattedDate: format(new Date(d.date), dateFormat),
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 h-96">
      {" "}
      {/* Fixed height */}
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Sales Overview
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{ top: 5, right: 20, left: 10, bottom: 40 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(128, 128, 128, 0.2)"
          />
          <XAxis
            dataKey="formattedDate"
            angle={-45}
            textAnchor="end"
            height={60} // Adjust height for angled labels
            tick={{ fontSize: 10, fill: "#6b7280" }} // Tailwind gray-500
            interval="preserveStartEnd" // Show first and last, skip some in between
          />
          <YAxis
            yAxisId="left"
            tickFormatter={(value) => `$${value}`}
            tick={{ fontSize: 10, fill: "#6b7280" }}
            width={50}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 10, fill: "#6b7280" }}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "none",
              borderRadius: "5px",
            }}
            labelStyle={{ color: "#fff" }}
            itemStyle={{ color: "#eee" }}
            formatter={(value: number, name: string) => {
              if (name === "Revenue") return formatCurrency(value);
              return value;
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="orders"
            name="Orders"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

interface TopProductsListProps {
  data: TopProductData[];
}

const TopProductsList: React.FC<TopProductsListProps> = ({ data }) => {
  if (!data || data.length === 0)
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-10">
        No product data available.
      </p>
    );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Top Selling Products
      </h3>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {data.slice(0, 5).map(
          (
            product // Show top 5
          ) => (
            <li
              key={product.id}
              className="py-3 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={product.imageUrl || "/images/placeholder.png"}
                  alt={product.name}
                  className="h-10 w-10 rounded object-cover flex-shrink-0"
                />
                <div>
                  <p
                    className="text-sm font-medium text-gray-900 dark:text-white truncate w-40"
                    title={product.name}
                  >
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Sold: {product.unitsSold}
                  </p>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {formatCurrency(product.revenue)}
              </p>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

// --- Main Page Component ---

export const AnalyticsPage: React.FC = () => {
  const {
    data,
    loading,
    error,
    options,
    setTimePeriod,
    setCustomDateRange,
    refreshData,
  } = useAdminAnalytics();

  const handleTimePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimePeriod(e.target.value as TimePeriod);
  };

  // Add state and handler for custom date range picker if needed later

  return (
    <AdminLayout>
      <div className="container flex justify-between items-center mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Analytics Overview
        </h1>
        {/* Time Period Selector */}
        <div className="flex items-center space-x-2">
          <select
            value={options.timePeriod}
            onChange={handleTimePeriodChange}
            disabled={loading}
            className="block w-fit pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
            <option value="all">All Time</option>{" "}
            {/* Add custom range option later */}
          </select>
          <button
            onClick={refreshData}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
          {/* Add Custom Date Range Picker here later */}
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading analytics data...
          </p>
        </div>
      )}
      {error && (
        <div className="text-center py-12 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md border border-red-200 dark:border-red-700">
          <p>Error loading analytics: {error}</p>
          <button
            onClick={refreshData}
            className="mt-4 px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Try Again
          </button>
        </div>
      )}
      {data && !loading && !error && (
        <div className="container mx-auto px-4 py-8 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data.kpis.map((kpi) => (
              <KpiCard key={kpi.title} data={kpi} />
            ))}
          </div>

          {/* Sales Chart */}
          <SalesChart data={data.salesOverTime} />

          {/* Other Charts/Tables - Example: Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <TopProductsList data={data.topProducts} />
            </div>
            <div className="lg:col-span-2">
              <CustomerActivityChart data={data.customerActivity} />
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AnalyticsPage;
