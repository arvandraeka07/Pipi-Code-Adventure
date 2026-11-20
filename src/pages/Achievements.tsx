import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGame } from '../store/GameContext'
import { BADGES } from '../data/badges'
import { badgeContext, evolutionState, friendlyDate } from '../lib/game'
import { BadgeMedal } from '../components/BadgeMedal'
import { Pipi } from '../components/Pipi'
import { Icon } from '../components/Icon'
import { Button, Card, Chip, Modal, PageHeader, ProgressBar, SectionHeading, StatTile, cn } from '../components/ui'

type Filter = 'all' | 'unlocked' | 'locked'

const TIER_STYLE: Record<string, { label: string; color: string }> = {
  bronze: { label: 'Bronze', color: '#E8B27A' },
  silver: { label: 'Silver', color: '#CFE0E6' },
  gold: { label: 'Gold', color: '#FFD452' },
  legend: { label: 'Legend', color: '#CDBAF9' },
}

export default function Achievements() {
  const { save } = useGame()
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<string | null>(null)
  if (!save) return null

  const ctx = badgeContext(save)
  const evolution = evolutionState(save)
  const unlocked = BADGES.filter((b) => save.badges[b.id])
  const locked = BADGES.filter((b) => !save.badges[b.id])
  const percent = Math.round((unlocked.length / BADGES.length) * 100)

  const items = BADGES.map((badge) => {
    const progress = badge.progress?.(ctx)
    const isUnlocked = Boolean(save.badges[badge.id])
    const ratio = progress ? Math.min(1, progress.current / progress.target) : isUnlocked ? 1 : 0
    return { badge, progress, isUnlocked, ratio }
  })

  const visible = items.filter((item) => (filter === 'all' ? true : filter === 'unlocked' ? item.isUnlocked : !item.isUnlocked))
  const nextUp = items
    .filter((item) => !item.isUnlocked && item.progress)
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 3)
  const active = items.find((item) => item.badge.id === selected) ?? null

  return (
    <div>
      <PageHeader title="Pencapaian" subtitle="Koleksi badge dan perjalanan evolusi Pipi." icon="trophy">
        <Link to="/adventure">
          <Button size="sm" variant="sun" icon="map">Cari badge baru</Button>
        </Link>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card tone="cream" className="relative overflow-hidden p-5">
            <div className="absolute -right-10 -top-14 h-44 w-44 rounded-full bg-sun/30" />
            <div className="relative flex flex-wrap items-center gap-5">
              <div className="relative">
                <BadgeMedal badge={BADGES[0]} unlocked size={92} showLock={false} />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full border-2 border-ink bg-surface px-2 py-0.5 font-display text-[10px] font-extrabold shadow-pop-sm">
                  {unlocked.length}/{BADGES.length}
                </span>
              </div>
              <div className="min-w-[200px] flex-1">
                <div className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-leafDark">Koleksi badge</div>
                <h2 className="font-display text-2xl font-extrabold leading-tight">
                  {unlocked.length === 0 ? 'Petualanganmu baru dimulai!' : `${unlocked.length} badge sudah di tangan`}
                </h2>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-ink/55">
                  {unlocked.length === BADGES.length
                    ? 'Luar biasa! Seluruh badge telah kamu kumpulkan. Pipi sangat bangga!'
                    : 'Badge terbuka otomatis dari aktivitas belajarmu. Tidak perlu diklaim manual.'}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <ProgressBar value={percent} color="#FFC93C" height={10} className="flex-1" />
                  <span className="font-mono text-[11px] font-bold text-ink/50">{percent}%</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-1.5 rounded-2xl border-2 border-ink/10 bg-surface/60 p-1">
              {([
                { id: 'all', label: 'Semua', count: BADGES.length },
                { id: 'unlocked', label: 'Terbuka', count: unlocked.length },
                { id: 'locked', label: 'Terkunci', count: locked.length },
              ] as { id: Filter; label: string; count: number }[]).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={cn(
                    'min-h-11 rounded-xl px-3 py-1.5 font-display text-[11px] font-extrabold transition',
                    filter === tab.id ? 'bg-sun text-ink shadow-pop-sm' : 'text-ink/55 hover:bg-surface',
                  )}
                >
                  {tab.label} <span className="opacity-60">{tab.count}</span>
                </button>
              ))}
            </div>
            <span className="text-[10px] font-bold text-ink/40">Klik badge untuk melihat detail</span>
          </div>

          {visible.length === 0 ? (
            <Card className="p-8 text-center">
              <Pipi mood="thinking" size={110} className="mx-auto" />
              <h3 className="mt-2 font-display text-lg font-extrabold">Belum ada badge di sini</h3>
              <p className="text-xs font-semibold text-ink/50">Selesaikan misi pertama untuk membuka koleksimu.</p>
              <Link to="/adventure" className="mt-3 inline-block">
                <Button size="sm" icon="compass">Buka peta</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {visible.map(({ badge, isUnlocked, progress, ratio }) => (
                <button
                  key={badge.id}
                  onClick={() => setSelected(badge.id)}
                  className={cn(
                    'group rounded-2xl border-[3px] p-3 text-center transition',
                    isUnlocked
                      ? 'border-ink bg-surface shadow-pop-sm hover:-translate-y-1 hover:shadow-pop'
                      : 'border-ink/15 bg-surface/45 hover:border-ink/30 hover:bg-surface/70',
                  )}
                >
                  <BadgeMedal badge={badge} unlocked={isUnlocked} size={66} className="mx-auto" />
                  <div className="mt-2 truncate font-display text-[12px] font-extrabold">{badge.name}</div>
                  <div className="mt-0.5 flex items-center justify-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: TIER_STYLE[badge.tier].color }} />
                    <span className="text-[8px] font-extrabold uppercase tracking-wider text-ink/35">{badge.tier}</span>
                  </div>
                  {progress && !isUnlocked && (
                    <div className="mt-1.5">
                      <ProgressBar value={ratio * 100} height={5} color={badge.color} />
                      <div className="mt-0.5 font-mono text-[8px] font-bold text-ink/35">{progress.current}/{progress.target}</div>
                    </div>
                  )}
                  {isUnlocked && (
                    <div className="mt-1 text-[9px] font-extrabold text-leafDark">
                      {save.badges[badge.id] ? friendlyDate(save.badges[badge.id]) : 'Terbuka'}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          <Card className="p-4">
            <SectionHeading eyebrow="Perjalanan Pipi" title="Galeri evolusi" subtitle="Empat wujud Pipi, empat tahap perjalananmu." className="mb-3" />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {evolution.map((evo) => {
                const isCurrent = evo.unlocked && save && evolution.filter((e) => e.unlocked).slice(-1)[0]?.stage === evo.stage
                return (
                  <div
                    key={evo.stage}
                    className={cn(
                      'relative rounded-2xl border-[3px] p-2 text-center',
                      evo.unlocked ? 'border-ink bg-surface shadow-pop-sm' : 'border-ink/10 bg-surface/40',
                    )}
                  >
                    {isCurrent && (
                      <span className="absolute left-1/2 top-1 -translate-x-1/2 rounded-full border-2 border-ink bg-sun px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide">Sekarang</span>
                    )}
                    <div className={cn('mx-auto mt-2 w-fit', !evo.unlocked && 'opacity-40 grayscale')}>
                      <Pipi stage={evo.stage} size={78} mood={evo.unlocked ? 'happy' : 'neutral'} accessory={false} />
                    </div>
                    <div className="mt-1 font-display text-[11px] font-extrabold leading-tight">{evo.name}</div>
                    {evo.unlocked ? (
                      <div className="text-[9px] font-extrabold text-leafDark">Terbuka</div>
                    ) : (
                      <>
                        <ProgressBar value={evo.percent} height={5} color="#8266E6" className="mt-1" />
                        <div className="mt-0.5 line-clamp-2 text-[8px] font-bold leading-tight text-ink/40">{evo.progressText}</div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="p-4">
            <h3 className="font-display text-sm font-extrabold">Statistik petualangan</h3>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <StatTile icon="bolt" label="Total XP" value={ctx.xp} color="#FFC93C" />
              <StatTile icon="star" label="Level" value={ctx.level} color="#63DE95" />
              <StatTile icon="book" label="Materi" value={ctx.completedLevels.length} color="#BFE9FF" />
              <StatTile icon="sword" label="Boss" value={ctx.bossesDefeated.length} color="#FF8A7A" />
            </div>
            <div className="mt-2 space-y-1">
              {[
                { icon: 'check', label: 'Kuis benar', value: ctx.quizzesCorrect },
                { icon: 'code', label: 'Kode dijalankan', value: ctx.codeRuns },
                { icon: 'bug', label: 'Bug ditemukan', value: ctx.bugsFound },
                { icon: 'puzzle', label: 'Puzzle selesai', value: ctx.puzzlesSolved },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-2 rounded-lg border-2 border-ink/5 bg-surface/60 px-2 py-1">
                  <Icon name={row.icon} size={12} className="text-ink/40" />
                  <span className="flex-1 text-[10px] font-bold text-ink/50">{row.label}</span>
                  <span className="font-mono text-[10px] font-bold">{row.value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card tone="grape" className="p-4">
            <h3 className="font-display text-sm font-extrabold">Badge berikutnya</h3>
            {nextUp.length === 0 ? (
              <p className="mt-1 text-[11px] font-semibold text-ink/55">Semua badge dengan progres sudah terbuka. Cari tantangan baru di peta!</p>
            ) : (
              <div className="mt-2 space-y-2">
                {nextUp.map(({ badge, progress, ratio }) => (
                  <button key={badge.id} onClick={() => setSelected(badge.id)} className="flex w-full items-center gap-2 rounded-xl border-2 border-ink/10 bg-surface/60 p-2 text-left transition hover:bg-surface">
                    <BadgeMedal badge={badge} unlocked={false} size={36} showLock={false} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[10px] font-extrabold">{badge.name}</div>
                      <ProgressBar value={ratio * 100} height={5} color={badge.color} className="mt-1" />
                      <div className="mt-0.5 text-[8px] font-bold text-ink/40">{progress ? `${progress.current}/${progress.target}` : badge.requirement}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>

          <Card tone="mint" className="p-4">
            <div className="flex items-center gap-2">
              <Icon name="info" size={15} className="text-leafDark" />
              <h3 className="font-display text-sm font-extrabold">Cara kerja badge</h3>
            </div>
            <ul className="mt-1.5 space-y-1 text-[10px] font-semibold leading-snug text-ink/55">
              <li>Badge dicek setiap kali kamu mendapat hadiah.</li>
              <li>Progres memakai aktivitas nyata: materi, kuis, kode, dan game.</li>
              <li>Badge legendaris butuh konsistensi, bukan klik berulang.</li>
            </ul>
          </Card>

          <div className="rounded-2xl border-2 border-dashed border-ink/15 bg-surface/40 p-3 text-center text-[10px] font-semibold text-ink/45">
            <Pipi mood={unlocked.length > 6 ? 'celebrate' : 'happy'} size={64} className="mx-auto" />
            {unlocked.length > 6 ? 'Koleksimu makin lengkap. Teruskan!' : 'Setiap badge adalah bukti usaha kecil yang kamu lakukan.'}
          </div>
        </aside>
      </div>

      <Modal open={Boolean(active)} onClose={() => setSelected(null)} title={active?.badge.name} icon={active?.badge.icon} size="sm" tone="cream">
        {active && (
          <div className="text-center">
            <BadgeMedal badge={active.badge} unlocked={active.isUnlocked} size={110} />
            <div className="mt-2 flex items-center justify-center gap-1.5">
              <Chip icon="award" color={active.badge.color}>{TIER_STYLE[active.badge.tier].label}</Chip>
              {active.isUnlocked && <Chip icon="check" color="#159A55">Terbuka</Chip>}
            </div>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-ink/65">{active.badge.description}</p>
            <div className="mt-3 rounded-xl border-2 border-ink/10 bg-surface/70 p-2.5 text-left">
              <div className="text-[9px] font-extrabold uppercase tracking-wide text-ink/35">Cara mendapatkan</div>
              <p className="mt-0.5 text-[11px] font-bold text-ink/60">{active.badge.requirement}</p>
              {active.progress && (
                <div className="mt-2">
                  <ProgressBar value={(active.progress.current / active.progress.target) * 100} height={7} color={active.badge.color} />
                  <div className="mt-0.5 text-right font-mono text-[9px] font-bold text-ink/40">{active.progress.current}/{active.progress.target}</div>
                </div>
              )}
              {active.isUnlocked && save.badges[active.badge.id] && (
                <p className="mt-2 flex items-center gap-1 text-[10px] font-bold text-leafDark">
                  <Icon name="check" size={11} /> Diraih pada {friendlyDate(save.badges[active.badge.id])}
                </p>
              )}
            </div>
            <div className="mt-4 flex justify-center gap-2">
              {!active.isUnlocked && (
                <Link to="/adventure" onClick={() => setSelected(null)}>
                  <Button size="sm" variant="sun" icon="compass">Ke peta</Button>
                </Link>
              )}
              <Button size="sm" variant="secondary" onClick={() => setSelected(null)}>Tutup</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
