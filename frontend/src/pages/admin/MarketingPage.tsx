import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import CampaignForm from "../../components/admin/marketing/CampaignForm";
import CampaignCard from "../../components/admin/marketing/CampaignCard";
import MarketingBarChart from "../../components/admin/marketing/MarketingBarChart";
import MarketingSummary from "../../components/admin/marketing/MarketingSummary";
import CampaignComparison from "../../components/admin/marketing/CampaignComparison";
import { MarketingCampaign } from "../../types/marketing";
import { mockMarketingCampaigns } from "../../data/mockMarketingCampaigns";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Filter,
  Search,
  BarChart,
} from "lucide-react";

const MarketingPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(
    mockMarketingCampaigns
  );
  const [showForm, setShowForm] = useState(false);
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [showAnalytics, setShowAnalytics] = useState(true);

  // In a real application, this would fetch from an API
  useEffect(() => {
    // This simulates fetching data from an API
    // In a real application, you would call your API here
    // Example:
    // const fetchCampaigns = async () => {
    //   try {
    //     const response = await fetch('/api/marketing/campaigns');
    //     const data = await response.json();
    //     setCampaigns(data);
    //   } catch (error) {
    //     console.error('Error fetching campaigns:', error);
    //   }
    // };
    //
    // fetchCampaigns();
    // For now, we're using mock data already set in the initial state
  }, []);

  const handleAddClick = () => {
    setEditingCampaignId(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditCampaign = (campaignId: string) => {
    setEditingCampaignId(campaignId);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCampaignId(null);
  };

  const handleFormSuccess = (campaign: MarketingCampaign) => {
    if (editingCampaignId) {
      // Update existing campaign
      setCampaigns(
        campaigns.map((c) => (c.id === editingCampaignId ? campaign : c))
      );
    } else {
      // Add new campaign
      setCampaigns([campaign, ...campaigns]);
    }
    setShowForm(false);
    setEditingCampaignId(null);
  };

  const handleDeleteCampaign = (campaignId: string) => {
    // Show confirm dialog
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      setCampaigns(campaigns.filter((c) => c.id !== campaignId));
    }
  };

  // Filter and search campaigns
  const filteredCampaigns = campaigns.filter((campaign) => {
    // Check if campaign matches search term
    const matchesSearch =
      searchTerm === "" ||
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Check if campaign matches status filter
    const matchesStatus =
      filterStatus === "" || campaign.status === filterStatus;

    // Check if campaign matches type filter
    const matchesType = filterType === "" || campaign.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Title and Add Campaign Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Marketing Campaigns
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <BarChart className="h-4 w-4 mr-2" />
              {showAnalytics ? "Hide Analytics" : "Show Analytics"}
            </button>
            <button
              onClick={handleAddClick}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Campaign
            </button>
          </div>
        </div>

        {/* Campaign Analytics */}
        {showAnalytics && (
          <>
            {/* Summary Metrics */}
            <MarketingSummary campaigns={campaigns} />

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <MarketingBarChart campaigns={campaigns} />
              <CampaignComparison campaigns={campaigns} />
            </div>
          </>
        )}

        {/* Campaign Form Section */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-8">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {editingCampaignId ? "Edit Campaign" : "Add New Campaign"}
              </h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showForm ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="p-6">
              <CampaignForm
                campaignId={editingCampaignId}
                existingCampaigns={campaigns}
                onSuccess={handleFormSuccess}
                onCancel={handleFormClose}
              />
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label
                  htmlFor="statusFilter"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Status
                </label>
                <select
                  id="statusFilter"
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label
                  htmlFor="typeFilter"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Campaign Type
                </label>
                <select
                  id="typeFilter"
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="email">Email Campaign</option>
                  <option value="social">Social Media</option>
                  <option value="discount">Discount Code</option>
                  <option value="banner">Banner Ads</option>
                  <option value="push">Push Notifications</option>
                  <option value="seo">SEO Campaign</option>
                  <option value="event">Event</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Campaigns List */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Campaigns
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredCampaigns.length} campaigns
            </div>
          </div>

          <div className="p-6">
            {filteredCampaigns.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {campaigns.length === 0
                    ? "No campaigns found. Get started by adding a new campaign."
                    : "No campaigns match your current filters."}
                </p>
                {campaigns.length === 0 && (
                  <button
                    onClick={handleAddClick}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Campaign
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    onEdit={handleEditCampaign}
                    onDelete={handleDeleteCampaign}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MarketingPage;
