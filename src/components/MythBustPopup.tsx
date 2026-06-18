interface MythBustPopupProps {
  statement: string
  truth: string
}

export function MythBustPopup({ statement, truth }: MythBustPopupProps) {
  return (
    <div className="myth-bust-popup" role="status">
      <div className="myth-bust-popup-inner">
        <span className="label-caps myth-bust-label">Myth Busted</span>
        <p className="myth-bust-statement">{statement}</p>
        <p className="myth-bust-truth">{truth}</p>
      </div>
    </div>
  )
}
