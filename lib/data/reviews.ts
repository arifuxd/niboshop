import type { Review } from './types'

const templates = [
  { author: 'Rakib Hasan', rating: 5, title: 'Exactly as described', body: 'Original product, packed well and delivered within a day in Dhaka. Very happy with the quality.' },
  { author: 'Nusrat Jahan', rating: 5, title: 'Great value for money', body: 'Performance is excellent for the price. The seller was responsive and helped me choose the right option.' },
  { author: 'Tanvir Ahmed', rating: 4, title: 'Good, but delivery took a bit long', body: 'The product itself is great. Delivery outside Dhaka took three days, otherwise no complaints.' },
  { author: 'Mehnaz Sultana', rating: 4, title: 'Solid purchase', body: 'Build quality feels premium and it works smoothly. Would recommend to friends and family.' },
  { author: 'Imran Hossain', rating: 3, title: 'Decent', body: 'Does the job. A few small things could be better, but overall fair for the price.' },
]

const dates = ['2026-10-28', '2026-10-12', '2026-09-30', '2026-09-14', '2026-08-22']

export function buildReviews(productId: string): Review[] {
  return templates.map((t, i) => ({
    id: `${productId}-r${i + 1}`,
    productId,
    ...t,
    date: dates[i],
    verified: i !== 4,
  }))
}
