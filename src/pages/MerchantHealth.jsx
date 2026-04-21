import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import MerchantHealthScore from '../components/widgets/MerchantHealthScore'
import { mockMerchants } from '../data/mockMerchants'
import getMerchantHealthDetails from '../utils/healthScorer'
import { formatDate, formatVolume } from '../utils/formatters'

const filters = ['All', 'Excellent', 'Good', 'At Risk', 'Critical']

export default function MerchantHealth() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [expandedMerchantId, setExpandedMerchantId] = useState(null)

  const merchantsWithHealth = useMemo(
    () =>
      mockMerchants.map((merchant) => ({
        ...merchant,
        health: getMerchantHealthDetails(merchant),
      })),
    []
  )

  const filteredMerchants = useMemo(() => {
    if (activeFilter === 'All') return merchantsWithHealth
    return merchantsWithHealth.filter((merchant) => merchant.health.label === activeFilter)
  }, [activeFilter, merchantsWithHealth])

  const summary = useMemo(() => {
    const totalMerchants = merchantsWithHealth.length
    const atRiskCount = merchantsWithHealth.filter(
      (merchant) => merchant.health.label === 'At Risk' || merchant.health.label === 'Critical'
    ).length
    const averageHealthScore =
      totalMerchants > 0
        ? Math.round(
            merchantsWithHealth.reduce((sum, merchant) => sum + merchant.health.score, 0) /
              totalMerchants
          )
        : 0

    return { totalMerchants, atRiskCount, averageHealthScore }
  }, [merchantsWithHealth])

  const downloadReport = () => {
    const headers = [
      'Merchant',
      'Category',
      'Health Score',
      'Health Label',
      'Monthly Volume',
      'Churn Risk',
      'Last Active',
    ]
    const rows = merchantsWithHealth.map((merchant) => [
      merchant.businessName,
      merchant.category,
      merchant.health.score,
      merchant.health.label,
      merchant.monthlyVolume,
      merchant.churnRisk,
      merchant.lastActive,
    ])
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'merchant-health-report.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 bg-[#F8F7FF] text-[#111827]">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Merchant Health</h1>
        <button
          type="button"
          onClick={downloadReport}
          className="inline-flex items-center gap-2 rounded-md bg-[#7C3AED] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#6D28D9]"
        >
          <Download className="h-4 w-4" />
          Download Report
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card-shadow rounded-xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Total Merchants</p>
          <p className="mt-1 font-syne text-2xl font-bold">{summary.totalMerchants}</p>
        </div>
        <div className="card-shadow rounded-xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">At Risk Count</p>
          <p className="mt-1 font-syne text-2xl font-bold text-[#F97316]">{summary.atRiskCount}</p>
        </div>
        <div className="card-shadow rounded-xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Average Health Score</p>
          <p className="mt-1 font-syne text-2xl font-bold text-[#16A34A]">{summary.averageHealthScore}</p>
        </div>
      </section>

      <section className="card-shadow flex flex-wrap gap-2 rounded-xl border border-[#E5E7EB] bg-white p-3">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeFilter === filter
                ? 'bg-[#7C3AED] text-white'
                : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
            }`}
          >
            {filter}
          </button>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        {filteredMerchants.map((merchant) => {
          const isExpanded = expandedMerchantId === merchant.id
          return (
            <article key={merchant.id} className="space-y-3">
              <button
                type="button"
                onClick={() => setExpandedMerchantId((current) => (current === merchant.id ? null : merchant.id))}
                className="w-full text-left"
              >
                <MerchantHealthScore merchant={merchant} />
              </button>

              {isExpanded ? (
                <div className="card-shadow rounded-xl border border-[#E5E7EB] bg-white p-4 text-sm">
                  <h4 className="font-semibold text-[#7C3AED]">Merchant Details</h4>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[#6B7280]">
                    <p>ID</p>
                    <p className="text-[#111827]">{merchant.id}</p>
                    <p>Avg Ticket</p>
                    <p className="text-[#111827]">${merchant.avgTicket.toFixed(2)}</p>
                    <p>Transactions</p>
                    <p className="text-[#111827]">{merchant.transactionCount}</p>
                    <p>Monthly Volume</p>
                    <p className="text-[#111827]">{formatVolume(merchant.monthlyVolume)}</p>
                    <p>Churn Risk</p>
                    <p className="text-[#111827] capitalize">{merchant.churnRisk}</p>
                    <p>Join Date</p>
                    <p className="text-[#111827]">{formatDate(merchant.joinDate)}</p>
                    <p>Last Active</p>
                    <p className="text-[#111827]">{formatDate(merchant.lastActive)}</p>
                  </div>
                </div>
              ) : null}
            </article>
          )
        })}
      </section>
    </div>
  )
}
