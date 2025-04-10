export interface MarketingCampaign {
  id: string;
  name: string;
  description: string;
  type: 'email' | 'social' | 'discount' | 'banner' | 'push' | 'seo' | 'event' | 'other';
  status: 'active' | 'scheduled' | 'completed' | 'draft';
  startDate: string;
  endDate?: string;
  budget?: number;
  target?: string;
  createdAt: string;
  updatedAt: string;
  metrics?: {
    impressions?: number;
    clicks?: number;
    conversions?: number;
    roi?: number;
  };
}

export const CAMPAIGN_TYPES = [
  { value: 'email', label: 'Email Campaign' },
  { value: 'social', label: 'Social Media' },
  { value: 'discount', label: 'Discount Code' },
  { value: 'banner', label: 'Banner Ads' },
  { value: 'push', label: 'Push Notifications' },
  { value: 'seo', label: 'SEO Campaign' },
  { value: 'event', label: 'Event' },
  { value: 'other', label: 'Other' }
];

export const CAMPAIGN_STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'draft', label: 'Draft' }
]; 