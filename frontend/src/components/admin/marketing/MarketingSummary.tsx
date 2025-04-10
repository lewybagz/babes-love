import React from "react";
import { MarketingCampaign } from "../../../types/marketing";
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  PieChart,
  Users,
  MousePointer,
} from "lucide-react";

interface MarketingSummaryProps {
  campaigns: MarketingCampaign[];
}

const MarketingSummary: React.FC<MarketingSummaryProps> = ({ campaigns }) => {
  // Calculate total metrics across all campaigns
  const metrics = campaigns.reduce(
    (acc, campaign) => {
      if (campaign.metrics) {
        acc.impressions += campaign.metrics.impressions || 0;
        acc.clicks += campaign.metrics.clicks || 0;
        acc.conversions += campaign.metrics.conversions || 0;
        acc.budget += campaign.budget || 0;
      }
      return acc;
    },
    { impressions: 0, clicks: 0, conversions: 0, budget: 0 }
  );

  // Calculate derived metrics
  const clickRate = metrics.impressions
    ? (metrics.clicks / metrics.impressions) * 100
    : 0;
  const conversionRate = metrics.clicks
    ? (metrics.conversions / metrics.clicks) * 100
    : 0;
  const costPerConversion = metrics.conversions
    ? metrics.budget / metrics.conversions
    : 0;

  const summaryCards = [
    {
      title: "Impressions",
      value: metrics.impressions.toLocaleString(),
      icon: <Users className="h-6 w-6 text-blue-500" />,
      color: "bg-blue-100",
    },
    {
      title: "Clicks",
      value: metrics.clicks.toLocaleString(),
      subtext: `${clickRate.toFixed(2)}% CTR`,
      icon: <MousePointer className="h-6 w-6 text-indigo-500" />,
      color: "bg-indigo-100",
      trend: clickRate > 2 ? "up" : "down",
    },
    {
      title: "Conversions",
      value: metrics.conversions.toLocaleString(),
      subtext: `${conversionRate.toFixed(2)}% CVR`,
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      color: "bg-green-100",
      trend: conversionRate > 15 ? "up" : "down",
    },
    {
      title: "Total Budget",
      value: `$${metrics.budget.toLocaleString()}`,
      subtext: `$${costPerConversion.toFixed(2)} CPA`,
      icon: <CreditCard className="h-6 w-6 text-purple-500" />,
      color: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {summaryCards.map((card) => (
        <div
          key={card.title}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <div className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {card.title}
                </p>
                <div className="flex items-baseline mt-1">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {card.value}
                  </p>
                  {card.subtext && (
                    <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      {card.subtext}
                    </p>
                  )}
                </div>
                {card.trend && (
                  <div className="flex items-center mt-2">
                    {card.trend === "up" ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-xs text-green-500">
                          Performing well
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-xs text-red-500">
                          Needs optimization
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className={`p-3 rounded-full ${card.color}`}>
                {card.icon}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MarketingSummary;
