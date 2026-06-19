export default function AlertBanner({ text, onDismiss }) {
  if (!text) return null
  return (
    <div className="alert-banner">
      <span>{text}</span>
      <button onClick={onDismiss}>✕</button>
    </div>
  )
}