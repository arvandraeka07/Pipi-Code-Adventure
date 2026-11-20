import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useGame } from '../store/GameContext'
import { downloadSave } from '../lib/storage'
import { Avatar, AvatarPicker } from '../components/Avatar'
import { evolutionState, friendlyDate, levelProgress, nextEvolution, shortDate } from '../lib/game'
import { badgeById } from '../data/badges'
import { reputationTitle } from '../data/games'
import { Pipi } from '../components/Pipi'
import { BadgeMedal } from '../components/BadgeMedal'
import { Icon } from '../components/Icon'
import { Button, Card, Chip, Modal, PageHeader, ProgressBar, SectionHeading, StatTile, cn } from '../components/ui'

export default function Profile() {
  const {
    save,
    accountId,
    accounts,
    level,
    evolution,
    updateProfile,
    switchProfile,
    removeProfile,
    createProfile,
    importSaveText,
    notify,
  } = useGame()
  const [name, setName] = useState(save?.profile.name ?? '')
  const [avatar, setAvatar] = useState(save?.profile.avatar ?? 'pipi')
  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newAvatar, setNewAvatar] = useState('pipi')
  const [removeTarget, setRemoveTarget] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setName(save?.profile.name ?? '')
    setAvatar(save?.profile.avatar ?? 'pipi')
  }, [save?.profile.name, save?.profile.avatar])

  if (!save) return null

  const progress = levelProgress(save.xp)
  const nextEvo = nextEvolution(save)
  const evolutions = evolutionState(save)
  const dirty = name.trim() !== save.profile.name || avatar !== save.profile.avatar
  const badgeEntries = Object.entries(save.badges)
    .sort((a, b) => new Date(b[1]).getTime() - new Date(a[1]).getTime())
    .slice(0, 6)
  const target = removeTarget ? accounts.find((a) => a.id === removeTarget) ?? null : null
  const completed = Object.keys(save.completedLevels).length

  const saveProfile = () => {
    if (!name.trim() || !dirty) return
    updateProfile({ name: name.trim(), avatar })
    notify('info', 'Profil diperbarui', `Sapaan barumu: ${name.trim()}.`)
  }

  const exportData = () => {
    downloadSave(save)
    notify('info', 'Save diekspor', 'File JSON berisi progresmu sudah diunduh.')
  }

  const importData = async (file: File | undefined) => {
    if (!file) return
    try {
      const text = await file.text()
      const ok = importSaveText(text)
      if (!ok) notify('error', 'Import gagal', 'File tidak dikenali. Pastikan itu file save PIPI CODE ADVENTURE.')
    } catch {
      notify('error', 'Import gagal', 'File tidak bisa dibaca.')
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  const doCreate = () => {
    if (!newName.trim()) return
    createProfile(newName.trim(), newAvatar)
    setCreateOpen(false)
    setNewName('')
    setNewAvatar('pipi')
  }

  return (
    <div>
      <PageHeader title="Profil" subtitle="Identitas, statistik, dan pengelolaan akun lokal." icon="user">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" icon="user-plus" onClick={() => setCreateOpen(true)}>Profil baru</Button>
          <Button size="sm" variant="sun" icon="save" onClick={saveProfile} disabled={!dirty || !name.trim()}>Simpan perubahan</Button>
        </div>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-[1fr_330px]">
        <div className="space-y-4">
          <Card tone="cream" className="relative overflow-hidden p-5">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-grape/15" />
            <div className="relative flex flex-wrap items-center gap-4">
              <Pipi avatarOverride={avatar} stage={evolution} mood="happy" size={96} interactive className="drop-shadow-[0_8px_0_rgba(18,59,42,0.12)]" />
              <div className="min-w-[180px] flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-2xl font-extrabold leading-tight">{save.profile.name}</h2>
                  <Chip icon="award" color="#8266E6">{reputationTitle(save.xp)}</Chip>
                </div>
                <p className="mt-0.5 text-[11px] font-semibold text-ink/45">
                  Bergabung {friendlyDate(save.profile.createdAt)} • Level {level} • {evolution === 'baby' ? 'Baby' : evolution === 'junior' ? 'Junior' : evolution === 'smart' ? 'Smart' : 'Master'} Pipi
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <ProgressBar value={progress.percent} color="#2FBF71" height={9} className="flex-1" />
                  <span className="font-mono text-[10px] font-bold text-ink/45">{progress.into}/{progress.span} XP</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-3 text-[10px] font-bold text-ink/40">
                  <span><b className="text-ink/70">{save.xp}</b> XP total</span>
                  <span><b className="text-ink/70">{save.coins}</b> koin</span>
                  <span><b className="text-ink/70">{save.streak.count}</b> hari streak</span>
                </div>
              </div>
              <Pipi stage={evolution} mood="happy" size={104} className="hidden sm:block" />
            </div>
          </Card>

          <Card className="p-4">
            <SectionHeading eyebrow="Identitas" title="Nama & avatar" subtitle="Perubahan disimpan ke profil lokal ini." className="mb-3" />
            <div className="grid gap-3 sm:grid-cols-[1fr_1fr]">
              <label className="block">
                <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-wide text-ink/40">Nama panggilan</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={24}
                  className="w-full rounded-xl border-2 border-ink/20 bg-surface px-3 py-2 font-display text-sm font-bold outline-none transition focus:border-leaf"
                  placeholder="Nama petualang"
                />
                <span className="mt-0.5 block text-[9px] font-semibold text-ink/35">Maksimal 24 karakter.</span>
              </label>
              <div>
                <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-wide text-ink/40">Avatar</span>
                <AvatarPicker value={avatar} onChange={setAvatar} compact />
              </div>
            </div>
            {dirty && (
              <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border-2 border-sun/50 bg-warning-soft px-2.5 py-1.5">
                <span className="text-[10px] font-bold text-ink/55">Ada perubahan yang belum disimpan.</span>
                <div className="flex gap-1.5">
                  <Button size="sm" variant="ghost" onClick={() => { setName(save.profile.name); setAvatar(save.profile.avatar) }}>Batal</Button>
                  <Button size="sm" variant="sun" onClick={saveProfile}>Simpan</Button>
                </div>
              </div>
            )}
          </Card>

          <div>
            <SectionHeading eyebrow="Ringkasan" title="Statistik belajarmu" action={<span className="text-[10px] font-bold text-ink/40">{completed} materi selesai</span>} />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <StatTile icon="book" label="Materi" value={completed} color="#BFE9FF" />
              <StatTile icon="sword" label="Boss" value={Object.keys(save.bossesDefeated).length} color="#FF8A7A" />
              <StatTile icon="trophy" label="Badge" value={Object.keys(save.badges).length} color="#FFC93C" />
              <StatTile icon="check" label="Kuis benar" value={save.stats.quizzesCorrect} color="#63DE95" />
              <StatTile icon="code" label="Kode dijalankan" value={save.stats.codeRuns} color="#CDBAF9" />
              <StatTile icon="clock" label="Menit belajar" value={save.stats.minutesLearned} color="#FFD9E3" />
            </div>
          </div>

          <Card className="p-4">
            <SectionHeading eyebrow="Aktivitas" title="Jejak terakhir" subtitle="Hadiah yang kamu terima dalam 40 aktivitas terakhir." className="mb-3" />
            {save.activity.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-ink/10 bg-surface/40 p-4 text-center text-[11px] font-semibold text-ink/40">
                Belum ada aktivitas. Selesaikan satu materi atau jalankan kode pertamamu.
              </div>
            ) : (
              <div className="space-y-1.5">
                {save.activity.slice(0, 8).map((item, i) => (
                  <div key={`${item.at}-${i}`} className="flex items-center gap-2 rounded-xl border-2 border-ink/5 bg-surface/60 px-2.5 py-1.5">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg border border-ink/10 bg-mint">
                      <Icon name={item.xp > 0 ? 'bolt' : 'coin'} size={11} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[10px] font-extrabold text-ink/70">{item.label}</div>
                      <div className="text-[8px] font-bold text-ink/35">{shortDate(item.at)}</div>
                    </div>
                    <div className="shrink-0 text-right text-[9px] font-extrabold">
                      {item.xp > 0 && <span className="text-sunDark">+{item.xp} XP </span>}
                      {item.coins > 0 && <span className="text-leafDark">+{item.coins}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <aside className="space-y-4">
          <Card tone="mint" className="p-4">
            <h3 className="font-display text-sm font-extrabold">Evolusi Pipi</h3>
            <div className="mt-2 flex items-center gap-3">
              <Pipi stage={evolution} mood="happy" size={90} />
              <div className="min-w-0">
                <div className="font-display text-sm font-extrabold capitalize">{evolution} Pipi</div>
                {nextEvo ? (
                  <>
                    <div className="mt-1 text-[10px] font-semibold leading-snug text-ink/55">Berikutnya: {nextEvo.name}</div>
                    <ProgressBar value={nextEvo.percent} color="#8266E6" height={7} className="mt-1" />
                    <div className="mt-0.5 text-[9px] font-bold text-ink/40">{nextEvo.progressText}</div>
                  </>
                ) : (
                  <div className="mt-1 text-[10px] font-bold text-leafDark">Tahap tertinggi sudah tercapai!</div>
                )}
              </div>
            </div>
            <div className="mt-2 grid grid-cols-4 gap-1">
              {evolutions.map((evo) => (
                <div key={evo.stage} className={cn('rounded-lg border-2 p-1 text-center', evo.unlocked ? 'border-leaf/40 bg-surface/70' : 'border-ink/10 bg-surface/30 opacity-55')}>
                  <div className="text-[8px] font-extrabold capitalize text-ink/60">{evo.stage}</div>
                  {evo.unlocked ? <Icon name="check" size={10} className="mx-auto text-leafDark" /> : <Icon name="lock" size={10} className="mx-auto text-ink/30" />}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-extrabold">Badge terbaru</h3>
              <Link to="/achievements" className="text-[9px] font-extrabold text-leafDark hover:underline">Lihat semua</Link>
            </div>
            {badgeEntries.length === 0 ? (
              <p className="mt-1 text-[10px] font-semibold text-ink/45">Belum ada badge. Mulai dari menjalankan kode pertamamu!</p>
            ) : (
              <div className="mt-2 grid grid-cols-3 gap-1">
                {badgeEntries.map(([id, at]) => {
                  const badge = badgeById(id)
                  if (!badge) return null
                  return (
                    <div key={id} className="rounded-xl border-2 border-ink/10 bg-surface/70 p-1.5 text-center" title={`${badge.name} • ${friendlyDate(at)}`}>
                      <BadgeMedal badge={badge} unlocked size={44} className="mx-auto" showLock={false} />
                      <div className="mt-0.5 truncate text-[8px] font-extrabold text-ink/60">{badge.name}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-extrabold">Akun lokal</h3>
              <span className="text-[9px] font-bold text-ink/35">{accounts.length} profil</span>
            </div>
            <div className="mt-2 space-y-1.5">
              {accounts.map((account) => {
                const active = account.id === accountId
                return (
                  <div key={account.id} className={cn('flex items-center gap-2 rounded-xl border-2 px-2 py-1.5', active ? 'border-ink bg-sun/30' : 'border-ink/10 bg-surface/60')}>
                    <Avatar avatar={account.avatar} size={30} ring={false} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 truncate text-[10px] font-extrabold">
                        {account.name}
                        {active && <span className="rounded bg-leaf px-1 text-[7px] uppercase text-white">Aktif</span>}
                      </div>
                      <div className="text-[8px] font-bold text-ink/35">Level {levelProgress(account.xp).level} • {account.xp} XP</div>
                    </div>
                    {!active && (
                      <button onClick={() => switchProfile(account.id)} className="rounded-md border border-ink/15 bg-surface px-1.5 py-0.5 text-[8px] font-extrabold hover:bg-mint" aria-label={`Ganti ke ${account.name}`}>
                        Pakai
                      </button>
                    )}
                    <button onClick={() => setRemoveTarget(account.id)} className="grid h-11 w-11 place-items-center rounded-md text-ink/30 hover:bg-coral/20 hover:text-coral-text" aria-label={`Hapus ${account.name}`}>
                      <Icon name="trash" size={11} />
                    </button>
                  </div>
                )
              })}
            </div>
            <Button size="sm" variant="secondary" icon="user-plus" className="mt-2 w-full" onClick={() => setCreateOpen(true)}>
              Tambah profil
            </Button>
          </Card>

          <Card tone="grape" className="p-4">
            <h3 className="font-display text-sm font-extrabold">Cadangkan progres</h3>
            <p className="mt-0.5 text-[10px] font-semibold leading-snug text-ink/50">
              Data hanya tersimpan di browser ini. Ekspor file JSON secara berkala agar aman.
            </p>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              <Button size="sm" variant="secondary" icon="download" onClick={exportData}>Ekspor</Button>
              <Button size="sm" variant="secondary" icon="upload" onClick={() => fileRef.current?.click()}>Impor</Button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              aria-label="Pilih file cadangan JSON"
              className="hidden"
              onChange={(e) => void importData(e.target.files?.[0])}
            />
            <p className="mt-1.5 text-[9px] font-bold text-ink/35">Import menggantikan progres profil aktif saat ini.</p>
          </Card>
        </aside>
      </div>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Profil petualang baru"
        icon="user-plus"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="secondary" onClick={() => setCreateOpen(false)}>Batal</Button>
            <Button size="sm" variant="sun" icon="sparkles" onClick={doCreate} disabled={!newName.trim()}>Mulai</Button>
          </div>
        }
      >
        <label className="block">
          <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-wide text-ink/40">Nama</span>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            maxLength={24}
            autoFocus
            className="w-full rounded-xl border-2 border-ink/20 bg-surface px-3 py-2 font-display text-sm font-bold outline-none focus:border-leaf"
            placeholder="Contoh: Andra"
          />
        </label>
        <div className="mt-3">
          <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-wide text-ink/40">Avatar</span>
          <AvatarPicker value={newAvatar} onChange={setNewAvatar} />
        </div>
        <p className="mt-3 rounded-xl border-2 border-ink/10 bg-surface/60 p-2 text-[10px] font-semibold text-ink/50">
          Profil baru mulai dari nol. Profil lain tetap tersimpan di perangkat ini.
        </p>
      </Modal>

      <Modal
        open={Boolean(target)}
        onClose={() => setRemoveTarget(null)}
        title="Hapus profil?"
        icon="trash"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="secondary" onClick={() => setRemoveTarget(null)}>Batal</Button>
            <Button
              size="sm"
              variant="danger"
              icon="trash"
              onClick={() => {
                if (removeTarget) removeProfile(removeTarget)
                setRemoveTarget(null)
                notify('info', 'Profil dihapus', 'Data profil tersebut telah dihapus dari perangkat ini.')
              }}
            >
              Hapus permanen
            </Button>
          </div>
        }
      >
        <p className="text-sm font-semibold text-ink/60">
          Profil <b>{target?.name}</b> beserta XP, badge, dan seluruh progresnya akan dihapus permanen dari browser ini.
          Tindakan ini tidak bisa dibatalkan.
        </p>
      </Modal>
    </div>
  )
}
