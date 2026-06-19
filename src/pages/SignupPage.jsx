import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHosps, saveHosps, hKey, genOTP, genID, seedDemo } from '../utils/hospital'
import MedLogo from '../components/UI/MedLogo'

const INITIAL = {
  name:'', type:'', city:'', address:'', admin:'', phone:'',
  pass:'', pass2:'', beds:'', spec:'',
}

export default function SignupPage() {
  const navigate = useNavigate()
  const [form,    setForm]    = useState(INITIAL)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => { seedDemo() }, [])

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function doRegister() {
    setError(''); setSuccess('')
    const { name, type, city, address, admin, phone, pass, pass2, beds } = form
    if (!name)    return setError('⚠ Hospital name is required.')
    if (!type)    return setError('⚠ Please select hospital type.')
    if (!city)    return setError('⚠ City / State is required.')
    if (!address) return setError('⚠ Full address is required.')
    if (!admin)   return setError('⚠ Admin / Doctor name is required.')
    if (!phone)   return setError('⚠ Mobile number is required.')
    if (!/^[0-9]{10}$/.test(phone)) return setError('⚠ Enter a valid 10-digit mobile.')
    if (!pass)    return setError('⚠ Password is required.')
    if (pass.length < 8) return setError('⚠ Password must be at least 8 characters.')
    if (pass !== pass2)  return setError('⚠ Passwords do not match.')
    if (!beds)    return setError('⚠ Please select ICU bed count.')

    const hosps = getHosps()
    const key   = hKey(name)
    if (hosps[key]) return setError('⚠ This hospital is already registered. Please sign in.')

    const otp = genOTP(), hospId = genID()
    hosps[key] = {
      name, type, city, address, admin, phone, pass,
      beds, spec: form.spec || 'General ICU',
      otp, hospId, registered: new Date().toISOString(),
    }
    saveHosps(hosps)

    setSuccess(`✅ ${name} registered successfully! 📱 Your permanent MFA code is ${otp}. Redirecting to Sign In…`)
    setTimeout(() => { navigate('/') }, 3000)
  }

  return (
    <div className="page signup-page">
      <div className="page-bg"><div className="page-grid"></div><div className="scanline"></div></div>
      <div className="su-card">
        <div className="su-logo-row">
          <MedLogo size={72} />
          <div className="su-title">
            <h1>MEDICORE AI</h1>
            <p>ICU PATIENT MONITORING SYSTEM</p>
            <p style={{ fontSize:'.6rem', color:'rgba(0,245,255,.4)', marginTop:'3px', letterSpacing:'2px' }}>v3.7 — NEURAL HEALTH INTELLIGENCE</p>
          </div>
        </div>
        <div className="su-divider"><span>NEW HOSPITAL REGISTRATION</span></div>
        <div className="su-grid">
          <div className="fld-group full">
            <label>Hospital Name *</label>
            <div className="fld-wrap"><span className="fld-ico">🏥</span>
              <input type="text" placeholder="e.g. Apollo Hospitals Hyderabad" value={form.name} onChange={e => upd('name', e.target.value)} autoComplete="off"/>
            </div>
          </div>
          <div className="fld-group">
            <label>Hospital Type *</label>
            <div className="fld-wrap"><span className="fld-ico">🏛️</span>
              <select value={form.type} onChange={e => upd('type', e.target.value)}>
                <option value="">— Select type —</option>
                <option>Government</option><option>Private</option>
                <option>Trust / NGO</option><option>Corporate</option><option>Teaching</option><option>Non-Teaching </option>
              </select>
            </div>
          </div>
          <div className="fld-group">
            <label>City / State *</label>
            <div className="fld-wrap"><span className="fld-ico">📍</span>
              <input type="text" placeholder="Hyderabad, Telangana" value={form.city} onChange={e => upd('city', e.target.value)}/>
            </div>
          </div>
          <div className="fld-group full">
            <label>Full Address *</label>
            <div className="fld-wrap"><span className="fld-ico">🗺️</span>
              <input type="text" placeholder="Street, Area, Pin Code" value={form.address} onChange={e => upd('address', e.target.value)}/>
            </div>
          </div>
          <div className="fld-group full">
            <label>Admin / Doctor Name *</label>
            <div className="fld-wrap"><span className="fld-ico">👨‍⚕️</span>
              <input type="text" placeholder="Dr. Full Name" value={form.admin} onChange={e => upd('admin', e.target.value)}/>
            </div>
          </div>
          <div className="fld-group full">
            <label>Registered Mobile Number * — OTP will be sent here</label>
            <div className="phone-row">
              <div className="phone-cc">+91</div>
              <div className="fld-wrap">
                <input type="tel" placeholder="10-digit mobile" maxLength={10} value={form.phone}
                  onChange={e => upd('phone', e.target.value)} style={{ paddingLeft:'14px' }}/>
              </div>
            </div>
          </div>
          <div className="fld-group">
            <label>Password *</label>
            <div className="fld-wrap"><span className="fld-ico">🔐</span>
              <input type="password" placeholder="Min 8 characters" value={form.pass} onChange={e => upd('pass', e.target.value)}/>
            </div>
          </div>
          <div className="fld-group">
            <label>Confirm Password *</label>
            <div className="fld-wrap"><span className="fld-ico">🔏</span>
              <input type="password" placeholder="Repeat password" value={form.pass2}
                onChange={e => upd('pass2', e.target.value)}
                onKeyDown={e => e.key==='Enter' && doRegister()}/>
            </div>
          </div>
          <div className="fld-group">
            <label>ICU Beds</label>
            <div className="fld-wrap"><span className="fld-ico">🛏️</span>
              <select value={form.beds} onChange={e => upd('beds', e.target.value)}>
                <option value="">— Select —</option>
                <option>1–10</option><option>11–25</option><option>26–50</option><option>51–100</option><option>100+</option>
              </select>
            </div>
          </div>
          <div className="fld-group">
            <label>ICU Speciality</label>
            <div className="fld-wrap"><span className="fld-ico">🩺</span>
              <select value={form.spec} onChange={e => upd('spec', e.target.value)}>
                <option value="">— Select —</option>
                <option>General ICU</option><option>Cardiac ICU</option><option>Neuro ICU</option>
                <option>Paediatric ICU</option><option>Burn ICU</option><option>Multi-Speciality</option>
              </select>
            </div>
          </div>
        </div>
        {error   && <div className="form-err" style={{ display:'block' }}>{error}</div>}
        {success && <div className="form-ok"  style={{ display:'block' }}>{success}</div>}
        <button className="primary-btn" onClick={doRegister} style={{ marginTop:'18px' }}>
          <span>REGISTER &amp; SEND OTP TO MOBILE</span><span style={{ fontSize:'1.2rem' }}>→</span>
        </button>
        <div className="sec-link">Already registered? <a onClick={() => navigate('/')}>Sign In here →</a></div>
      </div>
    </div>
  )
}