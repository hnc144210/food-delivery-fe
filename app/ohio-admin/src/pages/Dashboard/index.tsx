import { ShoppingBag, DollarSign, Users, Truck } from 'lucide-react'
import StatsCard from './StatsCard'
import RevenueChart from './RevenueChart'
import RecentOrders from './RecentOrders'
import TopMerchants from './TopMerchants'
import { mockOrders, mockUsers, mockDailyRevenue } from '@/mock'
import { formatCurrency } from '@/lib/utils'

export default function DashboardPage() {
  const todayRevenue = mockDailyRevenue[mockDailyRevenue.length - 1].revenue
  const totalOrders = mockOrders.length
  const delivering = mockOrders.filter(o => o.status === 'DELIVERING').length
  const newUsers = mockUsers.filter(u => u.role === 'CUSTOMER').length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard title="Doanh thu hôm nay" value={formatCurrency(todayRevenue)} trend={12} icon={DollarSign} color="bg-[#E8441A]" />
        <StatsCard title="Tổng đơn hàng" value={String(totalOrders)} sub="hôm nay" trend={5} icon={ShoppingBag} color="bg-blue-500" />
        <StatsCard title="Khách hàng mới" value={String(newUsers)} sub="tháng này" trend={-2} icon={Users} color="bg-purple-500" />
        <StatsCard title="Đang giao" value={String(delivering)} sub="đơn live" icon={Truck} color="bg-orange-500" />
      </div>

      <RevenueChart />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <RecentOrders />
        </div>
        <TopMerchants />
      </div>
    </div>
  )
}