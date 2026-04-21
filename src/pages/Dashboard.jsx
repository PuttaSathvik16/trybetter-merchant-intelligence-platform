import {
  Activity,
  Building2,
  DollarSign,
  ShieldAlert,
} from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import RevenueLineChart from '../components/charts/RevenueLineChart'
import ProcessorPieChart from '../components/charts/ProcessorPieChart'
import TransactionHeatmap from '../components/charts/TransactionHeatmap'
import RecentTransactions from '../components/widgets/RecentTransactions'
import ChargebackAlert from '../components/widgets/ChargebackAlert'
import { mockMerchants } from '../data/mockMerchants'
import { mockTransactions } from '../data/mockTransactions'
import { formatCurrency, formatPercent, formatVolume } from '../utils/formatters'

export default function Dashboard() {
  const totalVolume = mockMerchants.reduce((sum, merchant) => sum + merchant.monthlyVolume, 0)
  const activeMerchants = mockMerchants.length
  const totalSavingsVsStripe = mockMerchants.reduce(
    (sum, merchant) => sum + merchant.savingsVsStripe,
    0
  )

  const disputedCount = mockTransactions.filter((tx) => tx.status === 'disputed').length
  const chargebackRate = mockTransactions.length
    ? (disputedCount / mockTransactions.length) * 100
    : 0

  return (
    <div className="space-y-6 bg-[#F8F7FF] text-[#111827]">
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Volume This Month"
          value={formatVolume(totalVolume)}
          change={8.2}
          changeLabel="vs last month"
          icon={DollarSign}
          accentColor="#7C3AED"
        />
        <StatCard
          title="Active Merchants"
          value={activeMerchants}
          change={4.1}
          changeLabel="new this month"
          icon={Building2}
          accentColor="#7C3AED"
        />
        <StatCard
          title="Total Savings vs Stripe"
          value={formatCurrency(totalSavingsVsStripe)}
          change={12.4}
          changeLabel="estimated monthly"
          icon={Activity}
          accentColor="#16A34A"
        />
        <StatCard
          title="Chargeback Rate"
          value={formatPercent(chargebackRate)}
          change={-1.8}
          changeLabel="improved this week"
          icon={ShieldAlert}
          accentColor="#7C3AED"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="card-shadow xl:col-span-2">
          <RevenueLineChart />
        </div>
        <div className="card-shadow">
          <ProcessorPieChart />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="card-shadow xl:col-span-2">
          <RecentTransactions />
        </div>
        <div className="card-shadow">
          <ChargebackAlert />
        </div>
      </section>

      <section className="card-shadow">
        <TransactionHeatmap />
      </section>
    </div>
  )
}
