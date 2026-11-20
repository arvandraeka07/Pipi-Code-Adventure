import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type {
  AccountMeta,
  BadgeDef,
  CelebrationItem,
  ChatMessage,
  DailyQuestDef,
  EvolutionStage,
  Profile,
  RewardSummary,
  SaveState,
  Settings,
  ToastItem,
} from '../types'
import { BADGES } from '../data/badges'
import { isQuestComplete, questsForDate } from '../data/daily'
import { EVOLUTIONS, badgeContext, currentEvolution, levelFromXp, gameXpFor, todayKey } from '../lib/game'
import { findLevelById, getWorld } from '../data/worlds'
import { createAccount, deleteAccount, importSave, loadRegistry, loadSave, normalizeDaily, persistSave, resetSave, setActiveId, getActiveId, newId } from '../lib/storage'
import { sound } from '../lib/sound'
import { ToastViewport } from '../components/ToastViewport'
import { CelebrationOverlay } from '../components/CelebrationOverlay'

interface GrantOptions {
  xp?: number
  coins?: number
  label: string
  counters?: Record<string, number>
  extra?: (save: SaveState) => SaveState
  touch?: boolean
  badges?: boolean
  silent?: boolean
}

interface GrantResult extends RewardSummary {
  newBadgeDefs: BadgeDef[]
}

type GameContextValue = {
  save: SaveState | null
  accountId: string | null
  accounts: AccountMeta[]
  loading: boolean
  level: number
  evolution: EvolutionStage
  createProfile: (name: string, avatar: string) => void
  switchProfile: (id: string) => void
  removeProfile: (id: string) => void
  resetProgress: () => void
  updateProfile: (patch: Partial<Profile>) => void
  updateSettings: (patch: Partial<Settings>) => void
  finishOnboarding: () => void
  completeLesson: (worldId: string, levelId: string, score: number) => RewardSummary
  solveChallenge: (worldId: string, levelId: string) => RewardSummary
  recordQuizAttempt: (correct: number, total: number) => void
  recordCodeRun: (success: boolean) => void
  recordGame: (gameId: string, gameName: string, score: number) => { xp: number; coins: number; capped: boolean; playsUsed: number }
  recordBugFound: () => void
  recordPuzzleSolved: () => void
  recordBossHit: () => void
  defeatBoss: (worldId: string) => RewardSummary
  claimQuest: (quest: DailyQuestDef) => RewardSummary
  addChatMessage: (message: ChatMessage) => void
  clearChat: () => void
  setScratch: (code: string) => void
  setLastLesson: (levelId: string | null) => void
  setActivePlayground: (id: string) => void
  importSaveText: (text: string) => boolean
  notify: (kind: ToastItem['kind'], title: string, message?: string) => void
  toasts: ToastItem[]
  dismissToast: (id: string) => void
  celebrations: CelebrationItem[]
  dismissCelebration: () => void
}

const GameContext = createContext<GameContextValue | null>(null)

function touchStreak(save: SaveState): SaveState {
  const today = todayKey()
  if (save.streak.lastActive === today) return save
  const y = new Date()
  y.setDate(y.getDate() - 1)
  const yesterday = todayKey(y)
  const count = save.streak.lastActive === yesterday ? save.streak.count + 1 : 1
  return {
    ...save,
    streak: {
      count,
      best: Math.max(save.streak.best, count),
      lastActive: today,
    },
  }
}

