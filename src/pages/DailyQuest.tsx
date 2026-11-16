import { Link } from 'react-router-dom'
import { useGame } from '../store/GameContext'
import { counterLabel, questProgress, questsForDate } from '../data/daily'
import { todayKey } from '../lib/game'
import { Pipi, PipiBubble } from '../components/Pipi'
import { Icon } from '../components/Icon'
import { Button, Card, Chip, PageHeader, ProgressBar, SectionHeading, cn } from '../components/ui'

const QUEST_TONE: Record<string, { bg: string; iconBg: string }> = {
  play: { bg: '#F0FFF5', iconBg: '#63DE95' },
  lightbulb: { bg: '#FFFBEB', iconBg: '#FFC93C' },
  book: { bg: '#F1FAFF', iconBg: '#BFE9FF' },
  puzzle: { bg: '#F8F4FF', iconBg: '#CDBAF9' },
  bug: { bg: '#FFF3F0', iconBg: '#FF8A7A' },
  target: { bg: '#FFF8DF', iconBg: '#FFD86B' },
  gamepad: { bg: '#F4EEFF', iconBg: '#CDBAF9' },
}

export default function DailyQuest() {
  const { save, claimQuest } = useGame()
  if (!save) return null

  const today = todayKey()
  const isToday = save.daily.date === today
  const counters = isToday ? save.daily.counters : {}
  const claimed = isToday ? save.daily.claimed : {}
  const quests = questsForDate(today)
  const ready = quests.filter((q) => !claimed[q.id] && (counters[q.counter] ?? 0) >= q.target)
  const claimedCount = quests.filter((q) => claimed[q.id]).length
  const totalXp = quests.reduce((n, q) => n + q.xp, 0) + (save.daily.bonusGiven ? 0 : 40)
  const totalCoins = quests.reduce((n, q) => n + q.coins, 0) + (save.daily.bonusGiven ? 0 : 15)
  const dateLabel = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const activeToday = save.streak.lastActive === today

  const claimAll = () => {
    for (const quest of ready) claimQuest(quest)
  }

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = todayKey(d)
    const active = activeToday && save.streak.count > 0 && d <= new Date() && 6 - i < save.streak.count
    return {
      key,
      label: d.toLocaleDateString('id-ID', { weekday: 'short' }).slice(0, 3),
      day: d.getDate(),
      active,
      isToday: key === today,
    }
  })

  return (
    <div>
      <PageHeader title="Daily Quest" subtitle={dateLabel} icon="target">
        {ready.length > 0 && (
          <Button size="sm" variant="sun" icon="trophy" onClick={claimAll}>
            Klaim {ready.length} hadiah siap
          </Button>
        )}
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-[1fr_310px]">
        <div className="space-y-4">
          <Card tone="cream" className="relative overflow-hidden p-4 sm:p-5">
            <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full bg-coral/10" />
            <div className="relative flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-16 w-16 place-items-center rounded-2xl border-[3px] border-ink bg-coral shadow-pop-sm">
                  <Icon name="flame" size={30} />
                </span>
                <div>
                  <div className="font-display text-3xl font-extrabold leading-none">{save.streak.count}</div>
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink/45">hari streak</div>
                  <div className="mt-0.5 text-[10px] font-bold text-ink/40">Rekor: {save.streak.best} hari</div>
                </div>
              </div>
              <div className="min-w-[180px] flex-1">
                <div className="mb-1 flex items-center justify-between text-[9px] font-extrabold uppercase tracking-wide text-ink/40">
                  <span>7 hari terakhir</span>
                  <span className={activeToday ? 'text-leafDark' : 'text-coral'}>{activeToday ? 'Aktif hari ini' : 'Belum aktif hari ini'}</span>
                </div>
                <div className="flex items-end justify-between gap-1">
                  {days.map((d) => (
                    <div key={d.key} className="flex flex-1 flex-col items-center gap-1">
                      <span className={cn('grid h-7 w-7 place-items-center rounded-full border-2 text-[9px] font-extrabold', d.active ? 'border-ink bg-coral text-ink' : d.isToday ? 'border-coral bg-white text-coral' : 'border-ink/10 bg-white/60 text-ink/30')}>
                        {d.active ? <Icon name="flame" size={12} /> : d.day}
                      </span>
                      <span className={cn('text-[8px] font-extrabold uppercase', d.isToday ? 'text-ink' : 'text-ink/35')}>{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative mt-3 flex flex-wrap items-center gap-2 rounded-xl border-2 border-ink/10 bg-white/60 px-2.5 py-1.5 text-[10px] font-bold text-ink/50">
              <Icon name="info" size={12} /> Streak bertambah saat kamu melakukan aktivitas belajar hari ini.
              {!activeToday && <Link to="/playground" className="ml-auto font-extrabold text-leafDark hover:underline">Jalankan kode untuk memulai</Link>}
            </div>
          </Card>

          <div>
            <SectionHeading
              eyebrow="Misi hari ini"
              title="Empat langkah kecil"
              subtitle="Selesaikan aktivitasnya, lalu klaim hadiah. Progres dihitung otomatis."
              action={<span className="text-[10px] font-extrabold text-ink/45">{claimedCount}/4 diklaim</span>}
            />
            <div className="space-y-2">
              {quests.map((quest) => {
                const tone = QUEST_TONE[quest.icon] ?? QUEST_TONE.target
                const progress = questProgress({ ...save, daily: { ...save.daily, counters } }, quest)
                const done = (counters[quest.counter] ?? 0) >= quest.target
                const isClaimed = Boolean(claimed[quest.id])
                return (
                  <Card key={quest.id} className={cn('p-3.5 transition', isClaimed && 'opacity-80')} tone="paper">
                    <div className="flex items-start gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-[3px] border-ink" style={{ backgroundColor: tone.iconBg }}>
                        <Icon name={isClaimed ? 'check' : quest.icon} size={20} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h3 className="font-display text-sm font-extrabold">{quest.title}</h3>
                          {isClaimed && <span className="rounded-full bg-leaf/15 px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide text-leafDark">Selesai</span>}
                          {!isClaimed && done && <span className="rounded-full bg-sun/60 px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide text-ink/60">Siap diklaim</span>}
                        </div>
                        <p className="mt-0.5 text-[11px] font-semibold leading-snug text-ink/55">{quest.description}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <ProgressBar value={(progress / quest.target) * 100} height={6} color={isClaimed ? '#2FBF71' : tone.iconBg} className="flex-1" />
                          <span className="shrink-0 font-mono text-[10px] font-bold text-ink/45">{progress}/{quest.target}</span>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[9px] font-extrabold text-ink/35">
                          <span>{counterLabel(quest.counter)}</span>
                          <span className="inline-flex items-center gap-0.5 text-sunDark"><Icon name="bolt" size={10} /> +{quest.xp} XP</span>
                          <span className="inline-flex items-center gap-0.5 text-sunDark"><Icon name="coin" size={10} /> +{quest.coins}</span>
                        </div>
                      </div>
                      <div className="shrink-0 self-center">
                        {isClaimed ? (
                          <span className="flex items-center gap-1 rounded-lg bg-leaf/10 px-2 py-1 text-[9px] font-extrabold text-leafDark"><Icon name="check" size={11} /> Diterima</span>
                        ) : done ? (
                          <Button size="sm" variant="sun" icon="trophy" onClick={() => claimQuest(quest)}>Klaim</Button>
                        ) : (
                          <span className="flex items-center gap-1 rounded-lg bg-ink/5 px-2 py-1 text-[9px] font-extrabold text-ink/35"><Icon name="clock" size={11} /> Menunggu</span>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>

          <Card tone={claimedCount === 4 ? 'mint' : 'paper'} className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className={cn('grid h-10 w-10 place-items-center rounded-xl border-[3px] border-ink', claimedCount === 4 ? 'bg-leaf text-white' : 'bg-ink/10')}>
                <Icon name={claimedCount === 4 ? 'check' : 'gift'} size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-sm font-extrabold">Bonus semua quest</h3>
                <p className="text-[10px] font-semibold text-ink/50">
                  {claimedCount === 4
                    ? 'Bonus harian sudah diterima. Kembali besok untuk rangkaian baru!'
                    : 'Klaim keempat quest hari ini untuk bonus +40 XP dan +15 koin.'}
                </p>
              </div>
              <span className={cn('rounded-full border-2 px-2 py-1 text-[10px] font-extrabold', claimedCount === 4 ? 'border-leaf/40 bg-white/60 text-leafDark' : 'border-ink/15 bg-white/60 text-ink/45')}>
                {claimedCount === 4 ? 'Diterima' : '+40 XP • +15 koin'}
              </span>
            </div>
          </Card>

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-ink/10 bg-white/50 px-3 py-2">
            <span className="text-[10px] font-bold text-ink/45">Baru mulai? Quest "Pemanasan Pagi" cukup satu kali jalankan kode.</span>
            <Link to="/playground"><Button size="sm" variant="secondary" icon="terminal">Buka Playground</Button></Link>
          </div>
        </div>

        <aside className="space-y-4">
          <Card className="p-4">
            <h3 className="font-display text-sm font-extrabold">Hadiah hari ini</h3>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="rounded-xl border-2 border-ink/10 bg-[#FFF8DF] px-2 py-2 text-center">
                <Icon name="bolt" size={16} className="mx-auto text-sunDark" />
                <div className="mt-0.5 font-display text-lg font-extrabold leading-none">{totalXp}</div>
                <div className="text-[9px] font-extrabold uppercase tracking-wide text-ink/40">XP tersedia</div>
              </div>
              <div className="rounded-xl border-2 border-ink/10 bg-[#FFF4CC] px-2 py-2 text-center">
                <Icon name="coin" size={16} className="mx-auto text-sunDark" />
                <div className="mt-0.5 font-display text-lg font-extrabold leading-none">{totalCoins}</div>
                <div className="text-[9px] font-extrabold uppercase tracking-wide text-ink/40">Koin tersedia</div>
              </div>
            </div>
            <ul className="mt-2 space-y-1 text-[10px] font-semibold leading-snug text-ink/50">
              <li className="flex gap-1.5"><Icon name="check" size={11} className="mt-0.5 shrink-0 text-leafDark" /> Hadiah diklaim satu kali per hari.</li>
              <li className="flex gap-1.5"><Icon name="check" size={11} className="mt-0.5 shrink-0 text-leafDark" /> Hitungan memakai aktivitas nyata, bukan klik berulang.</li>
              <li className="flex gap-1.5"><Icon name="check" size={11} className="mt-0.5 shrink-0 text-leafDark" /> Rangkaian quest berganti setiap tanggal lokal.</li>
            </ul>
          </Card>

          <Card tone="grape" className="p-4">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg border-2 border-ink bg-white/70"><Icon name="lightbulb" size={15} /></span>
              <h3 className="font-display text-sm font-extrabold">Strategi cepat</h3>
            </div>
            <p className="mt-1.5 text-[11px] font-semibold leading-relaxed text-ink/60">
              Kerjakan satu misi materi: kamu otomatis mengumpulkan kode dijalankan, tantangan selesai,
              kuis benar, dan materi selesai. Empat quest bisa tuntas dalam satu sesi!
            </p>
            <Link to="/adventure" className="mt-2 inline-flex items-center gap-1 text-[10px] font-extrabold text-grapeDark hover:underline">
              Pilih misi <Icon name="arrow-right" size={11} />
            </Link>
          </Card>

          <PipiBubble mood={claimedCount === 4 ? 'celebrate' : 'happy'} size={56}>
            {claimedCount === 4
              ? 'Semua quest hari ini tuntas! Streak-mu aman. Tidak perlu memaksakan diri — istirahat juga bagian dari belajar.'
              : `${claimedCount} dari 4 quest selesai. Satu langkah kecil lagi, lalu klaim hadiahnya. Aku bangga kamu konsisten!`}
          </PipiBubble>
        </aside>
      </div>
    </div>
  )
}
