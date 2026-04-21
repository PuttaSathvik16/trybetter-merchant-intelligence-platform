import { useMemo } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { extractTransactions, loadTransactions } from '../data/pipeline/etlProcessor'
import { mockTransactions } from '../data/mockTransactions'

const stageDescriptions = [
  { key: 'extract', title: 'EXTRACT', detail: 'raw transactions source' },
  { key: 'transform', title: 'TRANSFORM', detail: 'normalize, categorize, enrich' },
  { key: 'load', title: 'LOAD', detail: 'analytics ready' },
]

const qualityFields = [
  'transaction_id',
  'amount',
  'merchant_name',
  'category',
  'date',
  'payment_method',
]

const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

export default function DataPipeline() {
  const pipelineResult = useMemo(() => loadTransactions(mockTransactions), [])
  const extraction = useMemo(() => extractTransactions(mockTransactions), [])

  const summary = pipelineResult.pipeline_summary
  const recordCount = pipelineResult.cleaned_transactions.length

  const qualityRows = useMemo(() => {
    const invalidRecords = extraction.invalidRecords
    const amounts = mockTransactions.map((tx) => Number(tx.amount) || 0)
    const mean = amounts.reduce((acc, value) => acc + value, 0) / (amounts.length || 1)
    const variance =
      amounts.reduce((acc, value) => acc + (value - mean) ** 2, 0) / (amounts.length || 1)
    const stdDev = Math.sqrt(variance)
    const outlierCount = amounts.filter((amount) => amount > mean + 2 * stdDev).length

    return qualityFields.map((field) => {
      const mappedKey = {
        transaction_id: 'id',
        merchant_name: 'merchantName',
        payment_method: 'paymentMethod',
      }[field] || field

      const nullCount = mockTransactions.filter(
        (record) =>
          record[mappedKey] === null || record[mappedKey] === undefined || record[mappedKey] === ''
      ).length

      const typeErrors =
        field === 'amount'
          ? mockTransactions.filter((record) => Number.isNaN(Number(record.amount))).length
          : field === 'date'
            ? mockTransactions.filter((record) => Number.isNaN(new Date(record.date).getTime()))
                .length
            : 0

      const fieldOutliers = field === 'amount' ? outlierCount : 0
      const status = nullCount === 0 && typeErrors === 0 ? 'Healthy' : 'Review'

      return {
        field,
        nullCount,
        typeErrors,
        outliers: fieldOutliers,
        status,
        failedFromExtraction: invalidRecords.length,
      }
    })
  }, [extraction.invalidRecords])

  const recentRuns = useMemo(() => {
    return Array.from({ length: 5 }, (_, index) => {
      const run = loadTransactions(mockTransactions)
      const timestamp = new Date(Date.now() - index * 15 * 60 * 1000).toISOString()

      return {
        id: `RUN-${String(index + 1).padStart(3, '0')}`,
        timestamp,
        records: run.pipeline_summary.total_records,
        duration: run.pipeline_summary.transformation_time_ms + index * 3,
        status: run.pipeline_summary.records_failed > 0 ? 'Warning' : 'Success',
      }
    })
  }, [])

  return (
    <div className="space-y-6 bg-[#F8F7FF] text-[#111827]">
      <section className="card-shadow rounded-2xl border border-[#E5E7EB] bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold text-[#7C3AED]">Data Pipeline Monitor</h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              Last run: <span className="font-medium text-[#111827]">{formatDateTime(summary.run_timestamp)}</span>
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#DCFCE7] px-3 py-1 text-sm font-semibold text-[#16A34A]">
            <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
            Pipeline: Live
          </span>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="card-shadow rounded-xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Total Records Processed</p>
          <p className="mt-2 text-2xl font-bold text-[#111827]">{summary.total_records}</p>
        </article>
        <article className="card-shadow rounded-xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Records Passed Validation</p>
          <p className="mt-2 text-2xl font-bold text-[#16A34A]">{summary.records_passed}</p>
        </article>
        <article className="card-shadow rounded-xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Records Failed</p>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-2xl font-bold text-[#DC2626]">{summary.records_failed}</p>
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
              Review
            </span>
          </div>
        </article>
        <article className="card-shadow rounded-xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Pipeline Run Time</p>
          <p className="mt-2 text-2xl font-bold text-[#7C3AED]">{summary.transformation_time_ms} ms</p>
        </article>
      </section>

      <section className="card-shadow rounded-xl border border-[#E5E7EB] bg-white p-5">
        <h2 className="mb-4 text-lg font-extrabold text-[#7C3AED]">Pipeline Flow</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {stageDescriptions.map((stage, index) => (
            <div key={stage.key} className="relative rounded-lg border border-[#E5E7EB] bg-[#F8F7FF] p-4">
              {index < stageDescriptions.length - 1 ? (
                <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-xl text-[#7C3AED] lg:block">
                  →
                </span>
              ) : null}
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#111827]">{stage.title}</h3>
                <CheckCircle2 className="h-5 w-5 text-[#16A34A]" />
              </div>
              <p className="mt-1 text-sm text-[#6B7280]">{stage.detail}</p>
              <p className="mt-3 text-sm font-semibold text-[#16A34A]">{recordCount} records</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card-shadow rounded-xl border border-[#E5E7EB] bg-white p-5">
        <h2 className="mb-4 text-lg font-extrabold text-[#7C3AED]">Data Quality Report</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-[#6B7280]">
                <th className="pb-2 font-medium">Field Name</th>
                <th className="pb-2 font-medium">Null Count</th>
                <th className="pb-2 font-medium">Type Errors</th>
                <th className="pb-2 font-medium">Outliers Detected</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {qualityRows.map((row) => (
                <tr key={row.field} className="border-b border-[#F3F4F6] last:border-0">
                  <td className="py-2.5 font-medium text-[#111827]">{row.field}</td>
                  <td className="py-2.5 text-[#374151]">{row.nullCount}</td>
                  <td className="py-2.5 text-[#374151]">{row.typeErrors}</td>
                  <td className="py-2.5 text-[#374151]">{row.outliers}</td>
                  <td className="py-2.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        row.status === 'Healthy'
                          ? 'bg-[#DCFCE7] text-[#16A34A]'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card-shadow rounded-xl border border-[#E5E7EB] bg-white p-5">
        <h2 className="mb-4 text-lg font-extrabold text-[#7C3AED]">Recent Pipeline Runs</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-[#6B7280]">
                <th className="pb-2 font-medium">Timestamp</th>
                <th className="pb-2 font-medium">Records</th>
                <th className="pb-2 font-medium">Duration</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentRuns.map((run) => (
                <tr key={run.id} className="border-b border-[#F3F4F6] last:border-0">
                  <td className="py-2.5 text-[#111827]">{formatDateTime(run.timestamp)}</td>
                  <td className="py-2.5 text-[#374151]">{run.records}</td>
                  <td className="py-2.5 text-[#374151]">{run.duration} ms</td>
                  <td className="py-2.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        run.status === 'Success'
                          ? 'bg-[#DCFCE7] text-[#16A34A]'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {run.status}
                    </span>
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
