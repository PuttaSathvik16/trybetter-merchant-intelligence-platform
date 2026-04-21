import Badge from '../ui/Badge'
import { formatCurrency } from '../../utils/formatters'

const flaggedTransactions = [
  {
    id: 'CB-001',
    merchantName: 'Maple & Thyme Bistro',
    amount: 482.75,
    riskLevel: 'High',
    reason: 'Large amount',
  },
  {
    id: 'CB-002',
    merchantName: 'Harbor Tech Supply',
    amount: 349.2,
    riskLevel: 'Medium',
    reason: 'Off-hours',
  },
  {
    id: 'CB-003',
    merchantName: 'Luna Home Essentials',
    amount: 198.9,
    riskLevel: 'High',
    reason: 'New card',
  },
  {
    id: 'CB-004',
    merchantName: 'Summit Dental Group',
    amount: 265.0,
    riskLevel: 'Medium',
    reason: 'Unusual category',
  },
  {
    id: 'CB-005',
    merchantName: 'Bluebird Coffee Roasters',
    amount: 173.45,
    riskLevel: 'High',
    reason: 'Off-hours',
  },
]

const getRiskVariant = (riskLevel) => (riskLevel === 'High' ? 'danger' : 'warning')

export default function ChargebackAlert() {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#111813] p-5 text-white">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-[#6B7F74]">Risk Monitoring</p>
          <h3 className="text-lg font-semibold">Chargeback Alerts</h3>
        </div>
        <span className="rounded-full bg-red-500/15 px-2.5 py-1 text-xs font-medium text-red-300">
          5 flagged
        </span>
      </div>

      <div className="space-y-2.5">
        {flaggedTransactions.map((item) => {
          const isHighRisk = item.riskLevel === 'High'
          return (
            <article
              key={item.id}
              className={`rounded-lg border p-3 ${
                isHighRisk
                  ? 'border-red-500/30 bg-red-500/5'
                  : 'border-white/10 bg-[#0A0F0D]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{item.merchantName}</p>
                  <p className="mt-0.5 text-xs text-[#9DB0A4]">{item.reason}</p>
                </div>

                <div className="flex items-center gap-2">
                  <p className={`text-sm font-semibold ${isHighRisk ? 'text-red-300' : 'text-white'}`}>
                    {formatCurrency(item.amount)}
                  </p>
                  <Badge label={item.riskLevel} variant={getRiskVariant(item.riskLevel)} />
                  <button
                    type="button"
                    className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-white transition hover:border-[#00C96B] hover:text-[#00C96B]"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
