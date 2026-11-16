import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useGame } from '../store/GameContext'
import { levelProgress } from '../lib/game'
import { Pipi } from './Pipi'
import { Icon } from './Icon'
import { Avatar } from './Avatar'
import { Onboarding } from './Onboarding'
import { ProgressBar, cn } from './ui'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: 'home' },
  { to: '/adventure', label: 'Peta Petualangan', icon: 'map' },
  { to: '/daily', label: 'Daily Quest', icon: 'target' },
  { to: '/playground', label: 'Playground', icon: 'terminal' },
  { to: '/games', label: 'Mini Games', icon: 'gamepad' },
  { to: '/achievements', label: 'Pencapaian', icon: 'trophy' },
  { to: '/tutor', label: 'Pipi Tutor', icon: 'chat' },
  { to: '/profile', label: 'Profil', icon: 'user' },
  { to: '/settings', label: 'Pengaturan', icon: 'settings' },
]

const BOTTOM_NAV = NAV.filter((n) => ['/dashboard', '/adventure', '/playground', '/games', '/tutor'].includes(n.to))

function useNavActive() {
  const { pathname } = useLocation()
  return (to: string) => {
    if (to === '/dashboard') return pathname === '/dashboard'
    if (to === '/adventure') {
      return pathname.startsWith('/adventure') || pathname.startsWith('/world') || pathname.startsWith('/lesson') || pathname.startsWith('/boss')
    }
    return pathname === to || pathname.startsWith(`${to}/`)
  }
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/dashboard" className="group flex items-center gap-2.5" aria-label="PIPI CODE ADVENTURE - Dashboard">
      <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-2xl border-[3px] border-ink bg-mint shadow-pop-sm transition group-hover:-rotate-3">
        <span className="absolute -bottom-2">
          <Pipi mood="happy" size={50} />
        </span>
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-[15px] font-extrabold tracking-tight text-ink">
            PIPI CODE
          </span>
          <span className="mt-0.5 block font-display text-[11px] font-bold tracking-[0.22em] text-leafDark">
            ADVENTURE
          </span>
        </span>
      )}
    </Link>
  )
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const isActive = useNavActive()
  return (
    <nav className="space-y-1" aria-label="Navigasi utama">
      {NAV.map((item) => {
        const active = isActive(item.to)
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              'group flex items-center gap-2.5 rounded-xl border-2 px-3 py-2 font-display text-[13px] font-bold transition',
              active
                ? 'border-ink bg-sun text-ink shadow-pop-sm'
                : 'border-transparent text-ink/65 hover:border-ink/10 hover:bg-white/70 hover:text-ink',
            )}
            aria-current={active ? 'page' : undefined}
          >
            <span
              className={cn(
                'grid h-7 w-7 place-items-center rounded-lg border-2 transition',
                active ? 'border-ink bg-white/60' : 'border-transparent bg-ink/5 group-hover:bg-white',
              )}
            >
              <Icon name={item.icon} size={15} />
            </span>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

function Sidebar() {
  const { save, level } = useGame()
  if (!save) return null
  const progress = levelProgress(save.xp)
  return (
    <aside className="sticky top-0 hidden h-screen w-[258px] shrink-0 flex-col border-r-[3px] border-ink/10 bg-paper/80 px-4 py-4 backdrop-blur lg:flex">
      <div className="px-1">
        <Logo />
      </div>

      <div className="mt-4 rounded-2xl border-[3px] border-ink bg-mint/60 p-3 shadow-pop-sm">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-sun px-2 py-0.5 font-display text-[11px] font-extrabold">
            <Icon name="star" size={12} /> LEVEL {level}
          </span>
          <span className="font-mono text-[10px] font-bold text-ink/50">{progress.into}/{progress.span} XP</span>
        </div>
        <ProgressBar value={progress.percent} height={9} className="mt-2" />
        <div className="mt-2 flex items-center justify-between text-[11px] font-extrabold">
          <span className="inline-flex items-center gap-1 text-ink/70">
            <Icon name="coin" size={12} className="text-sunDark" /> {save.coins}
          </span>
          <span className="inline-flex items-center gap-1 text-ink/70">
            <Icon name="flame" size={12} className="text-coral" /> {save.streak.count} hari
          </span>
        </div>
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto pb-2">
        <NavList />
      </div>

      <Link
        to="/profile"
        className="mt-2 flex items-center gap-2.5 rounded-2xl border-[3px] border-ink bg-white/80 p-2 shadow-pop-sm transition hover:-translate-y-0.5 hover:bg-white"
      >
        <Avatar avatar={save.profile.avatar} size={38} ring={false} />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-xs font-extrabold text-ink">{save.profile.name}</span>
          <span className="block text-[10px] font-bold text-ink/45">Lihat profil & akun</span>
        </span>
        <Icon name="chevron-right" size={14} className="text-ink/35" />
      </Link>
    </aside>
  )
}

function MobileHeader({ onMenu }: { onMenu: () => void }) {
  const { save, level } = useGame()
  if (!save) return null
  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-ink/10 bg-cream/90 px-3 py-2.5 backdrop-blur lg:hidden">
      <div className="flex items-center gap-2">
        <button
          onClick={onMenu}
          className="grid h-9 w-9 place-items-center rounded-xl border-2 border-ink bg-white shadow-pop-sm"
          aria-label="Buka menu"
        >
          <Icon name="menu" size={18} />
        </button>
        <Logo />
        <div className="ml-auto flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full border-2 border-ink/15 bg-white/80 px-2 py-1 text-[11px] font-extrabold">
            <Icon name="coin" size={12} className="text-sunDark" />
            {save.coins}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border-2 border-ink/15 bg-white/80 px-2 py-1 text-[11px] font-extrabold">
            <Icon name="flame" size={12} className="text-coral" />
            {save.streak.count}
          </span>
          <Link to="/profile" className="relative" aria-label="Profil">
            <Avatar avatar={save.profile.avatar} size={35} />
            <span className="absolute -bottom-1.5 -right-1.5 rounded-full border-2 border-ink bg-sun px-1 font-display text-[9px] font-extrabold">
              {level}
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { save, level } = useGame()
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])
  if (!save) return null
  return (
    <div className={cn('fixed inset-0 z-[65] lg:hidden', open ? 'pointer-events-auto' : 'pointer-events-none')}>
      <div
        className={cn('absolute inset-0 bg-ink/45 backdrop-blur-sm transition-opacity', open ? 'opacity-100' : 'opacity-0')}
        onClick={onClose}
      />
      <div
        className={cn(
          'absolute inset-y-0 left-0 flex w-[86%] max-w-[320px] flex-col border-r-[3px] border-ink bg-paper px-4 py-4 shadow-pop-lg transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi"
      >
        <div className="flex items-center justify-between">
          <Logo />
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl border-2 border-ink bg-white"
            aria-label="Tutup menu"
          >
            <Icon name="x" size={17} />
          </button>
        </div>
        <div className="mt-4 flex items-center gap-2.5 rounded-2xl border-[3px] border-ink bg-mint/60 p-2.5">
          <Avatar avatar={save.profile.avatar} size={40} ring={false} />
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-sm font-extrabold">{save.profile.name}</div>
            <div className="text-[10px] font-bold text-ink/50">
              Level {level} • {save.coins} koin • {save.streak.count} hari streak
            </div>
          </div>
        </div>
        <div className="mt-3 min-h-0 flex-1 overflow-y-auto">
          <NavList onNavigate={onClose} />
        </div>
        <div className="mt-2 rounded-xl bg-ink/5 px-3 py-2 text-[10px] font-bold leading-snug text-ink/45">
          Belajar Python dari nol bersama Pipi. Progres tersimpan otomatis di perangkat ini.
        </div>
      </div>
    </div>
  )
}

function BottomNav() {
  const isActive = useNavActive()
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t-[3px] border-ink bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      aria-label="Navigasi cepat"
    >
      <div className="grid grid-cols-5">
        {BOTTOM_NAV.map((item) => {
          const active = isActive(item.to)
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'relative flex flex-col items-center gap-0.5 py-2 text-[9.5px] font-extrabold transition',
                active ? 'text-leafDark' : 'text-ink/45',
              )}
              aria-current={active ? 'page' : undefined}
            >
              {active && <span className="absolute top-0 h-1 w-7 rounded-b-full bg-sun" />}
              <Icon name={item.icon} size={19} />
              <span className="truncate px-0.5">{item.label.replace('Peta Petualangan', 'Peta').replace('Pipi Tutor', 'Tutor')}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export function AppLayout() {
  const { pathname } = useLocation()
  const [drawer, setDrawer] = useState(false)

  useEffect(() => {
    setDrawer(false)
    const main = document.getElementById('pipi-main')
    if (main) main.scrollTo({ top: 0, behavior: 'auto' })
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <MobileHeader onMenu={() => setDrawer(true)} />
        <MobileDrawer open={drawer} onClose={() => setDrawer(false)} />
        <main id="pipi-main" className="mx-auto w-full max-w-6xl px-3 pb-24 pt-4 sm:px-5 lg:px-8 lg:pb-12 lg:pt-8">
          <Outlet />
        </main>
      </div>
      <BottomNav />
      <Onboarding />
    </div>
  )
}
