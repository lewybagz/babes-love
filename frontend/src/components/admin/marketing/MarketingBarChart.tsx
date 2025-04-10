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
import { MarketingCampaign } from "../../../types/marketing";

interface MarketingBarChartProps {
  campaigns: MarketingCampaign[];
}

const MarketingBarChart: React.FC<MarketingBarChartProps> = ({ campaigns }) => {
  // Transform campaign data for the chart
  const chartData = campaigns
    .filter((campaign) => campaign.metrics) // Only include campaigns with metrics
    .map((campaign) => ({
      name: campaign.name,
      impressions: campaign.metrics?.impressions || 0,
      clicks: campaign.metrics?.clicks || 0,
      conversions: campaign.metrics?.conversions || 0,
      roi: campaign.metrics?.roi || 0,
      type: campaign.type,
    }))
    .sort((a, b) => b.conversions - a.conversions) // Sort by conversions descending
    .slice(0, 5); // Take top 5 campaigns

  // Use a custom color based on campaign type
  const getBarColor = (type: string) => {
    switch (type) {
      case "email":
        return "#3498db"; // blue
      case "social":
        return "#9b59b6"; // purple
      case "discount":
        return "#2ecc71"; // green
      case "banner":
        return "#e74c3c"; // red
      case "push":
        return "#f39c12"; // orange
      case "seo":
        return "#1abc9c"; // teal
      case "event":
        return "#d35400"; // dark orange
      default:
        return "#7f8c8d"; // gray
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Campaign Performance
        </h2>
      </div>
      <div className="p-4">
        {chartData.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No campaign metrics available to display
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 70,
              }}
              barSize={20}
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
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
                stroke="#718096"
              />
              <YAxis yAxisId="left" stroke="#718096" />
              <YAxis yAxisId="right" orientation="right" stroke="#718096" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: 20, marginTop: 20 }} />
              <Bar
                yAxisId="left"
                dataKey="conversions"
                fill="#38b2ac"
                name="Conversions"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="left"
                dataKey="clicks"
                fill="#4299e1"
                name="Clicks"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey="roi"
                fill="#ed8936"
                name="ROI (x)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default MarketingBarChart;
