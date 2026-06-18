import { Button } from './Button'

interface HowToPlayModalProps {
  onStart: () => void
  onClose: () => void
}

const STEPS = [
  {
    id: 'drag',
    label: 'Drag',
    hint: 'Move your type',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden>
        <path
          d="M8 32 C16 24, 24 20, 34 22"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="4 3"
        />
        <path d="M34 22 L28 20 M34 22 L32 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="14" cy="34" r="5" fill="currentColor" opacity="0.25" />
      </svg>
    ),
  },
  {
    id: 'tap',
    label: 'Tap myth',
    hint: 'Bust the bubble',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden>
        <circle cx="28" cy="20" r="12" fill="currentColor" opacity="0.2" />
        <circle cx="28" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <path
          d="M14 38 L14 28 Q14 22 18 20 L20 18 Q22 16 24 18 L24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="28" cy="20" r="14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      </svg>
    ),
  },
  {
    id: 'orb',
    label: 'Collect',
    hint: 'Fly into orbs',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden>
        <circle cx="16" cy="24" r="9" fill="currentColor" opacity="0.35" />
        <circle cx="34" cy="30" r="5" fill="currentColor" />
        <path d="M22 26 L30 29" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2" />
      </svg>
    ),
  },
  {
    id: 'streak',
    label: 'Streak',
    hint: 'Chain for bonus',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden>
        <path
          d="M24 8 L26 18 L36 20 L28 27 L30 38 L24 32 L18 38 L20 27 L12 20 L22 18 Z"
          fill="currentColor"
          opacity="0.35"
        />
        <text x="24" y="26" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor">
          3×
        </text>
      </svg>
    ),
  },
] as const

function TapBubbleHero() {
  return (
    <div className="how-to-play-hero" aria-hidden>
      <svg viewBox="0 0 320 140" className="how-to-play-hero-svg">
        <defs>
          <radialGradient id="htp-bubble" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="55%" stopColor="rgba(255,217,227,0.55)" />
            <stop offset="100%" stopColor="rgba(181,87,122,0.25)" />
          </radialGradient>
        </defs>

        {/* Sky wash */}
        <ellipse cx="160" cy="150" rx="200" ry="40" fill="rgba(255,220,230,0.15)" />

        {/* Myth bubble */}
        <g className="how-to-play-bubble">
          <circle cx="200" cy="52" r="38" fill="url(#htp-bubble)" />
          <ellipse cx="186" cy="38" rx="10" ry="6" fill="rgba(255,255,255,0.75)" />
          <text x="200" y="44" textAnchor="middle" className="how-to-play-bubble-tag">
            MYTH
          </text>
          <text x="200" y="60" textAnchor="middle" className="how-to-play-bubble-text">
            Tap me!
          </text>
          <circle className="how-to-play-ripple how-to-play-ripple--1" cx="200" cy="52" r="42" fill="none" stroke="#d6a85c" strokeWidth="2" />
          <circle className="how-to-play-ripple how-to-play-ripple--2" cx="200" cy="52" r="42" fill="none" stroke="#d6a85c" strokeWidth="1.5" />
        </g>

        {/* Pointing hand — index finger toward bubble */}
        <g className="how-to-play-tap-hand">
          {/* palm */}
          <ellipse cx="88" cy="98" rx="26" ry="20" fill="#fff8f4" stroke="#b5577a" strokeWidth="1.75" />
          {/* folded fingers */}
          <rect x="72" y="78" width="10" height="20" rx="5" fill="#fff8f4" stroke="#b5577a" strokeWidth="1.5" />
          <rect x="82" y="74" width="10" height="22" rx="5" fill="#fff8f4" stroke="#b5577a" strokeWidth="1.5" />
          <rect x="92" y="76" width="9" height="20" rx="4.5" fill="#fff8f4" stroke="#b5577a" strokeWidth="1.5" />
          {/* index finger pointing */}
          <path
            d="M102 82 Q118 68, 168 58 L172 54 Q174 50, 170 48 L165 50 Q130 62, 108 78 Z"
            fill="#fff8f4"
            stroke="#b5577a"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          {/* fingertip highlight */}
          <circle cx="168" cy="52" r="4" fill="rgba(214,168,92,0.5)" className="how-to-play-fingertip" />
        </g>

        {/* Small fact orb */}
        <circle cx="56" cy="48" r="14" fill="rgba(170,220,195,0.45)" stroke="rgba(106,158,138,0.5)" strokeWidth="1" />
        <text x="56" y="52" textAnchor="middle" className="how-to-play-orb-label">
          Fact
        </text>
      </svg>
      <p className="how-to-play-hero-caption label-caps">Finger taps myth bubbles only</p>
    </div>
  )
}

export function HowToPlayModal({ onStart, onClose }: HowToPlayModalProps) {
  return (
    <div
      className="how-to-play-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-to-play-title"
    >
      <button
        type="button"
        className="how-to-play-backdrop"
        onClick={onClose}
        aria-label="Close how to play"
      />

      <div className="how-to-play-card">
        <p className="label-caps how-to-play-eyebrow">Before you start</p>
        <h2 id="how-to-play-title" className="headline-md how-to-play-title">
          How to play
        </h2>

        <TapBubbleHero />

        <ol className="how-to-play-steps" aria-label="Game steps">
          {STEPS.map((step, i) => (
            <li
              key={step.id}
              className={`how-to-play-step how-to-play-step--${step.id}`}
            >
              <span className="how-to-play-step-num">{i + 1}</span>
              <span className="how-to-play-step-icon">{step.icon}</span>
              <strong>{step.label}</strong>
              <span className="how-to-play-step-hint">{step.hint}</span>
            </li>
          ))}
        </ol>

        <div className="how-to-play-clarity" role="note">
          <span className="how-to-play-clarity-bar" aria-hidden />
          <span>Protect your <strong>Clarity</strong> bar</span>
        </div>

        <footer className="how-to-play-actions">
          <Button onClick={onClose} variant="secondary">
            Back
          </Button>
          <Button onClick={onStart}>Let&apos;s Play!</Button>
        </footer>
      </div>
    </div>
  )
}
