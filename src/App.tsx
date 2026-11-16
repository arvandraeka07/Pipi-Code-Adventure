import type { ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useGame } from './store/GameContext'
import { AppLayout } from './components/Layout'
import { Pipi } from './components/Pipi'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import AdventureMap from './pages/AdventureMap'
import WorldMap from './pages/WorldMap'
import LearningRoom from './pages/LearningRoom'
import BossBattle from './pages/BossBattle'
import Playground from './pages/Playground'
import MiniGames from './pages/MiniGames'
import Achievements from './pages/Achievements'
import Tutor from './pages/Tutor'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import DailyQuest from './pages/DailyQuest'

function LoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-cream">
      <div className="text-center">
        <Pipi mood="happy" size={120} animate />
        <p className="mt-2 font-display text-sm font-extrabold text-ink/60">Menyiapkan petualangan...</p>
      </div>
    </div>
  )
}

function RequireProfile({ children }: { children: ReactNode }) {
  const { save, loading } = useGame()
  const location = useLocation()
  if (loading) return <LoadingScreen />
  if (!save) return <Navigate to="/" replace state={{ from: location.pathname }} />
  return <>{children}</>
}

function NotFound() {
  const { save } = useGame()
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="text-center">
        <Pipi mood="confused" size={150} />
        <h1 className="mt-2 font-display text-2xl font-extrabold">Halaman tidak ditemukan</h1>
        <p className="mt-1 text-sm font-semibold text-ink/60">Sepertinya Pipi membawa peta yang salah.</p>
        <a
          href={save ? '/dashboard' : '/'}
          className="mt-4 inline-flex rounded-2xl border-[3px] border-ink bg-sun px-4 py-2 font-display text-sm font-extrabold shadow-pop"
        >
          Kembali ke petualangan
        </a>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        element={
          <RequireProfile>
            <AppLayout />
          </RequireProfile>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/adventure" element={<AdventureMap />} />
        <Route path="/world/:worldId" element={<WorldMap />} />
        <Route path="/lesson/:levelId" element={<LearningRoom />} />
        <Route path="/boss/:worldId" element={<BossBattle />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/games" element={<MiniGames />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/tutor" element={<Tutor />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/daily" element={<DailyQuest />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
