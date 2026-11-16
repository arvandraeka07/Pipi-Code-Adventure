import { useEffect } from 'react'
import type { ToastItem } from '../types'
import { Icon } from './Icon'
import { cn } from './ui'

const TONES: Record<ToastItem['kind'], { bg: string; icon: string; iconBg: string }> = {
  xp: { bg: 'bg-[#F3FFE9]', icon: 'bolt', iconBg: 'bg-sun' },
  coin: { bg: 'bg-[#FFF8E2]', icon: 'coin', iconBg: 'bg-sun' },
  level: { bg: 'bg-[#FFF4CC]', icon: 'star', iconBg: 'bg-sun' },
  badge: { bg: 'bg-[#F4EEFF]', icon: 'trophy', iconBg: 'bg-grape' },
  info: { bg: 'bg-white', icon: 'info', iconBg: 'bg-sky' },
  error: { bg: 'bg-[#FFF0ED]', icon: 'alert', iconBg: 'bg-coral' },
  boss: { bg: 'bg-[#FFEDE8]', icon: 'sword', iconBg: 'bg-coral' },
}

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), 4200)
    return () => window.clearTimeout(timer)
  }, [toast.id, onDismiss])

  const tone = TONES[toast.kind]
  return (
    <button
      onClick={() => onDismiss(toast.id)}
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border-[3px] border-ink px-3 py-2.5 text-left shadow-pop-sm animate-pop-in',
        tone.bg,
      )}
      aria-live="polite"
    >
      <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl border-2 border-ink', tone.iconBg)}>
        <Icon name={toast.icon ?? tone.icon} size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-sm font-extrabold leading-tight text-ink">{toast.title}</span>
        {toast.message && <span className="block truncate text-[11px] font-semibold text-ink/60">{toast.message}</span>}
      </span>
      <Icon name="x" size={14} className="shrink-0 text-ink/40" />
    </button>
  )
}

export function ToastViewport({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
  if (!toasts.length) return null
  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-20 z-[70] flex flex-col items-end gap-2 sm:inset-x-auto sm:bottom-5 sm:right-5">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
