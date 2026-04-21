import { useMemo, useState } from 'react'
import { calculateAnnual, calculateSavings } from '../../utils/feeCalculator'
import { formatCurrency, formatVolume } from '../../utils/formatters'

const businessPresets = {
  Restaurant: { monthlyVolume: 65000, avgTicket: 38 },
  Retail: { monthlyVolume: 90000, avgTicket: 72 },
  Ecommerce: { monthlyVolume: 120000, avgTicket: 58 },
  Medical: { monthlyVolume: 150000, avgTicket: 110 },
}

const resultCards = [
  { key: 'stripe', title: 'Stripe', color: '#768197' },
  { key: 'square', title: 'Square', color: '#8A95A8' },
  { key: 'tryBetter', title: 'TryBetter', color: '#00C96B' },
]

export default function SavingsCalculator() {
  const [bizType, setBizType] = useState('Restaurant')
  const [monthlyVolume, setMonthlyVolume] = useState(businessPresets.Restaurant.monthlyVolume)
  const [avgTicket, setAvgTicket] = useState(businessPresets.Restaurant.avgTicket)

  const { fees, maxSavings } = useMemo(
    () => calculateSavings(monthlyVolume, avgTicket),
    [avgTicket, monthlyVolume]
  )

  const annualRows = useMemo(
    () =>
      [
        { name: 'Stripe', key: 'stripe' },
        { name: 'Square', key: 'square' },
        { name: 'PayPal', key: 'paypal' },
        { name: 'TryBetter', key: 'tryBetter' },
      ].map((item) => ({
        ...item,
        monthlyFee: fees[item.key] ?? 0,
        annualFee: calculateAnnual(fees[item.key] ?? 0),
      })),
    [fees]
  )

  const onBusinessTypeChange = (event) => {
    const nextType = event.target.value
    const preset = businessPresets[nextType]

    setBizType(nextType)
    setMonthlyVolume(preset.monthlyVolume)
    setAvgTicket(preset.avgTicket)
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-[#0A0F0D] p-6 text-white">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-[#6B7F74]">Savings Calculator</p>
          <h2 className="mt-1 text-2xl font-semibold">Estimate Your Processing Savings</h2>
        </div>

        <label className="flex flex-col gap-2 text-sm text-[#6B7F74]">
          Business Type
          <select
            value={bizType}
            onChange={onBusinessTypeChange}
            className="rounded-md border border-white/10 bg-[#111813] px-3 py-2 text-sm text-white outline-none transition focus:border-[#00C96B]"
          >
            {Object.keys(businessPresets).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="rounded-xl border border-white/10 bg-[#111813] p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-[#6B7F74]">Monthly Volume</span>
            <span className="font-syne text-lg font-bold text-white">{formatVolume(monthlyVolume)}</span>
          </div>
          <input
            type="range"
            min={5000}
            max={500000}
            step={1000}
            value={monthlyVolume}
            onChange={(event) => setMonthlyVolume(Number(event.target.value))}
            className="h-2 w-full cursor-pointer accent-[#00C96B]"
          />
        </label>

        <label className="rounded-xl border border-white/10 bg-[#111813] p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-[#6B7F74]">Average Ticket</span>
            <span className="font-syne text-lg font-bold text-white">{formatCurrency(avgTicket)}</span>
          </div>
          <input
            type="range"
            min={5}
            max={500}
            step={1}
            value={avgTicket}
            onChange={(event) => setAvgTicket(Number(event.target.value))}
            className="h-2 w-full cursor-pointer accent-[#00C96B]"
          />
        </label>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {resultCards.map((card) => (
          <article key={card.key} className="rounded-xl border border-white/10 bg-[#111813] p-4">
            <p className="text-sm text-[#6B7F74]">{card.title}</p>
            <p className="mt-2 font-syne text-3xl font-bold" style={{ color: card.color }}>
              {formatCurrency(fees[card.key] ?? 0)}
            </p>
            <p className="mt-1 text-xs text-[#6B7F74]">Monthly fee</p>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-[#00C96B]/30 bg-[#00C96B]/10 px-5 py-4">
        <p className="text-sm text-[#9CDDBD]">Max monthly savings with TryBetter</p>
        <p className="mt-1 font-syne text-4xl font-bold text-[#00C96B]">{formatCurrency(maxSavings)}</p>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-[#111813] p-4">
        <h3 className="text-sm font-semibold text-white">Annual Breakdown</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[#6B7F74]">
                <th className="pb-2 font-medium">Processor</th>
                <th className="pb-2 font-medium">Monthly Fee</th>
                <th className="pb-2 font-medium">Annual Fee</th>
              </tr>
            </thead>
            <tbody>
              {annualRows.map((row) => (
                <tr key={row.key} className="border-b border-white/5 last:border-0">
                  <td className="py-2 text-white">{row.name}</td>
                  <td className="py-2 text-[#B8C6BE]">{formatCurrency(row.monthlyFee)}</td>
                  <td className="py-2 font-medium text-white">{formatCurrency(row.annualFee)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
