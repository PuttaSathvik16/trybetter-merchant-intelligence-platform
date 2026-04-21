const toNumber = (value, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const toDate = (transaction) => {
  const candidate = transaction?.date || transaction?.timestamp
  const parsed = new Date(candidate)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const roundToTwo = (value) => Number(value.toFixed(2))

export const detectHighValueOutliers = (transactions = []) => {
  if (!transactions.length) return []

  const amounts = transactions.map((tx) => toNumber(tx.amount))
  const mean = amounts.reduce((sum, value) => sum + value, 0) / amounts.length
  const variance =
    amounts.reduce((sum, value) => sum + (value - mean) ** 2, 0) / amounts.length
  const stdDev = Math.sqrt(variance)
  const threshold = mean + stdDev * 2

  return transactions
    .filter((tx) => toNumber(tx.amount) > threshold)
    .map((tx) => ({
      ...tx,
      reason: `Amount ${roundToTwo(toNumber(tx.amount))} is above outlier threshold ${roundToTwo(
        threshold
      )} (mean + 2σ).`,
    }))
}

export const detectOffHoursActivity = (transactions = []) => {
  return transactions
    .filter((tx) => {
      const date = toDate(tx)
      if (!date) return false
      const hour = date.getHours()
      return hour >= 23 || hour < 5
    })
    .map((tx) => {
      const date = toDate(tx)
      const hour = date ? date.getHours() : null
      return {
        ...tx,
        reason: `Transaction occurred during off-hours (${hour}:00), between 11pm and 5am window.`,
      }
    })
}

export const detectVelocitySpikes = (transactions = []) => {
  const byMerchantDay = transactions.reduce((acc, tx) => {
    const merchant = tx.merchantName || tx.merchant || 'Unknown Merchant'
    const date = toDate(tx)
    if (!date) return acc

    const dayKey = date.toISOString().split('T')[0]
    const merchantBucket = acc[merchant] || { dailyCounts: {}, total: 0, days: new Set() }
    merchantBucket.dailyCounts[dayKey] = (merchantBucket.dailyCounts[dayKey] || 0) + 1
    merchantBucket.total += 1
    merchantBucket.days.add(dayKey)
    acc[merchant] = merchantBucket
    return acc
  }, {})

  const spikes = []

  Object.entries(byMerchantDay).forEach(([merchant, bucket]) => {
    const activeDays = bucket.days.size || 1
    const avgDailyCount = bucket.total / activeDays
    const spikeThreshold = avgDailyCount * 3

    Object.entries(bucket.dailyCounts).forEach(([day, count]) => {
      if (count > spikeThreshold && avgDailyCount > 0) {
        spikes.push({
          merchantName: merchant,
          date: day,
          transaction_count: count,
          average_daily_count: roundToTwo(avgDailyCount),
          reason: `Merchant daily count ${count} is over 3x average ${roundToTwo(
            avgDailyCount
          )}.`,
        })
      }
    })
  })

  return spikes
}

export const detectChargebackRisk = (transactions = []) => {
  const categoryWeights = {
    restaurant: 8,
    retail: 12,
    medical: 6,
    ecommerce: 20,
  }

  return transactions.map((tx) => {
    const amount = toNumber(tx.amount)
    const date = toDate(tx)
    const hour = date ? date.getHours() : 12
    const category = String(tx.category || 'retail').toLowerCase()

    let risk = 20
    const reasons = []

    if (amount >= 300) {
      risk += 30
      reasons.push('Large amount transaction')
    } else if (amount >= 150) {
      risk += 18
      reasons.push('Above-average amount')
    } else {
      risk += 8
      reasons.push('Standard amount baseline')
    }

    if (hour >= 23 || hour < 5) {
      risk += 25
      reasons.push('Off-hours activity')
    } else if (hour >= 0 && hour < 8) {
      risk += 10
      reasons.push('Early-hours timing')
    }

    const categoryWeight = categoryWeights[category] ?? 10
    risk += categoryWeight
    reasons.push(`Category risk weight applied (${category})`)

    const boundedRisk = Math.max(0, Math.min(100, Math.round(risk)))

    return {
      ...tx,
      risk_score: boundedRisk,
      reason: reasons.join('; '),
    }
  })
}
