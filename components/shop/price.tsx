import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/format'

export function Price({
  price,
  comparePrice,
  size = 'md',
  className,
}: {
  price: number
  comparePrice?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-2', className)}>
      <span
        className={cn(
          'font-semibold text-primary-gradient',
          size === 'sm' && 'text-sm',
          size === 'md' && 'text-base',
          size === 'lg' && 'text-3xl',
        )}
      >
        {formatPrice(price)}
      </span>
      {comparePrice && comparePrice > price ? (
        <span
          className={cn(
            'text-muted-foreground line-through',
            size === 'lg' ? 'text-base' : 'text-xs',
          )}
        >
          {formatPrice(comparePrice)}
        </span>
      ) : null}
    </div>
  )
}
