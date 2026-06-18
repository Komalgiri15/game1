import { Button } from './Button'

interface FinalTruthIntroProps {
  onReady: () => void
}

export function FinalTruthIntro({ onReady }: FinalTruthIntroProps) {
  return (
    <div className="final-intro">
      <div className="final-intro-glow" aria-hidden />
      <div className="final-intro-content">
        <p className="label-caps final-intro-eyebrow">You&apos;ve made it</p>
        <h2 className="headline-md">The Final Truth</h2>
        <p className="body-md">
          The most widely believed myth of all — two linked statements. Both must
          be answered correctly. A miss on the second resets this encounter only.
        </p>
        <Button onClick={onReady} className="final-intro-btn">
          I&apos;m Ready
        </Button>
      </div>
    </div>
  )
}
