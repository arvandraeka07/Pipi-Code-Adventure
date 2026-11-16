import { useMemo, useState } from 'react'
import Editor from 'react-simple-code-editor'
import Prism from 'prismjs'
import 'prismjs/components/prism-python'
import type { CodeLine } from '../types'
import { Icon } from './Icon'
import { cn } from './ui'

export function CodeEditor({
  value,
  onChange,
  placeholder,
  minHeight = 170,
  maxHeight,
  ariaLabel = 'Editor kode Python',
  readOnly = false,
  showLineNumbers = true,
}: {
  value: string
  onChange: (code: string) => void
  placeholder?: string
  minHeight?: number
  maxHeight?: number
  ariaLabel?: string
  readOnly?: boolean
  showLineNumbers?: boolean
}) {
  const lineCount = Math.max(1, value.split('\n').length)
  return (
    <div className="relative overflow-hidden rounded-2xl border-[3px] border-ink bg-[#0F2B20]">
      <div className="flex items-center justify-between border-b border-white/10 bg-[#14382A] px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF8A7A]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FFC93C]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#2FBF71]" />
          <span className="ml-2 font-mono text-[11px] font-semibold text-mint/60">main.py</span>
        </div>
        <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] text-mint/60">Python 3</span>
      </div>
      <div className="flex overflow-auto" style={{ maxHeight: maxHeight ?? undefined }}>
        {showLineNumbers && (
          <pre
            aria-hidden="true"
            className="select-none border-r border-white/10 px-2 py-3 text-right font-mono text-[13px] leading-[1.65] text-mint/35"
            style={{ minHeight }}
          >
            {Array.from({ length: lineCount }).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </pre>
        )}
        <div className="min-w-0 flex-1 py-3 pr-3" style={{ minHeight }}>
          <Editor
            value={value}
            onValueChange={onChange}
            highlight={(code) => Prism.highlight(code, Prism.languages.python, 'python')}
            padding={0}
            tabSize={4}
            insertSpaces
            readOnly={readOnly}
            placeholder={placeholder}
            textareaId="pipi-code-editor"
            aria-label={ariaLabel}
            className="pipi-editor font-mono"
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 13,
              lineHeight: 1.65,
              minHeight,
              color: '#E9FFF1',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export function CodeBlock({
  code,
  title,
  lines,
  output,
  className,
  compact = false,
}: {
  code: string
  title?: string
  lines?: CodeLine[]
  output?: string
  className?: string
  compact?: boolean
}) {
  const [showExplain, setShowExplain] = useState(true)
  const [copied, setCopied] = useState(false)
  const html = useMemo(() => Prism.highlight(code, Prism.languages.python, 'python'), [code])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className={cn('overflow-hidden rounded-2xl border-[3px] border-ink', className)}>
      <div className="flex items-center justify-between gap-2 border-b-2 border-white/10 bg-[#14382A] px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <Icon name="code" size={14} className="shrink-0 text-mint/70" />
          <span className="truncate font-mono text-[11px] font-semibold text-mint/70">{title ?? 'Contoh Python'}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {lines && lines.length > 0 && (
            <button
              onClick={() => setShowExplain((v) => !v)}
              className="rounded-lg border border-white/15 px-2 py-1 text-[10px] font-bold text-mint/70 transition hover:bg-white/10"
            >
              {showExplain ? 'Sembunyikan penjelasan' : 'Jelaskan tiap baris'}
            </button>
          )}
          <button
            onClick={copy}
            className="grid h-7 w-7 place-items-center rounded-lg border border-white/15 text-mint/70 transition hover:bg-white/10"
            aria-label="Salin kode"
          >
            <Icon name={copied ? 'check' : 'copy'} size={13} />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto bg-[#0F2B20]">
        {lines && lines.length ? (
          <div className="py-2">
            {lines.map((item, i) => (
              <div key={i} className="group px-3 py-1">
                <div className="flex gap-3">
                  <span className="w-5 shrink-0 select-none pt-0.5 text-right font-mono text-[11px] text-mint/25">{i + 1}</span>
                  <pre className="min-w-0 flex-1 whitespace-pre-wrap break-words font-mono text-[12.5px] leading-relaxed text-[#E9FFF1]">
                    <code
                      className="language-python"
                      dangerouslySetInnerHTML={{
                        __html: Prism.highlight(item.line, Prism.languages.python, 'python'),
                      }}
                    />
                  </pre>
                </div>
                {showExplain && (
                  <div className="ml-8 mt-1 flex gap-1.5 text-[11px] font-semibold leading-snug text-[#9FD8B6]">
                    <Icon name="arrow-right" size={11} className="mt-0.5 shrink-0" />
                    <span>{item.explain}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <pre className="overflow-x-auto p-3 font-mono text-[12.5px] leading-relaxed">
            <code className="language-python" dangerouslySetInnerHTML={{ __html: html }} />
          </pre>
        )}
      </div>
      {output && (
        <div className="border-t-2 border-white/10 bg-[#0A1F17] px-3 py-2">
          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-mint/40">
            <Icon name="terminal" size={11} />
            Output
          </div>
          <pre className="whitespace-pre-wrap break-words font-mono text-[12px] text-[#B9F5CE]">{output}</pre>
        </div>
      )}
      {!compact && (
        <div className="border-t border-white/10 bg-[#14382A] px-3 py-1.5 text-[10px] font-semibold text-mint/40">
          Kode ini bisa kamu coba langsung di Playground.
        </div>
      )}
    </div>
  )
}
