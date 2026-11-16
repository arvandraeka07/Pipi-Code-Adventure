import { useEffect, useMemo, useRef, useState } from 'react'
import { useGame } from '../store/GameContext'
import { BUG_ITEMS, GUESS_ITEMS, PUZZLE_ITEMS, reputationTitle } from '../data/games'
import { shuffle } from '../lib/game'
import { sound } from '../lib/sound'
import { Pipi, PipiBubble } from '../components/Pipi'
import { Icon } from '../components/Icon'
import { Button, Card, Chip, PageHeader, ProgressBar, cn } from '../components/ui'

type Summary = { xp: number; coins: number; capped: boolean; playsUsed: number }
type GameId = 'guess' | 'bug' | 'puzzle' | 'speed'

const GAMES: { id: GameId; title: string; tagline: string; icon: string; color: string; soft: string }[] = [
  { id: 'guess', title: 'Tebak Output', tagline: 'Prediksi hasil kode sebelum dijalankan.', icon: 'terminal', color: '#2FBF71', soft: '#D8F7E4' },
  { id: 'bug', title: 'Find The Bug', tagline: 'Temukan baris yang membuat program error.', icon: 'bug', color: '#FF8A7A', soft: '#FFE4DE' },
  { id: 'puzzle', title: 'Code Puzzle', tagline: 'Susun potongan kode menjadi urutan logis.', icon: 'puzzle', color: '#8266E6', soft: '#F0EAFF' },
  { id: 'speed', title: 'Speed Coding', tagline: 'Jawab sebanyak mungkin dalam 60 detik.', icon: 'timer', color: '#FFC93C', soft: '#FFF4CC' },
]

function GameResult({
  headline,
  detail,
  result,
  onReplay,
  onExit,
}: {
  headline: string
  detail: string
  result: Summary
  onReplay: () => void
  onExit: () => void
}) {
  return (
    <Card tone="cream" className="p-5 text-center">
      <Pipi mood="celebrate" size={130} />
      <h2 className="mt-1 font-display text-xl font-extrabold">{headline}</h2>
      <p className="mx-auto mt-0.5 max-w-sm text-xs font-semibold text-ink/55">{detail}</p>
      <div className="mx-auto mt-3 flex max-w-xs items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-xl border-2 border-ink/10 bg-white/70 px-3 py-1.5 text-xs font-extrabold">
          <Icon name="bolt" size={14} className="text-sunDark" /> +{result.xp} XP
        </span>
        <span className="inline-flex items-center gap-1 rounded-xl border-2 border-ink/10 bg-white/70 px-3 py-1.5 text-xs font-extrabold">
          <Icon name="coin" size={14} className="text-sunDark" /> +{result.coins} koin
        </span>
      </div>
      {result.capped && (
        <p className="mx-auto mt-2 max-w-sm rounded-xl border-2 border-sun/40 bg-[#FFF8DF] px-2 py-1.5 text-[10px] font-bold text-ink/55">
          Hadiah ronde ke-{result.playsUsed} untuk game ini sudah mencapai batas harian. Ronde berikutnya tetap
          seru, tetapi tidak memberi XP lagi.
        </p>
      )}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Button size="sm" variant="primary" icon="refresh-cw" onClick={onReplay}>Main lagi</Button>
        <Button size="sm" variant="secondary" icon="gamepad" onClick={onExit}>Pilih game lain</Button>
      </div>
    </Card>
  )
}

function GameTop({ title, icon, onExit, progress, counter }: { title: string; icon: string; onExit: () => void; progress: number; counter: string }) {
  return (
    <div className="mb-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button onClick={onExit} className="grid h-8 w-8 place-items-center rounded-lg border-2 border-ink bg-white" aria-label="Kembali ke daftar game">
            <Icon name="arrow-left" size={14} />
          </button>
          <span className="grid h-8 w-8 place-items-center rounded-lg border-2 border-ink bg-sun"><Icon name={icon} size={15} /></span>
          <h2 className="font-display text-lg font-extrabold">{title}</h2>
        </div>
        <span className="rounded-full border-2 border-ink/15 bg-white/70 px-2 py-1 text-[10px] font-extrabold text-ink/50">{counter}</span>
      </div>
      <ProgressBar value={progress} height={7} className="mt-2" />
    </div>
  )
}

