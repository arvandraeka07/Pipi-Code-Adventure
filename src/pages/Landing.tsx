import { useState, type CSSProperties, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGame } from '../store/GameContext'
import { WORLDS } from '../data/worlds'
import { worldProgress } from '../lib/progress'
import { Pipi } from '../components/Pipi'
import { Icon } from '../components/Icon'
import { Button, Modal, cn } from '../components/ui'
import { Avatar, AvatarPicker } from '../components/Avatar'
import { ThemeToggle } from '../components/ThemeToggle'

const TOPICS = [
  { icon: 'variable', title: 'Variabel', text: 'Beri nama untuk menyimpan data.', tone: 'bg-mint' },
  { icon: 'type', title: 'Tipe data', text: 'Bedakan teks, angka, dan benar/salah.', tone: 'bg-sky' },
  { icon: 'branch', title: 'Percabangan', text: 'Buat program memilih jalannya.', tone: 'bg-warning-soft' },
  { icon: 'repeat', title: 'Loop', text: 'Ulangi perintah tanpa menulis ulang.', tone: 'bg-grape-soft' },
  { icon: 'function', title: 'Function', text: 'Bungkus langkah agar bisa dipakai lagi.', tone: 'bg-rose' },
  { icon: 'list', title: 'List', text: 'Simpan banyak data dalam satu tempat.', tone: 'bg-success-soft' },
]

const PRINCIPLES = [
  {
    n: '01',
    title: 'Kode benar-benar berjalan',
    text: 'Bukan tebak-tebakan. Anak menulis Python, menekan tombol, lalu melihat hasilnya di browser.',
  },
  {
    n: '02',
    title: 'Satu soal, satu langkah kecil',
    text: 'Pertanyaan dibuat pendek dan pilihan jawabannya hanya tiga. Fokus pada satu ide setiap kali.',
  },
  {
    n: '03',
    title: 'Salah itu bagian belajar',
    text: 'Pipi memberi petunjuk dan penjelasan, bukan menghukum. Anak boleh mencoba lagi tanpa takut.',
  },
  {
    n: '04',
    title: 'Progres tersimpan sendiri',
    text: 'Tanpa email, tanpa akun, tanpa instalasi. Cukup buka browser dan lanjutkan dari perangkat yang sama.',
  },
]

const STEPS = [
  { n: '01', title: 'Baca', text: 'Penjelasan singkat dengan contoh yang dekat dengan kehidupan sehari-hari.' },
  { n: '02', title: 'Coba', text: 'Tulis atau lengkapi kode, lalu jalankan langsung di browser.' },
  { n: '03', title: 'Jawab', text: 'Tiga soal ringan untuk memastikan idenya sudah dipahami.' },
  { n: '04', title: 'Tuntas', text: 'Kalahkan boss, buka dunia baru, dan lihat Pipi tumbuh.' },
]

const SOURCES = [
  { label: 'Python Tutorial resmi', url: 'https://docs.python.org/3/tutorial/', note: 'Dasar bahasa & konsep' },
  { label: 'PEP 8 Style Guide', url: 'https://peps.python.org/pep-0008/', note: 'Gaya penulisan kode' },
  { label: 'Real Python', url: 'https://realpython.com/', note: 'Praktik & penjelasan tambahan' },
  { label: 'W3Schools Python', url: 'https://www.w3schools.com/python/', note: 'Referensi cepat' },
]

