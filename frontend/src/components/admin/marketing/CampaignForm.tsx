import React, { useState, useEffect } from "react";
import {
  MarketingCampaign,
  CAMPAIGN_TYPES,
  CAMPAIGN_STATUSES,
} from "../../../types/marketing";
import { v4 as uuidv4 } from "uuid";

interface CampaignFormProps {
  campaignId?: string | null;
  existingCampaigns: MarketingCampaign[];
  onSuccess: (campaign: MarketingCampaign) => void;
  onCancel: () => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({
  campaignId,
  existingCampaigns,
  onSuccess,
  onCancel,
}) => {
  const defaultCampaign: MarketingCampaign = {
    id: "",
    name: "",
    description: "",
    type: "email",
    status: "draft",
    startDate: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const [campaign, setCampaign] = useState<MarketingCampaign>(defaultCampaign);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (campaignId) {
      const existingCampaign = existingCampaigns.find(
        (c) => c.id === campaignId
      );
      if (existingCampaign) {
        // Format dates for input fields
        const formattedCampaign = {
          ...existingCampaign,
          startDate: existingCampaign.startDate.split("T")[0],
          endDate: existingCampaign.endDate
            ? existingCampaign.endDate.split("T")[0]
            : "",
        };
        setCampaign(formattedCampaign);
      }
    }
  }, [campaignId, existingCampaigns]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setCampaign((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!campaign.name.trim()) {
      newErrors.name = "Campaign name is required";
    }

    if (!campaign.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!campaign.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (
      campaign.endDate &&
      new Date(campaign.endDate) < new Date(campaign.startDate)
    ) {
      newErrors.endDate = "End date must be after start date";
    }

    if (campaign.budget && isNaN(Number(campaign.budget))) {
      newErrors.budget = "Budget must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const now = new Date().toISOString();
    const updatedCampaign: MarketingCampaign = {
      ...campaign,
      id: campaign.id || uuidv4(),
      updatedAt: now,
      // If this is a new campaign, set createdAt
      createdAt: campaign.createdAt || now,
      // Convert budget to number if present
      budget: campaign.budget ? Number(campaign.budget) : undefined,
    };

    onSuccess(updatedCampaign);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Campaign Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={campaign.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${
              errors.name
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500`}
            placeholder="e.g. Summer Sale 2023"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Campaign Type *
          </label>
          <select
            id="type"
            name="type"
            value={campaign.type}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {CAMPAIGN_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={campaign.description}
            onChange={handleChange}
            rows={3}
            className={`w-full px-3 py-2 rounded-md border ${
              errors.description
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500`}
            placeholder="Describe your campaign"
          ></textarea>
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Status *
          </label>
          <select
            id="status"
            name="status"
            value={campaign.status}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {CAMPAIGN_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="target"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Target Audience
          </label>
          <input
            type="text"
            id="target"
            name="target"
            value={campaign.target || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="e.g. Email subscribers"
          />
        </div>

        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Start Date *
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={campaign.startDate}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${
              errors.startDate
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500`}
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={campaign.endDate || ""}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${
              errors.endDate
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500`}
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="budget"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Budget ($)
          </label>
          <input
            type="text"
            id="budget"
            name="budget"
            value={campaign.budget || ""}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${
              errors.budget
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500`}
            placeholder="e.g. 500"
          />
          {errors.budget && (
            <p className="mt-1 text-sm text-red-500">{errors.budget}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
        >
          {campaignId ? "Update Campaign" : "Create Campaign"}
        </button>
      </div>
    </form>
  );
};

export default CampaignForm;
