import type { Level, SaveState, World } from '../types'
import { WORLDS, getWorld, levelGlobalIndex } from '../data/worlds'

export function isLevelComplete(save: SaveState, levelId: string): boolean {
  return Boolean(save.completedLevels[levelId])
}

export function isWorldUnlocked(save: SaveState, worldId: string): boolean {
  const world = getWorld(worldId)
  if (!world) return false
  if (world.order === 1) return true
  const prev = WORLDS[world.order - 2]
  if (!prev) return true
  return Boolean(save.bossesDefeated[prev.id])
}

export function isLevelUnlocked(save: SaveState, world: World, level: Level): boolean {
  if (!isWorldUnlocked(save, world.id)) return false
  const index = world.levels.findIndex((l) => l.id === level.id)
  if (index <= 0) return true
  const prevLevel = world.levels[index - 1]
  return isLevelComplete(save, prevLevel.id)
}

export function isBossUnlocked(save: SaveState, world: World): boolean {
  return isWorldUnlocked(save, world.id) && world.levels.every((l) => isLevelComplete(save, l.id))
}

export function isBossDefeated(save: SaveState, worldId: string): boolean {
  return Boolean(save.bossesDefeated[worldId])
}

export function worldProgress(save: SaveState, world: World) {
  const completed = world.levels.filter((l) => isLevelComplete(save, l.id)).length
  const total = world.levels.length
  const boss = isBossDefeated(save, world.id)
  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100),
    bossUnlocked: isBossUnlocked(save, world),
    bossDefeated: boss,
    unlocked: isWorldUnlocked(save, world.id),
    rewardsClaimed: Boolean(save.worldRewardsClaimed[world.id]),
    complete: boss,
  }
}

export function overallProgress(save: SaveState) {
  const totalLevels = WORLDS.reduce((n, w) => n + w.levels.length, 0)
  const completed = Object.keys(save.completedLevels).length
  const worldsDone = WORLDS.filter((w) => save.bossesDefeated[w.id]).length
  return {
    totalLevels,
    completed,
    percent: Math.round((completed / totalLevels) * 100),
    worldsDone,
    totalWorlds: WORLDS.length,
  }
}

export function nextRecommended(save: SaveState): { world: World; level: Level } | null {
  for (const world of WORLDS) {
    if (!isWorldUnlocked(save, world.id)) continue
    for (const level of world.levels) {
      if (!isLevelComplete(save, level.id) && isLevelUnlocked(save, world, level)) {
        return { world, level }
      }
    }
  }
  return null
}

export function lastPlayedLevel(save: SaveState): { world: World; level: Level } | null {
  if (!save.lastLesson) return null
  for (const world of WORLDS) {
    const level = world.levels.find((l) => l.id === save.lastLesson)
    if (level) return { world, level }
  }
  return null
}

export function nextLevelInWorld(world: World, levelId: string): Level | null {
  const idx = world.levels.findIndex((l) => l.id === levelId)
  return world.levels[idx + 1] ?? null
}

export function levelOrderLabel(levelId: string): string {
  const idx = levelGlobalIndex(levelId)
  return idx >= 0 ? `Misi #${idx + 1}` : 'Misi'
}

export function xpNeededForEvolution(stage: 'junior' | 'smart' | 'master'): number {
  return stage === 'junior' ? 3 : stage === 'smart' ? 6 : 10
}
