import { useEffect, useMemo } from 'react'
import type { CelebrationItem, EvolutionStage } from '../types'
import { BADGES } from '../data/badges'
import { Pipi } from './Pipi'
import { BadgeMedal } from './BadgeMedal'
import { Button, Confetti } from './ui'
import { Icon } from './Icon'

const STAGE_LABEL: Record<EvolutionStage, string> = {
  baby: 'Baby Pipi',
  junior: 'Junior Pipi',
  smart: 'Smart Pipi',
  master: 'Python Master',
}

export function CelebrationOverlay({
  item,
  queued,
  onDismiss,
}: {
  item: CelebrationItem | null
  queued: number
  onDismiss: () => void
}) {
  useEffect(() => {
    if (!item) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') onDismiss()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [item, onDismiss])

  const badge = useMemo(() => (item?.badgeId ? BADGES.find((b) => b.id === item.badgeId) : null), [item?.badgeId])

  if (!item) return null
  const stage = item.stage ?? 'baby'

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={item.title}>
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-[3px]" onClick={onDismiss} />
      <div className="relative z-10 w-full max-w-md animate-pop-in overflow-hidden rounded-[30px] border-[4px] border-ink bg-cream shadow-pop-lg">
        <Confetti count={44} />
        <div
          className="relative px-6 pb-6 pt-5 text-center"
          style={{
            background: `radial-gradient(120% 90% at 50% 0%, ${item.color ?? '#FFC93C'}55 0%, transparent 70%)`,
          }}
        >
          <div className="mb-1 flex items-center justify-center gap-2 font-display text-[11px] font-extrabold uppercase tracking-[0.22em] text-ink/50">
            <Icon name="sparkles" size={14} />
            {item.kind === 'badge' ? 'Pencapaian Baru' : item.kind === 'boss' ? 'Boss Dikalahkan' : 'Momen Spesial'}
          </div>

          <div className="relative mx-auto my-2 flex max-w-[280px] items-center justify-center">
            {badge ? (
              <div className="animate-pop-in">
                <BadgeMedal badge={badge} unlocked size={132} />
              </div>
            ) : (
              <div className={stage === 'master' ? 'animate-float' : 'animate-pop-in'}>
                <Pipi mood={item.kind === 'boss' ? 'celebrate' : 'celebrate'} stage={stage} size={190} />
              </div>
            )}
            <span className="absolute -left-1 top-2 animate-sparkle">
              <Icon name="sparkles" size={22} className="text-sun" />
            </span>
            <span className="absolute -right-1 bottom-6 animate-sparkle" style={{ animationDelay: '0.8s' }}>
              <Icon name="star" size={18} className="text-grape" />
            </span>
          </div>

          <h3 className="mt-2 font-display text-2xl font-extrabold leading-tight text-ink sm:text-3xl">{item.title}</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm font-semibold leading-relaxed text-ink/70">{item.message}</p>

          {item.kind === 'evolve' && (
            <div className="mx-auto mt-3 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white/80 px-3 py-1.5 font-display text-xs font-extrabold text-ink">
              <Icon name="sparkles" size={14} />
              {STAGE_LABEL[stage]}
            </div>
          )}
          {item.kind === 'badge' && badge && (
            <div className="mx-auto mt-3 max-w-xs rounded-2xl border-2 border-ink/15 bg-white/70 px-3 py-2 text-xs font-semibold text-ink/60">
              {badge.requirement}
            </div>
          )}

          <Button variant="sun" size="lg" className="mt-5 w-full" onClick={onDismiss} iconRight="arrow-right">
            Lanjutkan Petualangan
          </Button>
          {queued > 1 && (
            <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-ink/40">
              +{queued - 1} kejutan lain menantimu
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
