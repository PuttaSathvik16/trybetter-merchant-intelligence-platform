import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

export default function StatCard({
  title,
  value,
  change = 0,
  changeLabel,
  icon: Icon,
  accentColor = '#00C96B',
}) {
  const isPositive = change >= 0
  const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight
  const changeColorClass = isPositive ? 'text-[#00C96B]' : 'text-red-400'

  return (
    <article
      className="rounded-[14px] border bg-[#111813] p-5 transition-colors hover:border-white/20"
      style={{ borderColor: 'rgba(255,255,255,0.07)' }}
    >
      <div className="mb-6 flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[#6B7F74]">{title}</p>

        <div
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: `${accentColor}26` }}
        >
          {Icon ? <Icon className="h-4 w-4" style={{ color: accentColor }} /> : null}
        </div>
      </div>

      <p className="font-syne text-3xl font-bold leading-tight text-white">{value}</p>

      <div className="mt-3 flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 text-sm font-semibold ${changeColorClass}`}>
          <ChangeIcon className="h-4 w-4" />
          {Math.abs(change).toFixed(2)}%
        </span>
        {changeLabel ? <span className="text-sm text-[#6B7F74]">{changeLabel}</span> : null}
      </div>
    </article>
  )
}
