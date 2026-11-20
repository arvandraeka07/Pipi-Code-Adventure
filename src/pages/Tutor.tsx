import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import type { ChatMessage } from '../types'
import { useGame } from '../store/GameContext'
import { QUICK_PROMPTS } from '../data/tutorKnowledge'
import { TUTOR_ENDPOINT, askTutorBackend, tutorReply } from '../lib/tutor'
import { runPython } from '../lib/python'
import { newId } from '../lib/storage'
import { Pipi } from '../components/Pipi'
import { CodeBlock } from '../components/CodeEditor'
import { Icon } from '../components/Icon'
import { Button, Card, Chip, Modal, PageHeader, cn } from '../components/ui'

function MessageBody({ text }: { text: string }) {
  const parts: { type: 'text' | 'code'; value: string }[] = []
  const regex = /```(?:python|py)?\s*([\s\S]*?)```/gi
  let last = 0
  let match: RegExpExecArray | null
  while ((match = regex.exec(text))) {
    if (match.index > last) parts.push({ type: 'text', value: text.slice(last, match.index) })
    parts.push({ type: 'code', value: match[1].trim() })
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push({ type: 'text', value: text.slice(last) })

  return (
    <div className="space-y-2">
      {parts.map((part, i) =>
        part.type === 'code' ? (
          <CodeBlock key={i} code={part.value} title="Kode dari percakapan" compact />
        ) : (
          <p key={i} className="whitespace-pre-wrap break-words">{part.value}</p>
        ),
      )}
    </div>
  )
}

function TypingBubble() {
  return (
    <div className="flex items-start gap-2">
      <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-ink bg-mint">
        <Pipi mood="thinking" size={34} />
      </span>
      <div className="mt-1 flex items-center gap-1 rounded-2xl rounded-tl-md border-2 border-ink/10 bg-surface px-3 py-2">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/40 [animation-delay:-0.2s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/40 [animation-delay:-0.1s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/40" />
        <span className="ml-1 text-[10px] font-bold text-ink/35">Pipi sedang mengetik</span>
      </div>
    </div>
  )
}

export default function Tutor() {
  const { save, level, addChatMessage, clearChat, notify } = useGame()
  const [messages, setMessages] = useState<ChatMessage[]>(save?.tutorHistory ?? [])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, busy])

  if (!save) return null

  const send = async (raw?: string) => {
    const text = (raw ?? input).trim()
    if (!text || busy) return
    const userMessage: ChatMessage = {
      id: newId(),
      role: 'user',
      text,
      at: new Date().toISOString(),
    }
    const history = messages.slice(-8).map((m) => ({ role: m.role, text: m.text }))
    setMessages((prev) => [...prev, userMessage])
    addChatMessage(userMessage)
    setInput('')
    setBusy(true)
    try {
      const backend = await askTutorBackend(text, level, history)
      const reply =
        backend ??
        (await tutorReply(text, level, async (code) => {
          const result = await runPython(code)
          return { ok: result.ok, output: result.output, error: result.error }
        }))
      const pipiMessage: ChatMessage = {
        id: newId(),
        role: 'pipi',
        text: reply,
        at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, pipiMessage])
      addChatMessage(pipiMessage)
    } catch {
      const errorMessage: ChatMessage = {
        id: newId(),
        role: 'pipi',
        text: 'Aduh, ada gangguan saat aku menyiapkan jawaban. Coba kirim pesanmu lagi, ya. Kalau kamu menempelkan kode, pastikan formatnya tetap di dalam blok ```python ... ```.',
        at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
      addChatMessage(errorMessage)
    } finally {
      setBusy(false)
      inputRef.current?.focus()
    }
  }

  const doClear = () => {
    setMessages([])
    clearChat()
    setConfirmClear(false)
    notify('info', 'Riwayat tutor dibersihkan', 'Percakapan baru dimulai. Pipi tetap di sini!')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void send()
    }
  }

  return (
    <div>
      <PageHeader title="Pipi Tutor" subtitle="Tanya konsep Python, minta petunjuk, atau periksa kodemu." icon="chat">
        <div className="flex items-center gap-2">
          <Chip icon="bot" color={TUTOR_ENDPOINT ? '#159A55' : '#8266E6'}>
            {TUTOR_ENDPOINT ? 'Tutor backend aktif' : 'Tutor lokal aktif'}
          </Chip>
          {messages.length > 0 && (
            <Button size="sm" variant="ghost" icon="trash" onClick={() => setConfirmClear(true)}>Hapus riwayat</Button>
          )}
        </div>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="flex h-[calc(100vh-190px)] min-h-[480px] flex-col overflow-hidden p-0" tone="paper">
          <div className="flex items-center gap-2 border-b-[3px] border-ink/10 bg-mint/50 px-3 py-2">
            <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-ink bg-surface">
              <Pipi mood={busy ? 'thinking' : 'happy'} size={38} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-display text-sm font-extrabold leading-tight">Pipi</div>
              <div className="flex items-center gap-1 text-[9px] font-bold text-ink/45">
                <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
                {busy ? 'sedang berpikir...' : 'siap membantu belajar Python'}
              </div>
            </div>
            <span className="hidden rounded-full border-2 border-ink/10 bg-surface/70 px-2 py-0.5 text-[9px] font-bold text-ink/40 sm:block">
              Level {level}
            </span>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3 sm:p-4" aria-live="polite">
            {messages.length === 0 && (
              <div className="mx-auto mt-4 max-w-md text-center">
                <Pipi mood="happy" size={120} className="mx-auto" animate />
                <h2 className="mt-1 font-display text-lg font-extrabold">Halo! Aku Pipi.</h2>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-ink/55">
                  Aku bisa menjelaskan konsep, memberi petunjuk saat kode error, dan membuat latihan kecil.
                  Tempelkan kode di antara <span className="rounded bg-ink/5 px-1 font-mono">```python</span> agar aku bisa memeriksanya.
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {QUICK_PROMPTS.slice(0, 4).map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => void send(prompt)}
                      className="min-h-11 rounded-full border-2 border-ink/15 bg-surface px-3 py-1 text-[10px] font-extrabold text-ink/65 transition hover:border-ink/30 hover:bg-sun/40"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => {
              const mine = message.role === 'user'
              return (
                <div key={message.id} className={cn('flex items-start gap-2', mine && 'flex-row-reverse')}>
                  {mine ? (
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-ink bg-grape/50">
                      <Icon name="user" size={15} />
                    </span>
                  ) : (
                    <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-ink bg-mint">
                      <Pipi mood="happy" size={34} />
                    </span>
                  )}
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl border-2 px-3 py-2 text-[12px] font-semibold leading-relaxed shadow-sm sm:max-w-[78%]',
                      mine
                        ? 'rounded-tr-md border-ink bg-leaf text-white'
                        : 'rounded-tl-md border-ink/10 bg-surface text-ink',
                    )}
                  >
                    {mine ? <p className="whitespace-pre-wrap break-words">{message.text}</p> : <MessageBody text={message.text} />}
                    <div className={cn('mt-1 text-right text-[8px] font-bold', mine ? 'text-white/60' : 'text-ink/30')}>
                      {new Date(message.at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              )
            })}

            {busy && <TypingBubble />}
          </div>

          <div className="border-t-[3px] border-ink/10 bg-surface/60 p-2.5">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={2}
                placeholder="Tulis pertanyaanmu... (Enter untuk kirim, Shift+Enter baris baru)"
                className="max-h-32 min-h-[46px] flex-1 resize-y rounded-xl border-2 border-ink/20 bg-surface px-3 py-2 text-[12px] font-semibold text-ink outline-none transition placeholder:text-ink/30 focus:border-leaf"
                aria-label="Pesan untuk Pipi Tutor"
              />
              <Button icon="send" onClick={() => void send()} disabled={busy || !input.trim()} className="h-[46px]">
                Kirim
              </Button>
            </div>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-1 text-[9px] font-bold text-ink/35">
              <span>Pipi tidak memberikan jawaban tantangan secara langsung — dia menuntunmu berpikir.</span>
              <span>{save.settings.tutorHistory ? 'Riwayat disimpan di perangkat ini' : 'Riwayat tidak disimpan'}</span>
            </div>
          </div>
        </Card>

        <aside className="space-y-4">
          <Card tone="cream" className="p-4">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg border-2 border-ink bg-sun"><Icon name="lightbulb" size={15} /></span>
              <h3 className="font-display text-sm font-extrabold">Mulai dari sini</h3>
            </div>
            <div className="mt-2 space-y-1.5">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => void send(prompt)}
                  disabled={busy}
                  className="flex min-h-11 w-full items-center gap-1.5 rounded-xl border-2 border-ink/10 bg-surface/70 px-2.5 py-1.5 text-left text-[10px] font-bold text-ink/60 transition hover:border-ink/25 hover:bg-surface disabled:opacity-50"
                >
                  <Icon name="arrow-right" size={11} className="shrink-0 text-leafDark" />
                  {prompt}
                </button>
              ))}
            </div>
          </Card>

          <Card tone="grape" className="p-4">
            <h3 className="font-display text-sm font-extrabold">Cara bertanya yang efektif</h3>
            <ol className="mt-1.5 space-y-1.5 text-[10px] font-semibold leading-snug text-ink/55">
              <li><b className="text-ink/75">1.</b> Sebutkan topiknya: "variabel", "for", "function", "error".</li>
              <li><b className="text-ink/75">2.</b> Tempelkan kode lengkap dalam blok ```python.</li>
              <li><b className="text-ink/75">3.</b> Tulis pesan error terakhir dan hasil yang kamu harapkan.</li>
              <li><b className="text-ink/75">4.</b> Minta petunjuk dulu, bukan jawaban jadi.</li>
            </ol>
          </Card>

          <Card className="p-4">
            <h3 className="font-display text-sm font-extrabold">Privasi & batasan</h3>
            <ul className="mt-1.5 space-y-1 text-[10px] font-semibold leading-snug text-ink/50">
              <li className="flex gap-1.5"><Icon name="check" size={11} className="mt-0.5 shrink-0 text-leafDark" /> Tanpa akun, tanpa email, tanpa iklan.</li>
              <li className="flex gap-1.5"><Icon name="check" size={11} className="mt-0.5 shrink-0 text-leafDark" /> Percakapan tersimpan lokal di browser.</li>
              <li className="flex gap-1.5"><Icon name="check" size={11} className="mt-0.5 shrink-0 text-leafDark" /> Tutor lokal berbasis aturan, bukan model AI cloud.</li>
              <li className="flex gap-1.5"><Icon name="info" size={11} className="mt-0.5 shrink-0 text-grapeDark" /> Referensi konsep: dokumentasi resmi Python.</li>
            </ul>
            <a href="https://docs.python.org/3/tutorial/" target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-[10px] font-extrabold text-leafDark hover:underline">
              Buka tutorial Python <Icon name="external" size={10} />
            </a>
          </Card>

          {!TUTOR_ENDPOINT && (
            <div className="rounded-2xl border-2 border-dashed border-ink/15 bg-surface/40 p-3 text-[10px] font-semibold leading-snug text-ink/45">
              <Icon name="info" size={12} className="mb-1" />
              Mode lokal aktif. Untuk jawaban yang lebih luas, hubungkan backend melalui variabel lingkungan
              <code className="mx-1 rounded bg-ink/5 px-1 font-mono">VITE_TUTOR_ENDPOINT</code>
              tanpa menaruh API key di frontend.
            </div>
          )}
        </aside>
      </div>

      <Modal
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Hapus riwayat tutor?"
        icon="trash"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="secondary" onClick={() => setConfirmClear(false)}>Batal</Button>
            <Button size="sm" variant="danger" icon="trash" onClick={doClear}>Hapus</Button>
          </div>
        }
      >
        <p className="text-sm font-semibold text-ink/60">
          Seluruh percakapan di perangkat ini akan dihapus. Progres belajar, badge, dan XP tidak terpengaruh.
        </p>
      </Modal>
    </div>
  )
}
