import { Icon } from './Icon'
import { cn } from './ui'

export const AVATAR_META: Record<string, { label: string; icon: string; color: string }> = {
  pipi: { label: 'Pipi', icon: 'sparkles', color: '#63DE95' },
  explorer: { label: 'Penjelajah', icon: 'compass', color: '#FFC93C' },
  wizard: { label: 'Penyihir', icon: 'wand', color: '#CDBAF9' },
  ninja: { label: 'Ninja', icon: 'swords', color: '#BFE9FF' },
  astronaut: { label: 'Astronaut', icon: 'rocket', color: '#FFD9E3' },
  robot: { label: 'Robot', icon: 'bot', color: '#D8F7E4' },
}

export function Avatar({
  avatar,
  size = 44,
  className,
  ring = true,
}: {
  avatar: string
  size?: number
  className?: string
  ring?: boolean
}) {
  const meta = AVATAR_META[avatar] ?? AVATAR_META.pipi
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-full border-[3px] border-ink',
        ring && 'shadow-pop-sm',
        className,
      )}
      style={{ width: size, height: size, backgroundColor: meta.color }}
      title={meta.label}
    >
      <Icon name={meta.icon} size={size * 0.46} strokeWidth={2.5} />
    </span>
  )
}
