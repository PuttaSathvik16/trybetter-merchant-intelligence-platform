import SavingsCalculatorWidget from '../components/widgets/SavingsCalculator'
import { processorRates } from '../data/processorRates'
import { calculateAnnual, calculateFees } from '../utils/feeCalculator'
import { formatCurrency } from '../utils/formatters'

const demoVolume = 65000
const demoAvgTicket = 38

const comparisonMeta = {
  stripe: {
    contractRequired: 'No',
    nextDayDeposits: 'Available (extra fee)',
  },
  square: {
    contractRequired: 'No',
    nextDayDeposits: 'Standard',
  },
  paypal: {
    contractRequired: 'No',
    nextDayDeposits: 'Limited',
  },
  tryBetter: {
    contractRequired: 'No',
    nextDayDeposits: 'Included',
  },
}

const processorOrder = ['stripe', 'square', 'paypal', 'tryBetter']

export default function SavingsCalculatorPage() {
  const tableRows = processorOrder.map((key) => {
    const processor = processorRates[key]
    const monthlyFee = calculateFees(demoVolume, demoAvgTicket, key)
    const annualFee = calculateAnnual(monthlyFee)
    const perTransactionCost = `${processor.percentageFee}% + ${formatCurrency(processor.flatFee)}`

    return {
      key,
      name: processor.name,
      monthlyFee,
      annualFee,
      perTransactionCost,
      contractRequired: comparisonMeta[key].contractRequired,
      nextDayDeposits: comparisonMeta[key].nextDayDeposits,
    }
  })

  return (
    <div className="space-y-8 bg-[#F8F7FF] text-[#111827]">
      <section className="card-shadow rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center">
        <h1 className="mx-auto max-w-3xl font-syne text-4xl font-bold leading-tight md:text-5xl">
          See Exactly What You&apos;re Losing to Stripe &amp; Square
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-[#6B7280] md:text-base">
          Compare monthly and annual processing fees in real time, then see how fast your margins
          improve when fees drop to zero.
        </p>
      </section>

      <section className="mx-auto w-full max-w-6xl">
        <SavingsCalculatorWidget />
      </section>

      <section className="card-shadow rounded-2xl border border-[#E5E7EB] bg-white p-5">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Processor Comparison</h2>
          <p className="text-sm text-[#6B7280]">
            Based on {formatCurrency(demoVolume)} monthly volume and {formatCurrency(demoAvgTicket)} average
            ticket.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-[#6B7280]">
                <th className="pb-2 font-medium">Processor</th>
                <th className="pb-2 font-medium">Monthly Fee</th>
                <th className="pb-2 font-medium">Annual Fee</th>
                <th className="pb-2 font-medium">Per-Transaction Cost</th>
                <th className="pb-2 font-medium">Contract Required</th>
                <th className="pb-2 font-medium">Next-Day Deposits</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr
                  key={row.key}
                  className={`border-b border-[#F3F4F6] last:border-0 ${
                    row.key === 'tryBetter' ? 'bg-[#DCFCE7]' : ''
                  }`}
                >
                  <td className="py-3 font-semibold text-[#111827]">{row.name}</td>
                  <td className="py-3 text-[#6B7280]">{formatCurrency(row.monthlyFee)}</td>
                  <td className="py-3 text-[#6B7280]">{formatCurrency(row.annualFee)}</td>
                  <td className="py-3 text-[#6B7280]">{row.perTransactionCost}</td>
                  <td className="py-3 text-[#6B7280]">{row.contractRequired}</td>
                  <td className="py-3 text-[#6B7280]">{row.nextDayDeposits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card-shadow rounded-2xl border border-[#E5E7EB] bg-white p-6 text-center">
        <p className="text-2xl font-semibold text-[#7C3AED]">Ready to switch? Get started in 48 hours.</p>
        <button
          type="button"
          className="mt-4 rounded-md bg-[#7C3AED] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6D28D9]"
        >
          Start Your Migration
        </button>
      </section>
    </div>
  )
}
