const variantClasses = {
  success: 'bg-emerald-500/15 text-emerald-300',
  warning: 'bg-amber-500/15 text-amber-300',
  danger: 'bg-red-500/15 text-red-300',
  neutral: 'bg-white/10 text-slate-300',
  info: 'bg-sky-500/15 text-sky-300',
}

export default function Badge({ label, variant = 'neutral' }) {
  const colorClasses = variantClasses[variant] || variantClasses.neutral

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${colorClasses}`}>
      {label}
    </span>
  )
}
