import type { Level, QuizQuestion, World } from '../../types'
import { world1 } from './world1'
import { world2 } from './world2'
import { world3 } from './world3'
import { world4 } from './world4'
import { world5 } from './world5'
import { world6 } from './world6'
import { world7 } from './world7'

export const WORLDS: World[] = [
  world1,
  world2,
  world3,
  world4,
  world5,
  world6,
  world7,
]

export const ALL_LEVELS: { world: World; level: Level }[] = WORLDS.flatMap((world) =>
  world.levels.map((level) => ({ world, level })),
)

export const ALL_QUESTIONS: QuizQuestion[] = WORLDS.flatMap((w) =>
  w.levels.flatMap((l) => l.quiz),
)

export function getWorld(worldId: string): World | undefined {
  return WORLDS.find((w) => w.id === worldId)
}

export function getLevel(worldId: string, levelId: string) {
  const world = getWorld(worldId)
  const level = world?.levels.find((l) => l.id === levelId)
  return world && level ? { world, level } : null
}

export function findLevelById(levelId: string) {
  return ALL_LEVELS.find((item) => item.level.id === levelId) ?? null
}

export function findQuestionById(questionId: string): QuizQuestion | undefined {
  return ALL_QUESTIONS.find((q) => q.id === questionId)
}

export function findWorldByLevel(levelId: string): World | undefined {
  return ALL_LEVELS.find((item) => item.level.id === levelId)?.world
}

export function levelGlobalIndex(levelId: string): number {
  return ALL_LEVELS.findIndex((item) => item.level.id === levelId)
}

export function quizCountForWorld(worldId: string): number {
  return getWorld(worldId)?.levels.reduce((sum, l) => sum + l.quiz.length, 0) ?? 0
}

/* integrity check (dev only) */
if (import.meta.env.DEV) {
  const ids = new Set<string>()
  const qids = new Set<string>()
  for (const world of WORLDS) {
    if (ids.has(world.id)) console.warn(`Duplicate world id: ${world.id}`)
    ids.add(world.id)
    for (const level of world.levels) {
      if (ids.has(level.id)) console.warn(`Duplicate level id: ${level.id}`)
      ids.add(level.id)
      if (!level.quiz.length) console.warn(`Level ${level.id} has no quiz`)
      for (const q of level.quiz) {
        if (qids.has(q.id)) console.warn(`Duplicate question id: ${q.id}`)
        qids.add(q.id)
        if (q.answer < 0 || q.answer >= q.options.length) {
          console.warn(`Question ${q.id} has invalid answer index`)
        }
      }
    }
    for (const qid of world.boss.questionIds) {
      if (!ALL_QUESTIONS.some((q) => q.id === qid)) {
        console.warn(`Boss ${world.boss.id} references missing question ${qid}`)
      }
    }
  }
}
