import { FileText } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import SavingsBarChart from '../components/charts/SavingsBarChart'
import { mockMerchants } from '../data/mockMerchants'
import { formatCurrency, formatVolume } from '../utils/formatters'

const monthSeries = [
  { month: 'Nov', volume: 72000, avgTicket: 42 },
  { month: 'Dec', volume: 81000, avgTicket: 44 },
  { month: 'Jan', volume: 76500, avgTicket: 41 },
  { month: 'Feb', volume: 84200, avgTicket: 46 },
  { month: 'Mar', volume: 91500, avgTicket: 49 },
  { month: 'Apr', volume: 97800, avgTicket: 51 },
]

const categoryColors = {
  restaurant: '#7C3AED',
  retail: '#8B5CF6',
  medical: '#A78BFA',
  ecommerce: '#C4B5FD',
}

function DonutTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) return null
  const point = payload[0]?.payload
  if (!point) return null

  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 shadow-lg">
      <p className="text-xs text-[#6B7280]">{point.name}</p>
      <p className="mt-1 text-sm font-semibold text-[#111827]">{formatVolume(point.value)}</p>
    </div>
  )
}

export default function Reports() {
  const topMerchants = [...mockMerchants]
    .sort((a, b) => b.monthlyVolume - a.monthlyVolume)
    .slice(0, 5)

  const savingsLeaderboard = [...mockMerchants]
    .sort((a, b) => b.savingsVsStripe - a.savingsVsStripe)
    .map((merchant, index) => ({
      rank: index + 1,
      ...merchant,
    }))

  const categoryData = Object.entries(
    mockMerchants.reduce((acc, merchant) => {
      acc[merchant.category] = (acc[merchant.category] || 0) + merchant.monthlyVolume
      return acc
    }, {})
  ).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: categoryColors[name] || '#6B7F74',
  }))

  return (
    <div className="space-y-6 bg-[#F8F7FF] text-[#111827]">
      <section className="card-shadow flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] bg-white p-5">
        <div>
          <h1 className="text-2xl font-semibold">Reports</h1>
          <p className="text-sm text-[#6B7280]">Key analytics and savings performance snapshots.</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md bg-[#7C3AED] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#6D28D9]"
        >
          <FileText className="h-4 w-4" />
          Generate PDF Report
        </button>
      </section>

      <section className="card-shadow rounded-xl border border-[#E5E7EB] bg-white p-5">
        <h2 className="text-lg font-semibold">Monthly Savings Report (Last 6 Months)</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {monthSeries.map((item) => (
            <div key={item.month} className="card-shadow rounded-lg border border-[#E5E7EB] bg-white p-3">
              <p className="mb-2 text-sm font-medium text-[#6B7280]">{item.month}</p>
              <SavingsBarChart volume={item.volume} avgTicket={item.avgTicket} />
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="card-shadow rounded-xl border border-[#E5E7EB] bg-white p-5 xl:col-span-2">
          <h2 className="text-lg font-semibold">Top 5 Merchants by Volume</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] text-[#6B7280]">
                  <th className="pb-2 font-medium">Merchant</th>
                  <th className="pb-2 font-medium">Category</th>
                  <th className="pb-2 font-medium">Monthly Volume</th>
                  <th className="pb-2 font-medium">Transactions</th>
                </tr>
              </thead>
              <tbody>
                {topMerchants.map((merchant) => (
                  <tr key={merchant.id} className="border-b border-[#F3F4F6] last:border-0">
                    <td className="py-2.5 font-medium">{merchant.businessName}</td>
                    <td className="py-2.5 text-[#6B7280] capitalize">{merchant.category}</td>
                    <td className="py-2.5 text-[#111827]">{formatVolume(merchant.monthlyVolume)}</td>
                    <td className="py-2.5 text-[#6B7280]">{merchant.transactionCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-shadow rounded-xl border border-[#E5E7EB] bg-white p-5">
          <h2 className="text-lg font-semibold">Volume by Category</h2>
          <div className="mt-3 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<DonutTooltip />} />
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={92}
                  paddingAngle={3}
                  stroke="none"
                >
                  {categoryData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="card-shadow rounded-xl border border-[#E5E7EB] bg-white p-5">
        <h2 className="text-lg font-semibold">Fee Savings Leaderboard (vs Stripe)</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-[#6B7280]">
                <th className="pb-2 font-medium">Rank</th>
                <th className="pb-2 font-medium">Merchant</th>
                <th className="pb-2 font-medium">Category</th>
                <th className="pb-2 font-medium">Monthly Volume</th>
                <th className="pb-2 font-medium">Saved vs Stripe</th>
              </tr>
            </thead>
            <tbody>
              {savingsLeaderboard.map((merchant) => (
                <tr key={merchant.id} className="border-b border-[#F3F4F6] last:border-0">
                  <td className="py-2.5 font-syne text-base font-bold text-[#7C3AED]">#{merchant.rank}</td>
                  <td className="py-2.5 font-medium text-[#111827]">{merchant.businessName}</td>
                  <td className="py-2.5 capitalize text-[#6B7280]">{merchant.category}</td>
                  <td className="py-2.5 text-[#6B7280]">{formatVolume(merchant.monthlyVolume)}</td>
                  <td className="py-2.5 font-semibold text-[#16A34A]">
                    {formatCurrency(merchant.savingsVsStripe)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
