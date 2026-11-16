import { KNOWLEDGE, type KnowledgeEntry } from '../data/tutorKnowledge'

export interface CodeRunResult {
  ok: boolean
  output: string
  error: string
}

export type Runner = (code: string) => Promise<CodeRunResult>

const CODE_FENCE = /```(?:python|py)?\s*([\s\S]*?)```/i

export function extractCode(text: string): string | null {
  const fence = text.match(CODE_FENCE)
  if (fence) return fence[1].trim()
  const lines = text.split('\n')
  if (lines.length >= 2) {
    const codeish = /(print\(|input\(|def |for |while |if |elif |else:|import |from |[A-Za-z_]\w*\s*=|return |try:|except )/
    if (lines.filter((l) => codeish.test(l)).length >= 1) return text.trim()
  }
  if (lines.length === 1 && /^\s*(print\(|if |for |while |def |[A-Za-z_]\w*\s*=)/.test(lines[0])) {
    return lines[0].trim()
  }
  return null
}

function stripCode(text: string): string {
  return text.replace(CODE_FENCE, ' ').replace(/[`]/g, ' ').trim()
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim()
}

function matchKnowledge(question: string): { entry: KnowledgeEntry; score: number } | null {
  const q = normalize(question)
  let best: { entry: KnowledgeEntry; score: number } | null = null
  for (const entry of KNOWLEDGE) {
    let score = 0
    for (const keyword of entry.keywords) {
      const k = keyword.toLowerCase()
      if (q.includes(k)) {
        score += k.length + (k.includes(' ') ? 6 : 0)
        if (q === k) score += 20
      }
    }
    if (q.includes(entry.title.toLowerCase())) score += 12
    if (score > 0 && (!best || score > best.score)) best = { entry, score }
  }
  return best
}

interface Issue {
  line?: number
  hint: string
}

const BUILTINS = new Set([
  'print', 'input', 'int', 'float', 'str', 'bool', 'len', 'range', 'sum', 'max', 'min',
  'abs', 'round', 'sorted', 'list', 'dict', 'set', 'tuple', 'type', 'enumerate', 'zip',
  'open', 'True', 'False', 'None', 'self', 'i', 'j', 'k', 'n', 'x', 'y', 'file',
])

export function analyzeCode(code: string): Issue[] {
  const issues: Issue[] = []
  const lines = code.split('\n')
  const defined = new Set<string>(BUILTINS)

  lines.forEach((raw) => {
    const line = raw.replace(/#.*/, '')
    const assign = line.match(/^\s*([A-Za-z_]\w*)\s*(?:=|\+=|-=|\*=|\/=)/)
    if (assign) defined.add(assign[1])
    const forVar = line.match(/^\s*for\s+([A-Za-z_]\w*)\s+in\s+/)
    if (forVar) defined.add(forVar[1])
    const defVar = line.match(/^\s*def\s+([A-Za-z_]\w*)\s*\(([^)]*)\)/)
    if (defVar) {
      defined.add(defVar[1])
      defVar[2]
        .split(',')
        .map((p) => p.trim().split('=')[0].trim())
        .filter(Boolean)
        .forEach((p) => defined.add(p))
    }
    const importVar = line.match(/^\s*(?:import|from)\s+([A-Za-z_]\w*)/)
    if (importVar) defined.add(importVar[1])
  })

  if (/^\s*Print\s*\(/m.test(code)) {
    issues.push({
      line: lines.findIndex((l) => /^\s*Print\s*\(/.test(l)) + 1,
      hint: 'Python peka huruf besar-kecil: gunakan print() dengan huruf kecil.',
    })
  }

  lines.forEach((raw, idx) => {
    const line = raw.replace(/#.*/, '')
    if (!line.trim()) return
    const trimmed = line.trim()
    if (/^(if|elif|while)\b/.test(trimmed) && !trimmed.endsWith(':')) {
      issues.push({ line: idx + 1, hint: 'Baris if/elif/while harus diakhiri titik dua (:).' })
    }
    if (/^(for|def|class)\b/.test(trimmed) && !trimmed.endsWith(':')) {
      issues.push({ line: idx + 1, hint: 'Baris for/def harus diakhiri titik dua (:).' })
    }
    const condition = trimmed.match(/^(?:if|elif|while)\s+(.*)$/)
    if (condition && /[^=!<>]=[^=]/.test(condition[1])) {
      issues.push({
        line: idx + 1,
        hint: 'Di dalam kondisi, gunakan == untuk membandingkan, bukan = yang menyimpan nilai.',
      })
    }
    if (/\.append\s*\[/.test(line)) {
      issues.push({
        line: idx + 1,
        hint: 'append adalah method, panggil dengan tanda kurung: .append("nilai").',
      })
    }
    if (/\(\s*["'][^"']*["']\s*\+\s*\d+/.test(line)) {
      issues.push({
        line: idx + 1,
        hint: 'String dan angka tidak bisa digabung dengan +. Gunakan str() atau f-string.',
      })
    }
    const openCount = (line.match(/\(/g) || []).length
    const closeCount = (line.match(/\)/g) || []).length
    if (openCount > closeCount && idx === lines.length - 1) {
      issues.push({ line: idx + 1, hint: 'Jumlah tanda kurung buka dan tutup tidak seimbang.' })
    }
    const quotesDouble = (line.match(/"/g) || []).length
    const quotesSingle = (line.match(/'/g) || []).length
    if (quotesDouble % 2 !== 0 && !line.includes("'")) {
      issues.push({ line: idx + 1, hint: 'Tanda kutip ganda di baris ini belum ditutup.' })
    }
    if (quotesSingle % 2 !== 0 && !line.includes('"')) {
      issues.push({ line: idx + 1, hint: 'Tanda kutip tunggal di baris ini belum ditutup.' })
    }
    if (trimmed.endsWith(':') && idx + 1 < lines.length) {
      const next = lines.slice(idx + 1).find((l) => l.trim() && !l.trim().startsWith('#'))
      if (next !== undefined) {
        const indent = line.match(/^\s*/)?.[0].length ?? 0
        const nextIndent = next.match(/^\s*/)?.[0].length ?? 0
        if (nextIndent <= indent) {
          issues.push({
            line: idx + 2,
            hint: 'Baris setelah blok ini harus diberi indentasi (biasanya 4 spasi).',
          })
        }
      }
    }
  })

  if (/while\s+True\s*:/.test(code) && !/\bbreak\b/.test(code)) {
    issues.push({
      hint: 'Ada while True tanpa break. Pastikan loop punya jalan keluar agar program tidak menggantung.',
    })
  }

  if (!/^\s*(?:#.*)?$/.test(code)) {
    const printCalls = code.match(/print\s*\(\s*([A-Za-z_]\w*)\s*\)/g) || []
    for (const call of printCalls) {
      const name = call.match(/print\s*\(\s*([A-Za-z_]\w*)/)?.[1]
      if (name && !defined.has(name)) {
        issues.push({
          hint: `Variabel "${name}" dipakai tetapi belum pernah dibuat. Cek ejaan atau buat variabelnya dulu.`,
        })
      }
    }
    const fVars = code.match(/\{([A-Za-z_]\w*)\}/g) || []
    for (const token of fVars) {
      const name = token.slice(1, -1)
      if (!defined.has(name)) {
        issues.push({ hint: `Variabel "${name}" di dalam f-string belum didefinisikan.` })
      }
    }
  }

  const seen = new Set<string>()
  return issues
    .filter((issue) => {
      const key = `${issue.line ?? ''}-${issue.hint}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .slice(0, 4)
}

export function explainCode(code: string): string {
  const lines = code.split('\n')
  const explanations = lines.map((raw, idx) => {
    const num = idx + 1
    const line = raw.trim()
    if (!line) return null
    if (line.startsWith('#')) return `Baris ${num}: komentar, diabaikan Python. ${line.slice(1).trim()}`
    if (/^print\s*\(/.test(line)) {
      const inner = line.replace(/^print\s*\(/, '').replace(/\)\s*$/, '')
      return `Baris ${num}: menampilkan ${inner || 'nilai'} ke layar.`
    }
    if (/^input\s*\(/.test(line)) return `Baris ${num}: membaca input pengguna (hasilnya string).`
    if (/^def\s+/.test(line)) {
      const name = line.match(/def\s+(\w+)/)?.[1]
      return `Baris ${num}: mendefinisikan function ${name ?? ''} — isinya baru berjalan saat dipanggil.`
    }
    if (/^for\s+/.test(line)) {
      const m = line.match(/^for\s+(\w+)\s+in\s+(.+):/)
      return `Baris ${num}: loop for, mengulang untuk setiap nilai dari ${m?.[2] ?? 'urutan'}${m ? `, variabel ${m[1]}` : ''}.`
    }
    if (/^while\s+/.test(line)) return `Baris ${num}: loop while, berulang selama kondisi ${line.replace(/^while\s+/, '').replace(/:$/, '')} bernilai True.`
    if (/^if\s+/.test(line)) return `Baris ${num}: memeriksa kondisi ${line.replace(/^if\s+/, '').replace(/:$/, '')}.`
    if (/^elif\s+/.test(line)) return `Baris ${num}: kondisi alternatif jika if sebelumnya tidak terpenuhi.`
    if (/^else\s*:/.test(line)) return `Baris ${num}: dijalankan jika kondisi sebelumnya tidak terpenuhi.`
    if (/^return\b/.test(line)) return `Baris ${num}: mengembalikan ${line.replace(/^return\s*/, '') || 'None'} ke pemanggil function.`
    if (/^try\s*:/.test(line)) return `Baris ${num}: mencoba menjalankan kode yang mungkin error.`
    if (/^except\b/.test(line)) return `Baris ${num}: menangani error tertentu.`
    if (/^with\s+/.test(line)) return `Baris ${num}: membuka file dan memastikan otomatis ditutup.`
    if (/^import\s+|^from\s+/.test(line)) return `Baris ${num}: mengimpor modul atau function dari library.`
    const assign = line.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/)
    if (assign) return `Baris ${num}: menyimpan ${assign[2]} ke variabel "${assign[1]}".`
    if (/^\w+\s*\(/.test(line)) return `Baris ${num}: menjalankan function/method.`
    if (/^\w+\.\w+\(/.test(line)) return `Baris ${num}: memanggil method pada sebuah objek.`
    return `Baris ${num}: menjalankan perintah ${line}.`
  })
  return explanations.filter(Boolean).join('\n')
}

function formatIssues(issues: Issue[]): string {
  return issues
    .map((issue, i) => `• ${issue.line ? `Baris ${issue.line}: ` : ''}${issue.hint}`)
    .join('\n')
}

function knowledgeAnswer(entry: KnowledgeEntry, level: number): string {
  let text = `${entry.body}`
  if (entry.example) text += `\n\nContoh:\n${entry.example}`
  if (entry.tip) text += `\n\nCatatan Pipi: ${entry.tip}`
  if (level <= 2) {
    text += `\n\nKarena kamu masih di awal petualangan, coba dulu contoh kecilnya di Code Playground. Kalau ada yang belum jelas, tanya lagi ya!`
  }
  return text
}

function exerciseFor(topicId: string): string {
  const tasks: Record<string, string> = {
    variabel: 'Buat variabel nama berisi namamu dan level berisi 1, lalu cetak keduanya dengan f-string.',
    print: 'Cetak tiga baris: "Halo", "Aku belajar Python", dan "Bersama Pipi".',
    'tipe-data': 'Buat empat variabel dengan tipe str, int, float, dan bool, lalu cetak type() masing-masing.',
    input: 'Minta nama pengguna dengan input(), lalu cetak "Halo, [nama]!".',
    if: 'Buat program yang mencetak "Dewasa" jika umur >= 18, selain itu "Belum dewasa".',
    for: 'Gunakan for dan range() untuk mencetak angka 1 sampai 10.',
    while: 'Gunakan while untuk mencetak angka 5 sampai 1, lalu "Selesai".',
    range: 'Cetak bilangan genap 2 sampai 10 dengan range(start, stop, step).',
    'break-continue': 'Loop 1 sampai 10, lewati angka 5, dan berhenti sebelum 9.',
    function: 'Buat function sapa() yang mencetak "Halo dari Pipi!", lalu panggil dua kali.',
    parameter: 'Buat function sapa(nama) yang mencetak sapaan sesuai nama, lalu panggil dengan namamu.',
    return: 'Buat function luas_persegi(sisi) yang mengembalikan sisi * sisi.',
    list: 'Buat list berisi tiga buah, tambahkan satu buah, lalu cetak semuanya.',
    dict: 'Buat dictionary siswa dengan kunci nama dan level, lalu cetak levelnya.',
    'string-method': 'Bersihkan string "  aku suka python  " dengan strip(), ubah ke title-case, lalu cetak.',
    exception: 'Buat pembagian yang menangani ZeroDivisionError dengan pesan ramah.',
    file: 'Tulis "Halo file" ke file latihan.txt, lalu baca dan cetak isinya.',
  }
  return (
    tasks[topicId] ??
    'Coba ubah salah satu contoh di atas dengan nilai buatanmu sendiri, lalu jalankan di Playground untuk melihat hasilnya.'
  )
}

export async function tutorReply(
  message: string,
  level: number,
  runner?: Runner,
): Promise<string> {
  const question = stripCode(message)
  const q = normalize(question)
  const code = extractCode(message)
  const asksOutput = /(output|hasil|keluaran|mencetak apa|menghasilkan apa)/.test(q)
  const asksExplain = /(jelaskan|jelasin|baris demi baris|baris ini|arti kode|maksud kode)/.test(q)
  const asksError = /(error|salah|bug|kenapa|gagal|tidak jalan|nggak jalan|benerin|perbaiki|traceback)/.test(q)
  const asksExercise = /(latihan|soal tambahan|contoh soal|beri tugas)/.test(q)

  if (code && asksExplain && !asksOutput) {
    return `Oke, kita bedah bersama. Aku belum menjalankan kodenya, jadi ini penjelasan tiap baris:\n\n${explainCode(
      code,
    )}\n\nCoba jalankan di Code Playground untuk melihat output aslinya. Kalau ada baris yang masih membingungkan, sebutkan nomor barisnya ya!`
  }

  if (code) {
    const issues = analyzeCode(code)
    if (asksOutput && runner) {
      try {
        const result = await runner(code)
        if (result.ok) {
          const output = result.output.trim()
          return `Aku jalankan kodenya. Output-nya:\n\n${
            output || '(tidak ada output — coba tambahkan print())'
          }\n\n${issues.length ? `Tapi ada catatan:\n${formatIssues(issues)}\n\n` : ''}Mau aku jelaskan kenapa hasilnya begitu?`
        }
        return `Kodenya berhenti dengan error. Ini pesan pentingnya:\n\n${result.error
          .trim()
          .split('\n')
          .slice(-3)
          .join('\n')}\n\nPetunjuk dari Pipi:\n${
          issues.length ? formatIssues(issues) : 'Baca pesan error dari bawah: nama error dan barisnya menunjukkan masalah.'
        }\n\nCoba perbaiki satu hal dulu, lalu kirim lagi. Aku di sini!`
      } catch {
        /* fall through */
      }
    }

    if (asksError || issues.length) {
      if (issues.length) {
        return `Sudah aku periksa, dan ada beberapa hal yang bisa dicek:\n\n${formatIssues(
          issues,
        )}\n\nCoba perbaiki bagian itu dulu, lalu jalankan lagi di Playground. Kalau masih error, kirim pesan error lengkapnya ya — jangan langsung minta jawaban, kita latih mata debugging-mu!`
      }
      if (runner) {
        try {
          const result = await runner(code)
          if (result.ok) {
            return `Kodenya ternyata berjalan tanpa error. Output-nya:\n\n${
              result.output.trim() || '(kosong)'
            }\n\nKalau hasilnya belum sesuai harapan, ceritakan hasil yang kamu inginkan. Kita periksa logikanya bersama.`
          }
          return `Aku menemukan error saat menjalankan kode:\n\n${result.error
            .trim()
            .split('\n')
            .slice(-4)
            .join('\n')}\n\nPetunjuk: baca baris terakhir pesan error, lalu cek baris kode yang disebut. Sering kali masalahnya di tanda kutip, titik dua, indentasi, atau nama variabel.`
        } catch {
          /* ignore */
        }
      }
      return 'Aku belum menemukan pelanggaran sintaks yang jelas hanya dari membaca kode. Coba jalankan di Code Playground, lalu kirimkan pesan error yang muncul (lengkap dengan barisnya). Dari situ kita bisa telusuri bersama.'
    }
  }

  if (asksError && !code) {
    return 'Ayo kita periksa bersama! Kirim kode kamu (boleh di dalam blok ```python) dan pesan error-nya. Pipi akan menunjukkan bagian yang perlu dicek dulu, bukan langsung memberi jawaban. Semakin lengkap kodenya, semakin tepat petunjukku.'
  }

  if (/(terima kasih|makasih|thanks|thank you)/.test(q)) {
    return 'Sama-sama, Petualang! Senang bisa membantu. Lanjutkan misimu, dan jangan ragu bertanya lagi. Pipi selalu di sini!'
  }

  if (
    /^(halo|hai|hi|hello|hey|pagi|siang|malam)[!. ]*$/.test(q) ||
    (q.length <= 24 && /^(halo|hai|hi|hello|hey)\b/.test(q))
  ) {
    return 'Halo, Petualang! Aku Pipi, tutor Python-mu. Kamu bisa bertanya tentang variabel, loop, function, error, atau minta latihan. Kalau ingin aku memeriksa kode, tempelkan kodenya di antara ```python ... ``` ya!'
  }

  if (asksExercise) {
    const match = matchKnowledge(question)
    const exercise = exerciseFor(match?.entry.id ?? '')
    return `Tentu! Ini latihan kecil untukmu:\n\n${exercise}\n\nPetunjuk: mulai dari bagian paling sederhana, lalu jalankan di Playground. Kalau bingung, tanyakan konsepnya dulu — aku akan membantu tanpa langsung membocorkan jawaban. Semangat!`
  }

  const match = matchKnowledge(question)
  if (match) {
    return knowledgeAnswer(match.entry, level)
  }

  if (/(apa itu|apa fungsi|jelaskan|gimana cara|bagaimana cara|kenapa|mengapa)/.test(q)) {
    return 'Hmm, aku belum yakin topik persisnya. Coba sebutkan kata kunci Python-nya, misalnya: variabel, tipe data, if, for, while, function, list, dictionary, atau error. Kamu juga bisa menempelkan kode (di dalam blok ```python) dan aku akan memeriksanya.'
  }

  return 'Aku mendengarmu! Sebagai tutor lokal, aku paling jago menjawab topik Python dasar: print, variabel, tipe data, if, loop, function, list, dict, error, dan file. Coba tanyakan salah satunya, atau kirim kode yang ingin diperiksa. Kalau kamu minta latihan, aku juga bisa membuatkannya!'
}

export const TUTOR_ENDPOINT = (import.meta.env.VITE_TUTOR_ENDPOINT as string | undefined) ?? ''

export async function askTutorBackend(
  message: string,
  level: number,
  history: { role: string; text: string }[],
): Promise<string | null> {
  if (!TUTOR_ENDPOINT) return null
  try {
    const res = await fetch(TUTOR_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, level, history }),
    })
    if (!res.ok) return null
    const data = (await res.json()) as { text?: string; reply?: string }
    return data.text ?? data.reply ?? null
  } catch {
    return null
  }
}
