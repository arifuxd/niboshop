import { siteConfig } from './site-config'

export type StoreSettings = {
  logoUrl: string
  address: string
  phone: string
  email: string
  hours: string
  insideDhakaCharge: number
  outsideDhakaCharge: number
  freeShippingThreshold: number
}

const settings: StoreSettings = {
  logoUrl: siteConfig.logoUrl,
  address: siteConfig.address,
  phone: siteConfig.contact.phone,
  email: siteConfig.contact.email,
  hours: siteConfig.contact.hours,
  insideDhakaCharge: siteConfig.deliveryCharge.insideDhaka,
  outsideDhakaCharge: siteConfig.deliveryCharge.outsideDhaka,
  freeShippingThreshold: siteConfig.freeShippingThreshold,
}

export function getStoreSettings(): StoreSettings {
  return { ...settings }
}

export function updateStoreSettings(next: StoreSettings) {
  Object.assign(settings, next)
  return getStoreSettings()
}
