export type PipiMood =
  | 'happy'
  | 'sad'
  | 'confused'
  | 'surprised'
  | 'thinking'
  | 'celebrate'
  | 'hint'
  | 'neutral'

export type EvolutionStage = 'baby' | 'junior' | 'smart' | 'master'

export interface SourceRef {
  label: string
  url: string
}

export interface CodeLine {
  line: string
  explain: string
}

export interface CodeSample {
  title?: string
  code: string
  lines?: CodeLine[]
  output?: string
}

export interface Section {
  heading: string
  body: string[]
  code?: CodeSample
  tip?: string
}

export type QuizKind = 'mc' | 'output' | 'fill' | 'fix'

export interface QuizQuestion {
  id: string
  kind: QuizKind
  question: string
  code?: string
  options: string[]
  answer: number
  explanation: string
  hint: string
}

export interface Challenge {
  prompt: string
  starter: string
  hint: string
  solution: string
  check: 'output' | 'tests'
  expected?: string
  stdin?: string
  tests?: string
}

export interface Level {
  id: string
  title: string
  summary: string
  minutes: number
  icon: string
  intro: string
  sections: Section[]
  playground: { starter: string; stdin?: string }
  challenge: Challenge
  quiz: QuizQuestion[]
  rewards: { xp: number; coins: number }
  sources: SourceRef[]
}

export interface Boss {
  id: string
  name: string
  title: string
  description: string
  hp: number
  damagePerHit: number
  playerHp: number
  questionIds: string[]
  finalChallenge: Challenge
  reward: { xp: number; coins: number }
}

export interface World {
  id: string
  order: number
  name: string
  tagline: string
  description: string
  icon: string
  palette: { from: string; to: string; accent: string; soft: string }
  levels: Level[]
  boss: Boss
  reward: { xp: number; coins: number; badge?: string }
}

export interface BadgeDef {
  id: string
  name: string
  description: string
  requirement: string
  icon: string
  color: string
  tier: 'bronze' | 'silver' | 'gold' | 'legend'
  check: (ctx: BadgeContext) => boolean
  progress?: (ctx: BadgeContext) => { current: number; target: number }
}

export interface BadgeContext {
  xp: number
  coins: number
  level: number
  streak: number
  completedLevels: string[]
  worldsCompleted: string[]
  bossesDefeated: string[]
  quizzesCorrect: number
  codeRuns: number
  bugsFound: number
  puzzlesSolved: number
  gamesPlayed: number
  challengesDone: number
  speedBest: number
}

export interface DailyQuestDef {
  id: string
  title: string
  description: string
  counter: string
  target: number
  xp: number
  coins: number
  icon: string
}

export interface CounterState {
  [key: string]: number
}

export interface ChatMessage {
  id: string
  role: 'pipi' | 'user'
  text: string
  at: string
}

export interface Settings {
  sound: boolean
  animations: boolean
  tutorHistory: boolean
  showLineNumbers: boolean
}

export interface Profile {
  name: string
  avatar: string
  createdAt: string
  email?: string
}

export interface ActivityEntry {
  at: string
  label: string
  xp: number
  coins: number
}

export interface SaveState {
  version: number
  profile: Profile
  xp: number
  coins: number
  completedLevels: Record<string, string>
  levelScores: Record<string, number>
  solvedChallenges: Record<string, string>
  bossesDefeated: Record<string, string>
  worldRewardsClaimed: Record<string, string>
  badges: Record<string, string>
  streak: { count: number; best: number; lastActive: string | null }
  daily: {
    date: string
    counters: CounterState
    claimed: Record<string, string>
    gameXp: Record<string, number>
    bonusGiven: boolean
  }
  stats: {
    quizzesCorrect: number
    quizzesAnswered: number
    codeRuns: number
    challengesDone: number
    bugsFound: number
    puzzlesSolved: number
    gamesPlayed: number
    minutesLearned: number
    speedBest: number
    lessonsStarted: number
  }
  activity: ActivityEntry[]
  tutorHistory: ChatMessage[]
  settings: Settings
  onboarded: boolean
  activePlayground: string
  scratchCode: string
  lastLesson: string | null
}

export interface AccountMeta {
  id: string
  name: string
  avatar: string
  createdAt: string
  xp: number
}

export interface ToastItem {
  id: string
  kind: 'xp' | 'coin' | 'level' | 'badge' | 'info' | 'error' | 'boss'
  title: string
  message?: string
  icon?: string
  color?: string
}

export interface CelebrationItem {
  id: string
  kind: 'level' | 'evolve' | 'badge' | 'boss' | 'world'
  title: string
  message: string
  badgeId?: string
  stage?: EvolutionStage
  color?: string
}

export interface RewardSummary {
  awarded: boolean
  reason?: string
  xp: number
  coins: number
  newBadges: string[]
  leveledUp: boolean
  leveledTo: number
  evolvedTo: EvolutionStage | null
}


