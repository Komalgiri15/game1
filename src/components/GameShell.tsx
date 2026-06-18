import type { ReactNode } from 'react'

interface GameShellProps {
  children: ReactNode
}

/** Full-viewport container for active gameplay — myth cards, timers, clarity bar */
export function GameShell({ children }: GameShellProps) {
  return (
    <div className="game-shell" role="application" aria-label="Menopause Myth Busters">
      {children}
    </div>
  )
}
