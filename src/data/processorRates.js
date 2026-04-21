export const processorRates = {
  stripe: {
    name: 'Stripe',
    percentageFee: 2.9,
    flatFee: 0.3,
    color: '#635BFF',
    description: 'Standard online card processing with broad global support.',
  },
  square: {
    name: 'Square',
    percentageFee: 2.6,
    flatFee: 0.1,
    color: '#3E4348',
    description: 'Simple payment processing for in-person and online sales.',
  },
  paypal: {
    name: 'PayPal',
    percentageFee: 3.49,
    flatFee: 0.49,
    color: '#0070BA',
    description: 'Widely recognized digital wallet and checkout option.',
  },
  tryBetter: {
    name: 'TryBetter',
    percentageFee: 0,
    flatFee: 0,
    color: '#00C96B',
    description: 'No processing fees to maximize merchant savings.',
  },
}
