import { siteConfig } from './site-config'

export function formatPrice(value: number) {
  return `${siteConfig.currency}${value.toLocaleString('en-US')}`
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function discountPercent(price: number, compare?: number) {
  if (!compare || compare <= price) return 0
  return Math.round(((compare - price) / compare) * 100)
}
