import { useId } from 'react'
import { Icon } from './Icon'
import { cn } from './ui'

export interface AvatarMeta {
  label: string
  icon: string
  color: string
  halo: string
  accent: string
  tagline: string
}

export const AVATAR_META: Record<string, AvatarMeta> = {
  pipi: {
    label: 'Pipi',
    icon: 'sparkles',
    color: '#63DE95',
    halo: '#D8F7E4',
    accent: '#FFC93C',
    tagline: 'Sahabat ceria',
  },
  explorer: {
    label: 'Penjelajah',
    icon: 'compass',
    color: '#FFC93C',
    halo: '#FFF4CC',
    accent: '#2FBF71',
    tagline: 'Siap berpetualang',
  },
  wizard: {
    label: 'Penyihir',
    icon: 'wand',
    color: '#CDBAF9',
    halo: '#F1EBFF',
    accent: '#FFC93C',
    tagline: 'Sihir kode',
  },
  ninja: {
    label: 'Ninja',
    icon: 'swords',
    color: '#BFE9FF',
    halo: '#E9F8FF',
    accent: '#FF7B8A',
    tagline: 'Tenang dan fokus',
  },
  astronaut: {
    label: 'Astronaut',
    icon: 'rocket',
    color: '#FFD9E3',
    halo: '#FFF1F5',
    accent: '#8ED8FF',
    tagline: 'Jelajah angkasa',
  },
  robot: {
    label: 'Robot',
    icon: 'bot',
    color: '#D8F7E4',
    halo: '#EEFFF5',
    accent: '#A9C7D8',
    tagline: 'Logika presisi',
  },
}

const INK = '#123B2A'

function BackdropSparkle({ x, y, s = 1, color }: { x: number; y: number; s?: number; color: string }) {
  return (
    <path
      d="M0 -5 L1.5 -1.5 L5 0 L1.5 1.5 L0 5 L-1.5 1.5 L-5 0 L-1.5 -1.5 Z"
      fill={color}
      opacity="0.85"
      transform={`translate(${x} ${y}) scale(${s})`}
    />
  )
}

function AvatarFace({ bodyId, bellyId, blinking }: { bodyId: string; bellyId: string; blinking?: boolean }) {
  return (
    <>
      <ellipse cx="50" cy="79" rx="24" ry="4.5" fill={INK} opacity="0.12" />
      <ellipse cx="50" cy="53" rx="24" ry="23" fill={`url(#${bodyId})`} stroke={INK} strokeWidth="2.8" />
      <ellipse cx="50" cy="57" rx="15.5" ry="13.5" fill={`url(#${bellyId})`} opacity="0.94" />
      <ellipse cx="35" cy="60" rx="4.6" ry="3" fill="#FF9CB6" opacity="0.7" />
      <ellipse cx="65" cy="60" rx="4.6" ry="3" fill="#FF9CB6" opacity="0.7" />
      <g className={blinking ? 'avatar-eye-blink' : undefined} style={blinking ? { transformBox: 'fill-box', transformOrigin: 'center' } : undefined}>
        <ellipse cx="42" cy="50" rx="5.7" ry="6.7" fill="#FFFFFF" stroke={INK} strokeWidth="2.2" />
        <circle cx="42.8" cy="50.8" r="2.5" fill={INK} />
        <circle cx="43.7" cy="49.5" r="0.9" fill="#FFFFFF" />
      </g>
      <g className={blinking ? 'avatar-eye-blink avatar-eye-blink-delay' : undefined} style={blinking ? { transformBox: 'fill-box', transformOrigin: 'center' } : undefined}>
        <ellipse cx="58" cy="50" rx="5.7" ry="6.7" fill="#FFFFFF" stroke={INK} strokeWidth="2.2" />
        <circle cx="58.8" cy="50.8" r="2.5" fill={INK} />
        <circle cx="59.7" cy="49.5" r="0.9" fill="#FFFFFF" />
      </g>
      <ellipse cx="46.6" cy="57.5" rx="1" ry="1.4" fill={INK} opacity="0.5" />
      <ellipse cx="53.4" cy="57.5" rx="1" ry="1.4" fill={INK} opacity="0.5" />
      <path d="M45.5 63 Q50 67.5 54.5 63" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
    </>
  )
}

