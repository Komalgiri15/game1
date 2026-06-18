interface FactToastProps {
  label: string
  truth: string
}

export function FactToast({ label, truth }: FactToastProps) {
  return (
    <div className="fact-toast" role="status">
      <span className="label-caps">Collected: {label}</span>
      <p>{truth}</p>
    </div>
  )
}
