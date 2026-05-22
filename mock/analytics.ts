export type Period = 'today' | 'week' | 'month'

export interface RevenueData { label: string; value: number }
export interface TopItem { id: string; name: string; category: string; orders: number; imageUrl: string }
export interface AnalyticsSummary {
  totalRevenue: number; revenueChange: number
  totalOrders: number; ordersChange: number
  customerRetention: number
}

export const mockSummary: Record<Period, AnalyticsSummary> = {
  today:  { totalRevenue: 5_000_000,   revenueChange: 11.8, totalOrders: 42,    ordersChange: 4.2,  customerRetention: 74.2 },
  week:   { totalRevenue: 28_500_000,  revenueChange: 8.3,  totalOrders: 248,   ordersChange: -2.1, customerRetention: 71.5 },
  month:  { totalRevenue: 120_000_000, revenueChange: 15.2, totalOrders: 1248,  ordersChange: 6.8,  customerRetention: 74.2 },
}

export const mockChartData: Record<Period, RevenueData[]> = {
  today: [
    { label: '8h', value: 350000 }, { label: '10h', value: 800000 },
    { label: '12h', value: 1200000 }, { label: '14h', value: 600000 },
    { label: '16h', value: 900000 }, { label: '18h', value: 1100000 },
    { label: '20h', value: 750000 },
  ],
  week: [
    { label: 'Mon', value: 3200000 }, { label: 'Tue', value: 4100000 },
    { label: 'Wed', value: 3800000 }, { label: 'Thu', value: 5000000 },
    { label: 'Fri', value: 6200000 }, { label: 'Sat', value: 4800000 },
    { label: 'Sun', value: 3400000 },
  ],
  month: [
    { label: 'W1', value: 28000000 }, { label: 'W2', value: 32000000 },
    { label: 'W3', value: 29000000 }, { label: 'W4', value: 31000000 },
  ],
}

export const mockTopItems: TopItem[] = [
  { id: '1', name: 'Signature Poke Bowl',    category: 'Starters',    orders: 482, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100' },
  { id: '2', name: 'Truffle Mushroom Pizza', category: 'Main Dishes', orders: 325, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100' },
  { id: '3', name: 'Dragon Fruit Smoothie',  category: 'Drinks',      orders: 291, imageUrl: 'https://images.unsplash.com/photo-1553530979-fbb9e4aee36f?w=100' },
]