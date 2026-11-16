import { useState } from 'react'
import { Modal, Button } from './ui'
import { Pipi, PipiBubble } from './Pipi'
import { Icon } from './Icon'
import { useGame } from '../store/GameContext'

const STEPS = [
  {
    title: 'Selamat datang, Petualang!',
    icon: 'sparkles',
    text: 'Aku Pipi, si ular Python yang akan menemanimu belajar coding. Di dunia ini, setiap baris kode adalah langkah petualangan!',
    points: ['Belajar Python dari nol, tanpa instalasi.', 'Semua progres tersimpan di browser-mu.', 'Tidak perlu takut salah — di sini salah adalah bagian dari belajar.'],
  },
  {
    title: 'Belajar dengan cara bermain',
    icon: 'book',
    text: 'Setiap misi punya tiga tahap: baca materinya, selesaikan tantangan kode, lalu buktikan pemahamanmu lewat kuis.',
    points: ['Materi dilengkapi penjelasan tiap baris kode.', 'Kode dijalankan langsung di browser.', 'Kuis memberi umpan balik dan penjelasan jawaban.'],
  },
  {
    title: 'XP, level, dan koin',
    icon: 'bolt',
    text: 'XP dan koin hanya diberikan dari aktivitas belajar yang nyata: menyelesaikan materi, tantangan, kuis, boss, dan mini game.',
    points: ['Naik level membuka evolusi Pipi.', 'Koin menandai koleksi usahamu.', 'Streak harian tumbuh saat kamu belajar tiap hari.'],
  },
  {
    title: 'Pipi tumbuh bersamamu',
    icon: 'star',
    text: 'Makin sering belajar, makin hebat bentuk Pipi. Mulai dari Baby Pipi, lalu Junior, Smart, hingga Python Master.',
    points: ['Junior: Level 3 + 4 materi.', 'Smart: Level 6 + 12 materi.', 'Master: Level 10 + 20 materi + 5 boss.'],
  },
  {
    title: 'Petualanganmu menanti!',
    icon: 'map',
    text: 'Selesaikan 7 dunia, kalahkan boss, kejar daily quest, dan mainkan mini games. Kalau bingung, Pipi Tutor siap membantu.',
    points: ['Peta petualangan menunjukkan misi berikutnya.', 'Daily quest memberi bonus tiap hari.', 'Pipi Tutor menjelaskan tanpa langsung membocorkan jawaban.'],
  },
]

export function Onboarding() {
  const { save, finishOnboarding, evolution } = useGame()
  const [step, setStep] = useState(0)

  if (!save || save.onboarded) return null
  const current = STEPS[step]
  const last = step === STEPS.length - 1

  return (
    <Modal
      open
      onClose={finishOnboarding}
      hideClose
      size="md"
      tone="cream"
      title="Panduan Petualangan"
      icon="compass"
      footer={
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={finishOnboarding}
            className="text-xs font-extrabold uppercase tracking-wide text-ink/40 transition hover:text-ink/70"
          >
            Lewati panduan
          </button>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <Button variant="secondary" size="sm" onClick={() => setStep((s) => s - 1)} icon="arrow-left">
                Kembali
              </Button>
            )}
            <Button
              variant="sun"
              size="sm"
              onClick={() => (last ? finishOnboarding() : setStep((s) => s + 1))}
              iconRight={last ? 'sparkles' : 'arrow-right'}
            >
              {last ? 'Mulai Petualangan' : 'Lanjut'}
            </Button>
          </div>
        </div>
      }
    >
      <div className="text-center">
        <div className="mb-3 flex items-center justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full border border-ink/20 transition-all ${
                i === step ? 'w-6 bg-leaf' : i < step ? 'w-2 bg-leaf/50' : 'w-2 bg-ink/10'
              }`}
            />
          ))}
        </div>
        <div className="mb-1 flex items-center justify-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl border-[3px] border-ink bg-sun shadow-pop-sm">
            <Icon name={current.icon} size={20} />
          </span>
          <Pipi mood={step === 4 ? 'celebrate' : 'happy'} stage={evolution} size={64} />
        </div>
        <h3 className="font-display text-xl font-extrabold text-ink sm:text-2xl">{current.title}</h3>
        <PipiBubble mood={step === 2 ? 'thinking' : step === 4 ? 'celebrate' : 'happy'} size={54} className="mt-3 text-left">
          {current.text}
        </PipiBubble>
        <ul className="mx-auto mt-3 max-w-sm space-y-1.5 text-left">
          {current.points.map((p) => (
            <li key={p} className="flex items-start gap-2 text-xs font-semibold leading-snug text-ink/70">
              <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-leaf text-white">
                <Icon name="check" size={10} />
              </span>
              {p}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[11px] font-bold text-ink/35">
          Langkah {step + 1} dari {STEPS.length}
        </p>
      </div>
    </Modal>
  )
}
