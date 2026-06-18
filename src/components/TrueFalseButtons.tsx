interface TrueFalseButtonsProps {
  onAnswer: (answer: boolean) => void
  disabled?: boolean
  pulsing?: 'true' | 'false' | null
}

export function TrueFalseButtons({
  onAnswer,
  disabled = false,
  pulsing = null,
}: TrueFalseButtonsProps) {
  return (
    <div className="tf-buttons">
      <button
        type="button"
        className={`tf-btn tf-btn--true ${pulsing === 'true' ? 'pulse' : ''}`}
        onClick={() => onAnswer(true)}
        disabled={disabled}
      >
        True
      </button>
      <button
        type="button"
        className={`tf-btn tf-btn--false ${pulsing === 'false' ? 'pulse' : ''}`}
        onClick={() => onAnswer(false)}
        disabled={disabled}
      >
        False
      </button>
    </div>
  )
}
