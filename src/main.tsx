import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { applyStoredPreferences } from './lib/preferences'
import { GameProvider } from './store/GameContext'

applyStoredPreferences()

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <GameProvider>
      <App />
    </GameProvider>
  </BrowserRouter>,
)
