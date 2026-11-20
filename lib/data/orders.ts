import type { Customer, Order, OrderItem } from './types'
import { products } from './products'

function item(slug: string, quantity: number): OrderItem {
  const p = products.find((x) => x.slug === slug) ?? products[0]
  return { productId: p.id, name: p.name, image: p.image, price: p.price, quantity }
}

function total(items: OrderItem[], delivery = 60) {
  return items.reduce((s, i) => s + i.price * i.quantity, 0) + delivery
}

const mk = (
  id: string,
  customerId: string,
  customerName: string,
  date: string,
  status: Order['status'],
  payment: Order['payment'],
  items: OrderItem[],
): Order => ({ id, customerId, customerName, date, status, payment, items, total: total(items) })

export const orders: Order[] = [
  mk('NB-10492', 'c1', 'Ariful Islam', '2026-11-19', 'processing', 'bKash', [item('nova-x-pro-5g-256gb', 1), item('gan-65w-fast-charger-with-cable', 1)]),
  mk('NB-10491', 'c2', 'Sadia Rahman', '2026-11-19', 'pending', 'Cash on Delivery', [item('crispy-chef-5l-digital-air-fryer', 1)]),
  mk('NB-10488', 'c3', 'Rafiq Chowdhury', '2026-11-18', 'shipped', 'Card', [item('zenbook-air-14-i7', 1)]),
  mk('NB-10485', 'c1', 'Ariful Islam', '2026-11-17', 'delivered', 'Cash on Delivery', [item('airbeat-pro-wireless-earbuds', 2)]),
  mk('NB-10480', 'c4', 'Farhana Akter', '2026-11-16', 'delivered', 'bKash', [item('pulse-fit-2-smartwatch', 1), item('volt-20000-mah-power-bank', 1)]),
  mk('NB-10476', 'c5', 'Tanvir Ahmed', '2026-11-15', 'cancelled', 'Cash on Delivery', [item('striker-k87-mechanical-gaming-keyboard', 1)]),
  mk('NB-10471', 'c6', 'Mim Chowdhury', '2026-11-14', 'delivered', 'Card', [item('quietmax-anc-over-ear-headphones', 1)]),
  mk('NB-10466', 'c1', 'Ariful Islam', '2026-11-10', 'delivered', 'bKash', [item('tabpro-11-wifi-128gb-with-stylus', 1)]),
  mk('NB-10459', 'c3', 'Rafiq Chowdhury', '2026-11-08', 'delivered', 'Cash on Delivery', [item('kitchenmate-1-8l-rice-cooker', 1), item('sonic-go-portable-bluetooth-speaker', 1)]),
]

export const customers: Customer[] = [
  { id: 'c1', name: 'Ariful Islam', email: 'ariful@example.com', phone: '01711-000111', city: 'Dhaka', orders: 4, spent: 189340, joined: '2025-03-12', status: 'active' },
  { id: 'c2', name: 'Sadia Rahman', email: 'sadia@example.com', phone: '01811-000222', city: 'Chattogram', orders: 2, spent: 22340, joined: '2025-06-02', status: 'active' },
  { id: 'c3', name: 'Rafiq Chowdhury', email: 'rafiq@example.com', phone: '01911-000333', city: 'Dhaka', orders: 3, spent: 134490, joined: '2025-07-19', status: 'active' },
  { id: 'c4', name: 'Farhana Akter', email: 'farhana@example.com', phone: '01611-000444', city: 'Sylhet', orders: 1, spent: 11840, joined: '2025-09-08', status: 'active' },
  { id: 'c5', name: 'Tanvir Ahmed', email: 'tanvir@example.com', phone: '01511-000555', city: 'Rajshahi', orders: 5, spent: 48200, joined: '2024-12-21', status: 'blocked' },
  { id: 'c6', name: 'Mim Chowdhury', email: 'mim@example.com', phone: '01311-000666', city: 'Dhaka', orders: 2, spent: 31800, joined: '2025-10-30', status: 'active' },
]

export const revenueByMonth = [
  { month: 'Jun', revenue: 412000, orders: 96 },
  { month: 'Jul', revenue: 468000, orders: 108 },
  { month: 'Aug', revenue: 455000, orders: 102 },
  { month: 'Sep', revenue: 538000, orders: 127 },
  { month: 'Oct', revenue: 612000, orders: 141 },
  { month: 'Nov', revenue: 689000, orders: 158 },
]

export const currentCustomerId = 'c1'
