import { ClarityBar } from './ClarityBar'
import { JourneyPath } from './JourneyPath'

interface RoadmapProps {
  clarity: number
  maxClarity: number
}

export function Roadmap({ clarity, maxClarity }: RoadmapProps) {
  return (
    <div className="roadmap">
      <ClarityBar clarity={clarity} maxClarity={maxClarity} showHeader />
      <p className="roadmap-hint body-md">
        Three stages ahead — protect your Clarity at each myth. Clear all three to
        unlock The Final Truth.
      </p>
      <JourneyPath stagesCleared={-1} finalUnlocked={false} />
    </div>
  )
}
