import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useGame } from '../store/GameContext'
import { downloadSave } from '../lib/storage'
import { getPythonEngineStatus, pythonRunner } from '../lib/python'
import { todayKey } from '../lib/game'
import { Pipi } from '../components/Pipi'
import { Icon } from '../components/Icon'
import { Button, Card, Chip, Modal, PageHeader, ProgressBar, SectionHeading, cn } from '../components/ui'

function ToggleRow({
  icon,
  title,
  description,
  checked,
  onChange,
  note,
}: {
  icon: string
  title: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
  note?: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border-2 border-ink/10 bg-white/60 p-3">
      <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl border-2 border-ink', checked ? 'bg-mint' : 'bg-ink/5')}>
        <Icon name={icon} size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-display text-[12px] font-extrabold">{title}</div>
        <p className="mt-0.5 text-[10px] font-semibold leading-snug text-ink/50">{description}</p>
        {note && <div className="mt-0.5 text-[9px] font-bold text-ink/35">{note}</div>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-1 h-6 w-11 shrink-0 rounded-full border-2 border-ink transition',
          checked ? 'bg-leaf' : 'bg-ink/15',
        )}
      >
        <span
          className={cn(
            'absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-ink bg-white transition-all',
            checked ? 'left-[22px]' : 'left-[3px]',
          )}
        />
      </button>
    </div>
  )
}

