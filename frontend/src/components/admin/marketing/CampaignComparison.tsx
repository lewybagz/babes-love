import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { MarketingCampaign } from "../../../types/marketing";

interface CampaignComparisonProps {
  campaigns: MarketingCampaign[];
}

const CampaignComparison: React.FC<CampaignComparisonProps> = ({
  campaigns,
}) => {
  // Group campaigns by type and calculate total metrics for each type
  const campaignsByType = campaigns.reduce((acc, campaign) => {
    if (!campaign.metrics) return acc;

    const type = campaign.type;
    if (!acc[type]) {
      acc[type] = {
        name: formatCampaignType(type),
        conversions: 0,
        clicks: 0,
        impressions: 0,
        value: 0,
        budget: 0,
        count: 0,
        type,
      };
    }

    acc[type].conversions += campaign.metrics.conversions || 0;
    acc[type].clicks += campaign.metrics.clicks || 0;
    acc[type].impressions += campaign.metrics.impressions || 0;
    acc[type].budget += campaign.budget || 0;
    acc[type].count += 1;

    // Calculate campaign value (using conversions for now)
    acc[type].value += campaign.metrics.conversions || 0;

    return acc;
  }, {} as Record<string, any>);

  const pieData = Object.values(campaignsByType)
    .filter((type: any) => type.value > 0)
    .sort((a: any, b: any) => b.value - a.value);

  // Map campaign types to colors
  const COLORS = {
    email: "#3498db", // blue
    social: "#9b59b6", // purple
    discount: "#2ecc71", // green
    banner: "#e74c3c", // red
    push: "#f39c12", // orange
    seo: "#1abc9c", // teal
    event: "#d35400", // dark orange
    other: "#7f8c8d", // gray
  };

  function formatCampaignType(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-md text-xs">
          <p className="font-bold">{data.name}</p>
          <p>Campaigns: {data.count}</p>
          <p>Conversions: {data.conversions}</p>
          <p>Clicks: {data.clicks}</p>
          <p>Impressions: {data.impressions}</p>
          {data.budget > 0 && <p>Budget: ${data.budget}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-96">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Campaign Type Effectiveness
        </h2>
      </div>
      <div className="p-4 h-80">
        {pieData.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500 dark:text-gray-400">
            No campaign metrics available to display
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry: any) => (
                  <Cell
                    key={entry.type}
                    fill={
                      COLORS[entry.type as keyof typeof COLORS] || "#7f8c8d"
                    }
                  />
                ))}
              </Pie>
              <Tooltip content={customTooltip} />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                formatter={(value) => <span className="text-xs">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default CampaignComparison;
