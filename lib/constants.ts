export const PLANS = {
  FREE: {
    name: 'Free',
    wordLimit: 500,
  },
  PRO: {
    name: 'Pro',
    wordLimit: 10000,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
  },
}
