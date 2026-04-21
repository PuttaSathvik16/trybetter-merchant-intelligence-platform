import { processorRates } from '../data/processorRates'

const roundToTwo = (value) => Number(value.toFixed(2))

export const calculateFees = (volume, avgTicket, processorKey) => {
  const processor = processorRates[processorKey]
  if (!processor || avgTicket <= 0) {
    return 0
  }

  const transactionCount = volume / avgTicket
  const percentageFee = volume * (processor.percentageFee / 100)
  const flatFee = transactionCount * processor.flatFee

  return roundToTwo(percentageFee + flatFee)
}

export const calculateSavings = (volume, avgTicket) => {
  const fees = Object.keys(processorRates).reduce((acc, key) => {
    acc[key] = calculateFees(volume, avgTicket, key)
    return acc
  }, {})

  const tryBetterFee = fees.tryBetter ?? 0
  const maxSavings = roundToTwo(
    Math.max(...Object.values(fees).map((fee) => fee - tryBetterFee))
  )

  return {
    fees,
    maxSavings,
  }
}

export const calculateAnnual = (monthlyFee) => roundToTwo(monthlyFee * 12)
