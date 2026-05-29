import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'


interface Props {
  title: string
  value: string
  sub?: string
  icon: LucideIcon
  trend?: number
  color?: string
}

export default function StatsCard({ title, value, sub, icon: Icon, trend, color = 'bg-[#E8441A]' }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
      <div className={cn('p-3 rounded-xl text-white shrink-0', color)}>
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 truncate">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        {trend !== undefined && (
          <p className={cn('text-xs mt-1 font-medium', trend >= 0 ? 'text-green-600' : 'text-red-500')}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% so với hôm qua
          </p>
        )}
      </div>
    </div>
  )
}