function GuessGame({ onExit }: { onExit: () => void }) {
  const { recordGame } = useGame()
  const [roundKey, setRoundKey] = useState(0)
  const questions = useMemo(() => shuffle(GUESS_ITEMS).slice(0, 8), [roundKey])
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [result, setResult] = useState<Summary | null>(null)
  const q = questions[index]

  const pick = (i: number) => {
    if (picked !== null) return
    setPicked(i)
    if (i === q.answer) {
      setScore((s) => s + 1)
      sound.play('coin')
    } else {
      sound.play('error')
    }
  }

  const next = () => {
    if (index >= questions.length - 1) {
      const percent = Math.round((score / questions.length) * 100)
      setResult(recordGame('guess', 'Tebak Output', percent))
      sound.play('success')
    } else {
      setIndex((n) => n + 1)
      setPicked(null)
    }
  }

  const replay = () => {
    setRoundKey((k) => k + 1)
    setIndex(0)
    setPicked(null)
    setScore(0)
    setResult(null)
  }

  if (result) {
    return (
      <GameResult
        headline={score >= 6 ? 'Mata Python-mu tajam!' : 'Terus asah prediksimu!'}
        detail={`Kamu menjawab ${score} dari ${questions.length} output dengan benar.`}
        result={result}
        onReplay={replay}
        onExit={onExit}
      />
    )
  }

  return (
    <div>
      <GameTop title="Tebak Output" icon="terminal" onExit={onExit} progress={((index + (picked !== null ? 1 : 0)) / questions.length) * 100} counter={`${index + 1}/${questions.length} • benar ${score}`} />
      <Card className="p-4">
        <div className="text-[10px] font-extrabold uppercase tracking-wide text-ink/40">Apa yang akan dicetak?</div>
        <pre className="mt-2 overflow-x-auto rounded-xl border-2 border-ink/10 bg-[#0F2B20] px-3 py-3 font-mono text-[13px] leading-relaxed text-[#E9FFF1]">{q.code}</pre>
        <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
          {q.options.map((opt, i) => {
            const isPicked = picked === i
            const isAnswer = q.answer === i
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                disabled={picked !== null}
                className={cn(
                  'flex items-center gap-2 rounded-xl border-[3px] px-3 py-2 text-left text-xs font-bold transition',
                  picked === null && 'border-ink/10 bg-white hover:border-ink/30',
                  picked !== null && isAnswer && 'border-leaf bg-[#F3FFF7] text-leafDark',
                  picked !== null && isPicked && !isAnswer && 'border-coral bg-[#FFF3F0] text-[#B3341F]',
                  picked !== null && !isPicked && !isAnswer && 'border-ink/5 bg-white/40 text-ink/35',
                )}
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2 border-ink/15 bg-cream font-display text-[10px] font-extrabold">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            )
          })}
        </div>
        {picked !== null && (
          <div className="mt-3 rounded-xl border-2 border-ink/10 bg-cream px-3 py-2">
            <div className="flex items-center gap-1.5 font-display text-xs font-extrabold">
              <Icon name={picked === q.answer ? 'check' : 'alert'} size={13} />
              {picked === q.answer ? 'Tepat!' : 'Belum tepat'}
            </div>
            <p className="mt-1 text-[11px] font-semibold leading-relaxed text-ink/60">{q.explanation}</p>
            <Button size="sm" variant="primary" className="mt-2" iconRight="arrow-right" onClick={next}>
              {index >= questions.length - 1 ? 'Lihat hasil' : 'Soal berikutnya'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

function BugGame({ onExit }: { onExit: () => void }) {
  const { recordGame, recordBugFound } = useGame()
  const [roundKey, setRoundKey] = useState(0)
  const items = useMemo(() => shuffle(BUG_ITEMS).slice(0, 6), [roundKey])
  const [round, setRound] = useState(0)
  const [wrongLines, setWrongLines] = useState<number[]>([])
  const [solved, setSolved] = useState(false)
  const [firstTry, setFirstTry] = useState(true)
  const [firstTryCorrect, setFirstTryCorrect] = useState(0)
  const [result, setResult] = useState<Summary | null>(null)
  const item = items[round]
  const lines = item.code.split('\n')

  const click = (line: number) => {
    if (solved) return
    if (line === item.buggyLine) {
      setSolved(true)
      if (firstTry) setFirstTryCorrect((n) => n + 1)
      recordBugFound()
      sound.play('success')
    } else {
      setWrongLines((prev) => (prev.includes(line) ? prev : [...prev, line]))
      setFirstTry(false)
      sound.play('error')
    }
  }

  const next = () => {
    if (round >= items.length - 1) {
      const percent = Math.round((firstTryCorrect / items.length) * 100)
      setResult(recordGame('bug', 'Find The Bug', percent))
      sound.play('success')
    } else {
      setRound((n) => n + 1)
      setSolved(false)
      setWrongLines([])
      setFirstTry(true)
    }
  }

  const replay = () => {
    setRoundKey((k) => k + 1)
    setRound(0)
    setWrongLines([])
    setSolved(false)
    setFirstTry(true)
    setFirstTryCorrect(0)
    setResult(null)
  }

  if (result) {
    return (
      <GameResult
        headline={firstTryCorrect >= 4 ? 'Detektif bug handal!' : 'Latih matamu lagi!'}
        detail={`Kamu menemukan bug tanpa salah klik pada ${firstTryCorrect} dari ${items.length} ronde.`}
        result={result}
        onReplay={replay}
        onExit={onExit}
      />
    )
  }

  return (
    <div>
      <GameTop title="Find The Bug" icon="bug" onExit={onExit} progress={((round + (solved ? 1 : 0)) / items.length) * 100} counter={`${round + 1}/${items.length} • tepat ${firstTryCorrect}`} />
      <Card className="p-4">
        <h3 className="font-display text-base font-extrabold">{item.title}</h3>
        <p className="mt-0.5 text-[11px] font-semibold text-ink/50">Klik baris yang menyebabkan error.</p>
        <div className="mt-3 overflow-hidden rounded-xl border-2 border-ink/10 bg-[#0F2B20]">
          {lines.map((line, i) => (
            <button
              key={i}
              onClick={() => click(i)}
              disabled={solved}
              className={cn(
                'flex w-full items-start gap-3 px-3 py-1.5 text-left font-mono text-[12px] leading-relaxed transition',
                solved && i === item.buggyLine && 'bg-[#FF8A7A]/25 text-[#FFD8D0]',
                !solved && wrongLines.includes(i) && 'bg-coral/15 text-[#FFB3A8]',
                !solved && !wrongLines.includes(i) && 'text-[#E9FFF1] hover:bg-white/10',
              )}
            >
              <span className={cn('w-5 shrink-0 select-none text-right text-[10px]', solved && i === item.buggyLine ? 'text-[#FFB3A8]' : 'text-mint/25')}>{i + 1}</span>
              <span className="whitespace-pre-wrap break-words">{line || ' '}</span>
            </button>
          ))}
        </div>
        {wrongLines.length > 0 && !solved && (
          <div className="mt-2 rounded-lg border-2 border-coral/30 bg-[#FFF3F0] px-2.5 py-1.5 text-[10px] font-bold text-ink/55">
            Bukan baris itu. Petunjuk: {item.hint}
          </div>
        )}
        {solved && (
          <div className="mt-3 rounded-xl border-2 border-leaf/40 bg-[#F3FFF7] px-3 py-2">
            <div className="flex items-center gap-1.5 font-display text-xs font-extrabold text-leafDark">
              <Icon name="check" size={13} /> Bug ditemukan!
            </div>
            <p className="mt-1 text-[11px] font-semibold leading-relaxed text-ink/60">{item.explanation}</p>
            <Button size="sm" variant="primary" className="mt-2" iconRight="arrow-right" onClick={next}>
              {round >= items.length - 1 ? 'Lihat hasil' : 'Ronde berikutnya'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

function PuzzleGame({ onExit }: { onExit: () => void }) {
  const { recordGame, recordPuzzleSolved } = useGame()
  const [roundKey, setRoundKey] = useState(0)
  const items = useMemo(() => shuffle(PUZZLE_ITEMS).slice(0, 4), [roundKey])
  const [round, setRound] = useState(0)
  const [order, setOrder] = useState<number[]>([])
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [mistakes, setMistakes] = useState(0)
  const [result, setResult] = useState<Summary | null>(null)
  const item = items[round]
  const pieces = useMemo(
    () => shuffle(item.lines.map((line, i) => ({ line, i }))),
    [item.id, roundKey],
  )
  const used = new Set(order)

  const pick = (pos: number) => {
    if (status === 'correct' || used.has(pos)) return
    setOrder((prev) => [...prev, pos])
    setStatus('idle')
  }

  const check = () => {
    if (order.length !== pieces.length) return
    const correct = order.every((pos, i) => pieces[pos].i === i)
    if (correct) {
      setStatus('correct')
      recordPuzzleSolved()
      sound.play('success')
    } else {
      setStatus('wrong')
      setMistakes((n) => n + 1)
      sound.play('error')
    }
  }

  const next = () => {
    if (round >= items.length - 1) {
      const percent = Math.max(20, 100 - mistakes * 10)
      setResult(recordGame('puzzle', 'Code Puzzle', percent))
      sound.play('success')
    } else {
      setRound((n) => n + 1)
      setOrder([])
      setStatus('idle')
    }
  }

  const replay = () => {
    setRoundKey((k) => k + 1)
    setRound(0)
    setOrder([])
    setStatus('idle')
    setMistakes(0)
    setResult(null)
  }

  if (result) {
    return (
      <GameResult
        headline={mistakes <= 2 ? 'Arsitek kode!' : 'Logika makin terasah!'}
        detail={`Kamu menyelesaikan ${items.length} puzzle dengan ${mistakes} percobaan yang meleset.`}
        result={result}
        onReplay={replay}
        onExit={onExit}
      />
    )
  }

  return (
    <div>
      <GameTop title="Code Puzzle" icon="puzzle" onExit={onExit} progress={((round + (status === 'correct' ? 1 : 0)) / items.length) * 100} counter={`${round + 1}/${items.length} • meleset ${mistakes}`} />
      <Card className="p-4">
        <h3 className="font-display text-base font-extrabold">{item.title}</h3>
        <p className="mt-0.5 text-[11px] font-semibold text-ink/50">{item.description}</p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <div className="mb-1 text-[9px] font-extrabold uppercase tracking-wide text-ink/40">Potongan kode (acak)</div>
            <div className="space-y-1">
              {pieces.map((piece, pos) => (
                <button
                  key={pos}
                  onClick={() => pick(pos)}
                  disabled={used.has(pos) || status === 'correct'}
                  className={cn(
                    'block w-full overflow-x-auto whitespace-pre rounded-lg border-2 px-2 py-1.5 text-left font-mono text-[11px] transition',
                    used.has(pos)
                      ? 'border-ink/5 bg-ink/5 text-ink/25'
                      : 'border-ink/15 bg-white text-ink/75 hover:border-ink/35',
                  )}
                >
                  {piece.line}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[9px] font-extrabold uppercase tracking-wide text-ink/40">Susunanmu</span>
              <div className="flex gap-1">
                <button onClick={() => setOrder((prev) => prev.slice(0, -1))} disabled={!order.length || status === 'correct'} className="rounded-md border border-ink/15 px-1.5 py-0.5 text-[9px] font-bold disabled:opacity-30">Undo</button>
                <button onClick={() => { setOrder([]); setStatus('idle') }} disabled={!order.length || status === 'correct'} className="rounded-md border border-ink/15 px-1.5 py-0.5 text-[9px] font-bold disabled:opacity-30">Reset</button>
              </div>
            </div>
            <div className={cn('min-h-[110px] rounded-lg border-2 bg-[#0F2B20] p-2', status === 'correct' ? 'border-leaf' : status === 'wrong' ? 'border-coral' : 'border-ink/10')}>
              {order.length ? (
                <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-[#E9FFF1]">
                  {order.map((pos) => pieces[pos].line).join('\n')}
                </pre>
              ) : (
                <p className="p-2 text-[10px] italic text-mint/30">Klik potongan di kiri untuk menyusun program.</p>
              )}
            </div>
            <Button size="sm" variant="primary" className="mt-2 w-full" icon="check" onClick={check} disabled={order.length !== pieces.length || status === 'correct'}>
              Periksa Susunan
            </Button>
          </div>
        </div>

        {status === 'wrong' && (
          <div className="mt-2 rounded-lg border-2 border-coral/30 bg-[#FFF3F0] px-2.5 py-1.5 text-[10px] font-bold text-ink/55">
            Susunannya belum benar. Ingat: program berjalan dari atas ke bawah. Perhatikan baris yang harus
            mendahului baris lain.
          </div>
        )}
        {status === 'correct' && (
          <div className="mt-3 rounded-xl border-2 border-leaf/40 bg-[#F3FFF7] px-3 py-2">
            <div className="flex items-center gap-1.5 font-display text-xs font-extrabold text-leafDark"><Icon name="check" size={13} /> Susunan tepat!</div>
            <p className="mt-1 text-[11px] font-semibold leading-relaxed text-ink/60">{item.explanation}</p>
            <Button size="sm" variant="primary" className="mt-2" iconRight="arrow-right" onClick={next}>
              {round >= items.length - 1 ? 'Lihat hasil' : 'Puzzle berikutnya'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

function SpeedGame({ onExit }: { onExit: () => void }) {
  const { recordGame } = useGame()
  const [phase, setPhase] = useState<'idle' | 'playing' | 'done'>('idle')
  const [timeLeft, setTimeLeft] = useState(60)
  const [score, setScore] = useState(0)
  const [questions, setQuestions] = useState(() => shuffle(GUESS_ITEMS))
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [result, setResult] = useState<Summary | null>(null)
  const finishedRef = useRef(false)
  const q = questions[index % questions.length]

  useEffect(() => {
    if (phase !== 'playing') return
    const timer = window.setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'playing' || timeLeft > 0) return
    if (finishedRef.current) return
    finishedRef.current = true
    setPhase('done')
    setResult(recordGame('speed', 'Speed Coding', score))
    sound.play('levelup')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase])

  const start = () => {
    finishedRef.current = false
    setPhase('playing')
    setTimeLeft(60)
    setScore(0)
    setQuestions(shuffle(GUESS_ITEMS))
    setIndex(0)
    setPicked(null)
    setResult(null)
  }

  const endNow = () => {
    if (finishedRef.current) return
    finishedRef.current = true
    setPhase('done')
    setResult(recordGame('speed', 'Speed Coding', score))
    sound.play('levelup')
  }

  const pick = (i: number) => {
    if (picked !== null || phase !== 'playing') return
    setPicked(i)
    if (i === q.answer) {
      setScore((s) => s + 1)
      sound.play('coin')
    } else {
      sound.play('error')
    }
    window.setTimeout(() => {
      setPicked(null)
      setIndex((n) => n + 1)
    }, 650)
  }

  if (phase === 'idle') {
    return (
      <Card tone="cream" className="p-5 text-center">
        <Pipi mood="surprised" size={130} />
        <h2 className="font-display text-xl font-extrabold">Speed Coding</h2>
        <p className="mx-auto mt-1 max-w-sm text-xs font-semibold text-ink/55">
          Jawab sebanyak mungkin soal output dalam 60 detik. Setiap jawaban benar menambah satu poin.
          Kejar minimal 8 poin untuk badge Speed Coder!
        </p>
        <Button size="md" variant="primary" className="mt-4" icon="play" onClick={start}>Mulai 60 Detik</Button>
        <button onClick={onExit} className="mt-2 block w-full text-[10px] font-extrabold text-ink/35 hover:text-ink/60">Kembali ke daftar game</button>
      </Card>
    )
  }

  if (phase === 'done' && result) {
    return (
      <GameResult
        headline={score >= 8 ? 'Kilat dan tepat!' : 'Kecepatan bisa dilatih!'}
        detail={`Kamu menjawab ${score} soal dengan benar dalam 60 detik.`}
        result={result}
        onReplay={start}
        onExit={onExit}
      />
    )
  }

  return (
    <div>
      <GameTop title="Speed Coding" icon="timer" onExit={onExit} progress={(timeLeft / 60) * 100} counter={`${timeLeft} detik • skor ${score}`} />
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <span className="rounded-full border-2 border-coral/40 bg-[#FFF1EC] px-2 py-1 font-display text-xs font-extrabold"><Icon name="clock" size={12} className="mr-1 inline" />{timeLeft}s</span>
          <button onClick={endNow} className="text-[10px] font-extrabold text-ink/35 hover:text-ink/60">Akhiri lebih awal</button>
        </div>
        <pre className="mt-3 overflow-x-auto rounded-xl border-2 border-ink/10 bg-[#0F2B20] px-3 py-3 font-mono text-[13px] leading-relaxed text-[#E9FFF1]">{q.code}</pre>
        <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
          {q.options.map((opt, i) => {
            const isPicked = picked === i
            const isAnswer = q.answer === i
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                disabled={picked !== null}
                className={cn(
                  'rounded-xl border-[3px] px-3 py-2 text-left text-xs font-bold transition',
                  picked === null && 'border-ink/10 bg-white hover:border-ink/30',
                  picked !== null && isAnswer && 'border-leaf bg-[#F3FFF7] text-leafDark',
                  picked !== null && isPicked && !isAnswer && 'border-coral bg-[#FFF3F0]',
                  picked !== null && !isPicked && !isAnswer && 'border-ink/5 bg-white/40 text-ink/30',
                )}
              >
                {opt}
              </button>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

export default function MiniGames() {
  const { save } = useGame()
  const [active, setActive] = useState<GameId | null>(null)
  if (!save) return null

  const exit = () => setActive(null)

  return (
    <div>
      <PageHeader title="Mini Games" subtitle="Latihan ringan untuk mata dan logikamu. Tiga ronde berhadiah per game setiap hari." icon="gamepad">
        <div className="flex gap-1.5">
          <Chip icon="trophy">{reputationTitle(save.xp)}</Chip>
          <Chip icon="timer">Speed best: {save.stats.speedBest}</Chip>
          <Chip icon="gamepad">{save.stats.gamesPlayed} ronde</Chip>
        </div>
      </PageHeader>

      {active === 'guess' && <GuessGame onExit={exit} />}
      {active === 'bug' && <BugGame onExit={exit} />}
      {active === 'puzzle' && <PuzzleGame onExit={exit} />}
      {active === 'speed' && <SpeedGame onExit={exit} />}

      {!active && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {GAMES.map((game) => (
              <Card key={game.id} hover className="relative overflow-hidden p-4">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full" style={{ backgroundColor: `${game.color}22` }} />
                <div className="relative flex items-start gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-[3px] border-ink" style={{ backgroundColor: game.color }}>
                    <Icon name={game.icon} size={22} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-lg font-extrabold leading-tight">{game.title}</h2>
                    <p className="mt-0.5 text-[11px] font-semibold leading-snug text-ink/55">{game.tagline}</p>
                  </div>
                </div>
                <div className="relative mt-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-ink/35">
                    {game.id === 'guess' ? '8 soal' : game.id === 'bug' ? '6 ronde' : game.id === 'puzzle' ? '4 puzzle' : '60 detik'}
                  </span>
                  <Button size="sm" variant="primary" icon="play" onClick={() => setActive(game.id)}>Mainkan</Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <Card tone="mint" className="p-4">
              <div className="flex items-center gap-2">
                <Icon name="bolt" size={16} className="text-leafDark" />
                <h3 className="font-display text-sm font-extrabold">Hadiah yang jujur</h3>
              </div>
              <p className="mt-1.5 text-[11px] font-semibold leading-relaxed text-ink/60">
                XP mini game ditentukan dari hasilmu. Tiga ronde pertama tiap game setiap hari memberi
                hadiah; setelah itu kamu tetap bisa bermain, tetapi XP tidak bertambah. Ini menjaga
                progres tetap bermakna.
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Chip icon="flame">Bug + daily quest</Chip>
                <Chip icon="trophy">Speed best untuk badge</Chip>
              </div>
            </Card>
            <PipiBubble mood="happy" size={58}>
              Jangan kejar skor sempurna. Kejar pola: baca kode perlahan, prediksi langkahnya, lalu
              cek. Setelah beberapa ronde, matamu akan otomatis melihat bug!
            </PipiBubble>
          </div>

          <div className="mt-4 rounded-2xl border-2 border-ink/10 bg-white/50 px-3 py-2 text-[10px] font-semibold leading-relaxed text-ink/40">
            Catatan: mini games tidak menjalankan kode Python dan tidak mengirim data ke mana pun. Semua
            soal dan pemeriksaan berjalan di perangkatmu.
          </div>
        </>
      )}
    </div>
  )
}
