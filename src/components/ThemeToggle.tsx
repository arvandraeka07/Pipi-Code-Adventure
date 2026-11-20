import { Icon } from './Icon'
import { usePreferences } from '../lib/preferences'
import { cn } from './ui'

export function ThemeToggle({ className, label = true }: { className?: string; label?: boolean }) {
  const { theme, toggleTheme } = usePreferences()
  const dark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
      aria-pressed={dark}
      title={dark ? 'Mode terang' : 'Mode gelap'}
      className={cn(
        'inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl border-2 border-ink bg-surface px-3 font-display text-xs font-extrabold text-ink shadow-pop-sm transition hover:-translate-y-0.5 hover:bg-sun focus-visible:outline-3',
        className,
      )}
    >
      <Icon name={dark ? 'sun' : 'moon'} size={17} />
      {label && <span className="hidden sm:inline">{dark ? 'Terang' : 'Gelap'}</span>}
    </button>
  )
}
