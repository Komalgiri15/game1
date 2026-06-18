import type { CSSProperties } from 'react'
import type { CardFeedback } from '../game/types'

interface MythCardProps {
  statement: string
  truth?: string
  flipped: boolean
  feedback: CardFeedback
  correctAnswer?: boolean
  stageColor: string
  stageColorDim: string
  golden?: boolean
}

export function MythCard({
  statement,
  truth,
  flipped,
  feedback,
  correctAnswer,
  stageColor,
  stageColorDim,
  golden = false,
}: MythCardProps) {
  const backLabel =
    feedback === 'busted'
      ? 'Myth Busted'
      : feedback === 'still-believed'
        ? 'Still Believed'
        : 'The Truth'

  const answerLine =
    feedback === 'still-believed' && correctAnswer !== undefined
      ? `The answer is ${correctAnswer ? 'True' : 'False'}.`
      : null

  return (
    <div
      className={`myth-card-scene ${flipped ? 'flipped' : ''} ${feedback === 'busted' ? 'glow-busted' : ''} ${golden ? 'myth-card-scene--golden' : ''}`}
    >
      <div className="myth-card">
        <div
          className="myth-card-face myth-card-front"
          style={
            {
              '--stage-color': stageColor,
              '--stage-dim': stageColorDim,
            } as CSSProperties
          }
        >
          <span className="label-caps myth-card-label">Myth or Fact?</span>
          <p className="myth-card-statement">{statement}</p>
        </div>
        <div
          className={`myth-card-face myth-card-back ${feedback === 'busted' ? 'myth-card-back--busted' : ''} ${feedback === 'still-believed' ? 'myth-card-back--still' : ''}`}
          style={
            {
              '--stage-color': stageColor,
              '--stage-dim': stageColorDim,
            } as CSSProperties
          }
        >
          <span className="label-caps myth-card-label truth-label">{backLabel}</span>
          {answerLine && <p className="myth-card-answer-line">{answerLine}</p>}
          <p className="myth-card-truth">{truth}</p>
        </div>
      </div>
    </div>
  )
}
