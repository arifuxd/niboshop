export const siteConfig = {
  name: 'Niboshop',
  tagline: 'Genuine gadgets & home essentials',
  description:
    'Niboshop is your trusted store for smartphones, laptops, audio, smart gadgets and home appliances with fast delivery across Bangladesh.',
  currency: '৳',
  freeShippingThreshold: 5000,
  deliveryCharge: { insideDhaka: 60, outsideDhaka: 120 },
  contact: {
    phone: '+8801953-417354',
    email: 'support@niboshop.com',
    hours: 'Sat – Thu, 10:00 AM – 9:00 PM',
  },
  topBar: ['Fastest home delivery', '100% genuine products', 'Easy 7-day return'],
} as const

export const mainNav = [
  { label: 'Home', href: '/' },
  { label: 'My Account', href: '/account' },
] as const

export const footerLinks = {
  shop: [
    { label: 'Home', href: '/' },
    { label: 'Smartphones', href: '/category/smartphones' },
    { label: 'Laptops', href: '/category/laptops' },
    { label: 'Audio', href: '/category/audio' },
    { label: 'Home Appliances', href: '/category/home-appliances' },
  ],
  account: [
    { label: 'My Account', href: '/account' },
    { label: 'My Orders', href: '/account/orders' },
    { label: 'Wishlist', href: '/account/wishlist' },
    { label: 'Checkout', href: '/checkout' },
  ],
} as const

export const accountNav = [
  { label: 'Overview', href: '/account', icon: 'layout-dashboard' },
  { label: 'My Orders', href: '/account/orders', icon: 'package' },
  { label: 'Wishlist', href: '/account/wishlist', icon: 'heart' },
  { label: 'Addresses', href: '/account/addresses', icon: 'map-pin' },
  { label: 'Profile', href: '/account/profile', icon: 'user' },
] as const

export const adminNav = [
  { label: 'Overview', href: '/admin', icon: 'layout-dashboard' },
  { label: 'Products', href: '/admin/products', icon: 'boxes' },
  { label: 'Categories', href: '/admin/categories', icon: 'tags' },
  { label: 'Orders', href: '/admin/orders', icon: 'shopping-bag' },
  { label: 'Customers', href: '/admin/customers', icon: 'users' },
  { label: 'Profile & security', href: '/admin/profile', icon: 'user' },
] as const
