import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from '@/components/layout/Layout'
import LoginPage from '@/pages/Login'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } }
})

// Placeholder pages
const DashboardPage = () => <div className="text-gray-500">Dashboard — coming next</div>
const UsersPage = () => <div className="text-gray-500">Người dùng — coming next</div>
const OrdersPage = () => <div className="text-gray-500">Đơn hàng — coming next</div>
const MerchantsPage = () => <div className="text-gray-500">Nhà hàng — coming next</div>
const FinancePage = () => <div className="text-gray-500">Tài chính — coming next</div>
const PromotionsPage = () => <div className="text-gray-500">Khuyến mãi — coming next</div>
const SettingsPage = () => <div className="text-gray-500">Cài đặt — coming next</div>

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="merchants" element={<MerchantsPage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="promotions" element={<PromotionsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}