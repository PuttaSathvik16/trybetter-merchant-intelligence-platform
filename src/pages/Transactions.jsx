import { useMemo, useState } from 'react'
import { Download, Search } from 'lucide-react'
import Badge from '../components/ui/Badge'
import { mockTransactions } from '../data/mockTransactions'
import { formatCurrency, formatDate } from '../utils/formatters'

const ITEMS_PER_PAGE = 10

const statusVariantMap = {
  completed: 'success',
  refunded: 'warning',
  disputed: 'danger',
}

const toTitleCase = (value = '') =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()

export default function Transactions() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)

  const categories = useMemo(
    () => ['all', ...new Set(mockTransactions.map((tx) => tx.category))],
    []
  )
  const statuses = useMemo(
    () => ['all', ...new Set(mockTransactions.map((tx) => tx.status))],
    []
  )

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return [...mockTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter((tx) => {
        const matchesSearch =
          !normalizedSearch ||
          tx.merchantName.toLowerCase().includes(normalizedSearch) ||
          tx.id.toLowerCase().includes(normalizedSearch)
        const matchesCategory = category === 'all' || tx.category === category
        const matchesStatus = status === 'all' || tx.status === status
        const txTime = new Date(tx.date).getTime()
        const matchesFrom = !dateFrom || txTime >= new Date(dateFrom).getTime()
        const matchesTo = !dateTo || txTime <= new Date(dateTo).getTime()

        return matchesSearch && matchesCategory && matchesStatus && matchesFrom && matchesTo
      })
  }, [search, category, status, dateFrom, dateTo])

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const summary = useMemo(() => {
    const totalCount = filteredTransactions.length
    const totalVolume = filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0)
    const totalFeesSaved = filteredTransactions.reduce((sum, tx) => sum + tx.processorFee, 0)

    return { totalCount, totalVolume, totalFeesSaved }
  }, [filteredTransactions])

  const exportCsv = () => {
    const headers = ['Date', 'Merchant', 'Category', 'Amount', 'Method', 'Status', 'Processor Fee']
    const rows = filteredTransactions.map((tx) => [
      tx.date,
      tx.merchantName,
      tx.category,
      tx.amount.toFixed(2),
      tx.paymentMethod,
      tx.status,
      (tx.processorFee ?? 0).toFixed(2),
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'transactions.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleFilterChange = (setter) => (event) => {
    setter(event.target.value)
    setPage(1)
  }

  return (
    <div className="space-y-6 bg-[#F8F7FF] text-[#111827]">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-md bg-[#7C3AED] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#6D28D9]"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </section>

      <section className="card-shadow grid gap-4 rounded-xl border border-[#E5E7EB] bg-white p-4 md:grid-cols-3 xl:grid-cols-6">
        <div className="rounded-lg border border-[#E5E7EB] bg-[#F8F7FF] p-3">
          <p className="text-xs text-[#6B7280]">Total Count</p>
          <p className="mt-1 font-syne text-xl font-bold">{summary.totalCount}</p>
        </div>
        <div className="rounded-lg border border-[#E5E7EB] bg-[#F8F7FF] p-3">
          <p className="text-xs text-[#6B7280]">Total Volume</p>
          <p className="mt-1 font-syne text-xl font-bold">{formatCurrency(summary.totalVolume)}</p>
        </div>
        <div className="rounded-lg border border-[#E5E7EB] bg-[#F8F7FF] p-3 md:col-span-1 xl:col-span-2">
          <p className="text-xs text-[#6B7280]">Total Fees Saved</p>
          <p className="mt-1 font-syne text-xl font-bold text-[#16A34A]">
            {formatCurrency(summary.totalFeesSaved)}
          </p>
        </div>
      </section>

      <section className="card-shadow rounded-xl border border-[#E5E7EB] bg-white p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#6B7280]" />
            <input
              value={search}
              onChange={handleFilterChange(setSearch)}
              placeholder="Search merchant or transaction ID"
              className="w-full rounded-md border border-[#E5E7EB] bg-[#F8F7FF] py-2 pl-9 pr-3 text-sm text-[#111827] outline-none transition focus:border-[#7C3AED]"
            />
          </label>

          <select
            value={category}
            onChange={handleFilterChange(setCategory)}
            className="rounded-md border border-[#E5E7EB] bg-[#F8F7FF] px-3 py-2 text-sm text-[#111827] outline-none transition focus:border-[#7C3AED]"
          >
            {categories.map((value) => (
              <option key={value} value={value}>
                {value === 'all' ? 'All Categories' : toTitleCase(value)}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={handleFilterChange(setStatus)}
            className="rounded-md border border-[#E5E7EB] bg-[#F8F7FF] px-3 py-2 text-sm text-[#111827] outline-none transition focus:border-[#7C3AED]"
          >
            {statuses.map((value) => (
              <option key={value} value={value}>
                {value === 'all' ? 'All Statuses' : toTitleCase(value)}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dateFrom}
            onChange={handleFilterChange(setDateFrom)}
            className="rounded-md border border-[#E5E7EB] bg-[#F8F7FF] px-3 py-2 text-sm text-[#111827] outline-none transition focus:border-[#7C3AED]"
          />

          <input
            type="date"
            value={dateTo}
            onChange={handleFilterChange(setDateTo)}
            className="rounded-md border border-[#E5E7EB] bg-[#F8F7FF] px-3 py-2 text-sm text-[#111827] outline-none transition focus:border-[#7C3AED]"
          />
        </div>
      </section>

      <section className="card-shadow overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#E5E7EB] text-[#6B7280]">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Merchant</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Method</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Processor Fee</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map((tx, index) => (
              <tr
                key={tx.id}
                className={`border-b border-[#F3F4F6] last:border-0 transition hover:bg-[#F9FAFB] ${
                  index % 2 === 0 ? 'bg-[#FCFCFD]' : 'bg-transparent'
                }`}
              >
                <td className="px-4 py-3 text-[#6B7280]">{formatDate(tx.date)}</td>
                <td className="px-4 py-3 font-medium text-[#111827]">{tx.merchantName}</td>
                <td className="px-4 py-3 text-[#6B7280]">{toTitleCase(tx.category)}</td>
                <td className="px-4 py-3 text-[#111827]">{formatCurrency(tx.amount)}</td>
                <td className="px-4 py-3 text-[#6B7280]">{toTitleCase(tx.paymentMethod)}</td>
                <td className="px-4 py-3">
                  <Badge label={toTitleCase(tx.status)} variant={statusVariantMap[tx.status] || 'neutral'} />
                </td>
                <td className="px-4 py-3 font-semibold text-[#16A34A]">
                  {formatCurrency(tx.processorFee ?? 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card-shadow flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm">
        <p className="text-[#6B7280]">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
          {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of{' '}
          {filteredTransactions.length} transactions
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={currentPage === 1}
            className="rounded-md border border-[#E5E7EB] px-3 py-1.5 text-[#111827] transition enabled:hover:border-[#7C3AED] enabled:hover:text-[#7C3AED] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-[#6B7280]">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            disabled={currentPage === totalPages}
            className="rounded-md border border-[#E5E7EB] px-3 py-1.5 text-[#111827] transition enabled:hover:border-[#7C3AED] enabled:hover:text-[#7C3AED] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>
    </div>
  )
}
