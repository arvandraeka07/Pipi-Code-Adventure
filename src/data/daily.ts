import type { DailyQuestDef, SaveState } from '../types'
import { hashString } from '../lib/game'

export const DAILY_POOL: DailyQuestDef[] = [
  {
    id: 'warmup',
    title: 'Pemanasan Pagi',
    description: 'Jalankan satu kode Python di playground atau materi.',
    counter: 'run_code',
    target: 1,
    xp: 30,
    coins: 10,
    icon: 'play',
  },
  {
    id: 'quiz-brain',
    title: 'Otak Python',
    description: 'Jawab 3 pertanyaan kuis dengan benar.',
    counter: 'correct_quiz',
    target: 3,
    xp: 40,
    coins: 15,
    icon: 'lightbulb',
  },
  {
    id: 'one-lesson',
    title: 'Satu Langkah Maju',
    description: 'Selesaikan satu materi pembelajaran.',
    counter: 'lesson_complete',
    target: 1,
    xp: 50,
    coins: 20,
    icon: 'book',
  },
  {
    id: 'one-puzzle',
    title: 'Pemecah Kode',
    description: 'Selesaikan satu Code Puzzle.',
    counter: 'puzzle_solved',
    target: 1,
    xp: 40,
    coins: 15,
    icon: 'puzzle',
  },
  {
    id: 'bug-detective',
    title: 'Detektif Bug',
    description: 'Temukan bug dalam satu ronde Find The Bug.',
    counter: 'bug_found',
    target: 1,
    xp: 40,
    coins: 15,
    icon: 'bug',
  },
  {
    id: 'challenge-day',
    title: 'Tantangan Harian',
    description: 'Selesaikan satu tantangan coding di materi mana pun.',
    counter: 'challenge_complete',
    target: 1,
    xp: 50,
    coins: 20,
    icon: 'target',
  },
  {
    id: 'play-game',
    title: 'Main Sebentar',
    description: 'Selesaikan 2 ronde mini game apa pun.',
    counter: 'game_round',
    target: 2,
    xp: 30,
    coins: 12,
    icon: 'gamepad',
  },
]

export function questsForDate(dateKey: string): DailyQuestDef[] {
  const scored = DAILY_POOL.map((quest) => ({
    quest,
    score: hashString(`${dateKey}-${quest.id}`),
  }))
  scored.sort((a, b) => a.score - b.score)
  return scored.slice(0, 4).map((s) => s.quest)
}

export function questProgress(save: SaveState, quest: DailyQuestDef): number {
  if (save.daily.claimed[quest.id]) return quest.target
  return Math.min(quest.target, save.daily.counters[quest.counter] ?? 0)
}

export function isQuestComplete(save: SaveState, quest: DailyQuestDef): boolean {
  return (save.daily.counters[quest.counter] ?? 0) >= quest.target
}

export function counterLabel(counter: string): string {
  const map: Record<string, string> = {
    run_code: 'kode dijalankan',
    correct_quiz: 'jawaban benar',
    lesson_complete: 'materi selesai',
    puzzle_solved: 'puzzle selesai',
    bug_found: 'bug ditemukan',
    challenge_complete: 'tantangan selesai',
    game_round: 'ronde game',
    boss_hit: 'serangan ke boss',
  }
  return map[counter] ?? 'progres'
}
