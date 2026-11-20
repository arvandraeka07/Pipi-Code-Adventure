import { useEffect, useId, useRef, type ReactNode } from 'react'
import type { EvolutionStage, PipiMood } from '../types'
import { useGame } from '../store/GameContext'

interface PipiProps {
  mood?: PipiMood
  stage?: EvolutionStage
  size?: number
  className?: string
  animate?: boolean
  sparkle?: boolean
  interactive?: boolean
  /** Tampilkan kostum avatar tertentu tanpa mengubah profil aktif. */
  avatarOverride?: string
  /** Matikan aksesori avatar, misalnya untuk galeri evolusi. */
  accessory?: boolean
}

const AVATAR_LABEL: Record<string, string> = {
  pipi: 'Pipi',
  explorer: 'Penjelajah',
  wizard: 'Penyihir',
  ninja: 'Ninja',
  astronaut: 'Astronaut',
  robot: 'Robot',
}

const SCARF_COLOR: Record<string, string> = {
  pipi: '#FFC93C',
  explorer: '#F2A93B',
  wizard: '#A88BFA',
  ninja: '#FF7B8A',
  astronaut: '#8ED8FF',
  robot: '#A9C7D8',
}

function Sparkle({ x, y, s = 1, color = '#FFC93C' }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M0 -9 L2.8 -2.8 L9 0 L2.8 2.8 L0 9 L-2.8 2.8 L-9 0 L-2.8 -2.8 Z"
        fill={color}
        opacity="0.9"
      />
    </g>
  )
}

