//src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import LoginPage from "@/pages/Login/Login";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

// Placeholder pages
import DashboardPage from "@/pages/Dashboard";
import UsersPage from "@/pages/Users";
import OrdersPage from "@/pages/Orders";
import MerchantsPage from "@/pages/Merchants";
import FinancePage from "@/pages/Finance";
import PromotionsPage from "@/pages/Promotions";
import SettingsPage from "@/pages/Settings";
import ShippersPage from "@/pages/Shippers";

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
            <Route path="shippers" element={<ShippersPage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="promotions" element={<PromotionsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
