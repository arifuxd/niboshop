import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NamedIcon } from '@/components/shop/category-icon'
import type { OrderStatus } from '@/lib/data/types'
import { cn } from '@/lib/utils'

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions}
    </div>
  )
}

export function StatCard({
  label,
  value,
  icon,
  hint,
}: {
  label: string
  value: string
  icon: string
  hint?: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <NamedIcon name={icon} className="size-4" />
        </span>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  )
}

const statusStyles: Record<OrderStatus, string> = {
  pending: 'bg-muted text-muted-foreground',
  processing: 'bg-primary/10 text-primary',
  shipped: 'bg-chart-2/15 text-chart-2',
  delivered: 'bg-success/15 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant="secondary" className={cn('capitalize', statusStyles[status])}>
      {status}
    </Badge>
  )
}
