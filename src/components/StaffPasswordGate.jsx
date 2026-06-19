import { useState, useRef, useEffect } from 'react'

export default function StaffPasswordGate({ hosp, onSuccess, onClose }) {
  const [pass,    setPass]    = useState('')
  const [error,   setError]   = useState('')
  const [shaking, setShaking] = useState(false)
  const [success, setSuccess] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    // auto-focus when gate opens
    setTimeout(() => inputRef.current?.focus(), 80)
  }, [])

  function attempt() {
    if (!pass.trim()) return setError('Please enter the owner password.')

    if (pass === hosp.pass) {
      // brief success animation before opening
      setError('')
      setSuccess(true)
      setTimeout(() => {
        onSuccess()
      }, 600)
    } else {
      setError('Incorrect password. Only the registered owner can manage staff.')
      setPass('')
      setShaking(true)
      setTimeout(() => setShaking(false), 600)
      inputRef.current?.focus()
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter') attempt()
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal-card staff-gate-card ${shaking ? 'gate-shake' : ''} ${success ? 'gate-success' : ''}`}>

        {/* header */}
        <div className="modal-hdr">
          <h2>🔐 Staff Access Control</h2>
          <button className="modal-cls" onClick={onClose}>✕</button>
        </div>

        {/* icon + description */}
        <div className="gate-body">
          <div className="gate-icon-wrap">
            <div className={`gate-shield ${success ? 'gate-shield-open' : ''}`}>
              {success ? '🔓' : '🔒'}
            </div>
            {/* animated ring around shield */}
            <div className="gate-ring gate-ring-1"></div>
            <div className="gate-ring gate-ring-2"></div>
          </div>

          <h3 className="gate-title">
            {success ? 'Access Granted' : 'Owner Authentication Required'}
          </h3>
          <p className="gate-desc">
            {success
              ? 'Redirecting to staff management…'
              : 'Only the registered hospital owner can add or remove staff members. Enter your account password to continue.'
            }
          </p>

          {!success && (
            <>
              {/* hospital name chip */}
              <div className="gate-hosp-chip">
                <span className="gate-hosp-ico">🏥</span>
                <span className="gate-hosp-name">{hosp.name}</span>
                <span className="gate-hosp-id">{hosp.hospId}</span>
              </div>

              {/* password field */}
              <div className="gate-field-wrap">
                <span className="gate-field-ico">🔑</span>
                <input
                  ref={inputRef}
                  type="password"
                  className="gate-input"
                  placeholder="Enter owner password…"
                  value={pass}
                  onChange={e => { setPass(e.target.value); setError('') }}
                  onKeyDown={handleKey}
                  autoComplete="current-password"
                />
              </div>

              {/* error */}
              {error && (
                <div className="gate-error">
                  <span>⚠</span> {error}
                </div>
              )}

              {/* hint */}
              <p className="gate-hint">
                This is the password you set when registering <b>{hosp.name}</b>.
              </p>

              {/* buttons */}
              <div className="gate-actions">
                <button className="gate-cancel" onClick={onClose}>Cancel</button>
                <button className="gate-confirm" onClick={attempt}>
                  <span>Verify &amp; Continue</span>
                  <span className="gate-arrow">→</span>
                </button>
              </div>
            </>
          )}

          {/* success progress bar */}
          {success && <div className="gate-progress-bar"><div className="gate-progress-fill"></div></div>}
        </div>

      </div>
    </div>
  )
}