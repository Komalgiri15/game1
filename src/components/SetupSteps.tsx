interface SetupStepsProps {
  current: 1 | 2
}

const STEPS = [
  { n: 1, label: 'Your starting point' },
  { n: 2, label: 'Your type' },
] as const

export function SetupSteps({ current }: SetupStepsProps) {
  return (
    <nav className="setup-steps" aria-label="Setup progress">
      {STEPS.map((step) => {
        const done = step.n < current
        const active = step.n === current
        return (
          <div
            key={step.n}
            className={`setup-step ${active ? 'setup-step--active' : ''} ${done ? 'setup-step--done' : ''}`}
          >
            <span className="setup-step-num" aria-hidden>
              {done ? '✓' : step.n}
            </span>
            <span className="setup-step-label">{step.label}</span>
          </div>
        )
      })}
    </nav>
  )
}
