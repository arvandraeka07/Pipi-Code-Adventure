import type { BadgeContext, EvolutionStage, SaveState } from '../types'

export const XP_RULES = {
  lessonBase: 60,
  quizPerCorrect: 8,
  quizBonusMax: 32,
  challengeBonus: 30,
  bossBase: 120,
  worldBonus: 150,
  gameMaxXpPerPlay: 35,
  gameRewardedPlaysPerDay: 3,
} as const

export const COIN_RULES = {
  lesson: 25,
  challenge: 10,
  boss: 50,
  world: 75,
} as const

export function cumulativeXpForLevel(level: number): number {
  const n = Math.max(0, level - 1)
  return 80 * n + 25 * n * n
}

export function levelFromXp(xp: number): number {
  let level = 1
  while (level < 99 && xp >= cumulativeXpForLevel(level + 1)) level++
  return level
}

export function levelProgress(xp: number) {
  const level = levelFromXp(xp)
  const currentFloor = cumulativeXpForLevel(level)
  const nextFloor = cumulativeXpForLevel(level + 1)
  const into = xp - currentFloor
  const span = nextFloor - currentFloor
  return {
    level,
    into,
    span,
    remaining: Math.max(0, nextFloor - xp),
    percent: Math.min(100, Math.round((into / span) * 100)),
    nextFloor,
  }
}

export interface EvolutionInfo {
  stage: EvolutionStage
  name: string
  tagline: string
  requirement: string
  unlocked: boolean
  progressText: string
  percent: number
}

export const EVOLUTIONS: {
  stage: EvolutionStage
  name: string
  tagline: string
  minLevel: number
  minLessons: number
  minBosses: number
  requirement: string
}[] = [
  {
    stage: 'baby',
    name: 'Baby Pipi',
    tagline: 'Petualang kecil yang penuh rasa ingin tahu.',
    minLevel: 1,
    minLessons: 0,
    minBosses: 0,
    requirement: 'Tersedia sejak awal petualangan.',
  },
  {
    stage: 'junior',
    name: 'Junior Pipi',
    tagline: 'Sudah bisa menulis kode pertamanya!',
    minLevel: 3,
    minLessons: 4,
    minBosses: 0,
    requirement: 'Capai Level 3 dan selesaikan 4 materi.',
  },
  {
    stage: 'smart',
    name: 'Smart Pipi',
    tagline: 'Topi petualang dan otak Python yang tajam.',
    minLevel: 6,
    minLessons: 12,
    minBosses: 0,
    requirement: 'Capai Level 6 dan selesaikan 12 materi.',
  },
  {
    stage: 'master',
    name: 'Python Master',
    tagline: 'Legenda yang menaklukkan seluruh kerajaan Python.',
    minLevel: 10,
    minLessons: 20,
    minBosses: 5,
    requirement: 'Capai Level 10, selesaikan 20 materi, dan kalahkan 5 boss.',
  },
]

export function evolutionState(save: SaveState): EvolutionInfo[] {
  const level = levelFromXp(save.xp)
  const lessons = Object.keys(save.completedLevels).length
  const bosses = Object.keys(save.bossesDefeated).length
  return EVOLUTIONS.map((evo) => {
    const unlocked =
      level >= evo.minLevel && lessons >= evo.minLessons && bosses >= evo.minBosses
    const parts = [
      { label: 'Level', current: Math.min(level, evo.minLevel), target: evo.minLevel },
      { label: 'Materi', current: Math.min(lessons, evo.minLessons), target: evo.minLessons },
      { label: 'Boss', current: Math.min(bosses, evo.minBosses), target: evo.minBosses },
    ].filter((p) => p.target > 0)
    const ratios = parts.map((p) => Math.min(1, p.current / p.target))
    const percent = ratios.length
      ? Math.round((ratios.reduce((a, b) => a + b, 0) / ratios.length) * 100)
      : 100
    const missing = parts
      .filter((p) => p.current < p.target)
      .map((p) => `${p.label} ${p.current}/${p.target}`)
    return {
      stage: evo.stage,
      name: evo.name,
      tagline: evo.tagline,
      requirement: evo.requirement,
      unlocked,
      progressText: unlocked ? 'Terbuka!' : missing.join(' • '),
      percent: unlocked ? 100 : percent,
    }
  })
}

export function currentEvolution(save: SaveState): EvolutionStage {
  const states = evolutionState(save)
  let stage: EvolutionStage = 'baby'
  for (const s of states) if (s.unlocked) stage = s.stage
  return stage
}

export function nextEvolution(save: SaveState) {
  const states = evolutionState(save)
  const current = currentEvolution(save)
  const idx = states.findIndex((s) => s.stage === current)
  return states[idx + 1] ?? null
}

export function badgeContext(save: SaveState): BadgeContext {
  return {
    xp: save.xp,
    coins: save.coins,
    level: levelFromXp(save.xp),
    streak: save.streak.count,
    completedLevels: Object.keys(save.completedLevels),
    worldsCompleted: Object.keys(save.worldRewardsClaimed),
    bossesDefeated: Object.keys(save.bossesDefeated),
    quizzesCorrect: save.stats.quizzesCorrect,
    codeRuns: save.stats.codeRuns,
    bugsFound: save.stats.bugsFound,
    puzzlesSolved: save.stats.puzzlesSolved,
    gamesPlayed: save.stats.gamesPlayed,
    challengesDone: save.stats.challengesDone,
    speedBest: save.stats.speedBest,
  }
}

/* ------------------------------- dates ------------------------------- */

export function todayKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function yesterdayKey(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return todayKey(d)
}

export function friendlyDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function shortDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

/* ------------------------------ rewards ------------------------------ */

export function scoreLabel(score: number) {
  if (score >= 90) return { label: 'Luar biasa!', pipi: 'celebrate' as const }
  if (score >= 70) return { label: 'Bagus sekali!', pipi: 'happy' as const }
  if (score >= 50) return { label: 'Terus berlatih!', pipi: 'hint' as const }
  return { label: 'Jangan menyerah!', pipi: 'hint' as const }
}

export function gameXpFor(score: number): number {
  if (score >= 90) return 35
  if (score >= 70) return 25
  if (score >= 50) return 15
  return 8
}

export function shuffle<T>(items: T[], seed = Math.random()): T[] {
  const arr = [...items]
  let s = Math.floor(seed * 10000) || 1
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function hashString(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}
