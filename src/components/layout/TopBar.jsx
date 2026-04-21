import { Bell } from 'lucide-react'

const dateRanges = ['Last 30 days', 'Last 90 days', 'This Year']

export default function TopBar({ title = 'Dashboard' }) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-white/10 bg-[#111813] px-6">
      <h1 className="text-xl font-semibold text-white">{title}</h1>

      <div className="flex items-center gap-4">
        <select
          defaultValue="Last 30 days"
          className="rounded-md border border-white/10 bg-[#0A0F0D] px-3 py-2 text-sm text-[#6B7F74] outline-none transition focus:border-[#00C96B]"
          aria-label="Select date range"
        >
          {dateRanges.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="relative rounded-full border border-white/10 bg-[#0A0F0D] p-2 text-[#6B7F74] transition hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            3
          </span>
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00C96B]/20 text-sm font-semibold text-[#00C96B]">
          TB
        </div>
      </div>
    </header>
  )
}
