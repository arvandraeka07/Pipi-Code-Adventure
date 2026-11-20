import type { AccountMeta, ChatMessage, SaveState } from '../types'
import { todayKey } from './game'

const ACCOUNTS_KEY = 'pipi.accounts.v1'
const SAVE_PREFIX = 'pipi.save.v1.'
const ACTIVE_KEY = 'pipi.activeAccount.v1'

export const AVATARS = ['pipi', 'explorer', 'wizard', 'ninja', 'astronaut', 'robot']

export interface AccountsRegistry {
  accounts: AccountMeta[]
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function storageGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function storageSet(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

function storageRemove(key: string): boolean {
  try {
    window.localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export function newId(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return `id-${Date.now()}-${Math.floor(Math.random() * 1e6)}`
  }
}

export function createInitialSave(name: string, avatar: string): SaveState {
  const now = new Date().toISOString()
  return {
    version: 1,
    profile: { name: name.trim() || 'Petualang', avatar, createdAt: now },
    xp: 0,
    coins: 0,
    completedLevels: {},
    levelScores: {},
    solvedChallenges: {},
    bossesDefeated: {},
    worldRewardsClaimed: {},
    badges: {},
    streak: { count: 0, best: 0, lastActive: null },
    daily: {
      date: todayKey(),
      counters: {},
      claimed: {},
      gameXp: {},
      bonusGiven: false,
    },
    stats: {
      quizzesCorrect: 0,
      quizzesAnswered: 0,
      codeRuns: 0,
      challengesDone: 0,
      bugsFound: 0,
      puzzlesSolved: 0,
      gamesPlayed: 0,
      minutesLearned: 0,
      speedBest: 0,
      lessonsStarted: 0,
    },
    activity: [],
    tutorHistory: [],
    settings: { sound: true, animations: true, tutorHistory: true, showLineNumbers: true },
    onboarded: false,
    activePlayground: 'sapaan',
    scratchCode: 'print("Halo, Pipi!")\n',
    lastLesson: null,
  }
}

export function loadRegistry(): AccountMeta[] {
  const data = safeParse<AccountsRegistry>(storageGet(ACCOUNTS_KEY), { accounts: [] })
  return Array.isArray(data.accounts) ? data.accounts : []
}

export function saveRegistry(accounts: AccountMeta[]): boolean {
  return storageSet(ACCOUNTS_KEY, JSON.stringify({ accounts }))
}

export function getActiveId(): string | null {
  return storageGet(ACTIVE_KEY)
}

export function setActiveId(id: string | null): boolean {
  return id ? storageSet(ACTIVE_KEY, id) : storageRemove(ACTIVE_KEY)
}

export function createAccount(name: string, avatar: string): { meta: AccountMeta; save: SaveState } {
  const id = newId()
  const save = createInitialSave(name, avatar)
  persistSave(id, save)
  const meta: AccountMeta = {
    id,
    name: save.profile.name,
    avatar,
    createdAt: save.profile.createdAt,
    xp: 0,
  }
  const accounts = loadRegistry()
  accounts.push(meta)
  saveRegistry(accounts)
  setActiveId(id)
  return { meta, save }
}

export function loadSave(accountId: string): SaveState | null {
  const raw = storageGet(SAVE_PREFIX + accountId)
  if (!raw) return null
  const parsed = safeParse<Partial<SaveState> | null>(raw, null)
  if (!parsed) return null
  const base = createInitialSave(parsed.profile?.name ?? 'Petualang', parsed.profile?.avatar ?? 'pipi')
  const merged: SaveState = {
    ...base,
    ...parsed,
    version: 1,
    profile: { ...base.profile, ...(parsed.profile ?? {}) },
    streak: { ...base.streak, ...(parsed.streak ?? {}) },
    daily: { ...base.daily, ...(parsed.daily ?? {}) },
    stats: { ...base.stats, ...(parsed.stats ?? {}) },
    settings: { ...base.settings, ...(parsed.settings ?? {}) },
    completedLevels: parsed.completedLevels ?? {},
    levelScores: parsed.levelScores ?? {},
    solvedChallenges: parsed.solvedChallenges ?? {},
    bossesDefeated: parsed.bossesDefeated ?? {},
    worldRewardsClaimed: parsed.worldRewardsClaimed ?? {},
    badges: parsed.badges ?? {},
    activity: parsed.activity ?? [],
    tutorHistory: parsed.tutorHistory ?? [],
    scratchCode: parsed.scratchCode ?? base.scratchCode,
  }
  return normalizeDaily(merged)
}

export function normalizeDaily(save: SaveState): SaveState {
  const today = todayKey()
  if (save.daily.date === today) return save
  const last = save.streak.lastActive
  const yesterday = (() => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    return todayKey(d)
  })()
  const streakCount = last === today || last === yesterday ? save.streak.count : 0
  return {
    ...save,
    streak: { ...save.streak, count: streakCount },
    daily: {
      date: today,
      counters: {},
      claimed: {},
      gameXp: {},
      bonusGiven: false,
    },
  }
}

export function persistSave(accountId: string, save: SaveState): boolean {
  const saved = storageSet(SAVE_PREFIX + accountId, JSON.stringify(save))
  if (!saved) return false
  const accounts = loadRegistry()
  const idx = accounts.findIndex((a) => a.id === accountId)
  if (idx >= 0) {
    accounts[idx] = {
      ...accounts[idx],
      name: save.profile.name,
      avatar: save.profile.avatar,
      xp: save.xp,
    }
  } else {
    accounts.push({
      id: accountId,
      name: save.profile.name,
      avatar: save.profile.avatar,
      createdAt: save.profile.createdAt,
      xp: save.xp,
    })
  }
  return saveRegistry(accounts)
}

export function deleteAccount(accountId: string) {
  storageRemove(SAVE_PREFIX + accountId)
  const accounts = loadRegistry().filter((a) => a.id !== accountId)
  saveRegistry(accounts)
  if (getActiveId() === accountId) {
    const next = accounts[0]?.id ?? null
    setActiveId(next)
  }
}

export function resetSave(accountId: string): SaveState {
  const current = loadSave(accountId)
  const fresh = createInitialSave(current?.profile.name ?? 'Petualang', current?.profile.avatar ?? 'pipi')
  if (current) {
    fresh.settings = current.settings
    fresh.tutorHistory = current.tutorHistory
    fresh.profile = { ...current.profile }
    fresh.onboarded = true
  }
  return fresh
}

export function exportSave(save: SaveState): string {
  return JSON.stringify({ app: 'pipi-code-adventure', version: 1, save }, null, 2)
}

export function downloadSave(save: SaveState) {
  const blob = new Blob([exportSave(save)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pipi-save-${save.profile.name.toLowerCase().replace(/\s+/g, '-')}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importSave(fileText: string): SaveState | null {
  try {
    const data = JSON.parse(fileText) as { save?: SaveState } | SaveState
    const candidate = 'save' in data && data.save ? data.save : (data as SaveState)
    if (!candidate || typeof candidate !== 'object' || !candidate.profile) return null
    const base = createInitialSave(candidate.profile.name ?? 'Petualang', candidate.profile.avatar ?? 'pipi')
    return normalizeDaily({
      ...base,
      ...candidate,
      version: 1,
      profile: { ...base.profile, ...candidate.profile },
      streak: { ...base.streak, ...(candidate.streak ?? {}) },
      daily: { ...base.daily, ...(candidate.daily ?? {}) },
      stats: { ...base.stats, ...(candidate.stats ?? {}) },
      settings: { ...base.settings, ...(candidate.settings ?? {}) },
      tutorHistory: (candidate.tutorHistory ?? []) as ChatMessage[],
    })
  } catch {
    return null
  }
}
