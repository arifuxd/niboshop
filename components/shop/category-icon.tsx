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
  const Icon = icons[name] ?? PackageIcon
  return <Icon className={className} aria-hidden="true" />
}
