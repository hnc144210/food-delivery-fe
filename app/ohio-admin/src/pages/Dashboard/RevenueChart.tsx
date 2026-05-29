import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { mockDailyRevenue } from "@/mock";
import { formatCurrency } from "@/lib/utils";

export default function RevenueChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Doanh thu 7 ngày gần nhất
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart
          data={mockDailyRevenue}
          margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E8441A" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#E8441A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
          />
          <Tooltip
            formatter={(v) => formatCurrency(Number(v))}
            labelStyle={{ fontWeight: 600 }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#E8441A"
            strokeWidth={2}
            fill="url(#rev)"
            name="Doanh thu"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
