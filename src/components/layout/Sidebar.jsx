import { NavLink } from 'react-router-dom'
import {
  BarChart2,
  BarChart3,
  Calculator,
  CreditCard,
  HeartPulse,
  FileText,
  GitBranch,
  Hexagon,
  ArrowUpRight,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', to: '/', icon: BarChart3 },
  { label: 'Analytics', to: '/analytics', icon: BarChart2 },
  { label: 'Savings Calculator', to: '/calculator', icon: Calculator },
  { label: 'Transactions', to: '/transactions', icon: CreditCard },
  { label: 'Merchant Health', to: '/health', icon: HeartPulse },
  { label: 'Reports', to: '/reports', icon: FileText },
  { label: 'Data Pipeline', to: '/pipeline', icon: GitBranch },
]

export default function Sidebar() {
  return (
    <aside
      className="flex h-full w-full flex-col justify-between border-r bg-white"
      style={{ borderRightColor: '#E5E7EB' }}
    >
      <div>
        <div className="border-b border-[#E5E7EB] px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-[#F3F0FF] p-2">
              <Hexagon className="h-5 w-5 fill-[#7C3AED] text-[#7C3AED]" />
            </div>
            <div>
              <p className="text-lg font-semibold text-[#111827]">TryBetter</p>
              <p className="text-xs text-[#6B7280]">Merchant Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="px-3 py-4">
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon

              return (
                <li key={item.label}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-md border-l-2 px-3 py-2.5 text-sm transition-colors ${
                        isActive
                          ? 'border-l-[#7C3AED] bg-[#F3F0FF] text-[#7C3AED]'
                          : 'border-l-transparent text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      <div className="p-4">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#7C3AED]">
            Upgrade
          </p>
          <p className="mt-2 text-sm text-[#6B7280]">Unlock advanced forecasting and risk alerts.</p>
          <button
            type="button"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#16A34A] px-3 py-2 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Go Pro
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
