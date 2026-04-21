import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { calculateFees } from '../../utils/feeCalculator'
import { formatCurrency } from '../../utils/formatters'

const processorConfig = [
  { key: 'stripe', name: 'Stripe', color: '#7C3AED' },
  { key: 'square', name: 'Square', color: '#8B5CF6' },
  { key: 'paypal', name: 'PayPal', color: '#A78BFA' },
  { key: 'tryBetter', name: 'TryBetter', color: '#16A34A' },
]

function CustomTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const point = payload[0]?.payload
  if (!point) {
    return null
  }

  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 shadow-lg">
      <p className="text-xs text-[#6B7280]">{point.name}</p>
      <p className="mt-1 text-sm font-semibold text-[#111827]">{formatCurrency(point.fee)}</p>
    </div>
  )
}

export default function SavingsBarChart({ volume = 50000, avgTicket = 50 }) {
  const data = useMemo(
    () =>
      processorConfig.map((processor) => ({
        name: processor.name,
        fee: calculateFees(volume, avgTicket, processor.key),
        color: processor.color,
      })),
    [avgTicket, volume]
  )

  return (
    <div className="h-[320px] w-full rounded-[14px] border border-[#E5E7EB] bg-white p-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 24, right: 16, left: 4, bottom: 6 }}>
          <CartesianGrid stroke="#F3F4F6" strokeDasharray="4 4" vertical={false} />

          <XAxis
            dataKey="name"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => formatCurrency(value)}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F9FAFB' }} />

          <Bar dataKey="fee" radius={[8, 8, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
            <LabelList
              dataKey="fee"
              position="top"
              formatter={(value) => formatCurrency(value)}
              fill="#111827"
              fontSize={11}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
