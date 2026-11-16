import { useEffect, useRef, useState } from 'react'
import { useGame } from '../store/GameContext'
import { PLAYGROUND_TEMPLATES } from '../data/playground'
import { getPythonEngineStatus, pythonRunner, runPython, type RunResult } from '../lib/python'
import { sound } from '../lib/sound'
import { CodeEditor } from '../components/CodeEditor'
import { Pipi, PipiBubble } from '../components/Pipi'
import { Icon } from '../components/Icon'
import { Button, Card, Chip, PageHeader, cn } from '../components/ui'

type Engine = 'loading' | 'ready' | 'offline'

export default function Playground() {
  const { save, recordCodeRun, setScratch, setActivePlayground } = useGame()
  const [templateId, setTemplateId] = useState(() => {
    const id = save?.activePlayground
    return PLAYGROUND_TEMPLATES.some((t) => t.id === id) ? (id as string) : PLAYGROUND_TEMPLATES[0].id
  })
  const template = PLAYGROUND_TEMPLATES.find((t) => t.id === templateId) ?? PLAYGROUND_TEMPLATES[0]
  const [code, setCode] = useState(() => save?.scratchCode || template.code)
  const [stdin, setStdin] = useState(template.stdin ?? '')
  const [result, setResult] = useState<RunResult | null>(null)
  const [running, setRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const [engine, setEngine] = useState<Engine>(() => {
    const status = getPythonEngineStatus()
    return status.ready ? 'ready' : 'loading'
  })
  const debounceRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    let alive = true
    pythonRunner.preload().then((ok) => {
      if (alive) setEngine(ok ? 'ready' : 'offline')
    })
    return () => {
      alive = false
      window.clearTimeout(debounceRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateCode = (next: string) => {
    setCode(next)
    window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => setScratch(next), 500)
  }

  const selectTemplate = (id: string) => {
    const t = PLAYGROUND_TEMPLATES.find((item) => item.id === id)
    if (!t) return
    setTemplateId(id)
    setActivePlayground(id)
    updateCode(t.code)
    setStdin(t.stdin ?? '')
    setResult(null)
    sound.play('click')
  }

  const retryEngine = () => {
    setEngine('loading')
    pythonRunner.reset()
    pythonRunner.preload().then((ok) => setEngine(ok ? 'ready' : 'offline'))
  }

  const run = async () => {
    if (running) return
    if (!code.trim()) {
      setResult({ ok: false, output: '', error: 'Editor masih kosong. Tulis kode Python dulu, ya!', durationMs: 0 })
      return
    }
    setRunning(true)
    setResult(null)
    const res = await runPython(code, stdin)
    setResult(res)
    setRunning(false)
    if (res.ok) {
      recordCodeRun(true)
      sound.play('success')
    } else {
      sound.play('error')
    }
    if (res.offline) setEngine('offline')
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* ignore */
    }
  }

  const reset = () => {
    updateCode(template.code)
    setStdin(template.stdin ?? '')
    setResult(null)
    sound.play('click')
  }

  const clear = () => {
    updateCode('')
    setResult(null)
  }

  const statusColor = result ? (result.ok ? '#2FBF71' : '#FF8A7A') : running ? '#FFC93C' : '#6B8577'
  const statusText = running ? 'Menjalankan...' : result ? (result.ok ? 'Selesai tanpa error' : result.timedOut ? 'Dihentikan: timeout' : 'Error') : 'Siap menerima kode'

  return (
    <div>
      <PageHeader title="Code Playground" subtitle="Tulis, jalankan, dan eksperimen dengan Python asli langsung di browser." icon="terminal">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border-2 px-2.5 py-1 text-[10px] font-extrabold',
              engine === 'ready' ? 'border-leaf/40 bg-[#F3FFF7] text-leafDark' : engine === 'offline' ? 'border-coral/40 bg-[#FFF3F0] text-[#B3341F]' : 'border-sun/60 bg-[#FFF8DF] text-ink/60',
            )}
          >
            <span className={cn('h-2 w-2 rounded-full', engine === 'ready' ? 'bg-leaf animate-pulse' : engine === 'offline' ? 'bg-coral' : 'bg-sun animate-pulse')} />
            {engine === 'ready' ? 'Python siap' : engine === 'offline' ? 'Python belum termuat' : 'Menyiapkan Python...'}
          </span>
          {engine === 'offline' && (
            <button onClick={retryEngine} className="text-[10px] font-extrabold text-ink/45 underline decoration-dotted hover:text-ink">
              Coba lagi
            </button>
          )}
        </div>
      </PageHeader>

      <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
        {PLAYGROUND_TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => selectTemplate(t.id)}
            className={cn(
              'flex w-[168px] shrink-0 items-center gap-2 rounded-xl border-[3px] px-2.5 py-2 text-left transition',
              templateId === t.id ? 'border-ink bg-sun shadow-pop-sm' : 'border-ink/10 bg-white/60 hover:border-ink/25 hover:bg-white',
            )}
            aria-pressed={templateId === t.id}
          >
            <span className={cn('grid h-7 w-7 shrink-0 place-items-center rounded-lg border-2', templateId === t.id ? 'border-ink bg-white/60' : 'border-ink/15 bg-cream')}>
              <Icon name={t.icon} size={13} />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-[11px] font-extrabold">{t.name}</span>
              <span className="block truncate text-[9px] font-semibold text-ink/40">{t.description}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Chip icon="file">{template.name}</Chip>
              <span className="text-[10px] font-bold text-ink/35">Tersimpan otomatis</span>
            </div>
            <div className="flex gap-1">
              <button onClick={copy} className="inline-flex items-center gap-1 rounded-lg border-2 border-ink/10 bg-white/70 px-2 py-1 text-[10px] font-extrabold text-ink/55 hover:border-ink/25">
                <Icon name={copied ? 'check' : 'copy'} size={11} /> {copied ? 'Tersalin' : 'Salin'}
              </button>
              <button onClick={reset} className="inline-flex items-center gap-1 rounded-lg border-2 border-ink/10 bg-white/70 px-2 py-1 text-[10px] font-extrabold text-ink/55 hover:border-ink/25">
                <Icon name="refresh-cw" size={11} /> Reset contoh
              </button>
            </div>
          </div>

          <div onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); void run() } }}>
            <CodeEditor
              value={code}
              onChange={updateCode}
              minHeight={330}
              maxHeight={520}
              showLineNumbers={save?.settings.showLineNumbers ?? true}
            />
          </div>

          <div className="rounded-xl border-2 border-ink/10 bg-white/60 p-2">
            <label htmlFor="stdin" className="mb-1 flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wide text-ink/40">
              <Icon name="corner-down-left" size={11} /> Input (stdin) untuk input()
            </label>
            <input
              id="stdin"
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Contoh: Pipi&#10;12"
              className="w-full rounded-lg border-2 border-ink/10 bg-white px-2 py-1.5 font-mono text-[11px] text-ink/75 outline-none placeholder:text-ink/25 focus:border-grape"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <Button size="md" variant="primary" icon={running ? 'clock' : 'play'} onClick={run} disabled={running}>
              {running ? 'Menjalankan...' : 'Jalankan Kode'}
            </Button>
            <Button size="md" variant="secondary" icon="trash" onClick={clear}>Kosongkan</Button>
            <span className="ml-auto hidden text-[9px] font-bold text-ink/35 sm:block">Ctrl/Cmd + Enter untuk menjalankan</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border-[3px] border-ink bg-[#0F2B20] shadow-pop">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#14382A] px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: statusColor }} />
                <span className="font-mono text-[11px] font-semibold text-mint/70">console</span>
                <span className="font-mono text-[10px] text-mint/40">{statusText}</span>
              </div>
              <div className="flex items-center gap-2">
                {result && <span className="font-mono text-[10px] text-mint/40">{Math.round(result.durationMs)} ms</span>}
                <button onClick={() => setResult(null)} className="rounded-md border border-white/15 px-1.5 py-0.5 text-[9px] font-bold text-mint/60 hover:bg-white/10">
                  Bersihkan
                </button>
              </div>
            </div>
            <div className="min-h-[330px] max-h-[520px] overflow-auto p-3 font-mono text-[12px] leading-relaxed">
              {running ? (
                <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
                  <div className="animate-bob"><Pipi mood="thinking" size={92} /></div>
                  <p className="mt-2 text-[11px] font-bold text-mint/60">Python sedang bekerja...</p>
                  {engine !== 'ready' && (
                    <p className="mt-1 max-w-xs text-[10px] font-semibold text-mint/35">
                      Kunjungan pertama perlu mengunduh mesin Pyodide (beberapa MB). Setelah itu lebih cepat.
                    </p>
                  )}
                </div>
              ) : result ? (
                <div>
                  {result.output && (
                    <pre className="whitespace-pre-wrap break-words text-[#B9F5CE]">{result.output}</pre>
                  )}
                  {result.error && (
                    <pre className="mt-2 whitespace-pre-wrap break-words text-[#FFB3A8]">
                      {result.timedOut ? result.error : result.error.trim().split('\n').slice(-12).join('\n')}
                    </pre>
                  )}
                  {!result.output && !result.error && (
                    <p className="text-[11px] font-semibold italic text-mint/35">(Program selesai tanpa output. Tambahkan print() untuk melihat hasil.)</p>
                  )}
                </div>
              ) : (
                <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
                  <Icon name="terminal" size={34} className="text-mint/25" />
                  <p className="mt-2 text-[11px] font-bold text-mint/40">Output akan muncul di sini.</p>
                  <p className="mt-1 max-w-xs text-[10px] font-semibold text-mint/25">
                    Tekan "Jalankan Kode". Python berjalan di perangkatmu, bukan di server.
                  </p>
                </div>
              )}
            </div>
          </div>

          {result?.offline && (
            <div className="rounded-xl border-2 border-coral/40 bg-[#FFF3F0] px-3 py-2">
              <div className="flex items-center gap-1.5 font-display text-xs font-extrabold text-[#B3341F]">
                <Icon name="alert" size={13} /> Mesin Python belum siap
              </div>
              <p className="mt-0.5 text-[10px] font-semibold leading-relaxed text-ink/55">
                Pastikan kamu terhubung ke internet saat pertama kali membuka playground. Setelah termuat,
                Pyodide biasanya tersimpan di cache browser.
              </p>
              <Button size="sm" variant="secondary" className="mt-2" icon="refresh-cw" onClick={retryEngine}>Muat ulang mesin</Button>
            </div>
          )}

          <Card tone="cream" className="p-3">
            <div className="flex items-center gap-2">
              <Icon name="lightbulb" size={15} className="text-sunDark" />
              <h3 className="font-display text-xs font-extrabold">Cara membaca error</h3>
            </div>
            <ul className="mt-1.5 space-y-1 text-[10px] font-semibold leading-snug text-ink/55">
              <li className="flex gap-1.5"><Icon name="arrow-right" size={10} className="mt-0.5 shrink-0 text-ink/30" /> Baca baris terakhir traceback: di situ nama error ditulis.</li>
              <li className="flex gap-1.5"><Icon name="arrow-right" size={10} className="mt-0.5 shrink-0 text-ink/30" /> Lihat nomor baris kode yang ditunjuk, lalu cek kutip, kurung, titik dua, dan indentasi.</li>
              <li className="flex gap-1.5"><Icon name="arrow-right" size={10} className="mt-0.5 shrink-0 text-ink/30" /> Cetak nilai antara dengan print() untuk melihat isi variabel.</li>
            </ul>
          </Card>

          <PipiBubble mood="hint" size={52}>
            Eksperimen itu bagian dari belajar. Ubah satu hal kecil, jalankan lagi, dan perhatikan
            perbedaan output-nya. Kalau bingung, kirim kodenya ke Pipi Tutor.
          </PipiBubble>
        </div>
      </div>
    </div>
  )
}
