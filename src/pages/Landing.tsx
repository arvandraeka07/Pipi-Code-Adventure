import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGame } from '../store/GameContext'
import { WORLDS } from '../data/worlds'
import { worldProgress } from '../lib/progress'
import { Pipi } from '../components/Pipi'
import { Icon } from '../components/Icon'
import { Button, Card, Chip, Modal, cn } from '../components/ui'
import { AVATAR_META, Avatar } from '../components/Avatar'

const FEATURES = [
  {
    icon: 'map',
    title: '7 dunia petualangan',
    text: 'Dari Lembah Pertama sampai Kerajaan Python. Setiap dunia punya materi, tantangan, kuis, dan boss.',
    color: '#D8F7E4',
  },
  {
    icon: 'terminal',
    title: 'Python sungguhan',
    text: 'Jalankan kode Python langsung di browser dengan Pyodide. Tanpa instalasi, tanpa setup.',
    color: '#BFE9FF',
  },
  {
    icon: 'sword',
    title: 'Boss battle',
    text: 'Kalahkan boss dengan jawaban benar dan tantangan kode. Setiap boss menguji satu keterampilan.',
    color: '#FFD9E3',
  },
  {
    icon: 'trophy',
    title: 'Badge & evolusi',
    text: 'Kumpulkan 18 badge, naik level, dan lihat Pipi berevolusi dari Baby sampai Python Master.',
    color: '#FFF4CC',
  },
  {
    icon: 'chat',
    title: 'Pipi Tutor',
    text: 'Tutor lokal yang menjelaskan konsep, memeriksa kode, dan memberi petunjuk tanpa membocorkan jawaban.',
    color: '#F0EAFF',
  },
  {
    icon: 'gamepad',
    title: '4 mini games',
    text: 'Tebak output, temukan bug, susun puzzle kode, dan uji kecepatan. Belajar tetap terasa seperti bermain.',
    color: '#FFE9C7',
  },
]

