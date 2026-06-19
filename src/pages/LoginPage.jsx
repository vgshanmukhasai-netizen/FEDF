import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHosps, setCurH, hKey, maskPh, seedDemo, ensureDefaultStaff } from '../utils/hospital'
import MedLogo         from '../components/UI/MedLogo'
import StethoscopeLogo from '../components/UI/StethoscopeLogo'

// ── Animated canvas background ───────────────────────────────────────────────
function AnimatedBG() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let W = window.innerWidth
    let H = window.innerHeight
    canvas.width  = W
    canvas.height = H

    const resize = () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 110 }, () => ({
      x:      Math.random() * W,
      y:      Math.random() * H,
      r:      Math.random() * 1.6 + 0.3,
      vx:     (Math.random() - 0.5) * 0.22,
      vy:     (Math.random() - 0.5) * 0.22,
      alpha:  Math.random() * 0.32 + 0.08,
      pulse:  Math.random() * Math.PI * 2,
      isStar: Math.random() > 0.60,
    }))

    const hLines = Array.from({ length: 10 }, (_, i) => ({
      y:     (H / 10) * i + Math.random() * 30,
      vy:    (Math.random() - 0.5) * 0.14,
      alpha: Math.random() * 0.030 + 0.008,
    }))
    const vLines = Array.from({ length: 16 }, (_, i) => ({
      x:     (W / 16) * i + Math.random() * 30,
      vx:    (Math.random() - 0.5) * 0.14,
      alpha: Math.random() * 0.028 + 0.007,
    }))

    const streaks = Array.from({ length: 6 }, () => ({
      x:     Math.random() * W,
      y:     Math.random() * H,
      len:   Math.random() * 100 + 50,
      speed: Math.random() * 0.45 + 0.15,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.040 + 0.010,
      width: Math.random() * 1.0 + 0.3,
    }))

    function draw() {
      ctx.clearRect(0, 0, W, H)

      hLines.forEach(l => {
        l.y += l.vy
        if (l.y < -10) l.y = H + 10
        if (l.y > H + 10) l.y = -10
        ctx.beginPath(); ctx.moveTo(0, l.y); ctx.lineTo(W, l.y)
        ctx.strokeStyle = `rgba(108,99,255,${l.alpha})`
        ctx.lineWidth = 0.5; ctx.stroke()
      })

      vLines.forEach(l => {
        l.x += l.vx
        if (l.x < -10) l.x = W + 10
        if (l.x > W + 10) l.x = -10
        ctx.beginPath(); ctx.moveTo(l.x, 0); ctx.lineTo(l.x, H)
        ctx.strokeStyle = `rgba(108,99,255,${l.alpha})`
        ctx.lineWidth = 0.5; ctx.stroke()
      })

      streaks.forEach(s => {
        s.x += Math.cos(s.angle) * s.speed
        s.y += Math.sin(s.angle) * s.speed
        if (s.x > W + 200 || s.y > H + 200) {
          s.x = Math.random() * W * 0.5 - 100
          s.y = Math.random() * H * 0.5 - 100
        }
        const ex = s.x + Math.cos(s.angle) * s.len
        const ey = s.y + Math.sin(s.angle) * s.len
        const g  = ctx.createLinearGradient(s.x, s.y, ex, ey)
        g.addColorStop(0,   `rgba(108,99,255,0)`)
        g.addColorStop(0.5, `rgba(108,99,255,${s.alpha})`)
        g.addColorStop(1,   `rgba(108,99,255,0)`)
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(ex, ey)
        ctx.strokeStyle = g; ctx.lineWidth = s.width; ctx.stroke()
      })

      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        p.pulse += 0.016
        const tw = p.isStar
          ? p.alpha * (0.45 + 0.55 * Math.sin(p.pulse * 2.2))
          : p.alpha

        if (p.isStar) {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.pulse * 0.25)
          const sr = p.r * 1.4
          ctx.beginPath()
          for (let i = 0; i < 4; i++) {
            const a = (i / 4) * Math.PI * 2; const ah = a + Math.PI / 4
            ctx.lineTo(Math.cos(a) * sr, Math.sin(a) * sr)
            ctx.lineTo(Math.cos(ah) * sr * 0.3, Math.sin(ah) * sr * 0.3)
          }
          ctx.closePath()
          ctx.fillStyle = `rgba(196,191,255,${tw})`
          ctx.fill(); ctx.restore()
        } else {
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.2)
          grd.addColorStop(0,   `rgba(168,160,255,${tw})`)
          grd.addColorStop(0.6, `rgba(108,99,255,${tw * 0.4})`)
          grd.addColorStop(1,   'rgba(108,99,255,0)')
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 2.2, 0, Math.PI * 2)
          ctx.fillStyle = grd; ctx.fill()
        }
      })

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none',
      }}
    />
  )
}

