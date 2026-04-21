const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const wholeNumberCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export const formatCurrency = (n) => currencyFormatter.format(Number(n) || 0)

export const formatPercent = (n) => {
  const value = Number(n) || 0
  return `${value.toFixed(2)}%`
}

export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) {
    return 'Invalid date'
  }
  return dateFormatter.format(date)
}

export const formatVolume = (n) => {
  const value = Number(n) || 0
  const absValue = Math.abs(value)

  if (absValue >= 1_000_000) {
    return wholeNumberCurrencyFormatter.format(value / 1_000_000) + 'M'
  }

  if (absValue >= 1_000) {
    return wholeNumberCurrencyFormatter.format(value / 1_000) + 'K'
  }

  return currencyFormatter.format(value)
}
