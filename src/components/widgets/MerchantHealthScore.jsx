import Badge from '../ui/Badge'
import { formatVolume } from '../../utils/formatters'
import getMerchantHealthDetails from '../../utils/healthScorer'

const scoreColors = {
  green: '#00C96B',
  yellow: '#EAB308',
  orange: '#F97316',
  red: '#EF4444',
}

const categoryToBadgeVariant = {
  restaurant: 'warning',
  retail: 'info',
  medical: 'success',
  ecommerce: 'neutral',
}

export default function MerchantHealthScore({ merchant = {} }) {
  const { score, label, color, insights } = getMerchantHealthDetails(merchant)
  const strokeColor = scoreColors[color] || scoreColors.green
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const progressOffset = circumference - (score / 100) * circumference
  const category = merchant.category || 'unknown'

  return (
    <section className="rounded-2xl border border-white/10 bg-[#111813] p-6 text-white">
      <div className="flex items-center gap-5">
        <svg width="132" height="132" viewBox="0 0 132 132" className="shrink-0">
          <circle
            cx="66"
            cy="66"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="12"
          />
          <circle
            cx="66"
            cy="66"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            transform="rotate(-90 66 66)"
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white font-syne text-2xl font-bold"
          >
            {score}
          </text>
        </svg>

        <div>
          <p className="text-sm text-[#6B7F74]">Health Score</p>
          <p className="mt-1 font-syne text-3xl font-bold" style={{ color: strokeColor }}>
            {label}
          </p>
        </div>
      </div>

      <div className="mt-5 border-t border-white/10 pt-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">{merchant.businessName || 'Unknown Merchant'}</h3>
          <Badge
            label={category.charAt(0).toUpperCase() + category.slice(1)}
            variant={categoryToBadgeVariant[category] || 'neutral'}
          />
        </div>

        <p className="mt-2 text-sm text-[#6B7F74]">
          Monthly Volume: <span className="font-medium text-white">{formatVolume(merchant.monthlyVolume || 0)}</span>
        </p>

        <ul className="mt-4 space-y-2 text-sm text-[#B8C6BE]">
          {insights.map((insight) => (
            <li key={insight} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00C96B]" />
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
