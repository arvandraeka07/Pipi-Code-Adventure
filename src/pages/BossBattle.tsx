import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { QuizQuestion, RewardSummary } from '../types'
import { useGame } from '../store/GameContext'
import { WORLDS, findQuestionById, getWorld } from '../data/worlds'
import { isBossDefeated, isBossUnlocked, worldProgress } from '../lib/progress'
import { checkChallenge, type ChallengeResult } from '../lib/python'
import { sound } from '../lib/sound'
import { Pipi } from '../components/Pipi'
import { CodeBlock, CodeEditor } from '../components/CodeEditor'
import { Icon } from '../components/Icon'
import { Button, Card, Chip, Confetti, PageHeader, ProgressBar, cn } from '../components/ui'

type Phase = 'intro' | 'quiz' | 'challenge' | 'won' | 'lost'

export default function BossBattle() {
  const { worldId } = useParams()
  const { save, evolution, defeatBoss, recordBossHit } = useGame()
  const world = getWorld(worldId ?? '')
  const [phase, setPhase] = useState<Phase>('intro')
  const [qIndex, setQIndex] = useState(0)
  const [bossHp, setBossHp] = useState(world?.boss.hp ?? 100)
  const [playerHp, setPlayerHp] = useState(world?.boss.playerHp ?? 100)
  const [selected, setSelected] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<{ correct: boolean; text: string } | null>(null)
  const [code, setCode] = useState('')
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<ChallengeResult | null>(null)
  const [summary, setSummary] = useState<RewardSummary | null>(null)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    setPhase('intro')
    setQIndex(0)
    setSelected(null)
    setFeedback(null)
    setResult(null)
    setSummary(null)
    setShowHint(false)
  }, [worldId])

  if (!save) return null

  const questions = (world?.boss.questionIds ?? [])
    .map((id) => findQuestionById(id))
    .filter((q): q is QuizQuestion => Boolean(q))

  if (!world) {
    return (
      <Card className="mx-auto max-w-lg p-8 text-center">
        <Pipi mood="confused" size={120} className="mx-auto" />
        <h1 className="mt-2 font-display text-xl font-extrabold">Dunia tidak ditemukan</h1>
        <Link to="/adventure" className="mt-3 inline-block"><Button size="sm" icon="map">Kembali ke peta</Button></Link>
      </Card>
    )
  }

  const boss = world.boss
  const progress = worldProgress(save, world)
  const defeated = isBossDefeated(save, world.id)

  if (!isBossUnlocked(save, world)) {
    return (
      <div>
        <PageHeader title={`Boss: ${boss.name}`} subtitle={world.name} icon="sword" />
        <Card tone="cream" className="mx-auto max-w-2xl overflow-hidden p-6 text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-3xl border-[3px] border-ink bg-surface/60">
            <Icon name="lock" size={42} className="text-ink/30" />
          </div>
          <h2 className="mt-3 font-display text-xl font-extrabold">Boss masih terkunci</h2>
          <p className="mx-auto mt-1 max-w-md text-xs font-semibold leading-relaxed text-ink/55">
            Selesaikan seluruh materi di {world.name} sebelum menantang {boss.name}. Materi akan membekalimu
            dengan konsep yang muncul di pertarungan.
          </p>
          <div className="mx-auto mt-3 max-w-sm">
            <ProgressBar value={(progress.completed / progress.total) * 100} label="Materi selesai" showLabel color={world.palette.from} />
            <div className="mt-1 text-[10px] font-bold text-ink/40">{progress.completed}/{progress.total} materi selesai</div>
          </div>
          <div className="mt-4 flex justify-center gap-2">
            <Link to={`/world/${world.id}`}><Button size="sm" icon="book">Lihat materi</Button></Link>
            <Link to="/adventure"><Button size="sm" variant="secondary" icon="map">Peta</Button></Link>
          </div>
        </Card>
      </div>
    )
  }

  const damage = Math.max(boss.damagePerHit, Math.ceil(boss.hp / Math.max(1, questions.length)))
  const wrongDamage = Math.max(8, Math.round(boss.playerHp / 5))
  const question = questions[qIndex]
  const challenge = boss.finalChallenge
  const nextWorld = WORLDS.find((w) => w.order === world.order + 1)

  const startBattle = () => {
    setPhase('quiz')
    setQIndex(0)
    setBossHp(boss.hp)
    setPlayerHp(boss.playerHp)
    setSelected(null)
    setFeedback(null)
    setResult(null)
    setSummary(null)
    setCode(challenge.starter)
    setShowHint(false)
    sound.play('click')
  }

  const answer = (i: number) => {
    if (selected !== null || !question) return
    setSelected(i)
    const correct = i === question.answer
    if (correct) {
      setBossHp((hp) => Math.max(0, hp - damage))
      recordBossHit()
      sound.play('coin')
      setFeedback({ correct: true, text: question.explanation })
    } else {
      setPlayerHp((hp) => Math.max(0, hp - wrongDamage))
      sound.play('error')
      setFeedback({ correct: false, text: `Belum tepat. Jawaban benar: ${question.options[question.answer]}. ${question.explanation}` })
    }
  }

  const advance = () => {
    if (!feedback) return
    if (!feedback.correct) {
      if (playerHp <= 0) {
        setPhase('lost')
        return
      }
      setSelected(null)
      setFeedback(null)
      return
    }
    if (bossHp <= 0) {
      setResult(null)
      setPhase('challenge')
      return
    }
    setQIndex((i) => (i + 1) % Math.max(1, questions.length))
    setSelected(null)
    setFeedback(null)
  }

  const checkFinal = async () => {
    if (checking) return
    setChecking(true)
    setResult(null)
    const outcome = await checkChallenge(challenge, code)
    setResult(outcome)
    setChecking(false)
    if (outcome.passed) {
      const reward = defeated ? null : defeatBoss(world.id)
      setSummary(reward)
      setPhase('won')
      sound.play('boss')
    } else {
      sound.play('error')
    }
  }

  if (phase === 'won') {
    const awarded = summary?.awarded ?? false
    return (
      <div>
        <PageHeader title="Kemenangan!" subtitle={`${boss.name} berhasil dikalahkan.`} icon="trophy" />
        <Card tone="cream" className="relative mx-auto max-w-2xl overflow-hidden p-6 text-center">
          <Confetti count={54} />
          <div className="relative">
            <Pipi mood="celebrate" stage={evolution} size={160} className="mx-auto" />
            <div className="mt-1 flex items-center justify-center gap-2">
              <Chip icon="sword" color={world.palette.accent}>{boss.name} tumbang</Chip>
              <Chip icon="flag" color="#159A55">{world.name} tuntas</Chip>
            </div>
            <h2 className="mt-3 font-display text-2xl font-extrabold">
              {awarded ? 'Boss dikalahkan!' : 'Latihan ulang selesai!'}
            </h2>
            <p className="mx-auto mt-1 max-w-md text-xs font-semibold leading-relaxed text-ink/55">
              {awarded
                ? `Hebat! Kamu menjawab pertarungan dan menulis kode terakhir dengan benar. Hadiah ${world.name} sudah masuk.`
                : `Kamu menaklukkan ${boss.name} lagi. Hadiah dunia hanya diberikan sekali, tetapi latihan ini tetap melatih pemahamanmu.`}
            </p>
            <div className="mx-auto mt-3 flex max-w-sm flex-wrap justify-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-xl border-2 border-ink/10 bg-surface/70 px-3 py-1.5 text-xs font-extrabold">
                <Icon name="bolt" size={14} className="text-sunDark" /> +{summary?.xp ?? 0} XP
              </span>
              <span className="inline-flex items-center gap-1 rounded-xl border-2 border-ink/10 bg-surface/70 px-3 py-1.5 text-xs font-extrabold">
                <Icon name="coin" size={14} className="text-sunDark" /> +{summary?.coins ?? 0} koin
              </span>
              {summary?.leveledUp && <Chip icon="star" color="#FFC93C">Level {summary.leveledTo}</Chip>}
            </div>
            {summary?.newBadges && summary.newBadges.length > 0 && (
              <p className="mt-2 text-[10px] font-bold text-leafDark">
                {summary.newBadges.length} badge baru terbuka — cek halaman Pencapaian!
              </p>
            )}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {nextWorld ? (
                <Link to={`/world/${nextWorld.id}`}>
                  <Button size="sm" variant="sun" icon="arrow-right">Dunia berikutnya: {nextWorld.name}</Button>
                </Link>
              ) : (
                <Link to="/dashboard">
                  <Button size="sm" variant="sun" icon="home">Kembali ke dashboard</Button>
                </Link>
              )}
              <Link to="/adventure"><Button size="sm" variant="secondary" icon="map">Peta petualangan</Button></Link>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (phase === 'lost') {
    return (
      <div>
        <PageHeader title="Kalah dulu, bukan menyerah" subtitle={`${boss.name} masih berdiri.`} icon="shield" />
        <Card className="mx-auto max-w-xl p-6 text-center">
          <Pipi mood="sad" size={140} className="mx-auto" />
          <h2 className="mt-1 font-display text-xl font-extrabold">Tenaga Pipi habis</h2>
          <p className="mx-auto mt-1 max-w-md text-xs font-semibold leading-relaxed text-ink/55">
            Jawaban yang salah mengurangi tenaga. Baca ulang materi singkat, lalu coba lagi.
            Semua soal akan diulang dari awal dan tenaga dipulihkan penuh.
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Button size="sm" icon="refresh-cw" onClick={startBattle}>Coba lagi</Button>
            <Link to={`/world/${world.id}`}><Button size="sm" variant="secondary" icon="book">Baca materi</Button></Link>
            <Link to="/adventure"><Button size="sm" variant="ghost" icon="map">Peta</Button></Link>
          </div>
        </Card>
      </div>
    )
  }

  if (phase === 'challenge') {
    return (
      <div>
        <PageHeader title="Tantangan terakhir" subtitle={`${boss.name} melemah. Selesaikan kode untuk menang.`} icon="code">
          <Link to={`/world/${world.id}`}><Button size="sm" variant="ghost" icon="arrow-left">Keluar</Button></Link>
        </PageHeader>
        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl border-2 border-ink" style={{ backgroundColor: world.palette.soft }}>
                <Icon name="terminal" size={17} />
              </span>
              <div>
                <div className="font-display text-sm font-extrabold">Kode penentu</div>
                <div className="text-[10px] font-bold text-ink/40">Tulis solusi, lalu periksa.</div>
              </div>
            </div>
            <p className="mt-2 rounded-xl border-2 border-ink/10 bg-surface/60 p-2.5 text-[11px] font-semibold leading-relaxed text-ink/65">
              {challenge.prompt}
            </p>
            <div className="mt-2">
              <CodeEditor value={code} onChange={setCode} showLineNumbers={save.settings.showLineNumbers} minHeight={190} ariaLabel="Kode tantangan terakhir boss" />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Button size="sm" icon="check" onClick={() => void checkFinal()} disabled={checking}>
                {checking ? 'Memeriksa...' : 'Periksa kode'}
              </Button>
              <Button size="sm" variant="secondary" icon="lightbulb" onClick={() => setShowHint((v) => !v)}>
                {showHint ? 'Sembunyikan petunjuk' : 'Petunjuk'}
              </Button>
              {defeated && <Chip icon="info" color="#8266E6">Mode latihan</Chip>}
            </div>
            {showHint && (
              <p className="mt-2 rounded-xl border-2 border-sun/40 bg-warning-soft p-2 text-[10px] font-bold leading-snug text-ink/55">
                {challenge.hint}
              </p>
            )}
            {result && (
              <div className={cn('mt-2 rounded-xl border-2 p-2.5', result.passed ? 'border-leaf/40 bg-mint/60' : 'border-coral/40 bg-coral/5')}>
                <div className="flex items-start gap-1.5">
                  <Icon name={result.passed ? 'check' : 'info'} size={14} className={result.passed ? 'mt-0.5 text-leafDark' : 'mt-0.5 text-coral-text'} />
                  <p className="whitespace-pre-wrap text-[11px] font-bold leading-snug text-ink/65">{result.message}</p>
                </div>
                {result.output.trim() && (
                  <div className="mt-1.5 rounded-lg bg-code p-2">
                    <div className="text-[8px] font-extrabold uppercase tracking-wide text-code-ink/40">Output</div>
                    <pre className="mt-0.5 whitespace-pre-wrap font-mono text-[10px] leading-relaxed text-[#B9F5CE]">{result.output}</pre>
                  </div>
                )}
              </div>
            )}
          </Card>

          <aside className="space-y-4">
            <Card tone="cream" className="p-4 text-center">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl border-[3px] border-ink bg-surface/60">
                <Icon name="sword" size={36} className="text-ink/60" />
              </div>
              <h3 className="mt-2 font-display text-sm font-extrabold">{boss.name}</h3>
              <p className="text-[10px] font-bold text-ink/40">Tenaga tersisa 1 kode</p>
              <ProgressBar value={12} height={9} color={world.palette.accent} className="mt-2" />
              <p className="mt-2 text-[10px] font-semibold leading-snug text-ink/45">
                Selesaikan tantangan ini untuk mengakhiri pertarungan. Kesalahan bisa diperbaiki tanpa kehilangan tenaga.
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="font-display text-sm font-extrabold">Pengingat</h3>
              <ul className="mt-1.5 space-y-1 text-[10px] font-semibold leading-snug text-ink/50">
                <li className="flex gap-1.5"><Icon name="check" size={11} className="mt-0.5 shrink-0 text-leafDark" /> Output harus sama persis.</li>
                <li className="flex gap-1.5"><Icon name="check" size={11} className="mt-0.5 shrink-0 text-leafDark" /> Perhatikan indentasi dan titik dua.</li>
                <li className="flex gap-1.5"><Icon name="check" size={11} className="mt-0.5 shrink-0 text-leafDark" /> Kamu boleh mencoba berkali-kali.</li>
              </ul>
            </Card>
            <div className="rounded-2xl border-2 border-dashed border-ink/15 bg-surface/40 p-3 text-center">
              <Pipi mood={result?.passed ? 'celebrate' : 'hint'} size={72} className="mx-auto" />
              <p className="mt-1 text-[10px] font-semibold leading-snug text-ink/45">Tenang. Kamu sudah sampai di sini karena bisa.</p>
            </div>
          </aside>
        </div>
      </div>
    )
  }

  if (phase === 'quiz') {
    const hpPercent = (bossHp / boss.hp) * 100
    const playerPercent = (playerHp / boss.playerHp) * 100
    return (
      <div>
        <PageHeader title={boss.name} subtitle={`Pertarungan ${qIndex + 1} dari ${questions.length}`} icon="sword">
          <Button size="sm" variant="ghost" icon="arrow-left" onClick={() => setPhase('intro')}>Keluar</Button>
        </PageHeader>

        <div className="grid gap-4 lg:grid-cols-[1fr_290px]">
          <div className="space-y-3">
            <Card className="p-3.5">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-[3px] border-ink" style={{ backgroundColor: world.palette.soft }}>
                  <Icon name="skull" size={22} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="truncate font-display text-sm font-extrabold">{boss.name}</h2>
                    <span className="shrink-0 font-mono text-[10px] font-bold text-ink/45">{bossHp}/{boss.hp} HP</span>
                  </div>
                  <ProgressBar value={hpPercent} height={10} color={bossHp > boss.hp / 3 ? world.palette.accent : '#FF8A7A'} className="mt-1" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 border-ink bg-mint">
                  <Pipi mood={playerPercent > 50 ? 'happy' : 'sad'} size={32} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-[11px] font-extrabold">Kamu</span>
                    <span className="font-mono text-[10px] font-bold text-ink/45">{playerHp}/{boss.playerHp} HP</span>
                  </div>
                  <ProgressBar value={playerPercent} height={7} color={playerPercent > 40 ? '#2FBF71' : '#FF8A7A'} className="mt-0.5" />
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between gap-2 text-[9px] font-extrabold uppercase tracking-wide text-ink/35">
                <span>Serangan benar: -{damage} HP boss</span>
                <span>Salah: -{wrongDamage} HP kamu</span>
              </div>
            </Card>

            {question && (
              <Card className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-grapeDark">Soal {qIndex + 1}</div>
                    <h3 className="mt-0.5 font-display text-base font-extrabold leading-snug">{question.question}</h3>
                  </div>
                  <Chip icon="skull" color={world.palette.accent}>{question.kind.toUpperCase()}</Chip>
                </div>
                {question.code && (
                  <div className="mt-2">
                    <CodeBlock code={question.code} title="Kode soal" compact />
                  </div>
                )}
                <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
                  {question.options.map((option, i) => {
                    const isAnswer = i === question.answer
                    const picked = selected === i
                    const showState = selected !== null
                    return (
                      <button
                        key={i}
                        onClick={() => answer(i)}
                        disabled={selected !== null}
                        className={cn(
                          'flex items-center gap-2 rounded-xl border-[2.5px] px-2.5 py-2 text-left text-[11px] font-bold transition',
                          !showState && 'border-ink/15 bg-surface hover:border-ink/35 hover:bg-sun/20',
                          showState && isAnswer && 'border-leaf bg-mint/70',
                          showState && picked && !isAnswer && 'border-coral bg-coral/10',
                          showState && !isAnswer && !picked && 'border-ink/10 bg-surface/40 opacity-60',
                        )}
                      >
                        <span className={cn(
                          'grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 text-[10px] font-extrabold',
                          showState && isAnswer ? 'border-leaf bg-leaf text-white' : showState && picked ? 'border-coral bg-coral text-ink' : 'border-ink/20 bg-surface',
                        )}>
                          {showState && isAnswer ? <Icon name="check" size={12} /> : showState && picked ? <Icon name="x" size={12} /> : String.fromCharCode(65 + i)}
                        </span>
                        <span className="min-w-0 flex-1 whitespace-pre-line">{option}</span>
                      </button>
                    )
                  })}
                </div>

                {feedback && (
                  <div className={cn('mt-3 rounded-xl border-2 p-2.5', feedback.correct ? 'border-leaf/40 bg-mint/50' : 'border-coral/40 bg-coral/5')}>
                    <div className="flex items-start gap-1.5">
                      <Icon name={feedback.correct ? 'check' : 'info'} size={14} className={cn('mt-0.5 shrink-0', feedback.correct ? 'text-leafDark' : 'text-coral-text')} />
                      <p className="text-[11px] font-semibold leading-relaxed text-ink/65">{feedback.text}</p>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <Button size="sm" variant={feedback.correct ? 'primary' : 'secondary'} icon={feedback.correct ? 'sword' : 'refresh-cw'} onClick={advance}>
                        {feedback.correct
                          ? bossHp <= 0
                            ? 'Tantangan terakhir'
                            : 'Soal berikutnya'
                          : playerHp <= 0
                            ? 'Lihat hasil'
                            : 'Coba lagi'}
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>

          <aside className="space-y-4">
            <Card tone="cream" className="p-4">
              <div className="flex items-center gap-2">
                <Pipi mood={feedback ? (feedback.correct ? 'celebrate' : 'hint') : 'thinking'} size={70} />
                <div>
                  <div className="font-display text-sm font-extrabold">Strategi Pipi</div>
                  <p className="mt-0.5 text-[10px] font-semibold leading-snug text-ink/50">
                    {feedback
                      ? feedback.correct
                        ? 'Serangan tepat! Lanjutkan sebelum boss bangkit.'
                        : 'Tenang, baca penjelasannya. Soal ini akan diulang.'
                      : 'Baca soal dengan teliti. Jawaban salah tidak langsung mengakhiri, tapi tenagamu berkurang.'}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-display text-sm font-extrabold">Progres pertarungan</h3>
              <div className="mt-2 flex items-center gap-1">
                {questions.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-2 flex-1 rounded-full border',
                      i < qIndex ? 'border-leaf bg-leaf' : i === qIndex ? 'border-ink bg-sun' : 'border-ink/15 bg-surface',
                    )}
                  />
                ))}
              </div>
              <p className="mt-1 text-[9px] font-bold text-ink/35">
                {qIndex} dari {questions.length} soal terjawab
              </p>
              <div className="mt-2 rounded-xl border-2 border-ink/10 bg-surface/60 p-2">
                <div className="text-[9px] font-extrabold uppercase tracking-wide text-ink/35">Hadiah</div>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[10px] font-extrabold text-sunDark">
                  <span className="inline-flex items-center gap-0.5"><Icon name="bolt" size={11} /> +{boss.reward.xp + world.reward.xp} XP</span>
                  <span className="inline-flex items-center gap-0.5"><Icon name="coin" size={11} /> +{boss.reward.coins + world.reward.coins}</span>
                </div>
              </div>
            </Card>

            <div className="rounded-2xl border-2 border-dashed border-ink/15 bg-surface/40 p-3 text-[10px] font-semibold leading-snug text-ink/45">
              <Icon name="info" size={12} className="mb-1" />
              Kamu bisa keluar kapan saja. Progres pertarungan akan dimulai dari awal saat kembali.
            </div>
          </aside>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Boss Battle" subtitle={`${world.name} • ${boss.title}`} icon="sword">
        <Link to={`/world/${world.id}`}><Button size="sm" variant="ghost" icon="arrow-left">Kembali ke dunia</Button></Link>
      </PageHeader>

      <Card tone="cream" className="relative mx-auto max-w-3xl overflow-hidden p-5 sm:p-6">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full" style={{ backgroundColor: world.palette.soft, opacity: 0.7 }} />
        <div className="relative grid gap-4 sm:grid-cols-[150px_1fr]">
          <div className="flex flex-col items-center justify-center">
            <div className="relative grid h-28 w-28 place-items-center rounded-[30px] border-[3px] border-ink shadow-pop-sm" style={{ backgroundColor: world.palette.accent }}>
              <Icon name="skull" size={52} />
              <span className="absolute -bottom-2 -right-2 grid h-8 w-8 place-items-center rounded-full border-2 border-ink bg-surface">
                <Icon name="flame" size={15} />
              </span>
            </div>
            <div className="mt-2 rounded-full border-2 border-ink bg-surface px-2 py-0.5 font-display text-[10px] font-extrabold shadow-pop-sm">
              {boss.hp} HP
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <Chip icon="flag" color={world.palette.accent}>{world.name}</Chip>
              {defeated ? <Chip icon="check" color="#159A55">Sudah dikalahkan</Chip> : <Chip icon="sword" color="#FF8A7A">Boss terkunci? Tidak lagi!</Chip>}
            </div>
            <h1 className="mt-1 font-display text-2xl font-extrabold leading-tight">{boss.name}</h1>
            <p className="text-[11px] font-extrabold uppercase tracking-wide text-ink/40">{boss.title}</p>
            <p className="mt-2 text-xs font-semibold leading-relaxed text-ink/60">{boss.description}</p>

            <div className="mt-3 grid grid-cols-3 gap-1.5">
              <div className="rounded-xl border-2 border-ink/10 bg-surface/70 px-2 py-1.5 text-center">
                <div className="font-display text-base font-extrabold">{questions.length}</div>
                <div className="text-[8px] font-extrabold uppercase tracking-wide text-ink/35">Soal</div>
              </div>
              <div className="rounded-xl border-2 border-ink/10 bg-surface/70 px-2 py-1.5 text-center">
                <div className="font-display text-base font-extrabold">{boss.playerHp}</div>
                <div className="text-[8px] font-extrabold uppercase tracking-wide text-ink/35">Nyawa</div>
              </div>
              <div className="rounded-xl border-2 border-ink/10 bg-surface/70 px-2 py-1.5 text-center">
                <div className="font-display text-base font-extrabold">{boss.reward.xp + world.reward.xp}</div>
                <div className="text-[8px] font-extrabold uppercase tracking-wide text-ink/35">XP hadiah</div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button icon="sword" onClick={startBattle}>{defeated ? 'Latihan ulang' : 'Mulai pertarungan'}</Button>
              {defeated && <span className="text-[9px] font-bold text-ink/35">Tanpa hadiah tambahan</span>}
            </div>
            {!defeated && (
              <p className="mt-2 flex items-start gap-1 text-[9px] font-bold leading-snug text-ink/35">
                <Icon name="info" size={11} className="mt-0.5 shrink-0" />
                Jawaban benar menyerang boss. Jawaban salah mengurangi tenagamu dan soal yang sama diulang.
              </p>
            )}
          </div>
        </div>
      </Card>

      <div className="mx-auto mt-4 grid max-w-3xl gap-3 sm:grid-cols-3">
        <Card className="p-3">
          <div className="flex items-center gap-1.5">
            <Icon name="target" size={14} className="text-leafDark" />
            <h3 className="font-display text-[12px] font-extrabold">Tahap 1: Kuis</h3>
          </div>
          <p className="mt-0.5 text-[10px] font-semibold leading-snug text-ink/50">Jawab {questions.length} soal dari materi {world.name}.</p>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-1.5">
            <Icon name="code" size={14} className="text-grapeDark" />
            <h3 className="font-display text-[12px] font-extrabold">Tahap 2: Kode</h3>
          </div>
          <p className="mt-0.5 text-[10px] font-semibold leading-snug text-ink/50">Tulis kode terakhir saat tenaga boss habis.</p>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-1.5">
            <Icon name="trophy" size={14} className="text-sunDark" />
            <h3 className="font-display text-[12px] font-extrabold">Hadiah</h3>
          </div>
          <p className="mt-0.5 text-[10px] font-semibold leading-snug text-ink/50">XP, koin, badge, dan akses dunia berikutnya.</p>
        </Card>
      </div>

      <div className="mx-auto mt-4 max-w-3xl">
        <Card tone="mint" className="flex items-center gap-3 p-3">
          <Pipi mood={defeated ? 'celebrate' : 'hint'} size={64} />
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-sm font-extrabold">Pesan Pipi</h3>
            <p className="text-[10px] font-semibold leading-snug text-ink/55">
              {defeated
                ? 'Kamu sudah menang di sini. Latihan ulang boleh, tapi jangan lupa tantangan baru menantimu!'
                : 'Boss ini menguji materi, bukan hafalan. Kalau ragu, kembali sebentar ke materi — itu bukan mundur, itu strategi.'}
            </p>
          </div>
          <Link to={`/world/${world.id}`}><Button size="sm" variant="secondary" icon="book">Materi</Button></Link>
        </Card>
      </div>
    </div>
  )
}
