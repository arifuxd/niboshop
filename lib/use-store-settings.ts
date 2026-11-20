'use client'

import useSWR from 'swr'
import { siteConfig } from './site-config'
import type { StoreSettings } from './store-settings'

const defaults: StoreSettings = {
  logoUrl: siteConfig.logoUrl,
  address: siteConfig.address,
  phone: siteConfig.contact.phone,
  email: siteConfig.contact.email,
  hours: siteConfig.contact.hours,
  insideDhakaCharge: siteConfig.deliveryCharge.insideDhaka,
  outsideDhakaCharge: siteConfig.deliveryCharge.outsideDhaka,
  freeShippingThreshold: siteConfig.freeShippingThreshold,
}

async function fetchSettings(url: string): Promise<StoreSettings> {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Could not load store settings.')
  return response.json()
}

export function useStoreSettings() {
  return useSWR<StoreSettings>('/api/store-settings', fetchSettings, { fallbackData: defaults })
}
