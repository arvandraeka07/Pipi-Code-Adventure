import { Link } from 'react-router-dom'
import { useGame } from '../store/GameContext'
import { WORLDS } from '../data/worlds'
import { isLevelComplete, isLevelUnlocked, nextRecommended, overallProgress, worldProgress } from '../lib/progress'
import { Pipi, PipiBubble } from '../components/Pipi'
import { Icon } from '../components/Icon'
import { Button, Card, Chip, PageHeader, ProgressBar, cn } from '../components/ui'

export default function AdventureMap() {
  const { save } = useGame()
  if (!save) return null

  const overall = overallProgress(save)
  const next = nextRecommended(save)
  const currentWorldId = next?.world.id

  return (
    <div>
      <PageHeader title="Peta Petualangan" subtitle="Ikuti jalur, tuntaskan misi, dan kalahkan boss tiap dunia." icon="map">
        {next && (
          <Link to={`/lesson/${next.level.id}`}>
            <Button size="sm" variant="primary" icon="play">Lanjutkan Misi</Button>
          </Link>
        )}
      </PageHeader>

      <Card tone="paper" className="relative mb-6 overflow-hidden p-4 sm:p-5">
        <div className="absolute inset-y-0 left-0 w-2 bg-sun" aria-hidden="true" />
        <div className="relative grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Chip icon="flag">{overall.worldsDone}/{overall.totalWorlds} dunia tuntas</Chip>
              <Chip icon="book">{overall.completed}/{overall.totalLevels} misi</Chip>
              <Chip icon="flame">Streak {save.streak.count} hari</Chip>
            </div>
            <h2 className="mt-2 font-display text-xl font-extrabold sm:text-2xl">
              {overall.worldsDone === 0
                ? 'Petualanganmu dimulai di Lembah Pertama.'
                : overall.worldsDone === overall.totalWorlds
                  ? 'Seluruh Kerajaan Python telah kau jelajahi!'
                  : `Kamu sudah menaklukkan ${overall.worldsDone} dunia. Terus melangkah!`}
            </h2>
            <div className="mt-2 max-w-lg">
              <ProgressBar value={overall.percent} height={12} showLabel label="Progres keseluruhan" />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] font-extrabold text-ink/45">
              <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full border-2 border-ink bg-surface" /> Terbuka</span>
              <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full border-2 border-ink bg-leaf" /> Tuntas</span>
              <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full border-2 border-ink bg-ink/20" /> Terkunci</span>
            </div>
          </div>
          <div className="hidden sm:block">
            <Pipi mood="hint" size={130} stage={next ? 'baby' : 'master'} />
          </div>
        </div>
      </Card>

      <div className="relative">
        <div className="absolute bottom-8 left-5 top-8 border-l-4 border-dashed border-ink/15 md:left-1/2 md:-translate-x-1/2" aria-hidden="true" />

        <div className="space-y-5 md:space-y-3">
          {WORLDS.map((world, index) => {
            const p = worldProgress(save, world)
            const prev = index > 0 ? WORLDS[index - 1] : null
            const isCurrent = world.id === currentWorldId
            const card = (
              <div
                className={cn(
                  'relative w-full overflow-hidden rounded-xl border-2 border-ink p-4 shadow-pop transition',
                  p.unlocked ? 'bg-paper' : 'bg-ink/10',
                  p.unlocked && 'hover:shadow-pop-lg',
                  isCurrent && 'ring-2 ring-sun',
                )}
              >
                <div
                  className="absolute inset-x-0 top-0 h-1.5"
                  style={{ backgroundColor: world.palette.accent }}
                />
                {!p.unlocked && <div className="absolute inset-0 z-10 bg-ink/10/70 backdrop-blur-[1px]" />}
                <div className="relative flex items-start gap-3">
                  <span
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-[3px] border-ink"
                    style={{ backgroundColor: p.unlocked ? world.palette.accent : '#DDE1D9' }}
                  >
                    <Icon name={p.unlocked ? world.icon : 'lock'} size={23} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-ink/40">Dunia {world.order}</span>
                      {p.bossDefeated && <span className="rounded-full bg-leaf px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide text-white">Tuntas</span>}
                      {isCurrent && <span className="rounded-full border border-ink/20 bg-sun px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide">Kamu di sini</span>}
                    </div>
                    <h3 className="font-display text-lg font-extrabold leading-tight text-ink">{world.name}</h3>
                    <p className="mt-0.5 line-clamp-2 text-[11px] font-semibold leading-snug text-ink/55">{world.tagline}</p>
                  </div>
                </div>

                <div className="relative mt-3">
                  <div className="flex flex-wrap items-center gap-1">
                    {world.levels.map((level) => {
                      const done = isLevelComplete(save, level.id)
                      const open = isLevelUnlocked(save, world, level)
                      return (
                        <span
                          key={level.id}
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full border-2 px-1.5 py-0.5 text-[9px] font-bold',
                            done
                              ? 'border-leaf bg-leaf/15 text-leafDark'
                              : open && p.unlocked
                                ? 'border-ink/20 bg-surface text-ink/60'
                                : 'border-ink/10 bg-ink/5 text-ink/30',
                          )}
                          title={level.title}
                        >
                          <Icon name={done ? 'check' : open && p.unlocked ? 'play' : 'lock'} size={9} />
                          {level.title.length > 18 ? `${level.title.slice(0, 18)}…` : level.title}
                        </span>
                      )
                    })}
                  </div>
                  <ProgressBar value={p.percent} height={7} color={world.palette.from} className="mt-2" />
                </div>

                <div className="relative mt-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-ink/5 px-2 py-1 text-[10px] font-bold text-ink/55">
                    <Icon name="sword" size={12} className={p.bossDefeated ? 'text-leafDark' : 'text-coral-text'} />
                    {p.bossDefeated ? `${world.boss.name} dikalahkan` : `${world.boss.name} • ${world.boss.hp} HP`}
                  </span>
                  <span className="inline-flex items-center gap-2 text-[10px] font-extrabold text-ink/45">
                    <span className="inline-flex items-center gap-0.5"><Icon name="bolt" size={11} /> {world.reward.xp}</span>
                    <span className="inline-flex items-center gap-0.5"><Icon name="coin" size={11} /> {world.reward.coins}</span>
                  </span>
                </div>

                <div className="relative mt-3 flex flex-wrap gap-1.5">
                  {!p.unlocked ? (
                    <div className="flex items-center gap-1.5 rounded-xl border-2 border-ink/10 bg-surface/70 px-2.5 py-1.5 text-[10px] font-bold text-ink/50">
                      <Icon name="lock" size={12} />
                      Kalahkan {prev?.boss.name ?? 'boss sebelumnya'} untuk membuka dunia ini.
                    </div>
                  ) : (
                    <>
                      <Link to={`/world/${world.id}`}>
                        <Button size="sm" variant={p.bossDefeated ? 'secondary' : 'primary'} icon={p.bossDefeated ? 'book' : 'play'}>
                          {p.bossDefeated ? 'Lihat materi' : p.completed > 0 ? 'Lanjutkan' : 'Mulai dunia'}
                        </Button>
                      </Link>
                      {p.bossUnlocked && !p.bossDefeated && (
                        <Link to={`/boss/${world.id}`}>
                          <Button size="sm" variant="sun" icon="sword">Lawan boss</Button>
                        </Link>
                      )}
                      {p.bossDefeated && (
                        <span className="inline-flex items-center gap-1 rounded-xl border-2 border-leaf/40 bg-leaf/10 px-2 py-1 text-[10px] font-extrabold text-leafDark">
                          <Icon name="check" size={12} /> Dunia tuntas
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            )

            return (
              <div key={world.id} className="relative flex md:justify-center">
                <div
                  className={cn(
                    'absolute left-5 top-1/2 z-0 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-ink font-display text-[11px] font-extrabold md:left-1/2',
                    p.bossDefeated ? 'bg-leaf text-white' : p.unlocked ? 'bg-sun text-ink' : 'bg-ink/15 text-ink/45',
                  )}
                  aria-hidden="true"
                >
                  {p.bossDefeated ? <Icon name="check" size={13} /> : world.order}
                </div>
                <div className={cn('ml-11 w-full md:ml-0 md:w-[calc(50%-2.25rem)]', index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto')}>
                  {card}
                </div>
                {isCurrent && (
                  <div className={cn('absolute top-2 z-20 hidden md:block', index % 2 === 0 ? 'left-[calc(50%+1.5rem)]' : 'right-[calc(50%+1.5rem)]')}>
                    <div className="flex items-center gap-1">
                      <Pipi mood="happy" size={54} animate />
                      <span className="rounded-xl border-2 border-ink bg-sun px-2 py-1 font-display text-[9px] font-extrabold shadow-pop-sm">Kamu di sini</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <PipiBubble mood="thinking" size={64} className="mt-6">
        Setiap dunia punya satu boss. Kalahkan boss untuk membuka dunia berikutnya. Kalau sebuah misi
        terkunci, selesaikan misi sebelumnya dulu — tidak ada jalan pintas, tapi setiap langkah kecil
        itu berarti!
      </PipiBubble>
    </div>
  )
}
