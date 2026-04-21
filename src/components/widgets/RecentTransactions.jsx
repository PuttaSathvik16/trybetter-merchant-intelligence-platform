import { useMemo, useState } from 'react'
import { ArrowDownUp } from 'lucide-react'
import Badge from '../ui/Badge'
import { mockTransactions } from '../../data/mockTransactions'
import { formatCurrency, formatDate } from '../../utils/formatters'

const statusVariantMap = {
  completed: 'success',
  refunded: 'warning',
  disputed: 'danger',
}

const toTitleCase = (value = '') =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()

export default function RecentTransactions() {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' })

  const sortedTransactions = useMemo(() => {
    const copy = [...mockTransactions]
    const directionMultiplier = sortConfig.direction === 'asc' ? 1 : -1

    copy.sort((a, b) => {
      if (sortConfig.key === 'amount') {
        return (a.amount - b.amount) * directionMultiplier
      }

      const aTime = new Date(a.date).getTime()
      const bTime = new Date(b.date).getTime()
      return (aTime - bTime) * directionMultiplier
    })

    return copy.slice(0, 8)
  }, [sortConfig])

  const toggleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc',
    }))
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-[#111813] p-5 text-white">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-[#6B7F74]">Live Feed</p>
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[#6B7F74]">
              <th className="pb-2 font-medium">
                <button
                  type="button"
                  onClick={() => toggleSort('date')}
                  className="inline-flex items-center gap-1.5 transition hover:text-white"
                >
                  Date
                  <ArrowDownUp className="h-3.5 w-3.5" />
                </button>
              </th>
              <th className="pb-2 font-medium">Merchant</th>
              <th className="pb-2 font-medium">Category</th>
              <th className="pb-2 font-medium">
                <button
                  type="button"
                  onClick={() => toggleSort('amount')}
                  className="inline-flex items-center gap-1.5 transition hover:text-white"
                >
                  Amount
                  <ArrowDownUp className="h-3.5 w-3.5" />
                </button>
              </th>
              <th className="pb-2 font-medium">Method</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Processor Fee</th>
            </tr>
          </thead>

          <tbody>
            {sortedTransactions.map((tx, index) => (
              <tr
                key={tx.id}
                className={`border-b border-white/5 transition hover:bg-white/[0.03] ${
                  index % 2 === 0 ? 'bg-white/[0.01]' : 'bg-transparent'
                }`}
              >
                <td className="py-3 text-[#B6C5BC]">{formatDate(tx.date)}</td>
                <td className="py-3 font-medium text-white">{tx.merchantName}</td>
                <td className="py-3 text-[#B6C5BC]">{toTitleCase(tx.category)}</td>
                <td className="py-3 text-white">{formatCurrency(tx.amount)}</td>
                <td className="py-3 text-[#B6C5BC]">{toTitleCase(tx.paymentMethod)}</td>
                <td className="py-3">
                  <Badge
                    label={toTitleCase(tx.status)}
                    variant={statusVariantMap[tx.status] || 'neutral'}
                  />
                </td>
                <td className="py-3 font-semibold text-[#00C96B]">
                  {formatCurrency(tx.processorFee ?? 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
