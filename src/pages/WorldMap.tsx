import { Link, Navigate, useParams } from 'react-router-dom'
import { useGame } from '../store/GameContext'
import { WORLDS, getWorld } from '../data/worlds'
import { isBossUnlocked, isLevelComplete, isLevelUnlocked, worldProgress } from '../lib/progress'
import { Pipi, PipiBubble } from '../components/Pipi'
import { Icon } from '../components/Icon'
import { Button, Card, Chip, Locked, ProgressBar, SectionHeading, cn } from '../components/ui'

export default function WorldMap() {
  const { worldId } = useParams()
  const { save } = useGame()
  const world = worldId ? getWorld(worldId) : undefined
  if (!save) return null
  if (!world) return <Navigate to="/adventure" replace />

  const progress = worldProgress(save, world)
  const prev = world.order > 1 ? WORLDS[world.order - 2] : null
  const bossUnlocked = isBossUnlocked(save, world)
  const bossDefeated = progress.bossDefeated
  const firstIncomplete = world.levels.find((l) => !isLevelComplete(save, l.id) && isLevelUnlocked(save, world, l))
  const sources = Array.from(
    new Map(world.levels.flatMap((l) => l.sources).map((s) => [s.url, s])).values(),
  )
  const totalMinutes = world.levels.reduce((n, l) => n + l.minutes, 0)

  if (!progress.unlocked) {
    return (
      <div className="mx-auto max-w-xl">
        <Card tone="cream" className="p-6 text-center">
          <Pipi mood="sad" size={160} />
          <div className="mx-auto mt-2 grid h-12 w-12 place-items-center rounded-2xl border-[3px] border-ink bg-ink/10">
            <Icon name="lock" size={24} />
          </div>
          <h1 className="mt-3 font-display text-2xl font-extrabold">{world.name} masih terkunci</h1>
          <p className="mx-auto mt-1 max-w-sm text-sm font-semibold text-ink/60">
            Selesaikan {prev?.name ?? 'dunia sebelumnya'} dan kalahkan {prev?.boss.name ?? 'boss sebelumnya'} untuk
            membuka dunia ini. Petualangan yang runtut membuat fondasimu kuat.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link to={prev ? `/world/${prev.id}` : '/adventure'}>
              <Button size="sm" variant="primary" icon="arrow-left">{prev ? `Ke ${prev.name}` : 'Kembali ke peta'}</Button>
            </Link>
            <Link to="/adventure">
              <Button size="sm" variant="secondary" icon="map">Peta petualangan</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-extrabold text-ink/45">
        <Link to="/adventure" className="inline-flex items-center gap-1 hover:text-ink"><Icon name="arrow-left" size={13} /> Peta</Link>
        <Icon name="chevron-right" size={11} />
        <span className="text-ink/70">Dunia {world.order}</span>
      </div>

      <Card className="relative mb-5 overflow-hidden">
        <div className="relative p-4 sm:p-6" style={{ background: `linear-gradient(135deg, ${world.palette.soft}, #FFFEF8 65%)` }}>
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border-[3px] border-dashed border-ink/10" />
          <div className="relative flex flex-wrap items-start gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-[22px] border-[3px] border-ink shadow-pop-sm" style={{ backgroundColor: world.palette.accent }}>
              <Icon name={world.icon} size={30} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <Chip icon="map">Dunia {world.order}</Chip>
                <Chip icon="clock">{totalMinutes} menit</Chip>
                <Chip icon="book">{world.levels.length} misi</Chip>
                {bossDefeated && <Chip icon="check" className="border-leaf/40 bg-leaf/10">Tuntas</Chip>}
              </div>
              <h1 className="mt-2 font-display text-2xl font-extrabold leading-tight sm:text-3xl">{world.name}</h1>
              <p className="mt-1 text-sm font-semibold italic text-ink/55">{world.tagline}</p>
              <p className="mt-1 max-w-2xl text-xs font-semibold leading-relaxed text-ink/60">{world.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {firstIncomplete ? (
                  <Link to={`/lesson/${firstIncomplete.id}`}>
                    <Button size="sm" variant="primary" icon="play" iconRight="arrow-right">Lanjutkan Misi</Button>
                  </Link>
                ) : !bossDefeated ? (
                  <Link to={`/boss/${world.id}`}>
                    <Button size="sm" variant="sun" icon="sword">Lawan {world.boss.name}</Button>
                  </Link>
                ) : (
                  <Link to={`/boss/${world.id}`}>
                    <Button size="sm" variant="secondary" icon="sword">Latihan ulang boss</Button>
                  </Link>
                )}
                <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-1 text-[10px] font-extrabold text-ink/55">
                  <Icon name="bolt" size={12} className="text-sunDark" /> +{world.reward.xp} XP dunia
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-1 text-[10px] font-extrabold text-ink/55">
                  <Icon name="coin" size={12} className="text-sunDark" /> +{world.reward.coins} koin
                </span>
              </div>
            </div>
          </div>
          <div className="relative mt-4">
            <ProgressBar value={progress.percent} height={11} showLabel label={`${progress.completed} dari ${progress.total} misi selesai`} color={world.palette.from} />
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1fr_310px]">
        <div>
          <SectionHeading eyebrow="Daftar misi" title="Jalur belajar dunia ini" subtitle="Misi terbuka berurutan. Tantangan kode harus lolos sebelum kuis bisa diselesaikan." />
          <div className="space-y-2.5">
            {world.levels.map((level, i) => {
              const done = isLevelComplete(save, level.id)
              const open = isLevelUnlocked(save, world, level)
              const solved = Boolean(save.solvedChallenges[level.id])
              const score = save.levelScores[level.id]
              const prevLevel = i > 0 ? world.levels[i - 1] : null
              const isNext = !done && open
              const inner = (
                <div
                  className={cn(
                    'relative flex items-start gap-3 rounded-[22px] border-[3px] p-3.5 transition',
                    done ? 'border-leaf/40 bg-[#F3FFF7]' : isNext ? 'border-ink bg-paper shadow-pop' : open ? 'border-ink/10 bg-white/60' : 'border-ink/10 bg-[#F2F1EA]/80 opacity-60',
                    open && 'hover:-translate-y-0.5',
                  )}
                >
                  <span
                    className={cn(
                      'relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border-[3px]',
                      done ? 'border-ink bg-leaf text-white' : open ? 'border-ink bg-sun' : 'border-ink/20 bg-ink/5',
                    )}
                  >
                    <Icon name={done ? 'check' : open ? level.icon : 'lock'} size={18} />
                    <span className="absolute -left-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full border-2 border-ink bg-white font-display text-[8px] font-extrabold">
                      {i + 1}
                    </span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h3 className="font-display text-sm font-extrabold text-ink">{level.title}</h3>
                      {isNext && <span className="rounded-full border-2 border-ink/15 bg-sun/60 px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide">Berikutnya</span>}
                      {done && <span className="rounded-full bg-leaf/15 px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide text-leafDark">Selesai</span>}
                      {!open && <Locked />}
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-[11px] font-semibold leading-snug text-ink/55">{level.summary}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[9px] font-extrabold text-ink/40">
                      <span className="inline-flex items-center gap-0.5"><Icon name="clock" size={10} /> {level.minutes} mnt</span>
                      <span className="inline-flex items-center gap-0.5"><Icon name="bolt" size={10} /> +{level.rewards.xp} XP</span>
                      <span className="inline-flex items-center gap-0.5"><Icon name="coin" size={10} /> +{level.rewards.coins}</span>
                      {solved && <span className="inline-flex items-center gap-0.5 text-leafDark"><Icon name="check" size={10} /> tantangan lolos</span>}
                      {typeof score === 'number' && <span className="inline-flex items-center gap-0.5 text-grapeDark"><Icon name="target" size={10} /> skor {score}%</span>}
                    </div>
                    {!open && prevLevel && (
                      <p className="mt-1 text-[9px] font-bold text-ink/40">Selesaikan "{prevLevel.title}" dulu.</p>
                    )}
                  </div>
                  {open && (
                    <span className="mt-1 hidden shrink-0 sm:block">
                      <Icon name="chevron-right" size={16} className="text-ink/30" />
                    </span>
                  )}
                </div>
              )
              return open ? (
                <Link key={level.id} to={`/lesson/${level.id}`} className="block">{inner}</Link>
              ) : (
                <div key={level.id} aria-disabled="true">{inner}</div>
              )
            })}
          </div>

          <div className="mt-5">
            <Card className={cn('relative overflow-hidden', bossUnlocked && !bossDefeated ? 'border-ink' : '')}>
              <div
                className="relative p-4"
                style={{
                  background: bossDefeated
                    ? 'linear-gradient(135deg, #D8F7E4, #FFFEF8)'
                    : `linear-gradient(135deg, ${world.palette.soft}, #FFF1EC)`,
                }}
              >
                <div className="flex flex-wrap items-start gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-[3px] border-ink bg-coral">
                    <Icon name={bossDefeated ? 'check' : 'sword'} size={22} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-ink/40">Boss dunia</div>
                    <h3 className="font-display text-lg font-extrabold leading-tight">{world.boss.name}</h3>
                    <p className="text-[11px] font-bold text-ink/50">{world.boss.title}</p>
                    <p className="mt-1 text-[11px] font-semibold leading-snug text-ink/60">{world.boss.description}</p>
                  </div>
                  <div className="rounded-xl border-2 border-ink/15 bg-white/70 px-2.5 py-1.5 text-center">
                    <div className="font-display text-sm font-extrabold">{bossDefeated ? '0' : world.boss.hp}</div>
                    <div className="text-[8px] font-extrabold uppercase tracking-wide text-ink/40">HP boss</div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {bossDefeated ? (
                    <Link to={`/boss/${world.id}`}><Button size="sm" variant="secondary" icon="sword">Latihan ulang</Button></Link>
                  ) : bossUnlocked ? (
                    <Link to={`/boss/${world.id}`}><Button size="sm" variant="danger" icon="sword">Mulai Boss Battle</Button></Link>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 rounded-xl border-2 border-ink/10 bg-white/70 px-2.5 py-1.5 text-[10px] font-bold text-ink/50">
                      <Icon name="lock" size={12} /> Selesaikan semua misi untuk membuka boss
                    </div>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-2 py-1 text-[10px] font-extrabold text-ink/50">
                    <Icon name="bolt" size={11} /> +{world.boss.reward.xp} XP
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-2 py-1 text-[10px] font-extrabold text-ink/50">
                    <Icon name="coin" size={11} /> +{world.boss.reward.coins}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <aside className="space-y-4">
          <Card tone="cream" className="p-4">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg border-2 border-ink bg-sun"><Icon name="compass" size={15} /></span>
              <h3 className="font-display text-sm font-extrabold">Yang akan kamu kuasai</h3>
            </div>
            <ul className="mt-2 space-y-1.5">
              {world.levels.map((l) => (
                <li key={l.id} className="flex items-start gap-1.5 text-[11px] font-semibold leading-snug text-ink/60">
                  <Icon name={isLevelComplete(save, l.id) ? 'check' : 'arrow-right'} size={11} className={cn('mt-0.5 shrink-0', isLevelComplete(save, l.id) ? 'text-leafDark' : 'text-ink/30')} />
                  {l.title}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-4">
            <h3 className="font-display text-sm font-extrabold">Sumber materi</h3>
            <p className="mt-0.5 text-[10px] font-semibold text-ink/45">Rujukan topik di dunia ini.</p>
            <div className="mt-2 space-y-1.5">
              {sources.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-1.5 rounded-lg border-2 border-ink/10 bg-white/60 px-2 py-1.5 text-[10px] font-bold text-ink/60 hover:border-ink/25 hover:text-ink"
                >
                  <Icon name="book" size={11} className="shrink-0" />
                  <span className="flex-1 truncate">{s.label}</span>
                  <Icon name="external" size={10} className="shrink-0 text-ink/30" />
                </a>
              ))}
            </div>
          </Card>

          <Card tone="mint" className="p-4">
            <div className="flex items-center gap-2">
              <Icon name="lightbulb" size={16} className="text-leafDark" />
              <h3 className="font-display text-sm font-extrabold">Tips Pipi</h3>
            </div>
            <p className="mt-1.5 text-[11px] font-semibold leading-relaxed text-ink/60">
              Jangan lompat ke kuis sebelum tantangan kode lolos. Tantangan adalah tempatmu benar-benar
              menulis Python; kuis hanya memastikan konsepnya menempel.
            </p>
          </Card>

          <PipiBubble mood="happy" size={56}>
            {bossDefeated
              ? `Hebat! ${world.boss.name} sudah kalah. Masih ingin berlatih? Ulangi misi favoritmu atau lanjut ke dunia berikutnya.`
              : `Aku akan menunggumu di gerbang ${world.boss.name}. Selesaikan ${world.levels.length} misi dulu, lalu kita hadapi bersama!`}
          </PipiBubble>
        </aside>
      </div>
    </div>
  )
}
