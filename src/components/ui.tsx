import { useEffect, useMemo, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Icon } from './Icon'

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

type ButtonVariant = 'primary' | 'secondary' | 'sun' | 'grape' | 'danger' | 'ghost' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-ink hover:bg-leafDark',
  secondary: 'bg-surface text-ink hover:bg-cream',
  sun: 'bg-sun text-ink hover:bg-[#e8a72f]',
  grape: 'bg-grape text-ink hover:bg-[#c7b5df]',
  danger: 'bg-coral text-white hover:bg-[#d5553b]',
  ghost: 'bg-transparent text-ink border-transparent shadow-none hover:bg-ink/5',
  outline: 'bg-transparent text-ink hover:bg-cream',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'min-h-11 px-3 py-1.5 text-xs rounded-lg gap-1.5 border-2',
  md: 'min-h-11 px-4 py-2.5 text-sm rounded-lg gap-2',
  lg: 'min-h-12 px-6 py-3.5 text-base rounded-xl gap-2.5',
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: string
  iconRight?: string
}) {
  return (
    <button
      className={cn(
        'inline-flex select-none items-center justify-center border-2 border-ink font-display font-bold shadow-pop-sm transition-all duration-150 hover:-translate-y-0.5 active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0',
        VARIANTS[variant],
        SIZES[size],
        variant === 'ghost' && 'border-transparent',
        className,
      )}
      {...props}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 15 : 18} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === 'sm' ? 15 : 18} />}
    </button>
  )
}

