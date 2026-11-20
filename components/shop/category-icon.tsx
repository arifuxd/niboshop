import Image from 'next/image'
import * as LucideIcons from 'lucide-react'
import {
  BatteryChargingIcon,
  BoxesIcon,
  CookingPotIcon,
  Gamepad2Icon,
  HeadphonesIcon,
  HeartIcon,
  LaptopIcon,
  LayoutDashboardIcon,
  MapPinIcon,
  PackageIcon,
  ShoppingBagIcon,
  SmartphoneIcon,
  TabletIcon,
  TagsIcon,
  UserIcon,
  UsersIcon,
  WatchIcon,
  type LucideIcon,
} from 'lucide-react'

const icons: Record<string, LucideIcon> = {
  smartphone: SmartphoneIcon,
  tablet: TabletIcon,
  laptop: LaptopIcon,
  watch: WatchIcon,
  headphones: HeadphonesIcon,
  'battery-charging': BatteryChargingIcon,
  'gamepad-2': Gamepad2Icon,
  'cooking-pot': CookingPotIcon,
  'layout-dashboard': LayoutDashboardIcon,
  package: PackageIcon,
  heart: HeartIcon,
  'map-pin': MapPinIcon,
  user: UserIcon,
  boxes: BoxesIcon,
  'shopping-bag': ShoppingBagIcon,
  tags: TagsIcon,
  users: UsersIcon,
}

export function NamedIcon({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  if (name.startsWith('https://') || name.startsWith('/')) {
    return <Image src={name} alt="" width={40} height={40} className={className} />
  }
  const exportName = `${name.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('')}Icon`
  const Icon = icons[name] ?? (LucideIcons as unknown as Record<string, LucideIcon>)[exportName] ?? PackageIcon
  return <Icon className={className} aria-hidden="true" />
}