function AvatarCostume({ avatar, meta }: { avatar: string; meta: AvatarMeta }) {
  if (avatar === 'explorer') {
    return (
      <g>
        <path d="M19 37 Q20 13 50 10 Q80 13 81 37 Z" fill="#D9A15E" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
        <ellipse cx="50" cy="37" rx="31" ry="5.5" fill="#C98A4B" stroke={INK} strokeWidth="2.8" />
        <path d="M24 34 Q50 41 76 34" fill="none" stroke="#7A4A1E" strokeWidth="4" strokeLinecap="round" />
        <circle cx="50" cy="27" r="5.2" fill={meta.accent} stroke={INK} strokeWidth="2" />
        <path d="M31 20 Q40 14 49 16" fill="none" stroke="#F3CF9B" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M33 72 Q50 79 67 72" fill="none" stroke="#2FBF71" strokeWidth="4" strokeLinecap="round" />
        <circle cx="22" cy="20" r="2.2" fill={meta.accent} opacity="0.85" />
      </g>
    )
  }

  if (avatar === 'wizard') {
    return (
      <g>
        <path d="M50 1 Q57 3 62 13 L75 37 Q50 45 25 37 Z" fill="#8E6FF0" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
        <ellipse cx="50" cy="37" rx="30" ry="5.8" fill="#A88BFA" stroke={INK} strokeWidth="2.8" />
        <path d="M26 35 Q50 43 74 35" fill="none" stroke={meta.accent} strokeWidth="3.2" strokeLinecap="round" />
        <path d="M55 15 l1.7 4 4.3 0.5 -3.2 2.9 0.9 4.2 -3.7 -2.2 -3.7 2.2 0.9 -4.2 -3.2 -2.9 4.3 -0.5 Z" fill="#FFE79A" stroke={INK} strokeWidth="1.2" />
        <circle cx="39" cy="25" r="1.8" fill="#FFFDF2" />
        <circle cx="68" cy="23" r="1.4" fill="#FFE79A" />
        <path d="M16 44 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" fill={meta.accent} opacity="0.85" />
      </g>
    )
  }

  if (avatar === 'ninja') {
    return (
      <g>
        <path d="M26 75 Q20 58 24 43 L36 46 Q31 60 35 75 Z" fill="#2E3A5C" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M74 75 Q80 58 76 43 L64 46 Q69 60 65 75 Z" fill="#2E3A5C" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M23 38 Q50 28 77 38 L76 45 Q50 37 24 45 Z" fill="#3B466F" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
        <rect x="43" y="35.5" width="14" height="8" rx="2" fill="#BFE9FF" stroke={INK} strokeWidth="1.8" />
        <path d="M49 39.5 L51 39.5" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M77 42 Q89 44 90 56 Q82 51 75 50 Z" fill={meta.accent} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M80 46 Q86 49 87 54" fill="none" stroke="#FFFDF2" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M18 68 l1.4 4 4 1.4 -4 1.4 -1.4 4 -1.4 -4 -4 -1.4 4 -1.4 Z" fill="#BFE9FF" stroke={INK} strokeWidth="1.1" />
      </g>
    )
  }

  if (avatar === 'astronaut') {
    return (
      <g>
        <circle cx="50" cy="53" r="30" fill="#BFE9FF" opacity="0.24" />
        <circle cx="50" cy="53" r="30" fill="none" stroke="#5EC8F5" strokeWidth="3.4" />
        <path d="M28 43 Q36 28 52 25" fill="none" stroke="#FFFFFF" strokeWidth="4.2" strokeLinecap="round" opacity="0.9" />
        <path d="M30 76 Q50 86 70 76 L69 83 Q50 91 31 83 Z" fill="#E8F8FF" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M75 28 L81 16" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="82" cy="13" r="4.2" fill={meta.accent} stroke={INK} strokeWidth="2" />
        <rect x="65" y="72" width="9" height="5.5" rx="1.7" fill="#FFC93C" stroke={INK} strokeWidth="1.6" />
        <path d="M14 30 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6 Z" fill="#FFFFFF" opacity="0.9" />
      </g>
    )
  }

  if (avatar === 'robot') {
    return (
      <g>
        <path d="M50 34 L50 16" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
        <circle cx="50" cy="12" r="5.4" fill={meta.accent} stroke={INK} strokeWidth="2.2" />
        <circle cx="50" cy="12" r="1.7" fill="#FFFDF2" />
        <circle cx="24" cy="55" r="5.2" fill="#BFE9FF" stroke={INK} strokeWidth="2.2" />
        <circle cx="76" cy="55" r="5.2" fill="#BFE9FF" stroke={INK} strokeWidth="2.2" />
        <path d="M20 55 L14 55 M80 55 L86 55" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <path d="M28 38 Q50 33 72 38 L71 44 Q50 40 29 44 Z" fill="#A9C7D8" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M34 76 Q50 82 66 76 L65 83 Q50 88 35 83 Z" fill="#D8F7E4" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
        <circle cx="50" cy="79" r="2.7" fill={meta.accent} stroke={INK} strokeWidth="1.4" />
        <path d="M84 21 l1.4 3.7 3.7 1.4 -3.7 1.4 -1.4 3.7 -1.4 -3.7 -3.7 -1.4 3.7 -1.4 Z" fill="#A9C7D8" opacity="0.9" />
      </g>
    )
  }

  return (
    <g>
      <path
        d="M26 42 Q27 18 50 15 Q73 18 74 42 L68 37 L64.5 44 L59 38 L55 45 L50 39 L45 45 L41 38 L35.5 44 L32 37 Z"
        fill="#FFFDF2"
        stroke={INK}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path d="M36 31 Q41 27 46 29" fill="none" stroke="#E8D9B0" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M67 14 Q72 5 80 9 Q78 18 69 20 Z" fill="#63DE95" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M69 17 Q73 12 77 11" fill="none" stroke={INK} strokeWidth="1.3" strokeLinecap="round" opacity="0.55" />
      <path d="M17 29 l1.6 4.2 4.2 1.6 -4.2 1.6 -1.6 4.2 -1.6 -4.2 -4.2 -1.6 4.2 -1.6 Z" fill="#FFE79A" stroke={INK} strokeWidth="1.1" />
    </g>
  )
}

