import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Define the data structure for customer activity
interface CustomerActivityData {
  date: string;
  newUsers: number;
  activeUsers: number;
  purchases: number;
  productViews: number;
}

interface CustomerActivityChartProps {
  data: CustomerActivityData[];
}

const CustomerActivityChart: React.FC<CustomerActivityChartProps> = ({
  data,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Customer Activity
        </h2>
      </div>
      <div className="p-4">
        {data.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No customer activity data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 70,
              }}
              barSize={18}
              barCategoryGap={10}
              barGap={10}
              layout="horizontal"
              stackOffset="sign"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#ccc"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
                stroke="#718096"
              />
              <YAxis stroke="#718096" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: 20 }} />
              <Bar
                dataKey="newUsers"
                name="New Users"
                fill="#4299e1"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="activeUsers"
                name="Active Users"
                fill="#38b2ac"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="purchases"
                name="Purchases"
                fill="#9f7aea"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="productViews"
                name="Product Views"
                fill="#ed8936"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default CustomerActivityChart;
