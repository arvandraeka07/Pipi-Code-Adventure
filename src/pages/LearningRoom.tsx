import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useGame } from '../store/GameContext'
import { findLevelById } from '../data/worlds'
import { isLevelUnlocked, nextLevelInWorld } from '../lib/progress'
import { levelGlobalIndex } from '../data/worlds'
import { scoreLabel } from '../lib/game'
import type { RewardSummary } from '../types'
import { checkChallenge, runPython, type ChallengeResult, type RunResult } from '../lib/python'
import { sound } from '../lib/sound'
import { CodeBlock, CodeEditor } from '../components/CodeEditor'
import { Pipi, PipiBubble } from '../components/Pipi'
import { Icon } from '../components/Icon'
import { Button, Card, Chip, ProgressBar, cn } from '../components/ui'

type Tab = 'materi' | 'tantangan' | 'kuis'

function MiniLab({ starter, stdin }: { starter: string; stdin?: string }) {
  const { save, recordCodeRun } = useGame()
  const [code, setCode] = useState(starter)
  const [result, setResult] = useState<RunResult | null>(null)
  const [running, setRunning] = useState(false)

  const run = async () => {
    if (running) return
    setRunning(true)
    const res = await runPython(code, stdin ?? '')
    setResult(res)
    setRunning(false)
    if (res.ok) recordCodeRun(true)
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-[3px] border-ink/10 bg-mint/40 px-3 py-2">
        <div className="flex items-center gap-2">
          <Icon name="terminal" size={16} />
          <span className="font-display text-xs font-extrabold">Laboratorium mini</span>
        </div>
        <span className="text-[10px] font-bold text-ink/45">Ubah kode lalu jalankan</span>
      </div>
      <div className="p-3">
        <CodeEditor
          value={code}
          onChange={setCode}
          minHeight={120}
          maxHeight={260}
          showLineNumbers={save?.settings.showLineNumbers ?? true}
        />
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <Button size="sm" variant="primary" icon={running ? 'clock' : 'play'} onClick={run} disabled={running}>
            {running ? 'Menjalankan...' : 'Jalankan'}
          </Button>
          <Button size="sm" variant="ghost" icon="refresh-cw" onClick={() => { setCode(starter); setResult(null) }}>
            Reset
          </Button>
          <span className="ml-auto text-[9px] font-bold text-ink/35">Python berjalan di browser-mu</span>
        </div>
        {result && (
          <div className={cn('mt-2 rounded-xl border-2 px-2.5 py-2', result.ok ? 'border-leaf/30 bg-[#F3FFF7]' : 'border-coral/40 bg-[#FFF3F0]')}>
            <div className="mb-1 flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wide text-ink/45">
              <Icon name={result.ok ? 'check' : 'alert'} size={11} /> Output
            </div>
            <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-ink/75">
              {result.error.trim() ? result.error.trim().split('\n').slice(-4).join('\n') : result.output || '(tidak ada output)'}
            </pre>
          </div>
        )}
      </div>
    </Card>
  )
}

