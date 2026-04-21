import {
  Area,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatVolume } from '../../utils/formatters'

const fallbackData = [
  { month: 'Nov', volume: 48200 },
  { month: 'Dec', volume: 51750 },
  { month: 'Jan', volume: 56340 },
  { month: 'Feb', volume: 54880 },
  { month: 'Mar', volume: 60120 },
  { month: 'Apr', volume: 63890 },
]

function CustomTooltip({ active, payload, label, lineColor }) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const point = payload[0]?.value ?? 0

  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 shadow-lg">
      <p className="text-xs text-[#6B7280]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#111827]" style={{ color: lineColor }}>
        {formatVolume(point)}
      </p>
    </div>
  )
}

export default function RevenueLineChart({ data = fallbackData, lineColor = '#7C3AED' }) {
  return (
    <div className="h-[320px] w-full rounded-[14px] border border-[#E5E7EB] bg-white p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 6 }}>
          <defs>
            <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity={0.08} />
              <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#F3F4F6" strokeDasharray="4 4" />

          <XAxis
            dataKey="month"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(17,24,39,0.12)' }}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => formatVolume(value)}
          />

          <Tooltip
            content={<CustomTooltip lineColor={lineColor} />}
            cursor={{ stroke: 'rgba(17,24,39,0.12)' }}
          />

          <Area
            type="monotone"
            dataKey="volume"
            stroke="none"
            fill="url(#volumeGradient)"
            fillOpacity={1}
          />

          <Line
            type="monotone"
            dataKey="volume"
            stroke={lineColor}
            strokeWidth={3}
            dot={{ r: 4, fill: lineColor, stroke: '#FFFFFF', strokeWidth: 2 }}
            activeDot={{ r: 5, fill: lineColor, stroke: '#FFFFFF', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