export function Pipi({
  mood = 'happy',
  stage = 'baby',
  size = 220,
  className = '',
  animate = false,
  sparkle,
  interactive = false,
  avatarOverride,
  accessory = true,
}: PipiProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const bodyId = `pipiBody${uid}`
  const bellyId = `pipiBelly${uid}`
  const glowId = `pipiGlow${uid}`
  const { save } = useGame()
  const avatar = avatarOverride ?? save?.profile.avatar ?? 'pipi'
  const showStageHat = accessory && avatar === 'pipi'
  const scarfColor = SCARF_COLOR[avatar] ?? SCARF_COLOR.pipi
  const avatarLabel = AVATAR_LABEL[avatar] ?? 'Pipi'
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!interactive) return
    const node = svgRef.current
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    let pointerX = 0
    let pointerY = 0
    const update = () => {
      frame = 0
      const rect = node.getBoundingClientRect()
      const x = Math.max(-3.5, Math.min(3.5, ((pointerX - (rect.left + rect.width / 2)) / rect.width) * 9))
      const y = Math.max(-3, Math.min(3, ((pointerY - (rect.top + rect.height / 2)) / rect.height) * 8))
      node.style.setProperty('--pipi-look-x', `${x.toFixed(2)}px`)
      node.style.setProperty('--pipi-look-y', `${y.toFixed(2)}px`)
    }
    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX
      pointerY = event.clientY
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [interactive])

  const closedEyes = mood === 'celebrate'
  const squintRight = mood === 'confused'
  const bigEyes = mood === 'surprised'
  const wink = mood === 'hint'
  const lookingUp = mood === 'thinking'
  const sad = mood === 'sad'

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 260 260"
      width={size}
      height={size}
      className={`${animate ? 'animate-bob' : ''} ${interactive ? 'pipi-interactive' : ''} ${className}`}
      role="img"
      aria-label={`${avatarLabel} si ular Python, ekspresi ${mood}, tahap ${stage}`}
    >
      <defs>
        <linearGradient id={bodyId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#63DE95" />
          <stop offset="60%" stopColor="#3BC472" />
          <stop offset="100%" stopColor="#25A85B" />
        </linearGradient>
        <linearGradient id={bellyId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F2FFF5" />
          <stop offset="100%" stopColor="#C7F5D8" />
        </linearGradient>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE79A" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFE79A" stopOpacity="0" />
        </radialGradient>
      </defs>

      {(mood === 'celebrate' || stage === 'master' || sparkle) && (
        <circle cx="130" cy="110" r="104" fill={`url(#${glowId})`} />
      )}

      {stage === 'master' && (
        <path
          d="M80 152 Q38 185 46 238 L130 222 L214 238 Q222 185 180 152 Z"
          fill="#8266E6"
          stroke="#123B2A"
          strokeWidth="5"
          strokeLinejoin="round"
        />
      )}

      <ellipse cx="130" cy="235" rx="80" ry="13" fill="#123B2A" opacity="0.12" />

      {/* tail curl */}
      <g className="pipi-tail">
        <path
          d="M196 205 C222 214 240 199 234 181 C230 169 214 168 209 180"
          fill="none"
          stroke="#123B2A"
          strokeWidth="22"
          strokeLinecap="round"
        />
        <path
          d="M196 205 C222 214 240 199 234 181 C230 169 214 168 209 180"
          fill="none"
          stroke={`url(#${bodyId})`}
          strokeWidth="14"
          strokeLinecap="round"
        />
      </g>

      {/* coiled body */}
      <ellipse cx="130" cy="201" rx="86" ry="38" fill={`url(#${bodyId})`} stroke="#123B2A" strokeWidth="5" />
      <ellipse cx="130" cy="197" rx="54" ry="22" fill="none" stroke="#123B2A" strokeOpacity="0.22" strokeWidth="3" />
      <ellipse cx="130" cy="208" rx="38" ry="12" fill={`url(#${bellyId})`} opacity="0.85" />

      {/* neck */}
      <path
        d="M100 142 L98 190 Q130 206 162 190 L160 142 Z"
        fill={`url(#${bodyId})`}
        stroke="#123B2A"
        strokeWidth="5"
      />
      <path d="M116 160 Q130 170 144 160 L142 196 Q130 203 118 196 Z" fill={`url(#${bellyId})`} opacity="0.8" />

      {/* scarf */}
      {stage !== 'baby' && (
        <g>
          <path
            d="M88 146 Q130 168 172 146 L168 166 Q130 186 92 166 Z"
            fill={scarfColor}
            stroke="#123B2A"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M158 162 Q188 172 180 204 L163 197 Q171 178 150 168 Z"
            fill={scarfColor}
            stroke="#123B2A"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path d="M96 158 Q130 176 164 158" fill="none" stroke="#123B2A" strokeWidth="2.4" opacity="0.25" />
        </g>
      )}

      {/* avatar emblem */}
      {accessory && avatar === 'explorer' && (
        <g>
          <path d="M96 160 L166 208" stroke="#7A4A1E" strokeWidth="9" strokeLinecap="round" />
          <path d="M96 160 L166 208" stroke="#B87D42" strokeWidth="4" strokeLinecap="round" />
          <circle cx="130" cy="187" r="14" fill="#C98A4B" stroke="#123B2A" strokeWidth="3.4" />
          <circle cx="130" cy="187" r="8.5" fill="#FFE79A" stroke="#123B2A" strokeWidth="2.2" />
          <path d="M130 179 L132.4 184.6 L138 187 L132.4 189.4 L130 195 L127.6 189.4 L122 187 L127.6 184.6 Z" fill="#2FBF71" />
        </g>
      )}

      {accessory && avatar === 'wizard' && (
        <g>
          <path d="M106 156 Q130 174 154 156" fill="none" stroke="#FFC93C" strokeWidth="4" strokeLinecap="round" />
          <circle cx="130" cy="174" r="9" fill="#8266E6" stroke="#123B2A" strokeWidth="3" />
          <path d="M130 166 L132 171 L137 173 L132 175 L130 180 L128 175 L123 173 L128 171 Z" fill="#FFE79A" />
          <circle cx="101" cy="174" r="3" fill="#CDBAF9" />
          <circle cx="159" cy="181" r="2.4" fill="#FFC93C" />
        </g>
      )}

      {accessory && avatar === 'ninja' && (
        <g>
          <path d="M100 159 L162 207" stroke="#2E3A5C" strokeWidth="9" strokeLinecap="round" />
          <path d="M160 159 L98 207" stroke="#3B466F" strokeWidth="7" strokeLinecap="round" />
          <circle cx="130" cy="185" r="12" fill="#BFE9FF" stroke="#123B2A" strokeWidth="3" />
          <path d="M130 175 L133 182 L140 185 L133 188 L130 195 L127 188 L120 185 L127 182 Z" fill="#3B466F" />
          <circle cx="130" cy="185" r="2.6" fill="#FFFDF2" />
        </g>
      )}

      {accessory && avatar === 'astronaut' && (
        <g>
          <rect x="103" y="171" width="54" height="31" rx="9" fill="#E8F8FF" stroke="#123B2A" strokeWidth="3.4" />
          <circle cx="116" cy="182" r="4.2" fill="#FF8A7A" stroke="#123B2A" strokeWidth="1.8" />
          <circle cx="129" cy="182" r="4.2" fill="#FFC93C" stroke="#123B2A" strokeWidth="1.8" />
          <rect x="112" y="191" width="31" height="3.4" rx="1.7" fill="#5EC8F5" />
          <rect x="146" y="190" width="6" height="6" rx="1.6" fill="#2FBF71" stroke="#123B2A" strokeWidth="1.4" />
        </g>
      )}

      {accessory && avatar === 'robot' && (
        <g>
          <rect x="104" y="172" width="52" height="30" rx="7" fill="#A9C7D8" stroke="#123B2A" strokeWidth="3.4" />
          <path d="M113 182 H124 M113 188 H119 M139 182 H147" stroke="#123B2A" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="145" cy="190" r="2.5" fill="#FF8A7A" />
          <circle cx="113" cy="194" r="2" fill="#FFC93C" />
          <circle cx="151" cy="177" r="1.8" fill="#123B2A" opacity="0.55" />
          <circle cx="109" cy="177" r="1.8" fill="#123B2A" opacity="0.55" />
        </g>
      )}

      {/* head */}
      <ellipse cx="130" cy="103" rx="66" ry="60" fill={`url(#${bodyId})`} stroke="#123B2A" strokeWidth="5" />
      <ellipse cx="130" cy="111" rx="45" ry="39" fill={`url(#${bellyId})`} opacity="0.92" />

      {/* cheeks */}
      <ellipse cx="88" cy="123" rx="11" ry="7" fill="#FF9CB6" opacity="0.65" />
      <ellipse cx="172" cy="123" rx="11" ry="7" fill="#FF9CB6" opacity="0.65" />

      {/* eyes */}
      {closedEyes ? (
        <g stroke="#123B2A" strokeWidth="6" strokeLinecap="round" fill="none">
          <path d="M92 92 Q105 78 118 92" />
          <path d="M142 92 Q155 78 168 92" />
        </g>
      ) : wink ? (
        <g>
          <path d="M92 92 Q105 80 118 92" stroke="#123B2A" strokeWidth="6" fill="none" strokeLinecap="round" />
          <g>
            <ellipse cx="155" cy="90" rx={bigEyes ? 20 : 17} ry={bigEyes ? 23 : 20} fill="#FFFFFF" stroke="#123B2A" strokeWidth="4" />
            <g className="pipi-pupil">
              <circle cx="158" cy="92" r={bigEyes ? 7 : 9} fill="#123B2A" />
              <circle cx="161" cy="88" r="3" fill="#FFFFFF" />
            </g>
          </g>
        </g>
      ) : (
        <g>
          {sad && (
            <g stroke="#123B2A" strokeWidth="5" strokeLinecap="round" fill="none">
              <path d="M90 78 Q102 72 116 78" />
              <path d="M144 78 Q158 72 170 78" />
            </g>
          )}
          {squintRight && (
            <g stroke="#123B2A" strokeWidth="5" strokeLinecap="round" fill="none">
              <path d="M138 84 Q152 74 166 84" />
            </g>
          )}
          {lookingUp && (
            <g stroke="#123B2A" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.75">
              <path d="M92 74 Q105 68 118 74" />
              <path d="M142 74 Q155 68 168 74" />
            </g>
          )}
          <g>
            <ellipse cx="105" cy="92" rx={bigEyes ? 21 : 17} ry={bigEyes ? 24 : 20} fill="#FFFFFF" stroke="#123B2A" strokeWidth="4" />
            <g className="pipi-pupil">
              <circle cx={lookingUp ? 108 : sad ? 105 : 108} cy={lookingUp ? 86 : sad ? 97 : 92} r={bigEyes ? 7 : 9.5} fill="#123B2A" />
              <circle cx={lookingUp ? 111 : sad ? 108 : 111} cy={lookingUp ? 82 : sad ? 93 : 88} r="3.2" fill="#FFFFFF" />
            </g>
          </g>
          <g>
            <ellipse cx="155" cy="92" rx={bigEyes ? 21 : 17} ry={bigEyes ? 24 : 20} fill="#FFFFFF" stroke="#123B2A" strokeWidth="4" />
            <g className="pipi-pupil">
              <circle cx={lookingUp ? 158 : sad ? 155 : 158} cy={lookingUp ? 86 : sad ? 97 : 92} r={bigEyes ? 7 : 9.5} fill="#123B2A" />
              <circle cx={lookingUp ? 161 : sad ? 158 : 161} cy={lookingUp ? 82 : sad ? 93 : 88} r="3.2" fill="#FFFFFF" />
            </g>
          </g>
        </g>
      )}

      {/* nostrils */}
      <ellipse cx="122" cy="112" rx="2.2" ry="3" fill="#123B2A" opacity="0.55" />
      <ellipse cx="138" cy="112" rx="2.2" ry="3" fill="#123B2A" opacity="0.55" />

      {/* mouth */}
      {mood === 'surprised' ? (
        <ellipse cx="130" cy="132" rx="11" ry="13" fill="#7A2E3A" stroke="#123B2A" strokeWidth="4" />
      ) : mood === 'sad' ? (
        <path d="M112 138 Q130 124 148 138" fill="none" stroke="#123B2A" strokeWidth="4.5" strokeLinecap="round" />
      ) : mood === 'confused' ? (
        <path d="M112 134 Q122 128 130 134 Q138 140 148 134" fill="none" stroke="#123B2A" strokeWidth="4.5" strokeLinecap="round" />
      ) : mood === 'thinking' ? (
        <path d="M118 134 L142 134" fill="none" stroke="#123B2A" strokeWidth="4.5" strokeLinecap="round" />
      ) : mood === 'celebrate' ? (
        <g>
          <path d="M106 126 Q130 152 154 126 Q130 140 106 126 Z" fill="#7A2E3A" stroke="#123B2A" strokeWidth="4" strokeLinejoin="round" />
          <path d="M121 139 Q130 149 139 139 Q130 144 121 139 Z" fill="#FF8FA3" />
        </g>
      ) : (
        <g>
          <path d="M108 128 Q130 148 152 128" fill="none" stroke="#123B2A" strokeWidth="4.5" strokeLinecap="round" />
          {mood === 'happy' && <path d="M123 140 Q130 146 137 140" fill="#FF8FA3" opacity="0.9" />}
        </g>
      )}

      {/* baby eggshell cap */}
      {showStageHat && stage === 'baby' && (
        <g>
          <path
            d="M68 80 Q70 36 130 33 Q190 36 192 80 L181 75 L174 87 L162 76 L153 88 L141 77 L130 90 L119 77 L107 88 L98 76 L86 87 L79 75 Z"
            fill="#FFFDF2"
            stroke="#123B2A"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path d="M92 62 Q100 54 108 60" stroke="#E8D9B0" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M152 50 Q160 44 168 50" stroke="#E8D9B0" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      )}

      {/* junior: small leaf */}
      {showStageHat && stage === 'junior' && (
        <g transform="translate(176 52) rotate(18)">
          <path d="M0 18 Q2 0 22 0 Q22 20 0 18 Z" fill="#63DE95" stroke="#123B2A" strokeWidth="3.5" />
          <path d="M2 16 Q10 10 18 4" stroke="#123B2A" strokeWidth="2.5" fill="none" />
        </g>
      )}

      {/* smart: explorer hat */}
      {showStageHat && stage === 'smart' && (
        <g>
          <ellipse cx="130" cy="55" rx="74" ry="14" fill="#8E6FF0" stroke="#123B2A" strokeWidth="4.5" />
          <path d="M86 55 Q88 22 130 20 Q172 22 174 55 Z" fill="#A88BFA" stroke="#123B2A" strokeWidth="4.5" />
          <path d="M92 49 Q130 58 168 49" fill="none" stroke="#FFC93C" strokeWidth="7" strokeLinecap="round" />
          <path d="M130 20 L130 49" stroke="#8266E6" strokeWidth="3" opacity="0.6" />
          <circle cx="130" cy="35" r="4.5" fill="#FFC93C" stroke="#123B2A" strokeWidth="2" />
        </g>
      )}

      {/* master: crown */}
      {showStageHat && stage === 'master' && (
        <g>
          <path
            d="M94 48 L92 20 L110 32 L130 12 L150 32 L168 20 L166 48 Q130 58 94 48 Z"
            fill="#FFD452"
            stroke="#123B2A"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          <circle cx="130" cy="25" r="4" fill="#FF8A7A" stroke="#123B2A" strokeWidth="2" />
          <circle cx="108" cy="34" r="3.4" fill="#8266E6" stroke="#123B2A" strokeWidth="1.8" />
          <circle cx="152" cy="34" r="3.4" fill="#2FBF71" stroke="#123B2A" strokeWidth="1.8" />
          <path d="M104 48 Q130 56 156 48" stroke="#E8A914" strokeWidth="3" fill="none" />
        </g>
      )}

      {/* avatar accessories */}
      {accessory && avatar === 'explorer' && (
        <g>
          <ellipse cx="130" cy="58" rx="76" ry="14" fill="#D9A15E" stroke="#123B2A" strokeWidth="4.5" />
          <path d="M84 56 Q86 21 130 19 Q174 21 176 56 Z" fill="#C98A4B" stroke="#123B2A" strokeWidth="4.5" strokeLinejoin="round" />
          <path d="M87 51 Q130 60 173 51" fill="none" stroke="#7A4A1E" strokeWidth="7" strokeLinecap="round" />
          <rect x="119" y="45" width="22" height="11" rx="3" fill="#FFD452" stroke="#123B2A" strokeWidth="2.5" />
          <path d="M100 34 Q118 24 138 29" stroke="#E9BC85" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
        </g>
      )}

      {accessory && avatar === 'wizard' && (
        <g>
          <path d="M130 0 L168 58 Q130 70 92 58 Z" fill="#8E6FF0" stroke="#123B2A" strokeWidth="4.5" strokeLinejoin="round" />
          <ellipse cx="130" cy="58" rx="76" ry="14" fill="#A88BFA" stroke="#123B2A" strokeWidth="4.5" />
          <path d="M93 55 Q130 66 167 55" fill="none" stroke="#FFC93C" strokeWidth="5" strokeLinecap="round" />
          <path d="M148 28 l2.4 5.6 6 0.7 -4.5 4 1.2 6 -5.1 -3 -5.1 3 1.2 -6 -4.5 -4 6 -0.7 Z" fill="#FFE79A" stroke="#123B2A" strokeWidth="1.8" strokeLinejoin="round" />
          <circle cx="112" cy="38" r="3.2" fill="#FFFDF2" opacity="0.9" />
        </g>
      )}

      {accessory && avatar === 'ninja' && (
        <g>
          <path d="M70 60 Q130 44 190 60 L188 76 Q130 62 72 76 Z" fill="#3B466F" stroke="#123B2A" strokeWidth="4" strokeLinejoin="round" />
          <path d="M186 68 Q210 72 204 100 Q193 84 182 82 Z" fill="#3B466F" stroke="#123B2A" strokeWidth="4" strokeLinejoin="round" />
          <path d="M190 78 Q202 85 199 95" fill="none" stroke="#FF7B8A" strokeWidth="3" strokeLinecap="round" />
          <circle cx="130" cy="67" r="4" fill="#BFE9FF" stroke="#123B2A" strokeWidth="2" />
          <path d="M126 67 L134 67" stroke="#123B2A" strokeWidth="1.6" />
        </g>
      )}

      {accessory && avatar === 'astronaut' && (
        <g>
          <circle cx="130" cy="108" r="78" fill="#BFE9FF" opacity="0.1" />
          <circle cx="130" cy="108" r="78" fill="none" stroke="#5EC8F5" strokeWidth="5" />
          <path d="M74 84 Q92 56 130 49" fill="none" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" opacity="0.8" />
          <path d="M206 54 L216 32" stroke="#123B2A" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="218" cy="27" r="6" fill="#FF8A7A" stroke="#123B2A" strokeWidth="3" />
          <rect x="184" y="124" width="16" height="10" rx="3" fill="#FFC93C" stroke="#123B2A" strokeWidth="2.5" />
        </g>
      )}

      {accessory && avatar === 'robot' && (
        <g>
          <path d="M130 44 L130 24" stroke="#123B2A" strokeWidth="6" strokeLinecap="round" />
          <circle cx="130" cy="16" r="8" fill="#FFD452" stroke="#123B2A" strokeWidth="3.5" />
          <path d="M86 62 Q130 44 174 62" fill="none" stroke="#BFE9FF" strokeWidth="8" strokeLinecap="round" />
          <circle cx="130" cy="60" r="3.4" fill="#FF8A7A" stroke="#123B2A" strokeWidth="2" />
          <circle cx="70" cy="105" r="9" fill="#BFE9FF" stroke="#123B2A" strokeWidth="3.5" />
          <circle cx="190" cy="105" r="9" fill="#BFE9FF" stroke="#123B2A" strokeWidth="3.5" />
          <path d="M61 105 L54 105 M199 105 L206 105" stroke="#123B2A" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}

      {/* mood decorations */}
      {mood === 'confused' && (
        <g>
          <text x="205" y="55" fontSize="34" fontFamily="'Baloo 2', sans-serif" fontWeight="800" fill="#8266E6">
            ?
          </text>
          <text x="40" y="90" fontSize="22" fontFamily="'Baloo 2', sans-serif" fontWeight="800" fill="#8266E6" opacity="0.7">
            ?
          </text>
        </g>
      )}
      {mood === 'thinking' && (
        <g>
          <circle cx="200" cy="58" r="7" fill="#FFFDF2" stroke="#123B2A" strokeWidth="3" />
          <circle cx="214" cy="42" r="10" fill="#FFFDF2" stroke="#123B2A" strokeWidth="3" />
          <circle cx="234" cy="24" r="15" fill="#FFFDF2" stroke="#123B2A" strokeWidth="3" />
          <text x="234" y="30" textAnchor="middle" fontSize="18" fontWeight="800" fontFamily="'Baloo 2', sans-serif" fill="#8266E6">
            ?
          </text>
        </g>
      )}
      {mood === 'hint' && (
        <g>
          <circle cx="218" cy="48" r="19" fill="#FFE79A" stroke="#123B2A" strokeWidth="3.5" />
          <path d="M218 36 L218 50" stroke="#123B2A" strokeWidth="4" strokeLinecap="round" />
          <circle cx="218" cy="57" r="2.6" fill="#123B2A" />
          <path d="M210 63 L226 63" stroke="#123B2A" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}
      {mood === 'sad' && (
        <path d="M96 104 Q90 118 95 128 Q102 120 100 108 Z" fill="#8ED8FF" stroke="#123B2A" strokeWidth="2.5" />
      )}
      {mood === 'surprised' && (
        <g>
          <path d="M52 60 L58 74" stroke="#123B2A" strokeWidth="4" strokeLinecap="round" />
          <path d="M40 78 L52 84" stroke="#123B2A" strokeWidth="4" strokeLinecap="round" />
          <path d="M208 80 L220 74" stroke="#123B2A" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}
      {mood === 'celebrate' && (
        <g>
          <Sparkle x={40} y={62} s={0.9} />
          <Sparkle x={214} y={78} s={0.7} color="#FF8A7A" />
          <Sparkle x={48} y={150} s={0.55} color="#CDBAF9" />
          <Sparkle x={222} y={145} s={0.8} color="#63DE95" />
        </g>
      )}
      {stage === 'master' && (
        <g>
          <Sparkle x={42} y={118} s={0.7} />
          <Sparkle x={218} y={112} s={0.6} color="#FF8A7A" />
          <Sparkle x={130} y={248} s={0.45} color="#CDBAF9" />
        </g>
      )}
    </svg>
  )
}

export function PipiBubble({
  children,
  mood = 'happy',
  size = 92,
  className = '',
}: {
  children: ReactNode
  mood?: PipiMood
  size?: number
  className?: string
}) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="shrink-0">
        <Pipi mood={mood} size={size} />
      </div>
      <div className="relative mt-3 flex-1 rounded-3xl border-[3px] border-ink bg-paper px-4 py-3 text-sm font-semibold leading-relaxed text-ink shadow-pop-sm">
        <span className="absolute -left-2 top-5 h-4 w-4 rotate-45 border-b-[3px] border-l-[3px] border-ink bg-paper" />
        {children}
      </div>
    </div>
  )
}
