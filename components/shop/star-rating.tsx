import { StarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StarRating({
  rating,
  className,
}: {
  rating: number
  className?: string
}) {
  return (
    <span
      className={cn('inline-flex items-center gap-0.5', className)}
      role="img"
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon
          key={i}
          className={cn(
            'size-3.5',
            i <= Math.round(rating)
              ? 'fill-star text-star'
              : 'fill-muted text-muted-foreground/40',
          )}
        />
      ))}
    </span>
  )
}
