interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
  disabled?: boolean
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`btn btn--${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