export default function Landing() {
  const { save, evolution, createProfile, accounts, switchProfile } = useGame()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('pipi')

  const start = () => {
    if (save) {
      navigate('/dashboard')
    } else {
      setName('')
      setAvatar('pipi')
      setOpen(true)
    }
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    createProfile(name.trim() || 'Petualang', avatar)
    setOpen(false)
    navigate('/dashboard')
  }

  return (
    <div className="landing-page min-h-screen overflow-x-hidden">
      <a href="#landing-main" className="skip-link">
        Lewati ke konten utama
      </a>

      <header className="sticky top-0 z-40 border-b-2 border-ink/15 bg-paper/95">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5" aria-label="PIPI CODE ADVENTURE - Beranda">
            <span className="relative grid h-10 w-10 -rotate-2 place-items-center overflow-hidden rounded-lg border-2 border-ink bg-sun shadow-pop-sm">
              <span className="absolute -bottom-2">
                <Pipi mood="happy" size={46} />
              </span>
            </span>
            <span className="leading-none">
              <span className="block font-display text-sm font-black tracking-tight text-ink">PIPI CODE</span>
              <span className="mt-1 block font-mono text-[9px] font-semibold tracking-[0.2em] text-leafDark">ADVENTURE</span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-5 text-xs font-extrabold text-ink/60 md:flex" aria-label="Navigasi halaman">
            <a href="#isi" className="transition hover:text-ink">Isi buku</a>
            <a href="#dunia" className="transition hover:text-ink">7 dunia</a>
            <a href="#cara" className="transition hover:text-ink">Cara main</a>
            <a href="#sumber" className="transition hover:text-ink">Sumber</a>
          </nav>

          <div className="ml-auto flex items-center gap-2 md:ml-4">
            <ThemeToggle label={false} />
            <Button size="sm" variant="sun" onClick={save ? () => navigate('/dashboard') : start} iconRight={save ? 'arrow-right' : 'play'}>
              {save ? 'Dashboard' : 'Mulai gratis'}
            </Button>
          </div>
        </div>
      </header>

      <main id="landing-main" tabIndex={-1}>
        <section className="mx-auto max-w-6xl px-4 pb-12 pt-9 sm:px-6 sm:pt-14">
          <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div className="animate-fade-up">
              <div className="flex flex-wrap items-center gap-2">
                <span className="stamp -rotate-2 text-coral-text">Untuk pemula</span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/50">
                  Python / Bahasa Indonesia / Gratis
                </span>
              </div>

              <h1 className="mt-5 max-w-[13ch] font-display text-[2.65rem] font-black leading-[0.98] tracking-tight text-ink sm:text-6xl lg:text-[4.1rem]">
                Belajar Python, <span className="marker-line">satu halaman</span> sehari.
              </h1>

              <p className="mt-5 max-w-xl text-base font-semibold leading-relaxed text-ink/70">
                Buku latihan interaktif untuk anak yang baru mulai. Ada cerita, kode sungguhan, soal
                pendek, dan Pipi yang menemani dari halaman pertama sampai jadi Python Master.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button size="lg" variant="primary" onClick={start} iconRight="arrow-right">
                  {save ? `Lanjutkan, ${save.profile.name}` : 'Mulai halaman pertama'}
                </Button>
                <a
                  href="#isi"
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl border-2 border-ink bg-surface px-5 py-3 font-display text-sm font-bold shadow-pop-sm transition hover:-translate-y-0.5 active:translate-y-[2px] active:shadow-none"
                >
                  <Icon name="book" size={17} />
                  Intip isi buku
                </a>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-0 border-y-2 border-dashed border-ink/20 py-3">
                <div className="border-r-2 border-ink/10 pr-3">
                  <div className="font-display text-2xl font-black leading-none">7</div>
                  <div className="mt-1 font-mono text-[9px] font-semibold uppercase tracking-wide text-ink/50">dunia</div>
                </div>
                <div className="border-r-2 border-ink/10 px-3">
                  <div className="font-display text-2xl font-black leading-none">28</div>
                  <div className="mt-1 font-mono text-[9px] font-semibold uppercase tracking-wide text-ink/50">misi</div>
                </div>
                <div className="pl-3">
                  <div className="font-display text-2xl font-black leading-none">84</div>
                  <div className="mt-1 font-mono text-[9px] font-semibold uppercase tracking-wide text-ink/50">soal ringan</div>
                </div>
              </div>

              <p className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-ink/50">
                <Icon name="check" size={13} className="text-leafDark" />
                Cocok dimulai tanpa pengetahuan coding sebelumnya.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-[440px]">
              <div className="absolute inset-x-8 bottom-1 top-8 rotate-2 rounded-lg border-2 border-ink/15 bg-mint/60" aria-hidden="true" />
              <figure className="relative rotate-1 rounded-lg border-2 border-ink bg-surface p-3 shadow-pop-lg">
                <span className="tape -top-3 left-8" aria-hidden="true" />
                <div className="paper-panel relative overflow-hidden rounded-md border border-ink/15 px-4 pb-4 pt-9">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-ink/45">Catatan 01</div>
                      <div className="mt-1 font-display text-lg font-black leading-tight">Halo, aku Pipi.</div>
                    </div>
                    <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-ink bg-sun text-[10px] font-black">01</span>
                  </div>

                  <div className="mt-2 flex justify-center">
                    <Pipi mood="happy" stage={save ? evolution : 'baby'} size={250} animate interactive />
                  </div>

                  <div className="relative -mt-1 rounded-md border-2 border-ink bg-surface px-3 py-2">
                    <p className="text-xs font-bold leading-snug text-ink/75">
                      “Hari ini kita belajar memberi perintah ke komputer. Mulai dari satu baris saja.”
                    </p>
                  </div>

                  <div className="mt-3 rounded-md bg-code px-3 py-2 font-mono text-[11px] text-code-ink">
                    <span className="text-[#7FAE93]"># coba tulis ini</span>
                    <br />
                    <span className="text-[#FFD86B]">print</span>
                    <span className="text-code-ink">(</span>
                    <span className="text-[#B9F5CE]">"Halo, aku siap belajar!"</span>
                    <span className="text-code-ink">)</span>
                  </div>
                </div>
                <figcaption className="sr-only">Contoh halaman belajar bersama Pipi.</figcaption>
              </figure>

              <div className="absolute -bottom-5 -right-2 rotate-3 rounded-md border-2 border-ink bg-coral px-3 py-2 font-display text-xs font-black text-white shadow-pop-sm sm:-right-5">
                Mulai dari nol, kok.
              </div>
            </div>
          </div>
        </section>

        <section id="isi" className="border-y-2 border-ink/15 bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
            <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
              <div>
                <div className="stamp text-leafDark">Daftar isi</div>
                <h2 className="mt-3 font-display text-3xl font-black leading-tight sm:text-4xl">
                  Enam hal kecil yang dibuka satu per satu.
                </h2>
                <p className="mt-3 max-w-md text-sm font-semibold leading-relaxed text-ink/60">
                  Tidak perlu menghafal semuanya. Setiap topik punya contoh pendek, latihan, dan kuis
                  yang bisa diulang kapan saja.
                </p>
                <div className="mt-5 inline-flex items-center gap-2 rounded-md border-2 border-ink bg-warning-soft px-3 py-2">
                  <Icon name="clock" size={15} />
                  <span className="text-[11px] font-extrabold text-ink/70">15 menit per sesi sudah cukup.</span>
                </div>
              </div>

              <div className="border-t-2 border-ink/20">
                {TOPICS.map((topic, index) => (
                  <button
                    key={topic.title}
                    type="button"
                    onClick={save ? () => navigate(`/lesson/${['w2l1', 'w2l2', 'w3l3', 'w4l1', 'w5l1', 'w6l1'][index]}`) : start}
                    className="index-row group flex w-full items-center gap-3 py-3 text-left transition hover:bg-cream/70"
                  >
                    <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-md border-2 border-ink', topic.tone)}>
                      <Icon name={topic.icon} size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-2">
                        <span className="font-mono text-[9px] font-semibold text-ink/35">0{index + 1}</span>
                        <span className="font-display text-base font-black leading-none">{topic.title}</span>
                      </span>
                      <span className="mt-1 block text-[11px] font-semibold text-ink/50">{topic.text}</span>
                    </span>
                    <Icon name="arrow-right" size={15} className="shrink-0 text-ink/30 transition group-hover:translate-x-0.5 group-hover:text-ink" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div>
              <div className="stamp text-coral-text">Kenapa dibuat begini</div>
              <h2 className="mt-3 font-display text-3xl font-black leading-[1.05] sm:text-4xl">
                Ramah anak, bukan sekadar terlihat lucu.
              </h2>
              <p className="mt-4 text-sm font-semibold leading-relaxed text-ink/65">
                Tampilan dibuat seperti buku latihan: tenang, jelas, dan tidak penuh distraksi. Isinya
                tetap menantang, tetapi setiap langkah dibuat cukup kecil untuk diselesaikan.
              </p>
              <div className="mt-6 border-l-4 border-sun pl-4">
                <p className="font-display text-xl font-black leading-snug text-ink">
                  “Kalau satu halaman terasa berat, berarti halamannya perlu dipecah lagi.”
                </p>
                <p className="mt-2 font-mono text-[10px] font-semibold uppercase tracking-wide text-ink/45">Catatan desain Pipi</p>
              </div>
            </div>

            <div className="border-t-2 border-ink/20">
              {PRINCIPLES.map((item) => (
                <div key={item.n} className="index-row grid gap-2 py-4 sm:grid-cols-[3rem_1fr]">
                  <span className="font-mono text-xs font-semibold text-coral-text">{item.n}</span>
                  <div>
                    <h3 className="font-display text-lg font-black leading-tight">{item.title}</h3>
                    <p className="mt-1 max-w-lg text-xs font-semibold leading-relaxed text-ink/60">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="dunia" className="border-y-2 border-ink/15 bg-mint/45">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="stamp text-leafDark">Peta perjalanan</div>
                <h2 className="mt-3 font-display text-3xl font-black leading-tight sm:text-4xl">Tujuh bab, satu petualangan.</h2>
                <p className="mt-2 max-w-xl text-sm font-semibold text-ink/60">
                  Setiap dunia punya misi pendek dan satu boss. Selesaikan satu bab untuk membuka bab berikutnya.
                </p>
              </div>
              {save && (
                <Link to="/adventure" className="inline-flex items-center gap-1.5 font-display text-xs font-extrabold text-leafDark hover:underline">
                  Buka peta lengkap <Icon name="arrow-right" size={14} />
                </Link>
              )}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {WORLDS.map((world) => {
                const progress = save ? worldProgress(save, world) : null
                const locked = progress ? !progress.unlocked : world.order > 2
                const content = (
                  <div
                    className={cn(
                      'world-card group relative flex h-full flex-col overflow-hidden rounded-lg border-2 border-ink p-4 transition',
                      locked ? 'opacity-70' : 'hover:-translate-y-1',
                    )}
                    style={{ '--world-soft': world.palette.soft } as CSSProperties}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="grid h-10 w-10 place-items-center rounded-md border-2 border-ink text-[#18392B]"
                          style={{ backgroundColor: world.palette.accent }}
                        >
                          <Icon name={locked ? 'lock' : world.icon} size={19} />
                        </span>
                        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-ink/40">
                          Bab {String(world.order).padStart(2, '0')}
                        </span>
                      </div>
                      <span className="stamp text-[8px] text-ink/45">{locked ? 'terkunci' : progress?.bossDefeated ? 'tuntas' : 'terbuka'}</span>
                    </div>

                    <h3 className="mt-4 font-display text-xl font-black leading-tight">{world.name}</h3>
                    <p className="mt-1 text-[11px] font-semibold leading-snug text-ink/55">{world.tagline}</p>

                    <div className="mt-auto flex items-center justify-between border-t border-dashed border-ink/20 pt-3 text-[10px] font-extrabold text-ink/50">
                      <span>{world.levels.length} misi</span>
                      <span className="inline-flex items-center gap-1">
                        {progress?.bossDefeated ? <Icon name="check" size={12} className="text-leafDark" /> : locked ? <Icon name="lock" size={12} /> : <Icon name="play" size={12} />}
                        {progress?.bossDefeated ? 'Selesai' : locked ? 'Selesaikan bab sebelumnya' : 'Bisa dimulai'}
                      </span>
                    </div>
                  </div>
                )

                if (!save) {
                  return (
                    <button key={world.id} onClick={start} className="text-left" aria-label={`Mulai untuk membuka ${world.name}`}>
                      {content}
                    </button>
                  )
                }
                return locked ? (
                  <div key={world.id} aria-disabled="true">{content}</div>
                ) : (
                  <Link key={world.id} to={`/world/${world.id}`}>{content}</Link>
                )
              })}

              <div className="flex flex-col justify-between rounded-lg border-2 border-ink bg-sun p-4 shadow-pop">
                <div>
                  <span className="grid h-10 w-10 place-items-center rounded-md border-2 border-ink bg-surface">
                    <Icon name="crown" size={19} />
                  </span>
                  <h3 className="mt-4 font-display text-xl font-black leading-tight">Halaman terakhir</h3>
                  <p className="mt-1 text-[11px] font-bold leading-snug text-ink/65">
                    Selesaikan tujuh dunia, kumpulkan badge, dan bawa Pipi ke bentuk terakhirnya.
                  </p>
                </div>
                <button onClick={start} className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-display text-xs font-extrabold text-ink hover:underline">
                  Mulai dari halaman satu <Icon name="arrow-right" size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="cara" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="max-w-2xl">
            <div className="stamp text-leafDark">Cara main</div>
            <h2 className="mt-3 font-display text-3xl font-black leading-tight sm:text-4xl">Empat langkah, tanpa buru-buru.</h2>
            <p className="mt-2 text-sm font-semibold text-ink/60">
              Satu misi bisa selesai dalam beberapa menit. Kalau lelah, tutup saja; progres tersimpan.
            </p>
          </div>

          <ol className="mt-6 grid border-y-2 border-ink/20 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li
                key={step.n}
                className={cn(
                  'border-b-2 border-ink/15 p-4 sm:border-b-0 lg:border-r-2',
                  index < 2 && 'sm:border-b-2',
                  index % 2 === 0 && 'sm:border-r-2 lg:border-r-2',
                  index === 3 && 'lg:border-r-0',
                )}
              >
                <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-coral-text">{step.n}</div>
                <h3 className="mt-2 font-display text-xl font-black">{step.title}</h3>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-ink/55">{step.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="flex gap-3 rounded-lg border-2 border-ink bg-surface p-4 shadow-pop-sm">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border-2 border-ink bg-grape"><Icon name="gamepad" size={19} /></span>
              <div>
                <h3 className="font-display text-base font-black">Empat mini games</h3>
                <p className="mt-1 text-[11px] font-semibold leading-relaxed text-ink/55">
                  Tebak output, temukan bug, susun kode, dan uji kecepatan. Tiga ronde pertama tiap hari memberi XP.
                </p>
              </div>
            </div>
            <div className="flex gap-3 rounded-lg border-2 border-ink bg-surface p-4 shadow-pop-sm">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border-2 border-ink bg-sky"><Icon name="chat" size={19} /></span>
              <div>
                <h3 className="font-display text-base font-black">Pipi siap membantu</h3>
                <p className="mt-1 text-[11px] font-semibold leading-relaxed text-ink/55">
                  Tanya bagian yang belum jelas. Pipi menjelaskan dengan bahasa sederhana, tanpa langsung membocorkan jawaban.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="sumber" className="border-t-2 border-ink/15 bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="stamp text-ink/55">Sumber materi</div>
                <h2 className="mt-2 font-display text-2xl font-black">Ditulis ulang untuk pemula.</h2>
              </div>
              <p className="max-w-md text-[11px] font-semibold leading-relaxed text-ink/50">
                Materi mengacu pada dokumentasi Python dan referensi umum, lalu disederhanakan untuk anak.
                Setiap misi mencantumkan rujukan topiknya.
              </p>
            </div>
            <div className="mt-4 grid border-t-2 border-ink/20 sm:grid-cols-2">
              {SOURCES.map((source) => (
                <a
                  key={source.label}
                  href={source.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="index-row flex items-center gap-3 py-2.5 transition hover:bg-cream/60"
                >
                  <Icon name="book" size={14} className="shrink-0 text-leafDark" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-extrabold">{source.label}</span>
                    <span className="block text-[10px] font-semibold text-ink/45">{source.note}</span>
                  </span>
                  <Icon name="external" size={12} className="shrink-0 text-ink/30" />
                </a>
              ))}
            </div>
            <p className="mt-4 max-w-2xl text-[10px] font-semibold leading-relaxed text-ink/40">
              PIPI CODE ADVENTURE adalah proyek belajar independen dan tidak berafiliasi dengan Python
              Software Foundation. Python adalah merek dagang Python Software Foundation.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="relative overflow-hidden rounded-xl border-2 border-ink bg-sun p-6 shadow-pop-lg sm:p-9">
            <div className="absolute inset-y-0 right-0 hidden w-1/3 halftone opacity-25 sm:block" aria-hidden="true" />
            <div className="relative grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/55">Halaman berikutnya</div>
                <h2 className="mt-2 max-w-xl font-display text-3xl font-black leading-[1.05] sm:text-4xl">Siap menulis baris pertama?</h2>
                <p className="mt-2 max-w-lg text-sm font-semibold leading-relaxed text-ink/70">
                  {save
                    ? `Petualanganmu sudah dimulai, ${save.profile.name}. Pipi menunggumu di misi berikutnya.`
                    : 'Gratis, tanpa email, dan bisa langsung dimainkan di browser. Tidak perlu memasang apa pun.'}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button variant="primary" size="lg" onClick={start} iconRight="arrow-right">
                    {save ? 'Lanjutkan petualangan' : 'Mulai sekarang'}
                  </Button>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-ink/55">
                    <Icon name="check" size={12} /> Progres tersimpan lokal
                  </span>
                </div>
                {accounts.length > 1 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-ink/50">
                    Profil lain:
                    {accounts.slice(0, 4).map((account) => (
                      <button
                        key={account.id}
                        onClick={() => {
                          switchProfile(account.id)
                          navigate('/dashboard')
                        }}
                        className="inline-flex items-center gap-1 rounded-md border-2 border-ink/15 bg-surface/70 px-2 py-0.5 font-extrabold text-ink/70 hover:bg-surface"
                      >
                        <Avatar avatar={account.avatar} size={16} ring={false} /> {account.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="-mb-8 hidden w-[180px] justify-center sm:flex">
                <Pipi mood="celebrate" size={170} stage={save ? evolution : 'baby'} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-ink/15 bg-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-[11px] font-bold text-ink/45 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md border-2 border-ink bg-sun"><Icon name="code" size={13} /></span>
            PIPI CODE ADVENTURE
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#isi" className="hover:text-ink">Isi buku</a>
            <a href="#dunia" className="hover:text-ink">7 dunia</a>
            <a href="#sumber" className="hover:text-ink">Sumber</a>
            <span>Dibuat untuk belajar dengan tenang.</span>
          </div>
        </div>
      </footer>

      <Modal open={open} onClose={() => setOpen(false)} title="Buat profil petualang" icon="user-plus" tone="cream">
        <form onSubmit={submit}>
          <label htmlFor="profile-name" className="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/55">
            Nama petualang
          </label>
          <input
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            placeholder="Contoh: Andra"
            autoFocus
            className="w-full rounded-lg border-2 border-ink bg-surface px-3 py-2.5 font-display text-sm font-bold text-ink shadow-inner-soft outline-none placeholder:font-semibold placeholder:text-ink/25 focus:ring-2 focus:ring-grape"
          />
          <p className="mt-1 text-[10px] font-semibold text-ink/40">Nama ini tampil di dashboard dan profil. Bisa diubah nanti.</p>

          <div className="mb-1 mt-4 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/55">Pilih avatar</div>
          <AvatarPicker value={avatar} onChange={setAvatar} />

          <Button type="submit" variant="primary" size="lg" className="mt-4 w-full" iconRight="sparkles">
            Mulai Petualangan
          </Button>
          <p className="mt-2 text-center text-[10px] font-semibold text-ink/40">
            Progres disimpan di localStorage browser ini. Tidak ada data yang dikirim ke server.
          </p>
        </form>
      </Modal>
    </div>
  )
}