export default function Settings() {
  const { save, updateSettings, resetProgress, importSaveText, notify } = useGame()
  const [resetOpen, setResetOpen] = useState(false)
  const [resetPhrase, setResetPhrase] = useState('')
  const [engine, setEngine] = useState(getPythonEngineStatus)
  const fileRef = useRef<HTMLInputElement>(null)
  if (!save) return null

  const settings = save.settings
  const today = todayKey()
  const rewardedToday = Object.values(save.daily.date === today ? save.daily.gameXp : {}).reduce((n, v) => n + v, 0)

  const exportData = () => {
    downloadSave(save)
    notify('info', 'Save diekspor', 'File JSON berisi progresmu sudah diunduh.')
  }

  const importData = async (file: File | undefined) => {
    if (!file) return
    try {
      const text = await file.text()
      if (!importSaveText(text)) {
        notify('error', 'Import gagal', 'File tidak dikenali atau bukan save PIPI CODE ADVENTURE.')
      }
    } catch {
      notify('error', 'Import gagal', 'File tidak bisa dibaca.')
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  const preloadEngine = async () => {
    setEngine({ ready: false, loading: true })
    const ok = await pythonRunner.preload()
    setEngine({ ready: ok, loading: false })
    if (ok) notify('info', 'Mesin Python siap', 'Sekarang kamu bisa menjalankan kode tanpa menunggu unduhan.')
    else notify('error', 'Mesin Python belum siap', 'Periksa koneksi internet, lalu coba lagi. Pyodide diunduh saat pertama dipakai.')
  }

  const doReset = () => {
    resetProgress()
    setResetOpen(false)
    setResetPhrase('')
  }

  return (
    <div>
      <PageHeader title="Pengaturan" subtitle="Sesuaikan pengalaman dan kelola datamu." icon="settings">
        <Chip icon="lock" color="#159A55">Data lokal</Chip>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card className="p-4">
            <SectionHeading eyebrow="Preferensi" title="Pengalaman belajar" subtitle="Perubahan langsung diterapkan dan disimpan." className="mb-3" />
            <div className="space-y-2">
              <ToggleRow
                icon={settings.sound ? 'volume' : 'volume-off'}
                title="Efek suara"
                description="Bunyi kecil saat klik, berhasil, naik level, dan membuka badge."
                checked={settings.sound}
                onChange={(v) => updateSettings({ sound: v })}
              />
              <ToggleRow
                icon="sparkles"
                title="Animasi"
                description="Animasi Pipi, perayaan, dan transisi antarmuka."
                checked={settings.animations}
                onChange={(v) => updateSettings({ animations: v })}
                note="Matikan jika perangkat terasa lambat atau kamu lebih nyaman tanpa gerakan."
              />
              <ToggleRow
                icon="chat"
                title="Simpan riwayat tutor"
                description="Menyimpan percakapan dengan Pipi di perangkat ini."
                checked={settings.tutorHistory}
                onChange={(v) => updateSettings({ tutorHistory: v })}
                note={settings.tutorHistory ? 'Matikan untuk menghapus riwayat saat ini dan berhenti menyimpan.' : 'Riwayat saat ini kosong dan tidak akan disimpan.'}
              />
              <ToggleRow
                icon="code"
                title="Nomor baris editor"
                description="Menampilkan nomor baris di editor kode Python."
                checked={settings.showLineNumbers}
                onChange={(v) => updateSettings({ showLineNumbers: v })}
              />
            </div>
          </Card>

          <Card className="p-4">
            <SectionHeading eyebrow="Mesin Python" title="Status Pyodide" subtitle="Python berjalan di browser melalui WebAssembly. Tidak ada kode yang dikirim ke server." className="mb-3" />
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-ink/10 bg-white/60 p-3">
              <span className={cn('grid h-11 w-11 place-items-center rounded-xl border-[3px] border-ink', engine.ready ? 'bg-leaf text-white' : engine.loading ? 'bg-sun' : 'bg-ink/10')}>
                <Icon name={engine.ready ? 'check' : engine.loading ? 'refresh-cw' : 'terminal'} size={20} className={engine.loading ? 'animate-spin' : ''} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-display text-sm font-extrabold">
                  {engine.ready ? 'Siap digunakan' : engine.loading ? 'Mengunduh & menyiapkan...' : 'Belum dimuat'}
                </div>
                <p className="text-[10px] font-semibold leading-snug text-ink/50">
                  {engine.ready
                    ? 'Editor dan tantangan bisa langsung menjalankan kode.'
                    : 'Unduhan pertama sekitar 10 MB. Setelah itu browser biasanya menyimpannya di cache.'}
                </p>
              </div>
              <Button size="sm" variant={engine.ready ? 'secondary' : 'primary'} icon="download" onClick={() => void preloadEngine()} disabled={engine.loading || engine.ready}>
                {engine.ready ? 'Siap' : 'Muat sekarang'}
              </Button>
            </div>
            <p className="mt-2 flex items-start gap-1.5 text-[10px] font-semibold leading-snug text-ink/40">
              <Icon name="info" size={12} className="mt-0.5 shrink-0" />
              Butuh koneksi internet saat memuat pertama kali. Setelah siap, eksekusi tetap berjalan lokal tanpa mengirim kodemu ke mana pun.
            </p>
          </Card>

          <Card className="p-4">
            <SectionHeading eyebrow="Data" title="Cadangkan & pulihkan" subtitle="Progres hanya tersimpan di localStorage browser ini." className="mb-3" />
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="primary" icon="download" onClick={exportData}>Ekspor save</Button>
              <Button size="sm" variant="secondary" icon="upload" onClick={() => fileRef.current?.click()}>Impor save</Button>
              <Link to="/profile"><Button size="sm" variant="ghost" icon="user">Kelola profil</Button></Link>
            </div>
            <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => void importData(e.target.files?.[0])} />
            <p className="mt-2 text-[10px] font-semibold text-ink/40">
              Import akan menggantikan data profil yang sedang aktif. Ekspor dulu jika ingin menyimpan kondisi sekarang.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <div className="rounded-xl border-2 border-ink/10 bg-white/60 px-2 py-1.5">
                <div className="text-[8px] font-extrabold uppercase tracking-wide text-ink/35">Profil</div>
                <div className="truncate text-[11px] font-extrabold">{save.profile.name}</div>
              </div>
              <div className="rounded-xl border-2 border-ink/10 bg-white/60 px-2 py-1.5">
                <div className="text-[8px] font-extrabold uppercase tracking-wide text-ink/35">Mini game berhadiah hari ini</div>
                <div className="text-[11px] font-extrabold">{rewardedToday}/12 ronde</div>
              </div>
              <div className="rounded-xl border-2 border-ink/10 bg-white/60 px-2 py-1.5">
                <div className="text-[8px] font-extrabold uppercase tracking-wide text-ink/35">Versi save</div>
                <div className="text-[11px] font-extrabold">v{save.version}</div>
              </div>
            </div>
            <ProgressBar value={(rewardedToday / 12) * 100} height={6} color="#FFC93C" className="mt-2" />
            <p className="mt-1 text-[9px] font-bold text-ink/35">Hadiah mini game dibatasi 3 ronde per game per hari agar XP tetap seimbang.</p>
          </Card>

          <Card className="border-coral/60 p-4">
            <SectionHeading eyebrow="Zona hati-hati" title="Reset progres" subtitle="Mulai ulang petualangan tanpa menghapus profil." className="mb-3" />
            <div className="rounded-2xl border-2 border-coral/30 bg-coral/5 p-3">
              <p className="text-[11px] font-semibold leading-relaxed text-ink/60">
                XP, koin, materi, badge, boss, dan daily quest akan dikosongkan. Nama, avatar, pengaturan,
                serta riwayat tutor tetap dipertahankan. Tindakan ini tidak bisa dibatalkan.
              </p>
              <Button size="sm" variant="danger" icon="trash" className="mt-2" onClick={() => setResetOpen(true)}>
                Reset progres
              </Button>
            </div>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card tone="cream" className="p-4">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg border-2 border-ink bg-sun"><Icon name="keyboard" size={15} /></span>
              <h3 className="font-display text-sm font-extrabold">Pintasan</h3>
            </div>
            <div className="mt-2 space-y-1.5 text-[10px] font-semibold text-ink/55">
              <div className="flex items-center justify-between rounded-lg border border-ink/10 bg-white/60 px-2 py-1">
                <span>Jalankan kode di Playground</span>
                <kbd className="rounded border border-ink/20 bg-white px-1.5 py-0.5 font-mono text-[9px] font-bold">Ctrl</kbd>
                <span>+</span>
                <kbd className="rounded border border-ink/20 bg-white px-1.5 py-0.5 font-mono text-[9px] font-bold">Enter</kbd>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-ink/10 bg-white/60 px-2 py-1">
                <span>Kirim pesan di tutor</span>
                <kbd className="rounded border border-ink/20 bg-white px-1.5 py-0.5 font-mono text-[9px] font-bold">Enter</kbd>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-ink/10 bg-white/60 px-2 py-1">
                <span>Baris baru di tutor</span>
                <kbd className="rounded border border-ink/20 bg-white px-1.5 py-0.5 font-mono text-[9px] font-bold">Shift + Enter</kbd>
              </div>
            </div>
          </Card>

          <Card tone="mint" className="p-4">
            <h3 className="font-display text-sm font-extrabold">Privasi</h3>
            <ul className="mt-1.5 space-y-1 text-[10px] font-semibold leading-snug text-ink/55">
              <li className="flex gap-1.5"><Icon name="check" size={11} className="mt-0.5 shrink-0 text-leafDark" /> Tanpa pendaftaran, email, atau pelacakan iklan.</li>
              <li className="flex gap-1.5"><Icon name="check" size={11} className="mt-0.5 shrink-0 text-leafDark" /> Progres dan percakapan disimpan di browser ini.</li>
              <li className="flex gap-1.5"><Icon name="check" size={11} className="mt-0.5 shrink-0 text-leafDark" /> Kode dijalankan lokal lewat Web Worker Pyodide.</li>
              <li className="flex gap-1.5"><Icon name="info" size={11} className="mt-0.5 shrink-0 text-grapeDark" /> Menghapus data situs di browser akan menghapus progres.</li>
            </ul>
          </Card>

          <Card className="p-4">
            <h3 className="font-display text-sm font-extrabold">Tentang materi</h3>
            <p className="mt-1 text-[10px] font-semibold leading-snug text-ink/50">
              Kurikulum mengikuti konsep dasar Python: output, variabel, tipe data, percabangan,
              loop, function, struktur data, dan file. Referensi utama:
            </p>
            <ul className="mt-1.5 space-y-1">
              {[
                { label: 'Dokumentasi resmi Python', url: 'https://docs.python.org/3/tutorial/' },
                { label: 'PEP 8 — Gaya Kode Python', url: 'https://peps.python.org/pep-0008/' },
                { label: 'Real Python', url: 'https://realpython.com/' },
              ].map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-extrabold text-leafDark hover:underline">
                    {source.label} <Icon name="external" size={10} />
                  </a>
                </li>
              ))}
            </ul>
          </Card>

          <div className="rounded-2xl border-2 border-dashed border-ink/15 bg-white/40 p-3 text-center">
            <Pipi mood="happy" size={70} className="mx-auto" />
            <p className="mt-1 text-[10px] font-semibold leading-snug text-ink/45">
              Dibangun untuk belajar Python dengan santai, jujur, dan menyenangkan.
            </p>
          </div>
        </aside>
      </div>

      <Modal
        open={resetOpen}
        onClose={() => { setResetOpen(false); setResetPhrase('') }}
        title="Reset seluruh progres?"
        icon="trash"
        size="sm"
        tone="cream"
        footer={
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="secondary" onClick={() => { setResetOpen(false); setResetPhrase('') }}>Batal</Button>
            <Button size="sm" variant="danger" icon="trash" onClick={doReset} disabled={resetPhrase.trim().toLowerCase() !== 'reset'}>
              Reset sekarang
            </Button>
          </div>
        }
      >
        <p className="text-sm font-semibold leading-relaxed text-ink/60">
          Semua XP, koin, badge, materi selesai, dan boss akan hilang. Profil, pengaturan, dan riwayat tutor tetap ada.
        </p>
        <label className="mt-3 block">
          <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-wide text-ink/40">
            Ketik <span className="font-mono text-coral">reset</span> untuk mengonfirmasi
          </span>
          <input
            value={resetPhrase}
            onChange={(e) => setResetPhrase(e.target.value)}
            className="w-full rounded-xl border-2 border-ink/20 bg-white px-3 py-2 font-mono text-sm font-bold outline-none focus:border-coral"
            placeholder="reset"
            aria-label="Ketik reset untuk konfirmasi"
          />
        </label>
      </Modal>
    </div>
  )
}
