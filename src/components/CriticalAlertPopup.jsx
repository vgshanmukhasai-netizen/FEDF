export default function CriticalAlertPopup({ msg, onDismiss }) {
  return (
    <div className="crit-popup">
      <div className="crit-inner">
        <span className="crit-siren">🚨</span>
        <h2>CRITICAL ALERT</h2>
        <div className="crit-msg">{msg}</div>
        <button onClick={onDismiss}>ACKNOWLEDGE</button>
      </div>
    </div>
  )
}