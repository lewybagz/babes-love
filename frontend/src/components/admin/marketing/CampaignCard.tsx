import React from "react";
import { MarketingCampaign } from "../../../types/marketing";
import { Calendar, DollarSign, Target, BarChart2 } from "lucide-react";
import { formatDate, formatCurrency } from "../../../utils/formatters";

interface CampaignCardProps {
  campaign: MarketingCampaign;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  onEdit,
  onDelete,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "draft":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return "📧";
      case "social":
        return "👥";
      case "discount":
        return "🏷️";
      case "banner":
        return "🖼️";
      case "push":
        return "📱";
      case "seo":
        return "🔍";
      case "event":
        return "🎉";
      default:
        return "📈";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">
                {getCampaignTypeIcon(campaign.type)}
              </span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {campaign.name}
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {campaign.description}
            </p>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              campaign.status
            )}`}
          >
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
            <span>
              {formatDate(campaign.startDate)}
              {campaign.endDate ? ` - ${formatDate(campaign.endDate)}` : ""}
            </span>
          </div>
          {campaign.budget && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <DollarSign className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
              <span>{formatCurrency(campaign.budget)}</span>
            </div>
          )}
          {campaign.target && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Target className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
              <span>{campaign.target}</span>
            </div>
          )}
          {campaign.metrics && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <BarChart2 className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
              <span>{campaign.metrics.conversions || 0} conversions</span>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={() => onEdit(campaign.id)}
            className="px-3 py-1 text-xs font-medium text-brand-600 bg-brand-50 rounded hover:bg-brand-100 dark:bg-brand-900/20 dark:text-brand-400 dark:hover:bg-brand-900/30"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(campaign.id)}
            className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
