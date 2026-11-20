import { useMemo, useRef, useState } from 'react'
import CodeMirror, { type ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView, placeholder as cmPlaceholder } from '@codemirror/view'
import Prism from 'prismjs'
import 'prismjs/components/prism-python'
import type { CodeLine } from '../types'
import { Icon } from './Icon'
import { cn } from './ui'

const SYMBOLS = ['  ', ':', '(', ')', '[', ']', '{', '}', '"', "'", '=', '+', '-', '*', '/', '_', '#']

const editorTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: 'transparent',
      color: '#E9FFF1',
      fontSize: '13px',
    },
    '.cm-content': {
      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      padding: '12px 0',
      caretColor: '#FFC93C',
    },
    '.cm-line': {
      padding: '0 12px 0 4px',
      lineHeight: '1.65',
    },
    '.cm-gutters': {
      backgroundColor: 'transparent',
      color: 'rgba(233, 255, 241, 0.35)',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      paddingLeft: '6px',
    },
    '.cm-activeLine': { backgroundColor: 'rgba(255, 255, 255, 0.045)' },
    '.cm-activeLineGutter': { backgroundColor: 'transparent', color: '#FFC93C' },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: '#FFC93C' },
    '&.cm-focused': { outline: 'none' },
    '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
      backgroundColor: 'rgba(130, 102, 230, 0.38)',
    },
    '.cm-scroller': { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
    '.cm-placeholder': { color: 'rgba(233, 255, 241, 0.38)' },
  },
  { dark: true },
)

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
  const editorRef = useRef<ReactCodeMirrorRef>(null)

  const insertSymbol = (symbol: string) => {
    const view = editorRef.current?.view
    if (!view || readOnly) {
      onChange(value + symbol)
      return
    }
    const { from, to } = view.state.selection.main
    view.dispatch({
      changes: { from, to, insert: symbol },
      selection: { anchor: from + symbol.length },
      scrollIntoView: true,
    })
    view.focus()
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border-[3px] border-ink bg-code">
      <div className="flex items-center justify-between border-b border-white/10 bg-code-header px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF8A7A]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FFC93C]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#2FBF71]" />
          <span className="ml-2 font-mono text-[11px] font-semibold text-code-ink/60">main.py</span>
        </div>
        <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] text-code-ink/60">Python 3</span>
      </div>

      <div
        className="flex gap-1 overflow-x-auto border-b border-white/10 bg-code-header/80 px-2 py-1.5 sm:hidden"
        role="toolbar"
        aria-label="Simbol cepat editor"
      >
        {SYMBOLS.map((symbol, index) => (
          <button
            key={`${symbol}-${index}`}
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => insertSymbol(symbol)}
            disabled={readOnly}
            aria-label={symbol === '  ' ? 'Sisipkan indentasi' : `Sisipkan ${symbol}`}
            className="grid h-11 min-w-11 place-items-center rounded-lg border border-white/15 font-mono text-[11px] font-bold text-code-ink/75 transition hover:border-white/35 hover:bg-white/10 disabled:opacity-40"
          >
            {symbol === '  ' ? 'â‡¥' : symbol}
          </button>
        ))}
      </div>

      <div className="overflow-hidden" style={{ minHeight, maxHeight }}>
        <CodeMirror
          ref={editorRef}
          value={value}
          onChange={onChange}
          height="auto"
          minHeight={`${minHeight}px`}
          maxHeight={maxHeight ? `${maxHeight}px` : undefined}
          readOnly={readOnly}
          theme={oneDark}
          extensions={[
            python(),
            editorTheme,
            EditorView.lineWrapping,
            EditorView.contentAttributes.of({ 'aria-label': ariaLabel, id: 'pipi-code-editor' }),
            ...(placeholder ? [cmPlaceholder(placeholder)] : []),
          ]}
          basicSetup={{
            lineNumbers: showLineNumbers,
            foldGutter: false,
            highlightActiveLineGutter: showLineNumbers,
            highlightActiveLine: false,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: false,
            rectangularSelection: false,
            crosshairCursor: false,
            highlightSelectionMatches: false,
          }}
          className="pipi-codemirror"
        />
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
      <div className="flex items-center justify-between gap-2 border-b-2 border-white/10 bg-code-header px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <Icon name="code" size={14} className="shrink-0 text-code-ink/70" />
          <span className="truncate font-mono text-[11px] font-semibold text-code-ink/70">{title ?? 'Contoh Python'}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {lines && lines.length > 0 && (
            <button
              onClick={() => setShowExplain((v) => !v)}
              className="min-h-11 rounded-lg border border-white/15 px-2 py-1 text-[10px] font-bold text-code-ink/70 transition hover:bg-white/10 sm:min-h-0"
            >
              {showExplain ? 'Sembunyikan penjelasan' : 'Jelaskan tiap baris'}
            </button>
          )}
          <button
            onClick={copy}
            className="grid h-11 w-11 place-items-center rounded-lg border border-white/15 text-code-ink/70 transition hover:bg-white/10 sm:h-8 sm:w-8"
            aria-label="Salin kode"
          >
            <Icon name={copied ? 'check' : 'copy'} size={13} />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto bg-code">
        {lines && lines.length ? (
          <div className="py-2">
            {lines.map((item, i) => (
              <div key={i} className="group px-3 py-1">
                <div className="flex gap-3">
                  <span className="w-5 shrink-0 select-none pt-0.5 text-right font-mono text-[11px] text-code-ink/25">{i + 1}</span>
                  <pre className="min-w-0 flex-1 whitespace-pre-wrap break-words font-mono text-[12.5px] leading-relaxed text-code-ink">
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
        <div className="border-t-2 border-white/10 bg-code-deep px-3 py-2">
          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-code-ink/40">
            <Icon name="terminal" size={11} />
            Output
          </div>
          <pre className="whitespace-pre-wrap break-words font-mono text-[12px] text-[#B9F5CE]">{output}</pre>
        </div>
      )}
      {!compact && (
        <div className="border-t border-white/10 bg-code-header px-3 py-1.5 text-[10px] font-semibold text-code-ink/40">
          Kode ini bisa kamu coba langsung di Playground.
        </div>
      )}
    </div>
  )
}