const STEPS = [
  { n: '01', title: 'Baca materinya', text: 'Penjelasan singkat, contoh kode, dan arti tiap baris.' },
  { n: '02', title: 'Selesaikan tantangan', text: 'Tulis kode dan jalankan. Pipi memeriksa output atau tesnya.' },
  { n: '03', title: 'Jawab kuisnya', text: 'Tiga pertanyaan dengan umpan balik dan penjelasan.' },
  { n: '04', title: 'Kalahkan boss', text: 'Tuntaskan dunia, buka dunia berikutnya, dan berevolusi.' },
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
    <div className="min-h-screen overflow-x-hidden">
      <header className="sticky top-0 z-40 border-b-[3px] border-ink/10 bg-cream/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-2xl border-[3px] border-ink bg-mint shadow-pop-sm">
              <span className="absolute -bottom-2">
                <Pipi mood="happy" size={46} />
              </span>
            </span>
            <span className="leading-none">
              <span className="block font-display text-sm font-extrabold tracking-tight text-ink">PIPI CODE</span>
              <span className="mt-0.5 block font-display text-[10px] font-bold tracking-[0.24em] text-leafDark">ADVENTURE</span>
            </span>
          </Link>
          <nav className="ml-auto hidden items-center gap-5 text-xs font-extrabold text-ink/60 md:flex" aria-label="Navigasi halaman">
            <a href="#fitur" className="transition hover:text-ink">Fitur</a>
            <a href="#dunia" className="transition hover:text-ink">Dunia</a>
            <a href="#cara" className="transition hover:text-ink">Cara belajar</a>
            <a href="#sumber" className="transition hover:text-ink">Sumber</a>
          </nav>
          <div className="ml-auto flex items-center gap-2 md:ml-4">
            {save ? (
              <Button size="sm" variant="sun" onClick={() => navigate('/dashboard')} iconRight="arrow-right">
                Dashboard
              </Button>
            ) : (
              <Button size="sm" variant="sun" onClick={start} iconRight="play">
                Mulai gratis
              </Button>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="relative mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 sm:pt-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
            <div className="relative z-10 animate-fade-up">
              <Chip icon="sparkles" className="border-ink/20 bg-white">Belajar Python dari nol, sambil bermain</Chip>
              <h1 className="mt-4 font-display text-[2.35rem] font-extrabold leading-[1.04] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
                Setiap baris kode adalah{' '}
                <span className="relative inline-block">
                  <span className="relative z-10">petualangan.</span>
                  <span className="absolute inset-x-0 bottom-1 z-0 h-3 -rotate-1 rounded-full bg-sun/80" />
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-sm font-semibold leading-relaxed text-ink/65 sm:text-base">
                Bersama Pipi, si ular Python yang ramah, kamu akan menjelajahi 7 dunia, menulis kode
                sungguhan, mengalahkan boss, dan berevolusi dari pemula menjadi Python Master.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button size="lg" variant="primary" onClick={start} iconRight="arrow-right">
                  {save ? `Lanjutkan, ${save.profile.name}` : 'Mulai Petualangan'}
                </Button>
                <a
                  href="#dunia"
                  className="inline-flex items-center gap-2 rounded-2xl border-[3px] border-ink bg-paper px-4 py-3 font-display text-sm font-extrabold shadow-pop transition active:translate-y-[3px] active:shadow-pop-sm"
                >
                  <Icon name="compass" size={18} />
                  Lihat 7 dunia
                </a>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-extrabold text-ink/55">
                <span className="inline-flex items-center gap-1.5"><Icon name="check" size={14} className="text-leafDark" /> Tanpa instalasi</span>
                <span className="inline-flex items-center gap-1.5"><Icon name="check" size={14} className="text-leafDark" /> Progres tersimpan lokal</span>
                <span className="inline-flex items-center gap-1.5"><Icon name="check" size={14} className="text-leafDark" /> Materi berbahasa Indonesia</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[480px]">
              <div className="absolute inset-6 rounded-[44%_56%_48%_52%/54%_44%_56%_46%] bg-mint/80" />
              <div className="absolute inset-10 rounded-[52%_48%_44%_56%/46%_56%_44%_54%] border-[3px] border-dashed border-leaf/30 animate-spin-slow" />
              <div className="relative flex justify-center py-4">
                <Pipi mood="happy" stage={save ? evolution : 'baby'} size={330} animate sparkle />
              </div>

              <div className="absolute left-0 top-8 animate-float rounded-2xl border-[3px] border-ink bg-paper px-3 py-2 shadow-pop-sm">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-xl border-2 border-ink bg-sun">
                    <Icon name="bolt" size={15} />
                  </span>
                  <div>
                    <div className="font-display text-sm font-extrabold leading-none">+120 XP</div>
                    <div className="text-[10px] font-bold text-ink/45">Misi selesai</div>
                  </div>
                </div>
              </div>
              <div
                className="absolute bottom-10 right-0 animate-float rounded-2xl border-[3px] border-ink bg-paper px-3 py-2 shadow-pop-sm"
                style={{ animationDelay: '1.2s' }}
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-xl border-2 border-ink bg-grape">
                    <Icon name="trophy" size={15} />
                  </span>
                  <div>
                    <div className="font-display text-sm font-extrabold leading-none">Badge baru!</div>
                    <div className="text-[10px] font-bold text-ink/45">Loop Master</div>
                  </div>
                </div>
              </div>
              <div
                className="absolute right-3 top-4 animate-float rounded-full border-[3px] border-ink bg-paper px-3 py-1.5 shadow-pop-sm"
                style={{ animationDelay: '0.6s' }}
              >
                <span className="inline-flex items-center gap-1 font-display text-xs font-extrabold">
                  <Icon name="flame" size={14} className="text-coral" /> Streak 7 hari
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { icon: 'map', value: '7', label: 'Dunia' },
              { icon: 'book', value: '27', label: 'Misi belajar' },
              { icon: 'sword', value: '7', label: 'Boss' },
              { icon: 'gamepad', value: '4', label: 'Mini games' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 rounded-2xl border-2 border-ink/15 bg-white/70 px-3 py-2">
                <Icon name={stat.icon} size={17} className="text-leafDark" />
                <div>
                  <div className="font-display text-lg font-extrabold leading-none">{stat.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wide text-ink/45">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="fitur" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Chip icon="sparkles">Kenapa belajar di sini?</Chip>
            <h2 className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">Belajar yang terasa seperti bermain game</h2>
            <p className="mt-2 text-sm font-semibold text-ink/60">
              Semua fitur dirancang untuk membuat latihan Python konsisten, menyenangkan, dan terukur.
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <Card key={f.title} hover className="p-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl border-2 border-ink" style={{ backgroundColor: f.color }}>
                  <Icon name={f.icon} size={20} />
                </div>
                <h3 className="mt-2.5 font-display text-base font-extrabold">{f.title}</h3>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-ink/60">{f.text}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="dunia" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <Chip icon="map">Peta petualangan</Chip>
              <h2 className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">Tujuh dunia, satu perjalanan</h2>
              <p className="mt-1 max-w-xl text-sm font-semibold text-ink/60">
                Setiap dunia membuka keterampilan baru. Kalahkan boss-nya untuk membuka dunia berikutnya.
              </p>
            </div>
            {save && (
              <Link to="/adventure" className="inline-flex items-center gap-1.5 font-display text-xs font-extrabold text-leafDark hover:underline">
                Buka peta lengkap <Icon name="arrow-right" size={14} />
              </Link>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {WORLDS.map((world) => {
              const progress = save ? worldProgress(save, world) : null
              const locked = progress ? !progress.unlocked : world.order > 2
              const content = (
                <div
                  className={cn(
                    'group relative flex h-full flex-col overflow-hidden rounded-[24px] border-[3px] border-ink p-4 shadow-pop transition',
                    locked ? 'opacity-80' : 'hover:-translate-y-1 hover:shadow-pop-lg',
                  )}
                  style={{ background: `linear-gradient(145deg, ${world.palette.soft}, #FFFEF8 72%)` }}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className="grid h-11 w-11 place-items-center rounded-2xl border-[3px] border-ink"
                      style={{ backgroundColor: world.palette.accent }}
                    >
                      <Icon name={world.icon} size={21} />
                    </span>
                    <span className="rounded-full border-2 border-ink/15 bg-white/80 px-2 py-0.5 font-display text-[10px] font-extrabold text-ink/55">
                      Dunia {world.order}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-extrabold leading-tight">{world.name}</h3>
                  <p className="mt-1 text-[11px] font-semibold leading-snug text-ink/60">{world.tagline}</p>
                  <div className="mt-auto flex items-center justify-between pt-3 text-[10px] font-extrabold text-ink/50">
                    <span>{world.levels.length} misi • boss</span>
                    {progress ? (
                      <span className="inline-flex items-center gap-1 text-ink/70">
                        {progress.bossDefeated ? <Icon name="check" size={12} className="text-leafDark" /> : locked ? <Icon name="lock" size={12} /> : <Icon name="play" size={12} />}
                        {progress.bossDefeated ? 'Tuntas' : locked ? 'Terkunci' : 'Terbuka'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-ink/70">
                        {locked ? <Icon name="lock" size={12} /> : <Icon name="play" size={12} />}
                        {locked ? 'Terkunci' : 'Terbuka'}
                      </span>
                    )}
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
            <Card tone="cream" className="flex flex-col justify-between p-4">
              <div>
                <span className="grid h-11 w-11 place-items-center rounded-2xl border-[3px] border-ink bg-sun">
                  <Icon name="crown" size={21} />
                </span>
                <h3 className="mt-3 font-display text-lg font-extrabold leading-tight">Jadilah Python Master</h3>
                <p className="mt-1 text-[11px] font-semibold leading-snug text-ink/60">
                  Tuntaskan semua dunia, kumpulkan 18 badge, dan bawa Pipi ke evolusi terakhirnya.
                </p>
              </div>
              <button onClick={start} className="mt-3 inline-flex items-center gap-1.5 font-display text-xs font-extrabold text-leafDark hover:underline">
                Mulai sekarang <Icon name="arrow-right" size={14} />
              </button>
            </Card>
          </div>
        </section>

        <section id="cara" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="rounded-[32px] border-[3px] border-ink bg-[#123B2A] p-5 text-[#E9FFF1] shadow-pop sm:p-7">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <Chip icon="play" className="border-white/20 bg-white/10 text-mint">Alur belajar</Chip>
                <h2 className="mt-3 font-display text-2xl font-extrabold text-white sm:text-3xl">Empat langkah, satu misi tuntas</h2>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-mint/70">
                  Kamu tidak hanya membaca. Setiap misi memintamu menulis kode, menguji pemahaman, lalu
                  membuktikannya di hadapan boss.
                </p>
                <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-mint/50">
                  <Icon name="shield" size={14} /> Hadiah XP hanya dari aktivitas nyata
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {STEPS.map((s) => (
                  <div key={s.n} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-lg bg-sun font-display text-[11px] font-extrabold text-ink">{s.n}</span>
                      <h3 className="font-display text-sm font-extrabold text-white">{s.title}</h3>
                    </div>
                    <p className="mt-1.5 text-[11px] font-semibold leading-snug text-mint/60">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-3 md:grid-cols-2">
            <Card tone="grape" className="flex flex-col p-5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-10 w-10 place-items-center rounded-xl border-2 border-ink bg-white/70"><Icon name="gamepad" size={20} /></span>
                <h3 className="font-display text-lg font-extrabold">Istirahat sambil mengasah otak</h3>
              </div>
              <p className="mt-2 text-xs font-semibold leading-relaxed text-ink/65">
                Tebak Output, Find The Bug, Code Puzzle, dan Speed Coding. Tiga ronde pertama tiap hari
                memberi XP — sisanya tetap seru tanpa hadiah.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {['Tebak Output', 'Find The Bug', 'Code Puzzle', 'Speed Coding'].map((g) => (
                  <span key={g} className="rounded-full border-2 border-ink/15 bg-white/70 px-2 py-0.5 text-[10px] font-extrabold">{g}</span>
                ))}
              </div>
            </Card>
            <Card tone="mint" className="flex flex-col p-5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-10 w-10 place-items-center rounded-xl border-2 border-ink bg-white/70"><Icon name="chat" size={20} /></span>
                <h3 className="font-display text-lg font-extrabold">Tutor yang tidak menghakimi</h3>
              </div>
              <p className="mt-2 text-xs font-semibold leading-relaxed text-ink/65">
                Pipi Tutor menjelaskan konsep dengan bahasa sederhana, membaca kode untuk menemukan
                kesalahan sintaks, dan memberikan latihan tambahan. Kamu tetap yang menulis jawabannya.
              </p>
              <div className="mt-3 rounded-xl border-2 border-ink/10 bg-white/60 p-2.5 font-mono text-[11px] text-ink/60">
                “Pipi, kenapa print aku error?”
              </div>
            </Card>
          </div>
        </section>

        <section id="sumber" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="rounded-[28px] border-[3px] border-ink bg-paper p-5 shadow-pop">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <Chip icon="book">Kredibilitas materi</Chip>
                <h2 className="mt-2 font-display text-xl font-extrabold">Belajar dari sumber yang jelas</h2>
              </div>
              <p className="max-w-md text-[11px] font-semibold leading-snug text-ink/50">
                Materi ditulis ulang untuk pemula dan disesuaikan dengan urutan latihan. Setiap misi di
                dalam aplikasi mencantumkan rujukan topiknya.
              </p>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {SOURCES.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-3 rounded-xl border-2 border-ink/10 bg-white/60 px-3 py-2 transition hover:border-ink/25 hover:bg-white"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-mint"><Icon name="book" size={15} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-extrabold">{s.label}</span>
                    <span className="block text-[10px] font-semibold text-ink/45">{s.note}</span>
                  </span>
                  <Icon name="external" size={13} className="text-ink/30" />
                </a>
              ))}
            </div>
            <p className="mt-3 text-[10px] font-semibold leading-relaxed text-ink/40">
              PIPI CODE ADVENTURE adalah proyek belajar independen dan tidak berafiliasi dengan Python
              Software Foundation. Python adalah merek dagang Python Software Foundation.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
          <div className="relative overflow-hidden rounded-[32px] border-[3px] border-ink bg-sun p-6 text-center shadow-pop sm:p-10">
            <div className="absolute inset-0 bg-dots opacity-30" />
            <div className="relative">
              <div className="mx-auto mb-2 w-fit animate-bob">
                <Pipi mood="celebrate" size={120} stage={save ? evolution : 'baby'} />
              </div>
              <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Siap menulis baris pertamamu?</h2>
              <p className="mx-auto mt-2 max-w-md text-sm font-semibold text-ink/65">
                {save
                  ? `Petualanganmu sudah dimulai, ${save.profile.name}. Pipi menunggumu di misi berikutnya!`
                  : 'Gratis, tanpa akun email, dan bisa dimainkan langsung di browser. Pipi sudah menunggu!'}
              </p>
              <Button variant="primary" size="lg" className="mt-5" onClick={start} iconRight="arrow-right">
                {save ? 'Lanjutkan Petualangan' : 'Mulai Sekarang'}
              </Button>
              {accounts.length > 1 && (
                <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-bold text-ink/50">
                  Profil lain:
                  {accounts.slice(0, 4).map((a) => (
                    <button
                      key={a.id}
                      onClick={() => {
                        switchProfile(a.id)
                        navigate('/dashboard')
                      }}
                      className="inline-flex items-center gap-1 rounded-full border-2 border-ink/15 bg-white/60 px-2 py-0.5 font-extrabold text-ink/70 hover:bg-white"
                    >
                      <Avatar avatar={a.avatar} size={16} ring={false} /> {a.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t-[3px] border-ink/10 bg-paper/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-[11px] font-bold text-ink/45 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg border-2 border-ink bg-mint"><Icon name="sparkles" size={13} /></span>
            PIPI CODE ADVENTURE
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#fitur" className="hover:text-ink">Fitur</a>
            <a href="#dunia" className="hover:text-ink">Dunia</a>
            <a href="#sumber" className="hover:text-ink">Sumber</a>
            <span>Dibuat untuk belajar Python dengan gembira.</span>
          </div>
        </div>
      </footer>

      <Modal open={open} onClose={() => setOpen(false)} title="Buat profil petualang" icon="user-plus" tone="cream">
        <form onSubmit={submit}>
          <label htmlFor="profile-name" className="mb-1 block font-display text-xs font-extrabold uppercase tracking-wide text-ink/55">
            Nama petualang
          </label>
          <input
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            placeholder="Contoh: Andra"
            autoFocus
            className="w-full rounded-xl border-[3px] border-ink bg-white px-3 py-2.5 font-display text-sm font-bold text-ink shadow-inner-soft outline-none placeholder:font-semibold placeholder:text-ink/25 focus:ring-2 focus:ring-grape"
          />
          <p className="mt-1 text-[10px] font-semibold text-ink/40">Nama ini tampil di dashboard dan profil. Bisa diubah nanti.</p>

          <div className="mt-4 mb-1 font-display text-xs font-extrabold uppercase tracking-wide text-ink/55">Pilih avatar</div>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(AVATAR_META).map(([id, meta]) => (
              <button
                key={id}
                type="button"
                onClick={() => setAvatar(id)}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-xl border-[3px] p-2 transition',
                  avatar === id ? 'border-ink bg-sun shadow-pop-sm' : 'border-ink/10 bg-white/70 hover:border-ink/30',
                )}
                aria-pressed={avatar === id}
              >
                <Avatar avatar={id} size={38} ring={false} />
                <span className="text-[10px] font-extrabold">{meta.label}</span>
              </button>
            ))}
          </div>

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