export function Avatar({
  avatar,
  size = 44,
  className,
  ring = true,
}: {
  avatar: string
  size?: number
  className?: string
  ring?: boolean
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const bodyId = `avatarBody${uid}`
  const bellyId = `avatarBelly${uid}`
  const shinyId = `avatarShine${uid}`
  const meta = AVATAR_META[avatar] ?? AVATAR_META.pipi

  return (
    <span
      className={cn(
        'avatar-portrait relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full border-[3px] border-ink',
        ring && 'shadow-pop-sm',
        className,
      )}
      style={{ width: size, height: size, background: `linear-gradient(145deg, ${meta.halo}, ${meta.color})` }}
      title={meta.label}
      role="img"
      aria-label={`Avatar ${meta.label}`}
    >
      <span className="avatar-portrait-glow" aria-hidden="true" />
      <svg viewBox="0 0 100 100" className="avatar-art relative z-10 h-full w-full" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={bodyId} x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0%" stopColor="#79E8A4" />
            <stop offset="55%" stopColor="#45CB7C" />
            <stop offset="100%" stopColor="#28A95C" />
          </linearGradient>
          <linearGradient id={bellyId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5FFF8" />
            <stop offset="100%" stopColor="#CDF6DD" />
          </linearGradient>
          <radialGradient id={shinyId} cx="30%" cy="24%" r="72%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="55" r="34" fill={meta.color} opacity="0.3" />
        <BackdropSparkle x={17} y={21} s={0.8} color={meta.accent} />
        <BackdropSparkle x={85} y={65} s={0.7} color={meta.accent} />
        <BackdropSparkle x={22} y={78} s={0.55} color={meta.accent} />
        <circle cx="82" cy="23" r="1.8" fill={meta.accent} opacity="0.75" />
        <circle cx="14" cy="53" r="1.4" fill={meta.accent} opacity="0.55" />
        <AvatarFace bodyId={bodyId} bellyId={bellyId} blinking />
        <AvatarCostume avatar={avatar} meta={meta} />
        <circle cx="50" cy="53" r="34" fill={`url(#${shinyId})`} opacity="0.45" />
        <path d="M20 70 Q28 89 52 93" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" opacity="0.55" />
      </svg>
    </span>
  )
}

export function AvatarPicker({
  value,
  onChange,
  className,
  compact = false,
}: {
  value: string
  onChange: (avatar: string) => void
  className?: string
  compact?: boolean
}) {
  return (
    <div className={cn('grid grid-cols-3 gap-1.5', className)} role="group" aria-label="Pilih avatar">
      {Object.entries(AVATAR_META).map(([id, meta]) => {
        const selected = value === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              'avatar-choice group relative flex min-w-0 flex-col items-center gap-1 rounded-2xl border-[3px] px-1 py-1.5 transition-all duration-200',
              selected
                ? 'border-ink bg-sun shadow-pop-sm'
                : 'border-ink/10 bg-surface/70 hover:-translate-y-1 hover:border-ink/30 hover:bg-mint/40 hover:shadow-pop-sm',
            )}
            title={`${meta.label} - ${meta.tagline}`}
            aria-label={`Pilih avatar ${meta.label}`}
            aria-pressed={selected}
          >
            <Avatar avatar={id} size={compact ? 42 : 58} ring={false} />
            <span className="w-full truncate text-center text-[9px] font-extrabold leading-none text-ink/75">
              {meta.label}
            </span>
            {!compact && (
              <span className="hidden w-full truncate text-center text-[8px] font-bold leading-none text-ink/40 sm:block">
                {meta.tagline}
              </span>
            )}
            {selected && (
              <span className="avatar-picked-check absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full border-2 border-ink bg-leaf text-primary-ink">
                <Icon name="check" size={9} strokeWidth={3} />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
