const clampScore = (value) => Math.max(0, Math.min(100, Math.round(value)))

const getDaysSince = (dateString) => {
  if (!dateString) {
    return Number.POSITIVE_INFINITY
  }

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return Number.POSITIVE_INFINITY
  }

  const diffMs = Date.now() - date.getTime()
  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}

const getLabelAndColor = (score) => {
  if (score >= 85) return { label: 'Excellent', color: 'green' }
  if (score >= 70) return { label: 'Good', color: 'yellow' }
  if (score >= 50) return { label: 'At Risk', color: 'orange' }
  return { label: 'Critical', color: 'red' }
}

export default function getMerchantHealthDetails(merchant = {}) {
  let score = typeof merchant.healthScore === 'number' ? merchant.healthScore : 70
  const insights = []

  const estimatedVolume = (merchant.avgTicket || 0) * (merchant.transactionCount || 0)
  const monthlyVolume = merchant.monthlyVolume || 0
  const volumeTrendRatio = estimatedVolume > 0 ? monthlyVolume / estimatedVolume : 1

  if (volumeTrendRatio >= 1.08) {
    score += 8
    insights.push('Monthly volume trend is improving versus expected transaction flow.')
  } else if (volumeTrendRatio >= 0.95) {
    score += 2
    insights.push('Monthly volume trend is steady with recent transaction activity.')
  } else {
    score -= 10
    insights.push('Monthly volume trend is softening compared to expected transaction flow.')
  }

  if (merchant.churnRisk === 'low') {
    score += 8
    insights.push('Low churn risk suggests strong retention and stable processing behavior.')
  } else if (merchant.churnRisk === 'medium') {
    score -= 4
    insights.push('Medium churn risk signals moderate retention pressure to monitor.')
  } else if (merchant.churnRisk === 'high') {
    score -= 15
    insights.push('High churn risk is a major warning signal for account stability.')
  }

  const daysSinceLastActive = getDaysSince(merchant.lastActive)
  if (daysSinceLastActive <= 3) {
    score += 6
    insights.push('Recent activity indicates healthy, active day-to-day payment usage.')
  } else if (daysSinceLastActive <= 14) {
    score -= 2
    insights.push('Activity is slightly stale but still within a manageable window.')
  } else {
    score -= 12
    insights.push('Limited recent activity may indicate declining engagement or volume.')
  }

  const normalizedScore = clampScore(score)
  const { label, color } = getLabelAndColor(normalizedScore)

  return {
    score: normalizedScore,
    label,
    color,
    insights: insights.slice(0, 3),
  }
}