export function Card({
  children,
  className,
  tone = 'paper',
  hover = false,
}: {
  children: ReactNode
  className?: string
  tone?: 'paper' | 'mint' | 'cream' | 'grape' | 'sun' | 'white'
  hover?: boolean
}) {
  const tones = {
    paper: 'bg-surface',
    mint: 'bg-mint',
    cream: 'bg-cream',
    grape: 'bg-grape-soft',
    sun: 'bg-warning-soft',
    white: 'bg-surface',
  }
  return (
    <div
      className={cn(
        'rounded-xl border-2 border-ink shadow-pop',
        tones[tone],
        hover && 'transition-transform duration-200 hover:-translate-y-1 hover:shadow-pop-lg',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function ProgressBar({
  value,
  color = '#2FBF71',
  height = 12,
  showLabel = false,
  label,
  className,
  animate = true,
}: {
  value: number
  color?: string
  height?: number
  showLabel?: boolean
  label?: string
  className?: string
  animate?: boolean
}) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="mb-1 flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wide text-ink/60">
          <span>{label ?? 'Progres'}</span>
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div
        className="relative w-full overflow-hidden rounded-full border-2 border-ink/20 bg-ink/10"
        style={{ height }}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progres'}
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-700 ease-out', animate && 'progress-shine')}
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

export function Chip({
  children,
  icon,
  color,
  className,
}: {
  children: ReactNode
  icon?: string
  color?: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border-2 border-ink/15 bg-surface/80 px-2.5 py-1 text-[11px] font-extrabold text-ink',
        className,
      )}
      style={color ? { color: `color-mix(in srgb, ${color} 68%, rgb(var(--c-ink)))` } : undefined}
    >
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  className,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mb-4 flex flex-wrap items-end justify-between gap-3', className)}>
      <div>
        {eyebrow && (
          <div className="mb-1 flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-leafDark">
            <span className="inline-block h-2 w-2 border border-ink bg-sun" />
            {eyebrow}
          </div>
        )}
        <h2 className="text-gradient font-display text-xl font-extrabold leading-tight sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 max-w-2xl text-sm font-semibold text-ink/60">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function PageHeader({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string
  subtitle?: string
  icon?: string
  children?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="group grid h-12 w-12 -rotate-2 place-items-center rounded-lg border-2 border-ink bg-sun shadow-pop-sm transition-transform duration-200 hover:rotate-0">
            <Icon name={icon} size={23} />
          </div>
        )}
        <div>
          <h1 className="text-gradient font-display text-2xl font-extrabold leading-tight sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm font-semibold text-ink/60">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}

export function Modal({
  open,
  onClose,
  title,
  icon,
  children,
  footer,
  size = 'md',
  tone = 'paper',
  hideClose = false,
}: {
  open: boolean
  onClose: () => void
  title?: string
  icon?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  tone?: 'paper' | 'cream' | 'mint' | 'white'
  hideClose?: boolean
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null
  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
  const tones = { paper: 'bg-paper', cream: 'bg-cream', mint: 'bg-mint', white: 'bg-surface' }
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-3 sm:items-center sm:p-6" role="dialog" aria-modal="true">
      <button
        className="absolute inset-0 cursor-default bg-ink/55"
        onClick={onClose}
        aria-label="Tutup dialog"
        tabIndex={-1}
      />
      <div
        className={cn(
          'relative z-10 w-full animate-pop-in overflow-hidden rounded-xl border-2 border-ink shadow-pop-lg',
          widths[size],
          tones[tone],
        )}
      >
        {(title || !hideClose) && (
          <div className="flex items-center justify-between gap-3 border-b-2 border-ink/15 px-5 py-4">
            <div className="flex items-center gap-2">
              {icon && (
                <div className="grid h-9 w-9 -rotate-2 place-items-center rounded-md border-2 border-ink bg-sun">
                  <Icon name={icon} size={18} />
                </div>
              )}
              {title && <h3 className="font-display text-lg font-bold text-ink">{title}</h3>}
            </div>
            {!hideClose && (
              <button
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-md border-2 border-ink bg-surface text-ink transition hover:bg-rose"
                aria-label="Tutup"
              >
                <Icon name="x" size={17} />
              </button>
            )}
          </div>
        )}
        <div className="max-h-[72vh] overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="border-t-2 border-ink/15 bg-surface/50 px-5 py-4">{footer}</div>}
      </div>
    </div>
  )
}

export function EmptyState({
  title,
  description,
  icon = 'compass',
  action,
}: {
  title: string
  description: string
  icon?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-ink/25 bg-surface/50 px-6 py-10 text-center">
      <div className="mb-3 grid h-14 w-14 place-items-center rounded-lg border-2 border-ink/20 bg-mint text-ink/70">
        <Icon name={icon} size={26} />
      </div>
      <h3 className="font-display text-lg font-extrabold text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-sm font-semibold text-ink/60">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function StatTile({
  icon,
  label,
  value,
  hint,
  color = '#FFC93C',
  className,
}: {
  icon: string
  label: string
  value: ReactNode
  hint?: string
  color?: string
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-3 rounded-lg border-2 border-ink bg-surface p-3 shadow-pop-sm', className)}>
      <div
        className="grid h-10 w-10 shrink-0 place-items-center rounded-md border-2 border-ink"
        style={{ backgroundColor: color }}
      >
        <Icon name={icon} size={19} />
      </div>
      <div className="min-w-0">
        <div className="font-display text-lg font-extrabold leading-none text-ink">{value}</div>
        <div className="mt-0.5 truncate text-[11px] font-bold uppercase tracking-wide text-ink/50">{label}</div>
        {hint && <div className="truncate text-[10px] font-semibold text-ink/40">{hint}</div>}
      </div>
    </div>
  )
}

export function Confetti({ count = 46, className = '' }: { count?: number; className?: string }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const colors = ['#FFC93C', '#2FBF71', '#CDBAF9', '#FF8A7A', '#BFE9FF', '#FF9CB6']
        return {
          left: (i * 37) % 100,
          delay: ((i * 13) % 90) / 100,
          duration: 1.9 + ((i * 7) % 90) / 100,
          color: colors[i % colors.length],
          size: 6 + (i % 5) * 2,
          rotate: (i * 47) % 360,
          round: i % 3 === 0,
        }
      }),
    [count],
  )
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece absolute top-[-16px]"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            backgroundColor: p.color,
            width: p.size,
            height: p.round ? p.size : p.size * 1.8,
            borderRadius: p.round ? '50%' : '2px',
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  )
}

export function Locked({ label = 'Terkunci' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-ink/10 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-ink/60">
      <Icon name="lock" size={11} />
      {label}
    </span>
  )
}