function emptySummary(reason: string): RewardSummary {
  return {
    awarded: false,
    reason,
    xp: 0,
    coins: 0,
    newBadges: [],
    leveledUp: false,
    leveledTo: 0,
    evolvedTo: null,
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [save, setSave] = useState<SaveState | null>(null)
  const [accountId, setAccountId] = useState<string | null>(null)
  const [accounts, setAccounts] = useState<AccountMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [celebrations, setCelebrations] = useState<CelebrationItem[]>([])
  const saveRef = useRef<SaveState | null>(null)
  const lastPersistedRef = useRef<SaveState | null>(null)

  useEffect(() => {
    const registry = loadRegistry()
    setAccounts(registry)
    const active = getActiveId()
    const chosen = registry.find((a) => a.id === active)?.id ?? registry[0]?.id ?? null
    if (chosen) {
      const loaded = loadSave(chosen)
      if (loaded) {
        saveRef.current = loaded
        setSave(loaded)
        setAccountId(chosen)
        setActiveId(chosen)
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!accountId || !save || lastPersistedRef.current === save) return
    const saved = persistSave(accountId, save)
    lastPersistedRef.current = save
    if (!saved) {
      setToasts((prev) => [
        ...prev.slice(-3),
        {
          id: newId(),
          kind: 'error',
          title: 'Penyimpanan browser penuh',
          message: 'Progres tetap berjalan di sesi ini, tetapi belum tersimpan. Ekspor save secara berkala.',
        },
      ])
    }
    setAccounts(loadRegistry())
  }, [save, accountId])

  useEffect(() => {
    sound.setEnabled(save?.settings.sound ?? true)
  }, [save?.settings.sound])

  useEffect(() => {
    const animations = save?.settings.animations ?? true
    document.documentElement.classList.toggle('no-motion', !animations)
  }, [save?.settings.animations])

  const commit = useCallback((next: SaveState) => {
    saveRef.current = next
    setSave(next)
  }, [])

  const notify = useCallback((kind: ToastItem['kind'], title: string, message?: string) => {
    setToasts((prev) => [...prev.slice(-3), { id: newId(), kind, title, message }])
  }, [])

  const pushCelebration = useCallback((item: Omit<CelebrationItem, 'id'>) => {
    setCelebrations((prev) => [...prev, { ...item, id: newId() }])
  }, [])

  const buildGrant = useCallback((previous: SaveState, opts: GrantOptions): { next: SaveState; result: GrantResult } => {
    const xp = opts.xp ?? 0
    const coins = opts.coins ?? 0
    const oldLevel = levelFromXp(previous.xp)
    const oldStage = currentEvolution(previous)

    let next = normalizeDaily(previous)
    if (opts.touch !== false) next = touchStreak(next)

    const hadReward = xp > 0 || coins > 0
    next = {
      ...next,
      xp: next.xp + xp,
      coins: next.coins + coins,
      activity: hadReward
        ? [{ at: new Date().toISOString(), label: opts.label, xp, coins }, ...next.activity].slice(0, 40)
        : next.activity,
    }

    if (opts.counters) {
      const counters = { ...next.daily.counters }
      for (const [key, value] of Object.entries(opts.counters)) {
        counters[key] = (counters[key] ?? 0) + value
      }
      next = { ...next, daily: { ...next.daily, counters } }
    }

    if (opts.extra) next = opts.extra(next)

    let newBadgeDefs: BadgeDef[] = []
    if (opts.badges !== false) {
      const ctx = badgeContext(next)
      const earned = BADGES.filter((badge) => !next.badges[badge.id] && badge.check(ctx))
      if (earned.length) {
        const badges = { ...next.badges }
        for (const badge of earned) badges[badge.id] = new Date().toISOString()
        next = { ...next, badges }
        newBadgeDefs = earned
      }
    }

    const newLevel = levelFromXp(next.xp)
    const newStage = currentEvolution(next)
    const leveledUp = newLevel > oldLevel
    const evolvedTo = newStage !== oldStage ? newStage : null

    return {
      next,
      result: {
        awarded: hadReward,
        xp,
        coins,
        newBadges: newBadgeDefs.map((b) => b.id),
        newBadgeDefs,
        leveledUp,
        leveledTo: newLevel,
        evolvedTo,
      },
    }
  }, [])

  const emitEvents = useCallback(
    (result: GrantResult, opts: GrantOptions, extraLabel?: string) => {
      const currentStage = saveRef.current ? currentEvolution(saveRef.current) : 'baby'
      if (!opts.silent && (result.xp > 0 || result.coins > 0)) {
        const parts: string[] = []
        if (result.xp > 0) parts.push(`+${result.xp} XP`)
        if (result.coins > 0) parts.push(`+${result.coins} koin`)
        setToasts((prev) => [
          ...prev.slice(-3),
          {
            id: newId(),
            kind: 'xp',
            title: parts.join('  •  '),
            message: extraLabel ?? opts.label,
            icon: 'bolt',
          },
        ])
        sound.play('success')
        if (result.coins > 0) window.setTimeout(() => sound.play('coin'), 260)
      }
      if (result.leveledUp) {
        pushCelebration({
          kind: 'level',
          stage: currentStage,
          title: `LEVEL ${result.leveledTo}!`,
          message: 'Hebat! Kemampuan Python-mu makin tajam. Teruskan petualangan!',
          color: '#FFC93C',
        })
        sound.play('levelup')
      }
      if (result.evolvedTo) {
        const evo = EVOLUTIONS.find((e) => e.stage === result.evolvedTo)
        pushCelebration({
          kind: 'evolve',
          stage: result.evolvedTo,
          title: `EVOLUSI: ${evo?.name.toUpperCase() ?? 'PIPI BARU'}!`,
          message: evo?.tagline ?? 'Pipi berevolusi karena usahamu!',
          color: '#8266E6',
        })
        sound.play('evolve')
      }
      for (const badge of result.newBadgeDefs) {
        pushCelebration({
          kind: 'badge',
          badgeId: badge.id,
          stage: currentStage,
          title: 'BADGE BARU!',
          message: `Kamu mendapatkan "${badge.name}". ${badge.description}`,
          color: badge.color,
        })
        sound.play('badge')
      }
    },
    [pushCelebration],
  )

  const runGrant = useCallback(
    (opts: GrantOptions): RewardSummary => {
      const current = saveRef.current
      if (!current) return emptySummary('no-save')
      const { next, result } = buildGrant(current, opts)
      commit(next)
      emitEvents(result, opts)
      return {
        awarded: result.awarded,
        xp: result.xp,
        coins: result.coins,
        newBadges: result.newBadges,
        leveledUp: result.leveledUp,
        leveledTo: result.leveledTo,
        evolvedTo: result.evolvedTo,
      }
    },
    [buildGrant, commit, emitEvents],
  )

  const createProfile = useCallback(
    (name: string, avatar: string) => {
      const { meta, save: fresh } = createAccount(name, avatar)
      setAccounts(loadRegistry())
      setAccountId(meta.id)
      saveRef.current = fresh
      setSave(fresh)
      setToasts([])
      setCelebrations([])
    },
    [],
  )

  const switchProfile = useCallback((id: string) => {
    const loaded = loadSave(id)
    if (!loaded) return
    saveRef.current = loaded
    setSave(loaded)
    setAccountId(id)
    setActiveId(id)
    setToasts([])
    setCelebrations([])
    sound.play('click')
  }, [])

  const removeProfile = useCallback(
    (id: string) => {
      deleteAccount(id)
      const registry = loadRegistry()
      setAccounts(registry)
      if (accountId === id) {
        const nextId = registry[0]?.id ?? null
        if (nextId) {
          const loaded = loadSave(nextId)
          saveRef.current = loaded
          setSave(loaded)
          setAccountId(nextId)
          setActiveId(nextId)
        } else {
          saveRef.current = null
          setSave(null)
          setAccountId(null)
        }
      }
    },
    [accountId],
  )

  const resetProgress = useCallback(() => {
    if (!accountId) return
    const fresh = resetSave(accountId)
    const saved = persistSave(accountId, fresh)
    lastPersistedRef.current = fresh
    commit(fresh)
    setAccounts(loadRegistry())
    setToasts([])
    setCelebrations([])
    notify(
      saved ? 'info' : 'error',
      saved ? 'Progres direset' : 'Reset belum tersimpan',
      saved
        ? 'Petualangan dimulai lagi dari awal. Badge dan XP dikosongkan.'
        : 'Progres dikosongkan untuk sesi ini, tetapi browser menolak menyimpan. Coba ekspor save.',
    )
  }, [accountId, commit, notify])

  const updateProfile = useCallback(
    (patch: Partial<Profile>) => {
      const current = saveRef.current
      if (!current) return
      commit({ ...current, profile: { ...current.profile, ...patch } })
    },
    [commit],
  )

  const updateSettings = useCallback(
    (patch: Partial<Settings>) => {
      const current = saveRef.current
      if (!current) return
      const settings = { ...current.settings, ...patch }
      const next = { ...current, settings }
      if (patch.tutorHistory === false) next.tutorHistory = []
      commit(next)
      sound.setEnabled(settings.sound)
      if (patch.sound) sound.play('click')
    },
    [commit],
  )

  const finishOnboarding = useCallback(() => {
    const current = saveRef.current
    if (!current) return
    commit({ ...current, onboarded: true })
  }, [commit])

  const completeLesson = useCallback(
    (worldId: string, levelId: string, score: number): RewardSummary => {
      const current = saveRef.current
      if (!current) return emptySummary('no-save')
      const found = findLevelById(levelId)
      if (!found || found.world.id !== worldId) return emptySummary('not-found')
      if (current.completedLevels[levelId]) return emptySummary('already')
      if (!current.solvedChallenges[levelId]) return emptySummary('challenge-required')
      return runGrant({
        xp: found.level.rewards.xp,
        coins: found.level.rewards.coins,
        label: `Menyelesaikan materi "${found.level.title}"`,
        counters: { lesson_complete: 1 },
        extra: (s) => ({
          ...s,
          completedLevels: { ...s.completedLevels, [levelId]: new Date().toISOString() },
          levelScores: {
            ...s.levelScores,
            [levelId]: Math.max(s.levelScores[levelId] ?? 0, Math.round(score)),
          },
          stats: { ...s.stats, minutesLearned: s.stats.minutesLearned + found.level.minutes },
          lastLesson: levelId,
        }),
      })
    },
    [runGrant],
  )

  const solveChallenge = useCallback(
    (worldId: string, levelId: string): RewardSummary => {
      const current = saveRef.current
      if (!current) return emptySummary('no-save')
      const found = findLevelById(levelId)
      if (!found || found.world.id !== worldId) return emptySummary('not-found')
      if (current.solvedChallenges[levelId]) return emptySummary('already')
      return runGrant({
        xp: 30,
        coins: 10,
        label: `Tantangan coding "${found.level.title}"`,
        counters: { challenge_complete: 1 },
        extra: (s) => ({
          ...s,
          solvedChallenges: { ...s.solvedChallenges, [levelId]: new Date().toISOString() },
          stats: { ...s.stats, challengesDone: s.stats.challengesDone + 1 },
        }),
      })
    },
    [runGrant],
  )

  const recordQuizAttempt = useCallback(
    (correct: number, total: number) => {
      if (total <= 0) return
      runGrant({
        label: 'Latihan kuis',
        silent: true,
        counters: { correct_quiz: correct },
        extra: (s) => ({
          ...s,
          stats: {
            ...s.stats,
            quizzesCorrect: s.stats.quizzesCorrect + correct,
            quizzesAnswered: s.stats.quizzesAnswered + total,
          },
        }),
      })
    },
    [runGrant],
  )

  const recordCodeRun = useCallback(
    (success: boolean) => {
      if (!success) return
      runGrant({
        label: 'Menjalankan kode Python',
        silent: true,
        counters: { run_code: 1 },
        extra: (s) => ({ ...s, stats: { ...s.stats, codeRuns: s.stats.codeRuns + 1 } }),
      })
    },
    [runGrant],
  )

  const recordGame = useCallback(
    (gameId: string, gameName: string, score: number) => {
      if (!saveRef.current) return { xp: 0, coins: 0, capped: false, playsUsed: 0 }
      const current = normalizeDaily(saveRef.current)
      const playsUsed = (current.daily.gameXp[gameId] ?? 0) + 1
      const capped = (current.daily.gameXp[gameId] ?? 0) >= 3
      const xpScore = gameId === 'speed' ? Math.min(100, score * 10) : score
      const xp = capped ? 0 : gameXpFor(xpScore)
      const coins = capped ? 0 : Math.max(2, Math.round(xp / 2))
      runGrant({
        xp,
        coins,
        label: `Mini game: ${gameName}`,
        silent: false,
        counters: { game_round: 1 },
        extra: (s) => ({
          ...s,
          daily: {
            ...s.daily,
            gameXp: {
              ...s.daily.gameXp,
              [gameId]: (s.daily.gameXp[gameId] ?? 0) + 1,
            },
          },
          stats: {
            ...s.stats,
            gamesPlayed: s.stats.gamesPlayed + 1,
            speedBest: gameId === 'speed' ? Math.max(s.stats.speedBest, score) : s.stats.speedBest,
          },
        }),
      })
      return { xp, coins, capped, playsUsed: Math.min(playsUsed, 99) }
    },
    [runGrant],
  )

  const recordBugFound = useCallback(() => {
    runGrant({
      label: 'Menemukan bug',
      silent: true,
      counters: { bug_found: 1 },
      extra: (s) => ({ ...s, stats: { ...s.stats, bugsFound: s.stats.bugsFound + 1 } }),
    })
  }, [runGrant])

  const recordPuzzleSolved = useCallback(() => {
    runGrant({
      label: 'Menyelesaikan Code Puzzle',
      silent: true,
      counters: { puzzle_solved: 1 },
      extra: (s) => ({ ...s, stats: { ...s.stats, puzzlesSolved: s.stats.puzzlesSolved + 1 } }),
    })
  }, [runGrant])

  const recordBossHit = useCallback(() => {
    runGrant({
      label: 'Menyerang boss',
      silent: true,
      counters: { boss_hit: 1 },
    })
  }, [runGrant])

  const defeatBoss = useCallback(
    (worldId: string): RewardSummary => {
      const current = saveRef.current
      if (!current) return emptySummary('no-save')
      const world = getWorld(worldId)
      if (!world) return emptySummary('not-found')
      if (current.bossesDefeated[worldId]) return emptySummary('already')
      const now = new Date().toISOString()
      const summary = runGrant({
        xp: world.boss.reward.xp + world.reward.xp,
        coins: world.boss.reward.coins + world.reward.coins,
        label: `Mengalahkan ${world.boss.name} dan menuntaskan ${world.name}`,
        counters: { challenge_complete: 1 },
        extra: (s) => ({
          ...s,
          bossesDefeated: { ...s.bossesDefeated, [worldId]: now },
          worldRewardsClaimed: { ...s.worldRewardsClaimed, [worldId]: now },
        }),
      })
      if (summary.awarded) {
        pushCelebration({
          kind: 'boss',
          stage: saveRef.current ? currentEvolution(saveRef.current) : 'baby',
          title: `${world.boss.name.toUpperCase()} DIKALAHKAN!`,
          message: `Kamu menuntaskan ${world.name}. Hadiah dunia: +${world.reward.xp} XP dan +${world.reward.coins} koin.`,
          color: world.palette.from,
        })
        sound.play('boss')
      }
      return summary
    },
    [pushCelebration, runGrant],
  )

  const claimQuest = useCallback(
    (quest: DailyQuestDef): RewardSummary => {
      const current = saveRef.current
      if (!current) return emptySummary('no-save')
      const normalized = normalizeDaily(current)
      if (normalized.daily.claimed[quest.id]) return emptySummary('already')
      if (!isQuestComplete(normalized, quest)) return emptySummary('incomplete')
      const now = new Date().toISOString()
      const claimedAfter = { ...normalized.daily.claimed, [quest.id]: now }
      const allClaimed =
        !normalized.daily.bonusGiven &&
        questsForDate(normalized.daily.date).every((q) => Boolean(claimedAfter[q.id]))
      const bonusXp = allClaimed ? 40 : 0
      const bonusCoins = allClaimed ? 15 : 0
      return runGrant({
        xp: quest.xp + bonusXp,
        coins: quest.coins + bonusCoins,
        label: allClaimed ? `Daily Quest: ${quest.title} + bonus semua quest` : `Daily Quest: ${quest.title}`,
        counters: { daily_claim: 1 },
        extra: (s) => ({
          ...s,
          daily: {
            ...s.daily,
            claimed: claimedAfter,
            bonusGiven: s.daily.bonusGiven || allClaimed,
          },
        }),
      })
    },
    [runGrant],
  )

  const addChatMessage = useCallback(
    (message: ChatMessage) => {
      const current = saveRef.current
      if (!current) return
      if (!current.settings.tutorHistory) return
      commit({ ...current, tutorHistory: [...current.tutorHistory, message].slice(-60) })
    },
    [commit],
  )

  const clearChat = useCallback(() => {
    const current = saveRef.current
    if (!current) return
    commit({ ...current, tutorHistory: [] })
  }, [commit])

  const setScratch = useCallback(
    (code: string) => {
      const current = saveRef.current
      if (!current) return
      commit({ ...current, scratchCode: code })
    },
    [commit],
  )

  const setLastLesson = useCallback(
    (levelId: string | null) => {
      const current = saveRef.current
      if (!current) return
      commit({ ...current, lastLesson: levelId })
    },
    [commit],
  )

  const setActivePlayground = useCallback(
    (id: string) => {
      const current = saveRef.current
      if (!current) return
      commit({ ...current, activePlayground: id })
    },
    [commit],
  )

  const importSaveText = useCallback(
    (text: string) => {
      const parsed = importSave(text)
      if (!parsed) return false
      if (accountId) {
        commit(parsed)
        persistSave(accountId, parsed)
        notify('info', 'Save berhasil dimuat', 'Progres dan profil telah dipulihkan dari file.')
        return true
      }
      return false
    },
    [accountId, commit, notify],
  )

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const dismissCelebration = useCallback(() => {
    setCelebrations((prev) => prev.slice(1))
  }, [])

  const level = save ? levelFromXp(save.xp) : 1
  const evolution = save ? currentEvolution(save) : 'baby'

  const value: GameContextValue = {
    save,
    accountId,
    accounts,
    loading,
    level,
    evolution,
    createProfile,
    switchProfile,
    removeProfile,
    resetProgress,
    updateProfile,
    updateSettings,
    finishOnboarding,
    completeLesson,
    solveChallenge,
    recordQuizAttempt,
    recordCodeRun,
    recordGame,
    recordBugFound,
    recordPuzzleSolved,
    recordBossHit,
    defeatBoss,
    claimQuest,
    addChatMessage,
    clearChat,
    setScratch,
    setLastLesson,
    setActivePlayground,
    importSaveText,
    notify,
    toasts,
    dismissToast,
    celebrations,
    dismissCelebration,
  }

  return (
    <GameContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
      <CelebrationOverlay
        item={celebrations[0] ?? null}
        queued={celebrations.length}
        onDismiss={dismissCelebration}
      />
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}

export function useSave() {
  const { save } = useGame()
  if (!save) throw new Error('No active save')
  return save
}
