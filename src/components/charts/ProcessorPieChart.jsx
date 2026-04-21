import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const paymentMethodData = [
  { name: 'Card Present', value: 45, color: '#7C3AED' },
  { name: 'Contactless', value: 30, color: '#8B5CF6' },
  { name: 'Online', value: 20, color: '#A78BFA' },
  { name: 'ACH', value: 5, color: '#C4B5FD' },
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
      <p className="mt-1 text-sm font-semibold text-[#111827]">{point.value}%</p>
    </div>
  )
}

export default function ProcessorPieChart() {
  return (
    <div className="w-full rounded-[14px] border border-[#E5E7EB] bg-white p-4">
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={paymentMethodData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={94}
              paddingAngle={3}
              stroke="none"
            >
              {paymentMethodData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        {paymentMethodData.map((item) => (
          <div key={item.name} className="flex items-center justify-between rounded-md bg-[#F9FAFB] px-2.5 py-2">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-[#6B7280]">{item.name}</span>
            </div>
            <span className="text-xs font-semibold text-[#111827]">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
