import type { Banner } from './types'

export const heroBanners: Banner[] = [
  { id: 'h1', image: '/images/banners/hero-1.png', alt: 'Latest smartphones and earbuds', href: '/category/smartphones' },
  { id: 'h2', image: '/images/banners/hero-2.png', alt: 'Laptops, tablets and smartwatches', href: '/category/laptops' },
  { id: 'h3', image: '/images/banners/hero-3.png', alt: 'Smart home appliances', href: '/category/home-appliances' },
]

export const sideBanners: Banner[] = [
  { id: 's1', image: '/images/banners/side-1.png', alt: 'Headphones and speakers', href: '/category/audio' },
  { id: 's2', image: '/images/banners/side-2.png', alt: 'Power banks and chargers', href: '/category/power-charging' },
]
