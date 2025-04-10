import { useState, useEffect, useCallback } from 'react';
import {
  AnalyticsOptions,
  AnalyticsOverview,
  SalesDataPoint,
  KpiCardData,
  TopProductData,
  CustomerActivityData,
  TrafficSourceData,
  TimePeriod,
} from '../types/admin';
import { format, subDays, eachDayOfInterval, startOfMonth, endOfMonth, eachMonthOfInterval, startOfYear, endOfYear } from 'date-fns';

// --- Mock Data Generation ---

const generateSalesData = (startDate: Date, endDate: Date, interval: 'day' | 'month'): SalesDataPoint[] => {
  const dates = interval === 'day'
    ? eachDayOfInterval({ start: startDate, end: endDate })
    : eachMonthOfInterval({ start: startOfMonth(startDate), end: endOfMonth(endDate) });

  return dates.map((date: Date) => {
    const revenue = Math.random() * 500 + 50; // Random revenue between 50 and 550
    const orders = Math.floor(Math.random() * 20) + 1; // Random orders between 1 and 20
    const itemsSold = orders * (Math.floor(Math.random() * 3) + 1); // 1-3 items per order
    return {
      date: format(date, interval === 'day' ? 'yyyy-MM-dd' : 'yyyy-MM'),
      revenue: parseFloat(revenue.toFixed(2)),
      orders,
      itemsSold,
    };
  });
};