// ── Main LoginPage ───────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate()
  const [phase,     setPhase]     = useState('landing')
  const [step,      setStep]      = useState(1)
  const [form,      setForm]      = useState({ name:'', phone:'', pass:'' })
  const [otp,       setOtp]       = useState(['','','','','',''])
  const [error,     setError]     = useState('')
  const [curHosp,   setCurHosp]   = useState(null)
  const [countdown, setCountdown] = useState(0)
  const resendRef = useRef(null)
  const digitRefs = useRef([])

  useEffect(() => { seedDemo() }, [])

  function handleLogoClick() {
    if (phase !== 'landing') return
    setPhase('transitioning')
    setTimeout(() => setPhase('login'), 900)
  }

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function startResend() {
    if (resendRef.current) clearInterval(resendRef.current)
    setCountdown(30)
    resendRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(resendRef.current); return 0 }
        return c - 1
      })
    }, 1000)
  }

  function doLoginStep1() {
    setError('')
    const { name, phone, pass } = form
    if (!name || !phone || !pass) return setError('⚠ Please fill all three fields.')
    if (!/^[0-9]{10}$/.test(phone)) return setError('⚠ Enter a valid 10-digit mobile.')
    const h = getHosps()[hKey(name)]
    if (!h)                return setError('⚠ Hospital not found. Register first or check spelling.')
    if (h.phone !== phone) return setError('⚠ Mobile number does not match our records.')
    if (h.pass  !== pass)  return setError('⚠ Incorrect password.')
    setCurHosp(h)
    setOtp(['','','','','',''])
    setStep(2)
    startResend()
  }

  function doVerifyOTP() {
    setError('')
    const code = otp.join('')
    if (code.length < 6) return setError('⚠ Please enter all 6 digits.')
    if (!curHosp)        return setError('⚠ Session expired. Go back and try again.')
    if (code !== curHosp.otp) {
      setOtp(['','','','','',''])
      return setError('⚠ Incorrect OTP. Check the SMS preview above.')
    }
    if (resendRef.current) clearInterval(resendRef.current)
    setCurH(curHosp)
    ensureDefaultStaff(curHosp)
    navigate('/dashboard')
  }

  function handleDigit(idx, val) {
    const v = val.replace(/\D/g, '').slice(-1)
    const next = [...otp]; next[idx] = v; setOtp(next)
    if (v && idx < 5) digitRefs.current[idx + 1]?.focus()
  }

  function handleDigitKey(idx, e) {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) digitRefs.current[idx - 1]?.focus()
    if (e.key === 'Enter') doVerifyOTP()
  }

  const isLanding       = phase === 'landing'
  const isTransitioning = phase === 'transitioning'
  const isLogin         = phase === 'login'

  return (
    <div className="login-fullpage">
      <div className="page-bg"><div className="page-grid"></div><div className="scanline"></div></div>
      <AnimatedBG />

      {/* ══ LANDING — Image 2 stethoscope logo, centered ══ */}
      {(isLanding || isTransitioning) && (
        <div className={`landing-screen ${isTransitioning ? 'landing-exit' : ''}`}>
          <div
            className={`landing-logo-wrap ${isTransitioning ? 'logo-fly-up' : 'logo-idle'}`}
            onClick={handleLogoClick}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && handleLogoClick()}
            title="Click to sign in"
          >
            {/* LARGE stethoscope — replaces Image 1 shield logo */}
            <StethoscopeLogo size={1} animate={isLanding} />
            <p className="landing-subtitle">Neural Health Intelligence System</p>
            <p className="landing-click-hint">
              <span className="hint-dot"></span>
              Click to Sign In
            </p>
          </div>
        </div>
      )}

      {/* ══ LOGIN CARD ══ */}
      {(isTransitioning || isLogin) && (
        <div className={`login-center-wrap ${isTransitioning ? 'login-fade-in' : 'login-visible'}`}>

          {/* Small stethoscope above card — replaces Image 3 cross logo */}
          <div className="login-top-logo">
            <StethoscopeLogo size={0.38} animate={isLogin} />
          </div>

          <div className="login-center-card">
            <div className="card-accent-line"></div>

            <div className="login-hdr">
              {/* Tiny stethoscope inside card header */}
              <div style={{ display:'flex', justifyContent:'center', marginBottom:'12px' }}>
                <MedLogo size={48} />
              </div>
              <h1>ICU Patient <span>Monitoring</span> System</h1>
              <p>Secure Medical Portal — Authorized Personnel Only</p>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <div className="login-step active">
                <div className="fld-group">
                  <label>Hospital Name</label>
                  <div className="fld-wrap">
                    <span className="fld-ico">🏥</span>
                    <input type="text" placeholder="Registered hospital name"
                      value={form.name}
                      onChange={e => upd('name', e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && doLoginStep1()}
                      autoComplete="off"/>
                  </div>
                </div>
                <div className="fld-group">
                  <label>Registered Mobile Number</label>
                  <div className="phone-row">
                    <div className="phone-cc">+91</div>
                    <div className="fld-wrap">
                      <input type="tel" placeholder="10-digit mobile"
                        maxLength={10} value={form.phone}
                        onChange={e => upd('phone', e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && doLoginStep1()}
                        style={{ paddingLeft:'14px' }}/>
                    </div>
                  </div>
                </div>
                <div className="fld-group">
                  <label>Password</label>
                  <div className="fld-wrap">
                    <span className="fld-ico">🔐</span>
                    <input type="password" placeholder="Your password"
                      value={form.pass}
                      onChange={e => upd('pass', e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && doLoginStep1()}/>
                  </div>
                </div>
                <button className="primary-btn" onClick={doLoginStep1}>
                  <span>NEXT — SEND OTP TO MOBILE</span><span>→</span>
                </button>
                <div className="sec-link">
                  New hospital? <a onClick={() => navigate('/signup')}>Register here →</a>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="login-step active">
                <div className="mfa-hdr">
                  <div className="mfa-ico">📱</div>
                  <h3>OTP Verification</h3>
                  <p>6-digit code sent to your registered mobile</p>
                </div>
                <div className="otp-phone-tag">
                  OTP sent to: <b>{maskPh(curHosp?.phone || '')}</b>
                </div>
                <div className="sms-bubble">
                  <div className="sms-txt">
                    Dear <b style={{ color:'#F59E0B' }}>{curHosp?.name}</b>,<br/>
                    Your MediCore ICU permanent login OTP:
                  </div>
                  <div className="sms-code">{curHosp?.otp}</div>
                  <div className="sms-note">🔒 Permanent hospital code — valid every login. Do not share.</div>
                </div>
                <div className="resend-row">
                  <span>{countdown > 0 ? `Resend in ${countdown}s` : 'You can resend now'}</span>
                  <button className="resend-btn" onClick={startResend} disabled={countdown > 0}>
                    Resend OTP
                  </button>
                </div>
                <div className="otp-inputs">
                  {otp.map((d, i) => (
                    <input key={i} type="text" maxLength={1} className="otp-digit"
                      value={d}
                      ref={el => digitRefs.current[i] = el}
                      onChange={e => handleDigit(i, e.target.value)}
                      onKeyDown={e => handleDigitKey(i, e)}/>
                  ))}
                </div>
                <button className="primary-btn" onClick={doVerifyOTP} style={{ marginTop:'4px' }}>
                  <span>VERIFY &amp; ENTER ICU</span><span>→</span>
                </button>
                <button className="back-btn-sm" onClick={() => { setStep(1); setError('') }}>
                  ← Back
                </button>
              </div>
            )}

            {error && <div className="login-err" style={{ display:'block' }}>{error}</div>}
          </div>

          <button className="back-to-landing" onClick={() => { setPhase('landing'); setError('') }}>
            ← Back to Home
          </button>
        </div>
      )}
    </div>
  )
}