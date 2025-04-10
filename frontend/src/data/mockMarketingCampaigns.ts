import { MarketingCampaign } from "../types/marketing";

export const mockMarketingCampaigns: MarketingCampaign[] = [
  {
    id: "camp-001",
    name: "Summer Sale 2023",
    description: "30% off all summer items for the end of season clearance",
    type: "discount",
    status: "active",
    startDate: "2023-08-01",
    endDate: "2023-09-15",
    budget: 500,
    target: "All customers",
    createdAt: "2023-07-15T10:30:00Z",
    updatedAt: "2023-07-25T14:45:00Z",
    metrics: {
      impressions: 15000,
      clicks: 2500,
      conversions: 350,
      roi: 2.7
    }
  },
  {
    id: "camp-002",
    name: "New Arrivals Newsletter",
    description: "Email campaign announcing new fall collection",
    type: "email",
    status: "scheduled",
    startDate: "2023-09-10",
    endDate: "2023-09-20",
    budget: 300,
    target: "Email subscribers",
    createdAt: "2023-08-20T09:15:00Z",
    updatedAt: "2023-08-20T09:15:00Z"
  },
  {
    id: "camp-003",
    name: "Instagram Story Ads",
    description: "Promoted stories featuring customer testimonials",
    type: "social",
    status: "completed",
    startDate: "2023-07-01",
    endDate: "2023-07-31",
    budget: 750,
    target: "18-35 age group",
    createdAt: "2023-06-15T11:20:00Z",
    updatedAt: "2023-08-02T16:30:00Z",
    metrics: {
      impressions: 25000,
      clicks: 4800,
      conversions: 620,
      roi: 3.2
    }
  },
  {
    id: "camp-004",
    name: "Holiday Season Planning",
    description: "Comprehensive marketing plan for Q4 holiday sales",
    type: "other",
    status: "draft",
    startDate: "2023-11-01",
    endDate: "2023-12-31",
    budget: 2000,
    target: "All market segments",
    createdAt: "2023-08-30T08:45:00Z",
    updatedAt: "2023-08-30T08:45:00Z"
  },
  {
    id: "camp-005",
    name: "Back in Stock Notifications",
    description: "Push notifications for restocked popular items",
    type: "push",
    status: "active",
    startDate: "2023-08-15",
    endDate: "2023-10-15",
    target: "Previous visitors",
    createdAt: "2023-08-10T13:25:00Z",
    updatedAt: "2023-08-12T10:05:00Z",
    metrics: {
      impressions: 8500,
      clicks: 1200,
      conversions: 180,
      roi: 2.4
    }
  }
]; 