const generateMockKpis = (salesData: SalesDataPoint[]): KpiCardData[] => {
    const totalRevenue = salesData.reduce((sum, d) => sum + d.revenue, 0);
    const totalOrders = salesData.reduce((sum, d) => sum + d.orders, 0);
    const totalItemsSold = salesData.reduce((sum, d) => sum + d.itemsSold, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return [
        {
            title: "Total Revenue",
            value: `$${totalRevenue.toFixed(2)}`,
            change: Math.random() * 20 - 10, // Random change +/- 10%
            changePeriod: "vs previous period",
        },
        {
            title: "Total Orders",
            value: totalOrders,
            change: Math.random() * 15 - 5, // Random change +/- 5-10%
            changePeriod: "vs previous period",
        },
        {
            title: "Items Sold",
            value: totalItemsSold,
            change: Math.random() * 10,
            changePeriod: "vs previous period",
        },
         {
            title: "Avg. Order Value",
            value: `$${avgOrderValue.toFixed(2)}`,
            change: Math.random() * 5 - 2.5,
            changePeriod: "vs previous period",
        },
    ];
};

const generateMockTopProducts = (): TopProductData[] => {
    const products = [
        { id: 'prod_1', name: 'Classic Logo Hat', imageUrl: '/images/birdiesHat.jpg' },
        { id: 'prod_2', name: 'Embroidered Hoodie', imageUrl: '/images/hoodie_placeholder.jpg' },
        { id: 'prod_3', name: 'Custom Text Beanie', imageUrl: '/images/beanie_placeholder.jpg' },
        { id: 'prod_4', name: 'Performance Cap', imageUrl: '/images/perf_cap_placeholder.jpg' },
        { id: 'prod_5', name: 'Signature Tee', imageUrl: '/images/tee_placeholder.jpg' },
    ];
    return products.map(p => ({
        ...p,
        revenue: parseFloat((Math.random() * 1000 + 200).toFixed(2)),
        unitsSold: Math.floor(Math.random() * 100 + 20),
    })).sort((a, b) => b.revenue - a.revenue);
};

const generateMockCustomerActivity = (startDate: Date, endDate: Date): CustomerActivityData[] => {
    const dates = eachDayOfInterval({ start: startDate, end: endDate });
    let baseActiveUsers = 100;
    
    return dates.map((date: Date) => {
        // Generate random data with some correlation
        const newUsers = Math.floor(Math.random() * 30) + 10;
        const activeUsers = baseActiveUsers + Math.floor(Math.random() * 40) - 10;
        const purchases = Math.floor(activeUsers * (Math.random() * 0.3 + 0.1)); // 10-40% conversion rate
        const productViews = Math.floor(activeUsers * (Math.random() * 5 + 2)); // 2-7 views per active user
        
        // Update the base for the next day (simulate some growth)
        baseActiveUsers = Math.max(75, baseActiveUsers + Math.floor(Math.random() * 10) - 3);
        
        return {
            date: format(date, 'MMM dd'),
            newUsers,
            activeUsers,
            purchases,
            productViews
        };
    }).slice(-7); // Only return the last 7 days to avoid overcrowding the chart
};

const generateMockTrafficSources = (): TrafficSourceData[] => {
    const sources = ['Direct', 'Organic Search', 'Social Media', 'Referral', 'Email'];
    return sources.map(source => ({
        source,
        visits: Math.floor(Math.random() * 1000 + 100),
        conversionRate: parseFloat((Math.random() * 5 + 0.5).toFixed(2)), // 0.5% to 5.5%
    }));
};

// --- Hook Implementation ---

export const useAdminAnalytics = (initialOptions?: AnalyticsOptions) => {
  const [options, setOptions] = useState<AnalyticsOptions>(initialOptions || { timePeriod: '30d' });
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalyticsData = useCallback(async (currentOptions: AnalyticsOptions) => {
    setLoading(true);
    setError(null);
    console.log("Loading analytics for:", currentOptions);

    try {
      // ** Replace with actual API call later **
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

      // Determine date range based on options
      const endDate = new Date();
      let startDate: Date;
      let interval: 'day' | 'month' = 'day';

      switch (currentOptions.timePeriod) {
        case '24h': startDate = subDays(endDate, 1); break;
        case '7d': startDate = subDays(endDate, 7); break;
        case '90d': startDate = subDays(endDate, 90); break;
        case '1y': startDate = subDays(endDate, 365); interval = 'month'; break;
        case 'all': startDate = startOfYear(subDays(endDate, 365 * 2)); interval = 'month'; break; // Example: 2 years back
        case '30d':
        default: startDate = subDays(endDate, 30); break;
      }

       if (currentOptions.customDateRange?.startDate && currentOptions.customDateRange?.endDate) {
           startDate = currentOptions.customDateRange.startDate;
           // Decide interval based on range duration (e.g., > 90 days = month)
           const dayDiff = (currentOptions.customDateRange.endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
           interval = dayDiff > 90 ? 'month' : 'day';
       }

      // Generate mock data based on the calculated range
      const salesOverTime = generateSalesData(startDate, endDate, interval);
      const mockData: AnalyticsOverview = {
        kpis: generateMockKpis(salesOverTime),
        salesOverTime,
        topProducts: generateMockTopProducts(),
        customerActivity: generateMockCustomerActivity(startDate, endDate), // Use consistent range
        trafficSources: generateMockTrafficSources(),
      };

      setData(mockData);

    } catch (err) {
      console.error("Error loading analytics data:", err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
      setData(null); // Clear data on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadAnalyticsData(options);
  }, [loadAnalyticsData, options]); // Reload when options change

  const setTimePeriod = useCallback((timePeriod: TimePeriod) => {
    setOptions({ timePeriod });
  }, []);

  const setCustomDateRange = useCallback((dateRange: { startDate: Date | null, endDate: Date | null }) => {
      if (dateRange.startDate && dateRange.endDate) {
         setOptions({ timePeriod: 'all', customDateRange: dateRange }); // Use 'all' or a specific custom indicator
      } else {
          // Handle case where date range is cleared or incomplete? Maybe revert to default?
          setTimePeriod('30d'); // Revert to default if range is cleared
      }
  }, [setTimePeriod]);

  return {
    data,
    loading,
    error,
    options,
    setTimePeriod,
    setCustomDateRange,
    refreshData: () => loadAnalyticsData(options) // Function to manually refresh
  };
}; 