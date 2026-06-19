import { useEffect, useState } from 'react'

export default function Toast({ msg, type = 'info' }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 3500)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  const bg = type==='success' ? 'rgba(0,255,136,.12)' : type==='error' ? 'rgba(255,34,68,.12)' : 'rgba(0,180,255,.12)'
  const bd = type==='success' ? 'rgba(0,255,136,.35)' : type==='error' ? 'rgba(255,34,68,.35)' : 'rgba(0,180,255,.35)'
  const cl = type==='success' ? 'var(--green)'        : type==='error' ? 'var(--red)'           : 'var(--neon)'

  return (
    <div className="icu-toast" style={{ background:bg, border:`1px solid ${bd}`, color:cl }}>
      {msg}
    </div>
  )
}