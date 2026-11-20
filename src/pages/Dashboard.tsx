import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useGame } from '../store/GameContext'
import { WORLDS } from '../data/worlds'
import { BADGES } from '../data/badges'
import { questsForDate, questProgress, isQuestComplete } from '../data/daily'
import { nextEvolution, levelProgress, todayKey, shortDate } from '../lib/game'
import { nextRecommended, lastPlayedLevel, overallProgress, worldProgress } from '../lib/progress'
import { Pipi, PipiBubble } from '../components/Pipi'
import { Icon } from '../components/Icon'
import { Avatar } from '../components/Avatar'
import { BadgeMedal } from '../components/BadgeMedal'
import { Button, Card, Chip, ProgressBar, SectionHeading, StatTile, cn } from '../components/ui'

export default function Dashboard() {
  const { save, level, evolution, claimQuest } = useGame()
  if (!save) return null

  const progress = levelProgress(save.xp)
  const next = nextRecommended(save)
  const last = lastPlayedLevel(save)
  const overall = overallProgress(save)
  const nextEvo = nextEvolution(save)
  const today = todayKey()
  const counters = save.daily.date === today ? save.daily.counters : {}
  const quests = questsForDate(today)
  const unlockedBadges = BADGES.filter((b) => save.badges[b.id])
  const recentBadges = [...unlockedBadges].sort((a, b) => (save.badges[b.id] ?? '').localeCompare(save.badges[a.id] ?? '')).slice(0, 4)
  const recentActivity = save.activity.slice(0, 5)
  const hour = new Date().getHours()
  const greeting = hour < 11 ? 'Selamat pagi' : hour < 15 ? 'Selamat siang' : hour < 19 ? 'Selamat sore' : 'Selamat malam'

  const openQuests = quests.filter((q) => !save.daily.claimed[q.id])
  const completeCount = openQuests.filter((q) => (counters[q.counter] ?? 0) >= q.target).length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar avatar={save.profile.avatar} size={52} />
          <div>
            <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-leafDark">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-leaf" />
              {greeting}, Petualang
            </div>
            <h1 className="font-display text-2xl font-extrabold leading-tight text-ink sm:text-3xl">{save.profile.name}</h1>
            <p className="text-xs font-semibold text-ink/50">
              Level {level} • {overall.completed}/{overall.totalLevels} misi • {overall.worldsDone}/{overall.totalWorlds} dunia tuntas
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/daily">
            <Chip icon="flame" className="border-coral/40 bg-danger-soft text-ink">
              Streak {save.streak.count} hari
            </Chip>
          </Link>
          <Link to="/achievements">
            <Chip icon="trophy" className="border-grapeDark/25 bg-grape-soft text-ink">
              {unlockedBadges.length}/{BADGES.length} badge
            </Chip>
          </Link>
        </div>
      </div>

      <Card tone="paper" className="relative overflow-hidden p-4 sm:p-5">
        <div className="absolute inset-y-0 left-0 w-2 bg-leaf" aria-hidden="true" />
        <div className="absolute right-3 top-3 stamp rotate-2 text-ink/30" aria-hidden="true">misi aktif</div>
        <div className="relative grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="flex items-center justify-center">
            <Pipi mood={save.streak.count > 0 ? 'happy' : 'hint'} stage={evolution} size={150} sparkle={level >= 6} interactive />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-sun px-2.5 py-1 font-display text-[11px] font-extrabold">
                <Icon name="star" size={12} /> LEVEL {level}
              </span>
              <span className="rounded-full border-2 border-ink/15 bg-surface/70 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-ink/55">
                {evolution === 'baby' ? 'Baby Pipi' : evolution === 'junior' ? 'Junior Pipi' : evolution === 'smart' ? 'Smart Pipi' : 'Python Master'}
              </span>
            </div>
            <div className="mt-2">
              <ProgressBar value={progress.percent} height={13} />
              <div className="mt-1 flex justify-between text-[10px] font-extrabold text-ink/50">
                <span>{progress.into} / {progress.span} XP</span>
                <span>{progress.remaining} XP lagi ke Level {level + 1}</span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {next ? (
                <Link to={`/lesson/${next.level.id}`}>
                  <Button size="sm" variant="primary" icon="play" iconRight="arrow-right">
                    Lanjut: {next.level.title}
                  </Button>
                </Link>
              ) : (
                <Link to="/achievements">
                  <Button size="sm" variant="sun" icon="crown">Semua misi tuntas!</Button>
                </Link>
              )}
              <Link to="/playground">
                <Button size="sm" variant="secondary" icon="terminal">Playground</Button>
              </Link>
            </div>
            {nextEvo && (
              <div className="mt-3 flex items-center gap-2 rounded-xl border-2 border-ink/10 bg-surface/60 px-2.5 py-1.5 text-[10px] font-bold text-ink/55">
                <Icon name="sparkles" size={13} className="text-grapeDark" />
                Berikutnya: <span className="font-extrabold text-ink/80">{nextEvo.name}</span> — {nextEvo.progressText}
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatTile icon="bolt" label="Total XP" value={save.xp} color="#FFC93C" hint={`Level ${level}`} />
        <StatTile icon="coin" label="Koin" value={save.coins} color="#FFE79A" hint="Koleksi usaha" />
        <StatTile icon="flame" label="Streak" value={`${save.streak.count} hari`} color="#FF8A7A" hint={`Terbaik ${save.streak.best} hari`} />
        <StatTile icon="check" label="Misi selesai" value={`${overall.completed}/${overall.totalLevels}`} color="#D8F7E4" hint={`${overall.percent}% total`} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-5">
          <section>
            <SectionHeading
              eyebrow="Misi berikutnya"
              title="Lanjutkan petualanganmu"
              subtitle="Pipi sudah menyiapkan langkah kecil berikutnya untukmu."
              action={
                <Link to="/adventure" className="inline-flex items-center gap-1 font-display text-xs font-extrabold text-leafDark hover:underline">
                  Peta lengkap <Icon name="arrow-right" size={14} />
                </Link>
              }
            />
            {next ? (
              <Card className="overflow-hidden">
                <div
                  className="world-tint relative p-4 sm:p-5"
                  style={
                    {
                      '--tint-soft': next.world.palette.soft,
                      '--tint-accent': next.world.palette.accent,
                    } as CSSProperties
                  }
                >
                  <div className="flex flex-wrap items-start gap-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-[3px] border-ink" style={{ backgroundColor: next.world.palette.accent }}>
                      <Icon name={next.world.icon} size={23} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink/45">
                        {next.world.name} • Dunia {next.world.order}
                      </div>
                      <h3 className="font-display text-lg font-extrabold leading-tight text-ink">{next.level.title}</h3>
                      <p className="mt-0.5 text-xs font-semibold leading-snug text-ink/60">{next.level.summary}</p>
                    </div>
                    <span className="rounded-full border-2 border-ink/15 bg-surface/80 px-2 py-1 text-[10px] font-extrabold text-ink/55">
                      {next.level.minutes} menit
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Link to={`/lesson/${next.level.id}`}>
                      <Button size="sm" variant="primary" icon="play">Mulai Misi</Button>
                    </Link>
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface/70 px-2 py-1 text-[10px] font-extrabold text-ink/55">
                      <Icon name="bolt" size={12} className="text-sunDark" /> +{next.level.rewards.xp} XP
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface/70 px-2 py-1 text-[10px] font-extrabold text-ink/55">
                      <Icon name="coin" size={12} className="text-sunDark" /> +{next.level.rewards.coins}
                    </span>
                  </div>
                </div>
                {last && last.level.id !== next.level.id && (
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t-[3px] border-ink/10 px-4 py-2.5">
                    <span className="text-[11px] font-bold text-ink/45">Terakhir dibuka: {last.level.title}</span>
                    <Link to={`/lesson/${last.level.id}`} className="inline-flex items-center gap-1 text-[11px] font-extrabold text-leafDark hover:underline">
                      Buka lagi <Icon name="corner-down-left" size={12} />
                    </Link>
                  </div>
                )}
              </Card>
            ) : (
              <Card tone="sun" className="p-5 text-center">
                <Pipi mood="celebrate" stage={evolution} size={120} />
                <h3 className="font-display text-xl font-extrabold">Seluruh dunia telah kau tuntaskan!</h3>
                <p className="mx-auto mt-1 max-w-md text-sm font-semibold text-ink/60">
                  Tidak ada misi tersisa. Kejar badge terakhir, mainkan mini games, atau bantu pemula lain dengan penjelasanmu.
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  <Link to="/achievements"><Button size="sm" variant="secondary" icon="trophy">Buka pencapaian</Button></Link>
                  <Link to="/games"><Button size="sm" variant="secondary" icon="gamepad">Mini games</Button></Link>
                </div>
              </Card>
            )}
          </section>

          <section>
            <SectionHeading
              eyebrow="Progres dunia"
              title="Peta perjalananmu"
              subtitle={`${overall.percent}% dari seluruh misi sudah selesai.`}
            />
            <div className="space-y-2">
              {WORLDS.map((world) => {
                const p = worldProgress(save, world)
                return (
                  <div
                    key={world.id}
                    className={cn(
                      'flex items-center gap-3 rounded-2xl border-[3px] border-ink/10 bg-surface/60 p-2.5 transition',
                      p.unlocked ? 'hover:border-ink/25 hover:bg-surface' : 'opacity-60',
                    )}
                  >
                    <Link to={p.unlocked ? `/world/${world.id}` : '/adventure'} className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border-2 border-ink/20" style={{ backgroundColor: world.palette.soft }}>
                        <Icon name={p.unlocked ? world.icon : 'lock'} size={17} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate font-display text-xs font-extrabold text-ink">{world.name}</span>
                          <span className="shrink-0 text-[10px] font-extrabold text-ink/45">
                            {p.completed}/{p.total} misi
                          </span>
                        </div>
                        <ProgressBar value={p.percent} height={7} color={world.palette.accent} className="mt-1" />
                      </div>
                    </Link>
                    {p.bossDefeated ? (
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-ink bg-leaf text-white"><Icon name="check" size={13} /></span>
                    ) : p.bossUnlocked ? (
                      <Link to={`/boss/${world.id}`} className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-ink bg-coral" aria-label={`Lawan boss ${world.name}`}>
                        <Icon name="sword" size={12} />
                      </Link>
                    ) : (
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-ink/15 text-ink/30"><Icon name="chevron-right" size={13} /></span>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section>
            <SectionHeading
              eyebrow="Hari ini"
              title="Daily quest"
              action={<Link to="/daily" className="text-[11px] font-extrabold text-leafDark hover:underline">Semua</Link>}
            />
            <Card className="p-3">
              <div className="mb-2 flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wide text-ink/45">
                <span>{openQuests.length} quest tersisa</span>
                <span className="text-leafDark">{completeCount} siap diklaim</span>
              </div>
              <div className="space-y-1.5">
                {quests.map((q) => {
                  const current = Math.min(q.target, counters[q.counter] ?? 0)
                  const done = current >= q.target
                  const claimed = Boolean(save.daily.claimed[q.id])
                  return (
                    <div key={q.id} className={cn('flex items-center gap-2 rounded-xl border-2 px-2 py-1.5', claimed ? 'border-leaf/30 bg-leaf/5' : 'border-ink/10 bg-surface/60')}>
                      <span className={cn('grid h-7 w-7 shrink-0 place-items-center rounded-lg border-2', claimed ? 'border-leaf bg-leaf text-white' : 'border-ink/15 bg-cream')}>
                        <Icon name={claimed ? 'check' : q.icon} size={13} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[11px] font-extrabold text-ink/80">{q.title}</div>
                        <ProgressBar value={(current / q.target) * 100} height={5} color={claimed ? '#2FBF71' : '#FFC93C'} className="mt-1" />
                      </div>
                      <span className="shrink-0 font-mono text-[10px] font-bold text-ink/45">{current}/{q.target}</span>
                      {done && !claimed ? (
                        <button
                          onClick={() => claimQuest(q)}
                          className="shrink-0 rounded-lg border-2 border-ink bg-sun px-1.5 py-0.5 text-[9px] font-extrabold shadow-pop-sm active:translate-y-0.5"
                        >
                          Klaim
                        </button>
                      ) : claimed ? (
                        <span className="shrink-0 text-[9px] font-extrabold text-leafDark">Klaim</span>
                      ) : (
                        <Icon name="clock" size={12} className="shrink-0 text-ink/25" />
                      )}
                    </div>
                  )
                })}
              </div>
              <Link to="/daily" className="mt-2 flex items-center justify-center gap-1 rounded-xl border-2 border-ink/10 bg-surface/50 py-1.5 text-[10px] font-extrabold text-ink/50 hover:bg-surface">
                Lihat detail & streak <Icon name="arrow-right" size={12} />
              </Link>
            </Card>
          </section>

          <section>
            <SectionHeading eyebrow="Koleksi" title="Badge terbaru" action={<Link to="/achievements" className="text-[11px] font-extrabold text-leafDark hover:underline">Semua</Link>} />
            <Card className="p-3">
              {recentBadges.length ? (
                <div className="grid grid-cols-4 gap-1.5">
                  {recentBadges.map((badge) => (
                    <Link key={badge.id} to="/achievements" className="flex flex-col items-center gap-1 rounded-xl p-1 hover:bg-surface/60" title={badge.name}>
                      <BadgeMedal badge={badge} unlocked size={52} />
                      <span className="line-clamp-1 text-center text-[9px] font-bold text-ink/55">{badge.name}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-xl bg-surface/50 p-2">
                  <Icon name="trophy" size={20} className="text-ink/25" />
                  <p className="text-[10px] font-semibold leading-snug text-ink/50">
                    Belum ada badge. Selesaikan misi pertamamu untuk membuka koleksi.
                  </p>
                </div>
              )}
              <div className="mt-2 flex items-center justify-between rounded-xl bg-cream px-2.5 py-1.5 text-[10px] font-bold text-ink/50">
                <span className="inline-flex items-center gap-1"><Icon name="sparkles" size={12} className="text-grapeDark" /> {unlockedBadges.length} dari {BADGES.length} terkumpul</span>
                <span className="font-extrabold text-ink/70">{Math.round((unlockedBadges.length / BADGES.length) * 100)}%</span>
              </div>
            </Card>
          </section>

          <Card tone="grape" className="p-4">
            <div className="flex items-start gap-2.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border-2 border-ink bg-surface/70"><Icon name="chat" size={17} /></span>
              <div>
                <h3 className="font-display text-sm font-extrabold">Butuh bantuan?</h3>
                <p className="mt-0.5 text-[11px] font-semibold leading-snug text-ink/60">
                  Tanya Pipi Tutor tentang konsep, error, atau minta latihan tambahan.
                </p>
                <Link to="/tutor" className="mt-2 inline-flex items-center gap-1 text-[11px] font-extrabold text-grapeDark hover:underline">
                  Buka tutor <Icon name="arrow-right" size={12} />
                </Link>
              </div>
            </div>
          </Card>

          <section>
            <SectionHeading eyebrow="Jejak" title="Aktivitas terbaru" />
            <Card className="divide-y divide-ink/5 p-2">
              {recentActivity.length ? (
                recentActivity.map((a, i) => (
                  <div key={`${a.at}-${i}`} className="flex items-center gap-2 px-1 py-1.5">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-mint"><Icon name="bolt" size={11} /></span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[11px] font-bold text-ink/70">{a.label}</div>
                      <div className="text-[9px] font-semibold text-ink/35">{shortDate(a.at)}</div>
                    </div>
                    <span className="shrink-0 font-mono text-[10px] font-bold text-leafDark">+{a.xp}</span>
                  </div>
                ))
              ) : (
                <div className="px-2 py-3 text-center text-[10px] font-semibold text-ink/40">
                  Aktivitasmu akan muncul di sini setelah misi pertama.
                </div>
              )}
            </Card>
          </section>
        </div>
      </div>

      <PipiBubble mood={save.streak.count > 0 ? 'happy' : 'hint'} size={62} className="mt-2">
        {save.streak.count > 0
          ? `Streak ${save.streak.count} hari! Konsistensi seperti ini yang membuat coding terasa ringan. Mau lanjut ke ${next ? `"${next.level.title}"` : 'mini games'}?`
          : 'Belum ada streak hari ini. Satu misi kecil sudah cukup untuk memulai kebiasaan belajar. Aku temani, ya!'}
      </PipiBubble>
    </div>
  )
}
