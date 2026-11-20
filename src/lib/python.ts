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

/**
 * Bentuk output yang dibandingkan dengan toleransi ramah pemula:
 * huruf besar/kecil, spasi berlebih, dan baris kosong di tepi diabaikan.
 */
export function comparableOutput(text: string): string {
  return normalizeOutput(text)
    .normalize('NFKC')
    .split('\n')
    .map((line) => line.trim().replace(/[ \t]+/g, ' '))
    .join('\n')
    .toLowerCase()
}

export function outputsMatch(actual: string, expected: string): boolean {
  return comparableOutput(actual) === comparableOutput(expected)
}

export interface ChallengeResult {
  passed: boolean
  output: string
  error: string
  message: string
  testsPassed?: number
  testsTotal?: number
}

export interface FriendlyPythonError {
  title: string
  hint: string
  detail: string
  line?: number
}

export function friendlyPythonError(error: string): FriendlyPythonError {
  const lines = error.trim().split('\n').filter(Boolean)
  const detail = lines[lines.length - 1] ?? 'Kode berhenti tanpa pesan error.'
  const lineMatch = error.match(/line (\d+)/)
  const line = lineMatch ? Number(lineMatch[1]) : undefined
  const typeMatch = detail.match(/^([A-Za-z]+Error):?\s*(.*)$/)
  const type = typeMatch?.[1] ?? ''
  const rest = typeMatch?.[2] ?? ''

  const map: Record<string, { title: string; hint: string }> = {
    SyntaxError: {
      title: 'Ada susunan kode yang belum pas',
      hint: 'Periksa tanda kurung, titik dua `:`, tanda kutip, dan baris tepat sebelum lokasi error.',
    },
    IndentationError: {
      title: 'Indentasi belum konsisten',
      hint: 'Gunakan 4 spasi untuk setiap level dan jangan mencampur tab dengan spasi.',
    },
    TabError: {
      title: 'Tab dan spasi tercampur',
      hint: 'Ganti semua tab dengan spasi agar Python membaca blok kode dengan benar.',
    },
    NameError: {
      title: 'Ada nama yang belum dikenal Python',
      hint: 'Cek ejaan variabel atau function, dan pastikan sudah dibuat sebelum dipakai.',
    },
    UnboundLocalError: {
      title: 'Variabel dipakai sebelum punya nilai',
      hint: 'Beri nilai awal pada variabel di dalam function sebelum membacanya.',
    },
    TypeError: {
      title: 'Tipe datanya belum cocok',
      hint: 'Cek apakah kamu mencampur teks dan angka, atau memberi jumlah argumen yang salah.',
    },
    ValueError: {
      title: 'Nilainya tidak sesuai yang diminta',
      hint: 'Periksa input dan konversi seperti `int()` atau `float()`.',
    },
    ZeroDivisionError: {
      title: 'Kamu membagi dengan nol',
      hint: 'Pastikan angka pembaginya bukan 0 sebelum operasi pembagian.',
    },
    IndexError: {
      title: 'Index list di luar jangkauan',
      hint: 'Ingat index dimulai dari 0. Cek juga panjang list dengan `len()`.',
    },
    KeyError: {
      title: 'Key tidak ditemukan di dictionary',
      hint: 'Cek ejaan key atau gunakan `.get()` agar lebih aman.',
    },
    AttributeError: {
      title: 'Objek tidak punya atribut atau metode itu',
      hint: 'Cek nama metode, misalnya `append` untuk list, bukan `add`.',
    },
    ModuleNotFoundError: {
      title: 'Modul belum tersedia',
      hint: 'Cek ejaan `import`. Pyodide hanya memuat modul Python yang umum dipakai.',
    },
    ImportError: {
      title: 'Import belum berhasil',
      hint: 'Cek nama modul atau function yang kamu impor.',
    },
    AssertionError: {
      title: 'Hasil belum sesuai pemeriksaan otomatis',
      hint: 'Baca pesan pemeriksaan, lalu cek nama variabel/function dan nilai akhirnya.',
    },
    RecursionError: {
      title: 'Function memanggil dirinya terlalu dalam',
      hint: 'Pastikan ada kondisi berhenti (base case) yang benar.',
    },
    OverflowError: {
      title: 'Angkanya terlalu besar untuk diproses',
      hint: 'Kurangi ukuran angka atau pecah perhitungan menjadi bagian kecil.',
    },
    EOFError: {
      title: 'Program menunggu input yang tidak tersedia',
      hint: 'Pastikan jumlah `input()` sesuai dengan input yang diberikan.',
    },
  }

  const entry = map[type]
  if (entry) return { ...entry, detail: rest || detail, line }

  return {
    title: 'Kode berhenti karena error',
    hint: 'Baca baris terakhir traceback, lalu periksa baris kode yang ditunjuk.',
    detail,
    line,
  }
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
      const friendly = friendlyPythonError(result.error)
      return {
        passed: false,
        output: result.output,
        error: result.error,
        message: `${friendly.title}${friendly.line ? ` (baris ${friendly.line})` : ''}. ${friendly.hint}`,
      }
    }
    const expected = normalizeOutput(challenge.expected ?? '')
    const passed = outputsMatch(result.output, expected)
    return {
      passed,
      output: result.output,
      error: result.error,
      message: passed
        ? 'Tantangan selesai! Output-mu tepat. Huruf besar/kecil dan spasi berlebih tidak dipermasalahkan.'
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
    const friendly = friendlyPythonError(result.error)
    const assertion = result.error.includes('AssertionError')
    return {
      passed: false,
      output: result.output,
      error: result.error,
      message: assertion
        ? `Hampir! ${friendly.detail.replace(/^AssertionError:\s*/, '')}. ${friendly.hint}`
        : `${friendly.title}${friendly.line ? ` (baris ${friendly.line})` : ''}. ${friendly.hint}`,
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
