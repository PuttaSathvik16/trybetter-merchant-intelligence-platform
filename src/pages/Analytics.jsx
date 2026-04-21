import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import RevenueLineChart from '../components/charts/RevenueLineChart'
import { mockTransactions } from '../data/mockTransactions'
import { aggregateByCategory } from '../data/pipeline/aggregator'
import {
  detectChargebackRisk,
  detectHighValueOutliers,
  detectOffHoursActivity,
} from '../data/pipeline/anomalyDetector'
import {
  buildTimeSeriesData,
  calculateCorrelation,
  calculateDescriptiveStats,
} from '../data/pipeline/statsEngine'
import { formatCurrency, formatVolume } from '../utils/formatters'

const getCorrelationInsight = (value) => {
  if (value >= 0.5) return 'Strong positive correlation - larger orders tend to occur later in the day.'
  if (value >= 0.2) return 'Weak positive correlation - larger orders tend to come in slightly later in the day.'
  if (value > -0.2) return 'Little to no correlation - order size is mostly independent of time of day.'
  if (value > -0.5) return 'Weak negative correlation - larger orders tend to occur earlier in the day.'
  return 'Strong negative correlation - larger orders are concentrated earlier in the day.'
}

export default function Analytics() {
  const amounts = mockTransactions.map((tx) => tx.amount)
  const stats = calculateDescriptiveStats(amounts)

  const timeSeries = buildTimeSeriesData(mockTransactions, 6).map((point) => ({
    month: point.month,
    volume: point.total,
  }))

  const categoryPerformance = aggregateByCategory(mockTransactions)
    .map((item) => ({
      category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
      volume: item.total_volume,
    }))
    .sort((a, b) => b.volume - a.volume)

  const outliers = detectHighValueOutliers(mockTransactions).map((tx) => ({
    id: tx.id,
    amount: tx.amount,
    merchant: tx.merchantName,
    type: 'High Value Outlier',
    severity: 'High',
  }))

  const offHours = detectOffHoursActivity(mockTransactions).map((tx) => ({
    id: tx.id,
    amount: tx.amount,
    merchant: tx.merchantName,
    type: 'Off-hours Activity',
    severity: 'Medium',
  }))

  const riskIndex = Object.fromEntries(
    detectChargebackRisk(mockTransactions).map((tx) => [tx.id, tx.risk_score])
  )

  const anomalies = [...outliers, ...offHours]
    .map((item) => ({
      ...item,
      riskScore: riskIndex[item.id] ?? 0,
    }))
    .slice(0, 12)

  const hours = mockTransactions.map((tx) => new Date(tx.date).getHours())
  const correlation = calculateCorrelation(amounts, hours)

  return (
    <div className="space-y-6 bg-[#F8F7FF] text-[#111827]">
      <section className="card-shadow rounded-2xl border border-[#E5E7EB] bg-white p-6">
        <h1 className="text-3xl font-extrabold text-[#7C3AED]">Analytics Deep Dive</h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Statistical analysis, anomaly detection, and category-level performance insights.
        </p>
      </section>

      <section className="card-shadow rounded-xl border border-[#E5E7EB] bg-white p-5">
        <h2 className="mb-4 text-lg font-extrabold text-[#7C3AED]">Descriptive Statistics</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="bg-[#7C3AED] text-white">
                <th className="px-3 py-2 font-semibold">Metric</th>
                <th className="px-3 py-2 font-semibold">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#E5E7EB]"><td className="px-3 py-2">Mean</td><td className="px-3 py-2">{formatCurrency(stats.mean)}</td></tr>
              <tr className="border-b border-[#E5E7EB]"><td className="px-3 py-2">Median</td><td className="px-3 py-2">{formatCurrency(stats.median)}</td></tr>
              <tr className="border-b border-[#E5E7EB]"><td className="px-3 py-2">Standard Deviation</td><td className="px-3 py-2">{formatCurrency(stats.standardDeviation)}</td></tr>
              <tr className="border-b border-[#E5E7EB]"><td className="px-3 py-2">Quartile 25</td><td className="px-3 py-2">{formatCurrency(stats.quartile25)}</td></tr>
              <tr><td className="px-3 py-2">Quartile 75</td><td className="px-3 py-2">{formatCurrency(stats.quartile75)}</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="card-shadow rounded-xl border border-[#E5E7EB] bg-white p-5">
        <h2 className="mb-4 text-lg font-extrabold text-[#7C3AED]">Transaction Volume Time Series</h2>
        <RevenueLineChart data={timeSeries} lineColor="#7C3AED" />
      </section>

      <section className="card-shadow rounded-xl border border-[#E5E7EB] bg-white p-5">
        <h2 className="mb-4 text-lg font-extrabold text-[#7C3AED]">Category Performance</h2>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryPerformance}
              layout="vertical"
              margin={{ top: 10, right: 16, left: 12, bottom: 8 }}
            >
              <CartesianGrid stroke="rgba(17,24,39,0.08)" strokeDasharray="4 4" />
              <XAxis type="number" tick={{ fill: '#6B7280' }} tickFormatter={formatVolume} />
              <YAxis type="category" dataKey="category" tick={{ fill: '#6B7280' }} width={90} />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="volume" fill="#7C3AED" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card-shadow rounded-xl border border-[#E5E7EB] bg-white p-5">
        <h2 className="mb-4 text-lg font-extrabold text-[#7C3AED]">Anomaly Detection Panel</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-[#6B7280]">
                <th className="pb-2 font-medium">Transaction ID</th>
                <th className="pb-2 font-medium">Amount</th>
                <th className="pb-2 font-medium">Merchant</th>
                <th className="pb-2 font-medium">Anomaly Type</th>
                <th className="pb-2 font-medium">Risk Score</th>
              </tr>
            </thead>
            <tbody>
              {anomalies.map((item) => (
                <tr key={`${item.type}-${item.id}`} className="border-b border-[#F3F4F6] last:border-0">
                  <td className="py-2.5 font-medium">{item.id}</td>
                  <td className="py-2.5">{formatCurrency(item.amount)}</td>
                  <td className="py-2.5">{item.merchant}</td>
                  <td className="py-2.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        item.severity === 'High'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="py-2.5 font-semibold text-[#7C3AED]">{item.riskScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card-shadow rounded-xl border border-[#E5E7EB] bg-white p-5">
        <h2 className="text-lg font-extrabold text-[#7C3AED]">Correlation Insight</h2>
        <p className="mt-2 text-3xl font-extrabold text-[#16A34A]">{correlation}</p>
        <p className="mt-1 text-sm text-[#6B7280]">{getCorrelationInsight(correlation)}</p>
      </section>
    </div>
  )
}
