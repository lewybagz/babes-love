export interface CustomerActivityData {
  date: string;
  newUsers: number;
  activeUsers: number;
  purchases: number;
  productViews: number;
}

export const mockCustomerActivity: CustomerActivityData[] = [
  {
    date: "Jun 01",
    newUsers: 45,
    activeUsers: 120,
    purchases: 18,
    productViews: 250
  },
  {
    date: "Jun 02",
    newUsers: 38,
    activeUsers: 132,
    purchases: 22,
    productViews: 283
  },
  {
    date: "Jun 03",
    newUsers: 42,
    activeUsers: 145,
    purchases: 28,
    productViews: 320
  },
  {
    date: "Jun 04",
    newUsers: 55,
    activeUsers: 165,
    purchases: 35,
    productViews: 390
  },
  {
    date: "Jun 05",
    newUsers: 62,
    activeUsers: 178,
    purchases: 32,
    productViews: 410
  },
  {
    date: "Jun 06",
    newUsers: 48,
    activeUsers: 160,
    purchases: 24,
    productViews: 312
  },
  {
    date: "Jun 07",
    newUsers: 44,
    activeUsers: 152,
    purchases: 21,
    productViews: 280
  }
]; 