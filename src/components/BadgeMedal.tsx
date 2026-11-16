import type { BadgeDef } from '../types'
import { Icon } from './Icon'
import { cn } from './ui'

export function BadgeMedal({
  badge,
  unlocked,
  size = 86,
  className,
  showLock = true,
}: {
  badge: BadgeDef
  unlocked: boolean
  size?: number
  className?: string
  showLock?: boolean
}) {
  const ribbon = unlocked ? badge.color : '#C7CFC9'
  return (
    <div
      className={cn('relative inline-flex shrink-0 items-center justify-center', className)}
      style={{ width: size, height: size * 1.08 }}
    >
      <div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2"
        style={{ width: size * 0.52, height: size * 0.36 }}
      >
        <div
          className="absolute inset-0 border-2 border-ink"
          style={{
            background: ribbon,
            clipPath: 'polygon(0 0, 100% 0, 76% 100%, 50% 78%, 24% 100%)',
            filter: unlocked ? 'none' : 'grayscale(1)',
            opacity: unlocked ? 1 : 0.5,
          }}
        />
      </div>
      <div
        className={cn(
          'relative grid place-items-center rounded-full border-[3px] border-ink transition',
          unlocked ? 'shadow-pop-sm' : 'opacity-60 grayscale',
        )}
        style={{
          width: size,
          height: size,
          background: unlocked
            ? `radial-gradient(circle at 35% 28%, #FFFFFF 0%, ${badge.color} 62%, #123B2A 160%)`
            : 'radial-gradient(circle at 35% 28%, #FAFAF7 0%, #DDE5DF 70%)',
        }}
      >
        <div className="absolute inset-[9px] rounded-full border-2 border-ink/15 bg-white/45" />
        <div className="relative grid h-[58%] w-[58%] place-items-center rounded-full border-2 border-ink/20 bg-white/85 text-ink">
          <Icon name={badge.icon} size={size * 0.32} strokeWidth={2.6} />
        </div>
        <span className="absolute left-[18%] top-[12%] h-2 w-2 rounded-full bg-white/90" />
        <span className="absolute right-[16%] top-[24%] h-1.5 w-1.5 rounded-full bg-white/70" />
      </div>
      {!unlocked && showLock && (
        <span className="absolute right-0 top-0 grid h-6 w-6 place-items-center rounded-full border-2 border-ink bg-white text-ink">
          <Icon name="lock" size={12} />
        </span>
      )}
      {unlocked && (
        <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full border-2 border-ink bg-sun text-ink">
          <Icon name="check" size={12} />
        </span>
      )}
    </div>
  )
}