export default function LearningRoom() {
  const { levelId } = useParams()
  const { save, solveChallenge, recordQuizAttempt, recordCodeRun, completeLesson, setLastLesson, notify } = useGame()
  const found = levelId ? findLevelById(levelId) : null

  const [tab, setTab] = useState<Tab>('materi')
  const [code, setCode] = useState(found?.level.challenge.starter ?? '')
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<ChallengeResult | null>(null)
  const [failed, setFailed] = useState(0)
  const [hint, setHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [quizIndex, setQuizIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [completedSummary, setCompletedSummary] = useState<RewardSummary | null>(null)

  const quiz = found?.level.quiz ?? []
  const correctCount = useMemo(
    () => quiz.filter((q) => answers[q.id] === q.answer).length,
    [quiz, answers],
  )
  const allAnswered = quiz.length > 0 && quiz.every((q) => answers[q.id] !== undefined)
  const scorePercent = quiz.length ? Math.round((correctCount / quiz.length) * 100) : 0

  if (!save) return null
  if (!found) return <Navigate to="/adventure" replace />
  const { world, level } = found
  if (!isLevelUnlocked(save, world, level)) return <Navigate to={`/world/${world.id}`} replace />

  const solved = Boolean(save.solvedChallenges[level.id])
  const completed = Boolean(save.completedLevels[level.id])
  const next = nextLevelInWorld(world, level.id)
  const missionNumber = levelGlobalIndex(level.id) + 1
  const input = level.challenge.stdin

  const startLesson = () => {
    if (save.lastLesson !== level.id) setLastLesson(level.id)
  }

  const runChallenge = async () => {
    if (running) return
    startLesson()
    setRunning(true)
    const res = await runPython(code, input ?? '')
    setResult({
      passed: false,
      output: res.output,
      error: res.error,
      message: res.ok ? 'Kode berjalan. Bandingkan output-nya, lalu tekan Periksa.' : res.error,
    })
    setRunning(false)
    if (res.ok) recordCodeRun(true)
  }

  const check = async () => {
    if (running) return
    startLesson()
    setRunning(true)
    const res = await checkChallenge(level.challenge, code)
    setResult(res)
    setRunning(false)
    if (res.passed) {
      sound.play('success')
      if (!save.solvedChallenges[level.id]) {
        solveChallenge(world.id, level.id)
      }
      recordCodeRun(true)
    } else {
      setFailed((n) => n + 1)
      sound.play('error')
    }
  }

  const chooseOption = (questionId: string, index: number) => {
    if (answers[questionId] !== undefined) return
    const q = quiz.find((item) => item.id === questionId)
    if (!q) return
    setAnswers((prev) => ({ ...prev, [questionId]: index }))
    const isCorrect = index === q.answer
    recordQuizAttempt(isCorrect ? 1 : 0, 1)
    if (isCorrect) sound.play('coin')
    else sound.play('error')
    startLesson()
  }

  const finish = () => {
    if (!solved) {
      setTab('tantangan')
      notify('info', 'Selesaikan tantangan dulu', 'Lolos tantangan kode adalah syarat untuk menuntaskan misi.')
      return
    }
    const summary = completeLesson(world.id, level.id, scorePercent)
    setCompletedSummary(summary)
    if (summary.reason === 'already') {
      notify('info', 'Misi ini sudah selesai', 'Hadiah hanya diberikan sekali. Kamu bisa mengulang untuk latihan.')
    }
  }

  const tabDone: Record<Tab, boolean> = {
    materi: true,
    tantangan: solved,
    kuis: allAnswered,
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-1.5 text-[11px] font-extrabold text-ink/45">
        <Link to="/adventure" className="hover:text-ink">Peta</Link>
        <Icon name="chevron-right" size={10} />
        <Link to={`/world/${world.id}`} className="hover:text-ink">{world.name}</Link>
        <Icon name="chevron-right" size={10} />
        <span className="text-ink/70">Misi #{missionNumber}</span>
      </div>

      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border-[3px] border-ink shadow-pop-sm" style={{ backgroundColor: world.palette.accent }}>
            <Icon name={level.icon} size={26} />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <Chip icon="map">{world.name}</Chip>
              <Chip icon="clock">{level.minutes} menit</Chip>
              {completed && <Chip icon="check" className="border-leaf/40 bg-leaf/10">Selesai</Chip>}
            </div>
            <h1 className="mt-1 font-display text-2xl font-extrabold leading-tight sm:text-3xl">{level.title}</h1>
            <p className="mt-0.5 max-w-2xl text-xs font-semibold leading-relaxed text-ink/55">{level.summary}</p>
          </div>
        </div>
        <div className="flex gap-1.5 rounded-2xl border-[3px] border-ink/10 bg-white/60 p-1">
          {(
            [
              ['materi', 'Materi', 'book'],
              ['tantangan', 'Tantangan', 'terminal'],
              ['kuis', 'Kuis', 'lightbulb'],
            ] as const
          ).map(([id, label, icon]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-extrabold transition',
                tab === id ? 'border-2 border-ink bg-sun shadow-pop-sm' : 'text-ink/50 hover:bg-white',
              )}
              aria-current={tab === id ? 'step' : undefined}
            >
              <Icon name={icon} size={13} />
              <span className="hidden sm:inline">{label}</span>
              {tabDone[id] && <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-leaf text-white"><Icon name="check" size={9} /></span>}
            </button>
          ))}
        </div>
      </div>

      {completed && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border-2 border-leaf/40 bg-[#F3FFF7] px-3 py-2 text-[11px] font-bold text-leafDark">
          <Icon name="check" size={14} />
          Misi ini sudah selesai. Hadiah utama sudah kamu terima; mengulang tetap bagus untuk latihan.
          {next && <Link to={`/lesson/${next.id}`} className="ml-auto inline-flex items-center gap-1 rounded-lg border-2 border-leaf/40 bg-white px-2 py-1 font-extrabold hover:border-leaf">Misi berikutnya <Icon name="arrow-right" size={11} /></Link>}
        </div>
      )}

      {tab === 'materi' && (
        <div className="grid gap-4 lg:grid-cols-[1fr_290px]">
          <div className="space-y-4">
            <Card className="p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg border-2 border-ink bg-mint"><Icon name="compass" size={15} /></span>
                <h2 className="font-display text-base font-extrabold">Kenalan dengan misi ini</h2>
              </div>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-ink/65">{level.intro}</p>
            </Card>

            {level.sections.map((section, i) => (
              <Card key={section.heading} className="p-4 sm:p-5">
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border-2 border-ink bg-sun font-display text-[11px] font-extrabold">{i + 1}</span>
                  <h2 className="font-display text-base font-extrabold leading-snug sm:text-lg">{section.heading}</h2>
                </div>
                <div className="mt-2 space-y-2">
                  {section.body.map((p, j) => (
                    <p key={j} className="text-sm font-semibold leading-relaxed text-ink/65">{p}</p>
                  ))}
                </div>
                {section.code && (
                  <div className="mt-3">
                    <CodeBlock code={section.code.code} title={section.code.title} lines={section.code.lines} output={section.code.output} />
                  </div>
                )}
                {section.tip && (
                  <div className="mt-3 flex gap-2 rounded-xl border-2 border-sun/60 bg-[#FFF8DF] px-3 py-2">
                    <Icon name="lightbulb" size={16} className="mt-0.5 shrink-0 text-sunDark" />
                    <p className="text-[11px] font-bold leading-relaxed text-ink/65">{section.tip}</p>
                  </div>
                )}
              </Card>
            ))}

            <MiniLab starter={level.playground.starter} stdin={level.playground.stdin} />

            <div className="flex flex-wrap items-center justify-between gap-2">
              <Link to={`/world/${world.id}`}>
                <Button size="sm" variant="secondary" icon="arrow-left">Kembali ke dunia</Button>
              </Link>
              <Button size="sm" variant="primary" iconRight="arrow-right" onClick={() => setTab('tantangan')}>
                Aku siap praktik
              </Button>
            </div>
          </div>

          <aside className="space-y-4">
            <Card tone="cream" className="p-4">
              <h3 className="font-display text-sm font-extrabold">Yang kamu pelajari</h3>
              <ul className="mt-2 space-y-1.5">
                {level.sections.map((s) => (
                  <li key={s.heading} className="flex gap-1.5 text-[11px] font-semibold leading-snug text-ink/60">
                    <Icon name="arrow-right" size={11} className="mt-0.5 shrink-0 text-ink/30" />
                    {s.heading}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg border-2 border-ink bg-grape"><Icon name="book" size={15} /></span>
                <h3 className="font-display text-sm font-extrabold">Rujukan</h3>
              </div>
              <div className="mt-2 space-y-1.5">
                {level.sources.map((s) => (
                  <a key={s.url} href={s.url} target="_blank" rel="noreferrer noopener" className="flex items-center gap-1.5 rounded-lg border-2 border-ink/10 bg-white/60 px-2 py-1.5 text-[10px] font-bold text-ink/60 hover:border-ink/25 hover:text-ink">
                    <span className="flex-1 truncate">{s.label}</span>
                    <Icon name="external" size={10} className="shrink-0 text-ink/30" />
                  </a>
                ))}
              </div>
            </Card>

            <PipiBubble mood="happy" size={56}>
              Baca pelan-pelan. Kalau ada baris kode yang belum jelas, buka Pipi Tutor dan tanyakan
              bagian itu. Tidak perlu langsung hafal!
            </PipiBubble>
          </aside>
        </div>
      )}

      {tab === 'tantangan' && (
        <div className="grid gap-4 lg:grid-cols-[1fr_290px]">
          <div className="space-y-3">
            <Card className="p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg border-2 border-ink bg-sun"><Icon name="target" size={16} /></span>
                  <h2 className="font-display text-base font-extrabold">Tantangan coding</h2>
                </div>
                {solved && <Chip icon="check" className="border-leaf/40 bg-leaf/10">Tantangan lolos</Chip>}
              </div>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-ink/65">{level.challenge.prompt}</p>
              {level.challenge.check === 'output' && level.challenge.expected && (
                <div className="mt-3">
                  <div className="mb-1 text-[9px] font-extrabold uppercase tracking-wide text-ink/40">Output yang diharapkan</div>
                  <pre className="overflow-x-auto rounded-xl border-2 border-ink/10 bg-[#0F2B20] px-3 py-2 font-mono text-[11px] text-[#B9F5CE]">{level.challenge.expected}</pre>
                </div>
              )}
              {input && (
                <div className="mt-2 rounded-xl border-2 border-grape/40 bg-[#F7F2FF] px-2.5 py-1.5 text-[10px] font-bold text-ink/55">
                  Input yang diberikan saat pemeriksaan: <code className="rounded bg-white px-1 font-mono text-[10px]">{input}</code>
                </div>
              )}
              {level.challenge.check === 'tests' && (
                <p className="mt-2 text-[10px] font-bold text-ink/40">Pemeriksaan otomatis akan dijalankan setelah kode-mu, memakai nama variabel dan function sesuai instruksi.</p>
              )}
            </Card>

            <Card className="overflow-hidden">
              <div className="p-3">
                <div onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); void check() } }}>
                  <CodeEditor
                    value={code}
                    onChange={setCode}
                    minHeight={210}
                    maxHeight={430}
                    showLineNumbers={save.settings.showLineNumbers}
                  />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <Button size="sm" variant="primary" icon={running ? 'clock' : 'check'} onClick={check} disabled={running}>
                    {running ? 'Memeriksa...' : 'Periksa Jawaban'}
                  </Button>
                  <Button size="sm" variant="secondary" icon="play" onClick={runChallenge} disabled={running}>
                    Jalankan saja
                  </Button>
                  <Button size="sm" variant="ghost" icon="refresh-cw" onClick={() => { setCode(level.challenge.starter); setResult(null) }}>
                    Reset
                  </Button>
                  <button
                    onClick={() => setHint(true)}
                    className="ml-auto inline-flex items-center gap-1 rounded-lg border-2 border-sun/60 bg-[#FFF8DF] px-2 py-1 text-[10px] font-extrabold text-ink/60 hover:border-sun"
                  >
                    <Icon name="lightbulb" size={11} /> Petunjuk Pipi
                  </button>
                </div>
                <p className="mt-1 text-[9px] font-semibold text-ink/35">Tip: Ctrl/Cmd + Enter untuk memeriksa.</p>
              </div>

              {result && (
                <div className={cn('border-t-[3px] px-3 py-2.5', result.passed ? 'border-leaf/30 bg-[#F3FFF7]' : 'border-coral/30 bg-[#FFF3F0]')}>
                  <div className="flex items-center gap-1.5">
                    <span className={cn('grid h-6 w-6 place-items-center rounded-full border-2 border-ink', result.passed ? 'bg-leaf text-white' : 'bg-coral')}>
                      <Icon name={result.passed ? 'check' : 'alert'} size={12} />
                    </span>
                    <span className="font-display text-xs font-extrabold">{result.passed ? 'Berhasil!' : 'Belum tepat'}</span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-[11px] font-semibold leading-relaxed text-ink/65">{result.message}</p>
                  {(result.output || result.error) && (
                    <pre className="mt-1.5 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-ink/10 bg-white/70 px-2 py-1.5 font-mono text-[10px] leading-relaxed text-ink/65">
                      {result.error.trim() ? result.error.trim().split('\n').slice(-6).join('\n') : result.output}
                    </pre>
                  )}
                  {result.passed && (
                    <button onClick={() => setTab('kuis')} className="mt-2 inline-flex items-center gap-1 rounded-xl border-2 border-ink bg-sun px-2.5 py-1.5 text-[10px] font-extrabold shadow-pop-sm active:translate-y-0.5">
                      Lanjut ke kuis <Icon name="arrow-right" size={11} />
                    </button>
                  )}
                </div>
              )}
            </Card>

            {hint && (
              <div className="flex gap-2 rounded-2xl border-[3px] border-sun/60 bg-[#FFF8DF] p-3">
                <Pipi mood="hint" size={58} />
                <div>
                  <div className="font-display text-xs font-extrabold text-ink/75">Petunjuk dari Pipi</div>
                  <p className="mt-0.5 text-[11px] font-semibold leading-relaxed text-ink/60">{level.challenge.hint}</p>
                </div>
              </div>
            )}

            {failed >= 2 && !showSolution && (
              <button onClick={() => setShowSolution(true)} className="text-[10px] font-extrabold text-ink/40 underline decoration-dotted hover:text-ink/70">
                Sudah dua kali belum tepat? Lihat solusi (coba dulu sendiri, ya)
              </button>
            )}
            {showSolution && (
              <div className="rounded-2xl border-[3px] border-ink/15 bg-white/70 p-3">
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wide text-ink/45">
                  <Icon name="eye" size={12} /> Solusi referensi
                </div>
                <pre className="mt-1.5 overflow-x-auto rounded-xl bg-[#0F2B20] px-3 py-2 font-mono text-[11px] text-[#B9F5CE]">{level.challenge.solution}</pre>
                <div className="mt-2 flex gap-1.5">
                  <Button size="sm" variant="secondary" icon="copy" onClick={() => setCode(level.challenge.solution)}>Isi ke editor</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowSolution(false)}>Tutup</Button>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <Card tone="mint" className="p-4">
              <h3 className="font-display text-sm font-extrabold">Cara memeriksa</h3>
              <p className="mt-1.5 text-[11px] font-semibold leading-relaxed text-ink/60">
                {level.challenge.check === 'output'
                  ? 'Pipi menjalankan kodemu di Python asli dan membandingkan output dengan jawaban yang diharapkan. Spasi di akhir baris tidak dihitung.'
                  : 'Pipi menambahkan pemeriksaan otomatis setelah kodemu. Jangan hapus atau ubah nama variabel yang diminta.'}
              </p>
              <div className="mt-2 rounded-lg bg-white/60 px-2 py-1.5 text-[10px] font-bold text-ink/45">
                Hadiah tantangan: +30 XP • +10 koin (sekali)
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Pipi mood={solved ? 'celebrate' : 'thinking'} size={54} />
                <div>
                  <div className="font-display text-xs font-extrabold">{solved ? 'Kerja bagus!' : 'Tetap tenang'}</div>
                  <p className="text-[10px] font-semibold leading-snug text-ink/50">
                    {solved ? 'Tantangan lolos. Lanjut ke kuis untuk menuntaskan misi.' : 'Baca error dari baris paling bawah. Sering kali masalahnya kecil.'}
                  </p>
                </div>
              </div>
              {solved && (
                <Button size="sm" variant="primary" className="mt-2 w-full" iconRight="arrow-right" onClick={() => setTab('kuis')}>
                  Buka kuis
                </Button>
              )}
            </Card>
            <div className="flex flex-wrap gap-1.5">
              <Button size="sm" variant="ghost" icon="arrow-left" onClick={() => setTab('materi')}>Materi</Button>
              <Button size="sm" variant="ghost" iconRight="arrow-right" onClick={() => setTab('kuis')}>Kuis</Button>
            </div>
          </aside>
        </div>
      )}

      {tab === 'kuis' && (
        <div className="grid gap-4 lg:grid-cols-[1fr_290px]">
          <div>
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between gap-2 border-b-[3px] border-ink/10 bg-[#F4EEFF] px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg border-2 border-ink bg-grape"><Icon name="lightbulb" size={14} /></span>
                  <span className="font-display text-xs font-extrabold">Kuis pemahaman</span>
                </div>
                <span className="text-[10px] font-extrabold text-ink/45">
                  {Object.keys(answers).length}/{quiz.length} dijawab
                </span>
              </div>

              {!showResults ? (
                <div className="p-4 sm:p-5">
                  <ProgressBar value={((quizIndex + 1) / quiz.length) * 100} height={7} className="mb-4" />
                  {(() => {
                    const q = quiz[Math.min(quizIndex, quiz.length - 1)]
                    const chosen = answers[q.id]
                    const answered = chosen !== undefined
                    const correct = chosen === q.answer
                    return (
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="rounded-full border-2 border-ink/15 bg-white px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-ink/45">
                            Soal {quizIndex + 1} dari {quiz.length}
                          </span>
                          <span className="rounded-full border-2 border-grape/30 bg-[#F7F2FF] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-grapeDark">
                            {q.kind === 'mc' ? 'Pilihan ganda' : q.kind === 'output' ? 'Prediksi output' : q.kind === 'fill' ? 'Isi bagian kosong' : 'Perbaiki kode'}
                          </span>
                        </div>
                        <h2 className="mt-2 font-display text-lg font-extrabold leading-snug">{q.question}</h2>
                        {q.code && (
                          <div className="mt-2">
                            <CodeBlock code={q.code} title="Kode" compact />
                          </div>
                        )}
                        <div className="mt-3 space-y-1.5">
                          {q.options.map((option, i) => {
                            const isChosen = chosen === i
                            const isAnswer = q.answer === i
                            return (
                              <button
                                key={i}
                                onClick={() => chooseOption(q.id, i)}
                                disabled={answered}
                                className={cn(
                                  'flex w-full items-center gap-2.5 rounded-xl border-[3px] px-3 py-2 text-left text-xs font-bold transition',
                                  !answered && 'border-ink/10 bg-white hover:border-ink/30 hover:bg-cream',
                                  answered && isAnswer && 'border-leaf bg-[#F3FFF7] text-leafDark',
                                  answered && isChosen && !isAnswer && 'border-coral bg-[#FFF3F0] text-[#B3341F]',
                                  answered && !isChosen && !isAnswer && 'border-ink/5 bg-white/40 text-ink/35',
                                )}
                              >
                                <span className={cn('grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2 font-display text-[10px] font-extrabold', answered && isAnswer ? 'border-leaf bg-leaf text-white' : answered && isChosen ? 'border-coral bg-coral' : 'border-ink/15 bg-cream')}>
                                  {answered && isAnswer ? '✓' : answered && isChosen ? '×' : String.fromCharCode(65 + i)}
                                </span>
                                <span className="flex-1">{option}</span>
                              </button>
                            )
                          })}
                        </div>
                        {answered && (
                          <div className={cn('mt-3 rounded-xl border-2 px-3 py-2', correct ? 'border-leaf/40 bg-[#F3FFF7]' : 'border-coral/30 bg-[#FFF3F0]')}>
                            <div className="flex items-center gap-1.5 font-display text-xs font-extrabold">
                              <Icon name={correct ? 'check' : 'alert'} size={13} />
                              {correct ? 'Tepat sekali!' : 'Belum tepat'}
                            </div>
                            <p className="mt-1 text-[11px] font-semibold leading-relaxed text-ink/65">{q.explanation}</p>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-[10px] font-bold text-ink/40">
                                {correct ? 'Jawaban benar tercatat untuk daily quest.' : 'Baca penjelasannya, lalu lanjut. Kamu bisa mengulang kuis nanti.'}
                              </span>
                              <Button
                                size="sm"
                                variant={correct ? 'primary' : 'secondary'}
                                iconRight="arrow-right"
                                onClick={() => {
                                  setHint(false)
                                  if (quizIndex >= quiz.length - 1) setShowResults(true)
                                  else setQuizIndex((n) => n + 1)
                                }}
                              >
                                {quizIndex >= quiz.length - 1 ? 'Lihat hasil' : 'Soal berikutnya'}
                              </Button>
                            </div>
                          </div>
                        )}
                        {!answered && (
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <button onClick={() => setHint(true)} className="inline-flex items-center gap-1 text-[10px] font-extrabold text-ink/40 hover:text-ink/70">
                              <Icon name="lightbulb" size={11} /> Butuh petunjuk?
                            </button>
                            <span className="text-[10px] font-bold text-ink/35">Pilih satu jawaban</span>
                          </div>
                        )}
                        {hint && !answered && (
                          <div className="mt-2 flex gap-2 rounded-xl border-2 border-sun/50 bg-[#FFF8DF] px-2.5 py-2">
                            <Icon name="hint" size={14} className="mt-0.5 shrink-0 text-sunDark" />
                            <p className="text-[10px] font-bold leading-relaxed text-ink/60">{q.hint}</p>
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              ) : (
                <div className="p-5 text-center">
                  <Pipi mood={scorePercent >= 70 ? 'celebrate' : 'hint'} size={130} />
                  <h2 className="mt-1 font-display text-xl font-extrabold">{scoreLabel(scorePercent).label}</h2>
                  <p className="text-sm font-semibold text-ink/55">
                    Skor kuis: <span className="font-extrabold text-ink">{correctCount}/{quiz.length}</span> ({scorePercent}%)
                  </p>
                  <div className="mx-auto mt-2 max-w-sm">
                    <ProgressBar value={scorePercent} height={11} color={scorePercent >= 70 ? '#2FBF71' : '#FFC93C'} />
                  </div>

                  {!solved ? (
                    <div className="mx-auto mt-4 max-w-md rounded-2xl border-2 border-coral/40 bg-[#FFF3F0] p-3">
                      <div className="font-display text-sm font-extrabold">Satu langkah tersisa</div>
                      <p className="mt-0.5 text-[11px] font-semibold text-ink/60">
                        Tantangan kode belum lolos. Selesaikan tantangan agar misi bisa dituntaskan dan hadiah diberikan.
                      </p>
                      <Button size="sm" variant="primary" className="mt-2" icon="terminal" onClick={() => setTab('tantangan')}>
                        Ke tantangan
                      </Button>
                    </div>
                  ) : completed || completedSummary ? (
                    <div className="mx-auto mt-4 max-w-md rounded-2xl border-2 border-leaf/40 bg-[#F3FFF7] p-3">
                      <div className="flex items-center justify-center gap-1.5 font-display text-sm font-extrabold text-leafDark">
                        <Icon name="check" size={15} /> Misi tuntas!
                      </div>
                      <p className="mt-0.5 text-[11px] font-semibold text-ink/60">
                        {completedSummary?.awarded
                          ? `Kamu menerima +${completedSummary.xp} XP dan +${completedSummary.coins} koin.`
                          : 'Hadiah misi ini sudah pernah kamu terima. Ulangi kapan saja untuk latihan.'}
                      </p>
                      <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                        {next ? (
                          <Link to={`/lesson/${next.id}`}><Button size="sm" variant="primary" iconRight="arrow-right">Misi berikutnya</Button></Link>
                        ) : (
                          <Link to={`/boss/${world.id}`}><Button size="sm" variant="danger" icon="sword">Lawan boss dunia</Button></Link>
                        )}
                        <Link to={`/world/${world.id}`}><Button size="sm" variant="secondary" icon="map">Kembali ke dunia</Button></Link>
                      </div>
                    </div>
                  ) : (
                    <div className="mx-auto mt-4 max-w-md">
                      <Button size="md" variant="sun" icon="trophy" onClick={finish} className="w-full">
                        Klaim hadiah & selesaikan misi
                      </Button>
                      <p className="mt-1 text-[10px] font-semibold text-ink/40">Hadiah: +{level.rewards.xp} XP dan +{level.rewards.coins} koin (sekali per misi).</p>
                    </div>
                  )}

                  <button
                    onClick={() => { setAnswers({}); setQuizIndex(0); setShowResults(false); setHint(false) }}
                    className="mt-3 inline-flex items-center gap-1 text-[10px] font-extrabold text-ink/40 hover:text-ink/70"
                  >
                    <Icon name="refresh-cw" size={11} /> Ulangi kuis
                  </button>
                </div>
              )}
            </Card>
          </div>

          <aside className="space-y-4">
            <Card tone="cream" className="p-4">
              <h3 className="font-display text-sm font-extrabold">Status misi</h3>
              <ul className="mt-2 space-y-2">
                <li className="flex items-center gap-2 text-[11px] font-bold">
                  <span className="grid h-5 w-5 place-items-center rounded-full border-2 border-ink bg-leaf text-white"><Icon name="check" size={10} /></span>
                  Materi dibaca
                </li>
                <li className="flex items-center gap-2 text-[11px] font-bold">
                  <span className={cn('grid h-5 w-5 place-items-center rounded-full border-2 border-ink', solved ? 'bg-leaf text-white' : 'bg-white/60')}>
                    <Icon name={solved ? 'check' : 'terminal'} size={10} />
                  </span>
                  Tantangan {solved ? 'lolos' : 'belum lolos'}
                </li>
                <li className="flex items-center gap-2 text-[11px] font-bold">
                  <span className={cn('grid h-5 w-5 place-items-center rounded-full border-2 border-ink', allAnswered ? 'bg-leaf text-white' : 'bg-white/60')}>
                    <Icon name={allAnswered ? 'check' : 'lightbulb'} size={10} />
                  </span>
                  Kuis {allAnswered ? `${correctCount}/${quiz.length} benar` : 'belum selesai'}
                </li>
                <li className="flex items-center gap-2 text-[11px] font-bold">
                  <span className={cn('grid h-5 w-5 place-items-center rounded-full border-2 border-ink', completed ? 'bg-leaf text-white' : 'bg-white/60')}>
                    <Icon name={completed ? 'check' : 'trophy'} size={10} />
                  </span>
                  Hadiah misi {completed ? 'diterima' : 'belum diklaim'}
                </li>
              </ul>
            </Card>
            <Card className="p-4">
              <h3 className="font-display text-sm font-extrabold">Setelah ini</h3>
              <p className="mt-1 text-[11px] font-semibold leading-relaxed text-ink/55">
                {next
                  ? `Misi berikutnya: ${next.title}. Selesaikan misi ini dulu untuk membukanya.`
                  : `Ini misi terakhir di ${world.name}. Setelah tuntas, gerbang boss akan terbuka.`}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] font-extrabold text-ink/40">
                <Icon name="bolt" size={11} /> +{level.rewards.xp} XP
                <Icon name="coin" size={11} /> +{level.rewards.coins}
              </div>
            </Card>
            <PipiBubble mood={allAnswered ? 'happy' : 'thinking'} size={54}>
              {allAnswered
                ? 'Kuis selesai! Kalau tantangan sudah lolos, klaim hadiahmu. Kalau belum, tidak apa-apa — kembali ke tantangan dan coba lagi.'
                : 'Kuis menguji pemahaman, bukan kecepatan. Baca semua pilihan sebelum memilih, dan pelajari penjelasan tiap jawaban.'}
            </PipiBubble>
          </aside>
        </div>
      )}
    </div>
  )
}
