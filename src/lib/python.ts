import type { Challenge } from '../types'

export interface RunResult {
  ok: boolean
  output: string
  error: string
  durationMs: number
  timedOut?: boolean
  offline?: boolean
}

type Pending = {
  resolve: (result: RunResult) => void
  timeout: number
  started: number
}

const WORKER_URL = `${import.meta.env.BASE_URL}pyodide-worker.js`

class PythonRunner {
  private worker: Worker | null = null
  private pending = new Map<number, Pending>()
  private seq = 0
  private loading = false
  private loaded = false
  private preloadPromise: Promise<boolean> | null = null

  private ensureWorker(): Worker {
    if (this.worker) return this.worker
    const worker = new Worker(WORKER_URL)
    worker.onmessage = (event) => {
      const data = event.data || {}
      if (data.type === 'status') {
        if (data.status === 'downloading') this.loading = true
        if (data.status === 'ready') {
          this.loading = false
          this.loaded = true
        }
        return
      }
      if (data.type === 'fatal') {
        this.loading = false
        return
      }
      if (data.type === 'result' && typeof data.id === 'number') {
        const pending = this.pending.get(data.id)
        if (!pending) return
        this.pending.delete(data.id)
        window.clearTimeout(pending.timeout)
        this.loading = false
        if (!data.ok) this.loaded = true
        pending.resolve({
          ok: Boolean(data.ok),
          output: String(data.output ?? ''),
          error: String(data.error ?? ''),
          durationMs: performance.now() - pending.started,
        })
      }
    }
    worker.onerror = (event) => {
      this.loading = false
      for (const [id, pending] of this.pending) {
        window.clearTimeout(pending.timeout)
        pending.resolve({
          ok: false,
          output: '',
          error:
            'Tidak bisa memuat mesin Python. Pastikan kamu terhubung ke internet saat pertama kali membuka playground, lalu coba lagi.',
          durationMs: performance.now() - pending.started,
          offline: true,
        })
        this.pending.delete(id)
      }
      event.preventDefault()
    }
    this.worker = worker
    return worker
  }

  get isReady() {
    return this.loaded
  }

  get isLoading() {
    return this.loading
  }

  reset() {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
    for (const [, pending] of this.pending) {
      window.clearTimeout(pending.timeout)
      pending.resolve({
        ok: false,
        output: '',
        error: 'Mesin Python direset karena eksekusi terlalu lama (mungkin infinite loop).',
        durationMs: 0,
        timedOut: true,
      })
    }
    this.pending.clear()
    this.loaded = false
    this.loading = false
    this.preloadPromise = null
  }

  preload(): Promise<boolean> {
    if (this.loaded) return Promise.resolve(true)
    if (this.preloadPromise) return this.preloadPromise
    this.preloadPromise = new Promise((resolve) => {
      try {
        const worker = this.ensureWorker()
        const id = ++this.seq
        this.loading = true
        const timeout = window.setTimeout(() => {
          this.loading = false
          resolve(false)
        }, 90_000)
        const listener = (event: MessageEvent) => {
          const data = event.data || {}
          if (data.id === id && (data.type === 'ready' || data.type === 'fatal')) {
            window.clearTimeout(timeout)
            worker.removeEventListener('message', listener)
            this.loading = false
            this.loaded = data.type === 'ready'
            resolve(data.type === 'ready')
          }
        }
        worker.addEventListener('message', listener)
        worker.postMessage({ id, type: 'ping' })
      } catch {
        resolve(false)
      }
    })
    return this.preloadPromise
  }

  async run(code: string, stdin = ''): Promise<RunResult> {
    let worker: Worker
    try {
      worker = this.ensureWorker()
    } catch {
      return {
        ok: false,
        output: '',
        error:
          'Browser ini tidak mendukung Web Worker. Coba gunakan Chrome, Edge, atau Firefox terbaru.',
        durationMs: 0,
        offline: true,
      }
    }
    const id = ++this.seq
    const started = performance.now()
    const timeoutMs = this.loaded ? 10_000 : 120_000
    return new Promise<RunResult>((resolve) => {
      const timeout = window.setTimeout(() => {
        this.pending.delete(id)
        this.reset()
        resolve({
          ok: false,
          output: '',
          error:
            'Kode berjalan terlalu lama (lebih dari 10 detik) dan dihentikan. Periksa kemungkinan infinite loop, terutama pada while.',
          durationMs: performance.now() - started,
          timedOut: true,
        })
      }, timeoutMs)
      this.pending.set(id, { resolve, timeout, started })
      this.loading = !this.loaded
      worker.postMessage({ id, type: 'run', code, stdin })
    })
  }
}

export const pythonRunner = new PythonRunner()

export async function runPython(code: string, stdin = ''): Promise<RunResult> {
  return pythonRunner.run(code, stdin)
}

export function normalizeOutput(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\n+/, '')
    .replace(/\n+$/, '')
}

export interface ChallengeResult {
  passed: boolean
  output: string
  error: string
  message: string
  testsPassed?: number
  testsTotal?: number
}

export async function checkChallenge(challenge: Challenge, code: string): Promise<ChallengeResult> {
  const trimmed = code.trim()
  if (!trimmed) {
    return {
      passed: false,
      output: '',
      error: '',
      message: 'Kode masih kosong. Tulis dulu solusimu, ya!',
    }
  }
  if (challenge.check === 'output') {
    const result = await runPython(code, challenge.stdin ?? '')
    if (result.offline || result.timedOut) {
      return { passed: false, output: result.output, error: result.error, message: result.error }
    }
    if (result.error.trim()) {
      const lastLine = result.error.trim().split('\n').slice(-1)[0]
      return {
        passed: false,
        output: result.output,
        error: result.error,
        message: `Kodenya error: ${lastLine}. Baca petunjuk Pipi dan coba lagi!`,
      }
    }
    const actual = normalizeOutput(result.output)
    const expected = normalizeOutput(challenge.expected ?? '')
    const passed = actual === expected
    return {
      passed,
      output: result.output,
      error: result.error,
      message: passed
        ? 'Tantangan selesai! Output-mu tepat.'
        : `Belum tepat. Output yang diharapkan:\n${expected || '(kosong)'}`,
    }
  }

  const tests = challenge.tests ?? ''
  const combined = `${code}\n\n# ------ Pemeriksaan Pipi ------\n${tests}`
  const result = await runPython(combined, challenge.stdin ?? '')
  if (result.offline || result.timedOut) {
    return { passed: false, output: result.output, error: result.error, message: result.error }
  }
  if (result.error.trim()) {
    const lines = result.error.trim().split('\n').filter(Boolean)
    const assertion = lines.find((l) => l.includes('AssertionError'))
    const lastLine = lines[lines.length - 1] ?? ''
    return {
      passed: false,
      output: result.output,
      error: result.error,
      message: assertion
        ? `Hampir! ${assertion.replace(/^AssertionError:\s*/, '')}`
        : `Kodenya error: ${lastLine}`,
    }
  }
  const passed = result.output.includes('PIPI_PASS')
  return {
    passed,
    output: result.output,
    error: result.error,
    message: passed
      ? 'Tantangan selesai! Semua pemeriksaan lolos.'
      : 'Belum lolos pemeriksaan. Baca lagi permintaan tantangan dan periksa nama variabel/function-mu.',
  }
}

export function getPythonEngineStatus() {
  return {
    ready: pythonRunner.isReady,
    loading: pythonRunner.isLoading,
  }
}
