const merchants = [
  { merchantName: 'Maple & Thyme Bistro', category: 'restaurant' },
  { merchantName: 'Riverfront Grill House', category: 'restaurant' },
  { merchantName: 'Bluebird Coffee Roasters', category: 'restaurant' },
  { merchantName: 'Northside Outfitters', category: 'retail' },
  { merchantName: 'Cedar Lane Pharmacy', category: 'medical' },
  { merchantName: 'BrightCare Family Clinic', category: 'medical' },
  { merchantName: 'Urban Thread Co.', category: 'retail' },
  { merchantName: 'Luna Home Essentials', category: 'ecommerce' },
  { merchantName: 'Peak Performance Supplements', category: 'ecommerce' },
  { merchantName: 'Harbor Tech Supply', category: 'retail' },
]

const paymentMethods = ['card', 'contactless', 'online']
const statuses = [
  ...Array(45).fill('completed'),
  ...Array(3).fill('refunded'),
  ...Array(2).fill('disputed'),
]

const today = new Date()

export const mockTransactions = Array.from({ length: 50 }, (_, index) => {
  const merchant = merchants[index % merchants.length]
  const date = new Date(today)
  date.setDate(today.getDate() - ((index * 2 + 3) % 90))

  // Keep amounts between $10 and $500.
  const amount = Number((10 + ((index * 37.91) % 490)).toFixed(2))

  return {
    id: `TXN-${String(index + 1).padStart(4, '0')}`,
    date: date.toISOString().split('T')[0],
    amount,
    merchantName: merchant.merchantName,
    category: merchant.category,
    status: statuses[index],
    paymentMethod: paymentMethods[index % paymentMethods.length],
    processorFee: 0,
  }
})
