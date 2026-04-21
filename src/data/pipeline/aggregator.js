const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const roundToTwo = (value) => Number(value.toFixed(2))

const resolveDayName = (value) => {
  if (!value) return null

  const normalized = String(value).toLowerCase()
  const map = {
    mon: 'Monday',
    monday: 'Monday',
    tue: 'Tuesday',
    tues: 'Tuesday',
    tuesday: 'Tuesday',
    wed: 'Wednesday',
    wednesday: 'Wednesday',
    thu: 'Thursday',
    thur: 'Thursday',
    thurs: 'Thursday',
    thursday: 'Thursday',
    fri: 'Friday',
    friday: 'Friday',
    sat: 'Saturday',
    saturday: 'Saturday',
    sun: 'Sunday',
    sunday: 'Sunday',
  }

  return map[normalized] || null
}

export const aggregateByCategory = (transactions = []) => {
  const grouped = transactions.reduce((acc, tx) => {
    const category = String(tx.category || 'unknown').toLowerCase()
    const amount = toNumber(tx.amount)
    const feesSaved = toNumber(tx.fee_saved)
    const avgTicket = toNumber(tx.avgTicket, amount)

    if (!acc[category]) {
      acc[category] = {
        category,
        count: 0,
        total_volume: 0,
        total_fees_saved: 0,
        avg_ticket_sum: 0,
      }
    }

    acc[category].count += 1
    acc[category].total_volume += amount
    acc[category].total_fees_saved += feesSaved
    acc[category].avg_ticket_sum += avgTicket

    return acc
  }, {})

  return Object.values(grouped).map((group) => ({
    category: group.category,
    count: group.count,
    total_volume: roundToTwo(group.total_volume),
    avg_ticket: group.count ? roundToTwo(group.avg_ticket_sum / group.count) : 0,
    total_fees_saved: roundToTwo(group.total_fees_saved),
  }))
}

export const aggregateByDayOfWeek = (transactions = []) => {
  const base = DAYS_ORDER.reduce((acc, day) => {
    acc[day] = { day, count: 0, volume: 0 }
    return acc
  }, {})

  transactions.forEach((tx) => {
    const resolvedDay =
      resolveDayName(tx.day_of_week) ||
      resolveDayName(new Date(tx.date).toLocaleDateString('en-US', { weekday: 'long' }))

    if (!resolvedDay || !base[resolvedDay]) return

    base[resolvedDay].count += 1
    base[resolvedDay].volume += toNumber(tx.amount)
  })

  return DAYS_ORDER.map((day) => ({
    day,
    count: base[day].count,
    volume: roundToTwo(base[day].volume),
  }))
}

export const aggregateByHour = (transactions = []) => {
  const hours = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: 0,
    volume: 0,
  }))

  transactions.forEach((tx) => {
    const derivedHour =
      Number.isInteger(tx.hour_of_day) && tx.hour_of_day >= 0 && tx.hour_of_day <= 23
        ? tx.hour_of_day
        : new Date(tx.date).getHours()

    if (!Number.isInteger(derivedHour) || derivedHour < 0 || derivedHour > 23) return

    hours[derivedHour].count += 1
    hours[derivedHour].volume += toNumber(tx.amount)
  })

  return hours.map((slot) => ({
    hour: slot.hour,
    count: slot.count,
    volume: roundToTwo(slot.volume),
  }))
}

export const calculateMerchantKPIs = (merchants = []) => {
  return merchants.map((merchant) => {
    const monthlyVolume = toNumber(merchant.monthlyVolume)
    const transactionCount = toNumber(merchant.transactionCount)
    const healthScore = toNumber(merchant.healthScore, 70)
    const churnRisk = String(merchant.churnRisk || 'medium').toLowerCase()

    const revenuePerDay = roundToTwo(monthlyVolume / 30)
    const projectedAnnualSavings = roundToTwo(
      (monthlyVolume * 0.029 + transactionCount * 0.3) * 12
    )

    let healthTrend = 'stable'
    if (healthScore >= 85 && churnRisk === 'low') {
      healthTrend = 'improving'
    } else if (healthScore < 72 || churnRisk === 'high') {
      healthTrend = 'declining'
    }

    let riskScore = 100 - healthScore
    if (churnRisk === 'high') riskScore += 15
    if (churnRisk === 'medium') riskScore += 7
    riskScore = Math.max(0, Math.min(100, Math.round(riskScore)))

    return {
      merchantId: merchant.id,
      merchantName: merchant.businessName,
      revenue_per_day: revenuePerDay,
      projected_annual_savings: projectedAnnualSavings,
      health_trend: healthTrend,
      risk_score: riskScore,
    }
  })
}

export const getTopPerformers = (merchants = [], n = 5) => {
  const limit = Math.max(0, Number(n) || 0)
  if (limit === 0) return []

  return [...merchants]
    .sort((a, b) => toNumber(b.monthlyVolume) - toNumber(a.monthlyVolume))
    .slice(0, limit)
    .map((merchant, index) => ({
      rank: index + 1,
      merchantId: merchant.id,
      merchantName: merchant.businessName,
      category: merchant.category,
      monthlyVolume: roundToTwo(toNumber(merchant.monthlyVolume)),
      transactionCount: toNumber(merchant.transactionCount),
    }))
}
