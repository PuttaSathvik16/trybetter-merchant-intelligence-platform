const toNumber = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const roundToTwo = (value) => Number(value.toFixed(2))

const percentile = (sortedValues, p) => {
  if (!sortedValues.length) return 0
  if (sortedValues.length === 1) return sortedValues[0]

  const index = (sortedValues.length - 1) * p
  const lower = Math.floor(index)
  const upper = Math.ceil(index)

  if (lower === upper) return sortedValues[lower]

  const weight = index - lower
  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight
}

export const calculateDescriptiveStats = (values = []) => {
  const numericValues = values.map(toNumber).filter((value) => value !== null)
  if (!numericValues.length) {
    return {
      mean: 0,
      median: 0,
      mode: [],
      standardDeviation: 0,
      min: 0,
      max: 0,
      quartile25: 0,
      quartile75: 0,
    }
  }

  const sorted = [...numericValues].sort((a, b) => a - b)
  const count = sorted.length
  const sum = sorted.reduce((acc, value) => acc + value, 0)
  const mean = sum / count

  const median =
    count % 2 === 0
      ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2
      : sorted[Math.floor(count / 2)]

  const frequency = sorted.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1
    return acc
  }, {})

  const maxFrequency = Math.max(...Object.values(frequency))
  const mode = Object.entries(frequency)
    .filter(([, freq]) => freq === maxFrequency && maxFrequency > 1)
    .map(([value]) => Number(value))

  const variance =
    sorted.reduce((acc, value) => acc + (value - mean) ** 2, 0) / count
  const standardDeviation = Math.sqrt(variance)

  return {
    mean: roundToTwo(mean),
    median: roundToTwo(median),
    mode,
    standardDeviation: roundToTwo(standardDeviation),
    min: roundToTwo(sorted[0]),
    max: roundToTwo(sorted[count - 1]),
    quartile25: roundToTwo(percentile(sorted, 0.25)),
    quartile75: roundToTwo(percentile(sorted, 0.75)),
  }
}

export const calculateGrowthRate = (currentPeriod, previousPeriod) => {
  const current = toNumber(currentPeriod) ?? 0
  const previous = toNumber(previousPeriod) ?? 0
  if (previous === 0) {
    return current === 0 ? 0 : 100
  }
  return roundToTwo(((current - previous) / Math.abs(previous)) * 100)
}

export const calculateCorrelation = (xArray = [], yArray = []) => {
  const length = Math.min(xArray.length, yArray.length)
  if (length < 2) return 0

  const pairs = Array.from({ length }, (_, index) => ({
    x: toNumber(xArray[index]),
    y: toNumber(yArray[index]),
  })).filter((pair) => pair.x !== null && pair.y !== null)

  if (pairs.length < 2) return 0

  const n = pairs.length
  const sumX = pairs.reduce((acc, pair) => acc + pair.x, 0)
  const sumY = pairs.reduce((acc, pair) => acc + pair.y, 0)
  const meanX = sumX / n
  const meanY = sumY / n

  const numerator = pairs.reduce(
    (acc, pair) => acc + (pair.x - meanX) * (pair.y - meanY),
    0
  )
  const denominatorX = Math.sqrt(
    pairs.reduce((acc, pair) => acc + (pair.x - meanX) ** 2, 0)
  )
  const denominatorY = Math.sqrt(
    pairs.reduce((acc, pair) => acc + (pair.y - meanY) ** 2, 0)
  )

  if (denominatorX === 0 || denominatorY === 0) return 0
  return roundToTwo(numerator / (denominatorX * denominatorY))
}

export const buildTimeSeriesData = (transactions = [], months = 6) => {
  const monthCount = Math.max(1, Number(months) || 1)
  const now = new Date()

  const timeline = Array.from({ length: monthCount }, (_, offset) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (monthCount - 1 - offset), 1)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    return {
      key,
      month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      total: 0,
    }
  })

  const indexByKey = timeline.reduce((acc, point, index) => {
    acc[point.key] = index
    return acc
  }, {})

  transactions.forEach((tx) => {
    const date = new Date(tx.date || tx.timestamp)
    if (Number.isNaN(date.getTime())) return

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const index = indexByKey[key]
    if (index === undefined) return

    timeline[index].total += toNumber(tx.amount) ?? 0
  })

  return timeline.map((point) => ({
    month: point.month,
    total: roundToTwo(point.total),
  }))
}

export const calculateCumulativeSavings = (merchants = []) => {
  const monthlySavings = merchants.reduce((sum, merchant) => {
    const direct = toNumber(merchant.savingsVsStripe)
    if (direct !== null) return sum + direct

    const volume = toNumber(merchant.monthlyVolume) ?? 0
    const count = toNumber(merchant.transactionCount) ?? 0
    return sum + (volume * 0.029 + count * 0.3)
  }, 0)

  let runningTotal = 0
  return Array.from({ length: 12 }, (_, index) => {
    runningTotal += monthlySavings
    const date = new Date(new Date().getFullYear(), index, 1)
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      monthlySavings: roundToTwo(monthlySavings),
      cumulativeSavings: roundToTwo(runningTotal),
    }
  })
}
