import type { Category } from './types'

export const categories: Category[] = [
  { slug: 'smartphones', name: 'Smartphones', icon: 'smartphone', description: 'Flagship and mid-range phones from top brands.', subcategories: [{ slug: 'android-phones', name: 'Android Phones' }, { slug: 'iphones', name: 'iPhones' }, { slug: 'phone-accessories', name: 'Phone Accessories' }] },
  { slug: 'tablets', name: 'Tablets', icon: 'tablet', description: 'Tablets for work, study and entertainment.', subcategories: [{ slug: 'android-tablets', name: 'Android Tablets' }, { slug: 'ipads', name: 'iPads' }, { slug: 'tablet-accessories', name: 'Tablet Accessories' }] },
  { slug: 'laptops', name: 'Laptops', icon: 'laptop', description: 'Ultrabooks, student and performance laptops.', subcategories: [{ slug: 'ultrabooks', name: 'Ultrabooks' }, { slug: 'business-laptops', name: 'Business Laptops' }, { slug: 'gaming-laptops', name: 'Gaming Laptops' }] },
  { slug: 'smartwatches', name: 'Smart Watches', icon: 'watch', description: 'Fitness trackers and smartwatches.', subcategories: [{ slug: 'smartwatches', name: 'Smartwatches' }, { slug: 'fitness-watches', name: 'Fitness Watches' }, { slug: 'watch-bands', name: 'Watch Bands' }] },
  { slug: 'audio', name: 'Audio', icon: 'headphones', description: 'Earbuds, headphones and speakers.', subcategories: [{ slug: 'earbuds', name: 'Earbuds' }, { slug: 'headphones', name: 'Headphones' }, { slug: 'speakers', name: 'Speakers' }] },
  { slug: 'power-charging', name: 'Power & Charging', icon: 'battery-charging', description: 'Power banks, chargers and cables.', subcategories: [{ slug: 'power-banks', name: 'Power Banks' }, { slug: 'chargers', name: 'Chargers' }, { slug: 'cables', name: 'Cables' }] },
  { slug: 'gaming', name: 'Gaming', icon: 'gamepad-2', description: 'Keyboards, mice and gaming gear.', subcategories: [{ slug: 'keyboards', name: 'Keyboards' }, { slug: 'gaming-mice', name: 'Gaming Mice' }, { slug: 'gaming-consoles', name: 'Gaming Consoles' }] },
  { slug: 'home-appliances', name: 'Home Appliances', icon: 'cooking-pot', description: 'Air fryers, rice cookers and kitchen helpers.', subcategories: [{ slug: 'kitchen-appliances', name: 'Kitchen Appliances' }, { slug: 'cleaning-appliances', name: 'Cleaning Appliances' }, { slug: 'home-comfort', name: 'Home Comfort' }] },
]
