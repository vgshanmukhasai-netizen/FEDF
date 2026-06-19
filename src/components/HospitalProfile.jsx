import { useState }      from 'react'
import { getStaff }      from '../utils/hospital'
import { RICON }         from '../utils/constants'
import StaffPasswordGate from './StaffPasswordGate'

export default function HospitalProfile({ open, hosp, stats, onClose, onAddPatient, onManageStaff }) {
  const [showGate, setShowGate] = useState(false)

  if (!hosp) return null
  const staff = getStaff(hosp.hospId)
  const q     = encodeURIComponent(hosp.name + ' ' + hosp.city)

  // any staff-management action goes through the gate
  function requestStaffAccess() {
    setShowGate(true)
  }

  function onGateSuccess() {
    setShowGate(false)
    onManageStaff()   // open the actual staff modal
  }

  return (
    <>
      <div id="hospProfilePanel" className={open ? 'open' : ''}>

        {/* ── HEADER ── */}
        <div className="pp-hdr">
          <div className="pp-logo">
            <svg viewBox="0 0 100 100" style={{ width:'44px', height:'44px' }} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="ppLgD" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stopColor="#6C63FF"/>
                  <stop offset="100%" stopColor="#22D3EE"/>
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="47" fill="none" stroke="url(#ppLgD)" strokeWidth="2" opacity=".8"/>
              <circle cx="50" cy="50" r="36" fill="rgba(108,99,255,0.10)"/>
              <rect x="42" y="20" width="16" height="60" rx="5" fill="url(#ppLgD)"/>
              <rect x="20" y="42" width="60" height="16" rx="5" fill="url(#ppLgD)"/>
              <circle cx="50" cy="50" r="10" fill="#22D3EE" opacity=".95"/>
            </svg>
          </div>
          <div style={{ flex:1 }}>
            <div className="pp-hname">{hosp.name}</div>
            <div className="pp-hid">ID: {hosp.hospId}</div>
          </div>
          <button className="pp-close" onClick={onClose}>✕</button>
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div className="pp-sec">
          <div className="pp-sec-ttl">QUICK ACTIONS</div>
          <button className="pp-act-btn pp-act-p" onClick={onAddPatient}>
            ➕ Add New ICU Patient
          </button>
          {/* Staff action → goes through gate */}
          <button className="pp-act-btn pp-act-s" onClick={requestStaffAccess}>
            🔐 Manage Staff Members
          </button>
        </div>

        {/* ── HOSPITAL INFORMATION ── */}
        <div className="pp-sec">
          <div className="pp-sec-ttl">HOSPITAL INFORMATION</div>
          {[
            ['🏥', 'TYPE',       hosp.type],
            ['🩺', 'SPECIALITY', hosp.spec],
            ['📍', 'CITY / STATE', hosp.city],
            ['🗺️', 'ADDRESS',    hosp.address],
            ['📱', 'CONTACT',    '+91 ' + hosp.phone],
            ['👨‍⚕️','ADMIN',     hosp.admin],
            ['🛏️', 'ICU BEDS',  (hosp.beds || '—') + ' beds'],
            ['📅', 'REGISTERED', hosp.registered
              ? new Date(hosp.registered).toLocaleDateString('en-IN',{
                  day:'numeric', month:'long', year:'numeric'
                })
              : '—'
            ],
          ].map(([ico, lbl, val]) => (
            <div className="pp-row" key={lbl}>
              <span className="pp-rico">{ico}</span>
              <div>
                <div className="pp-rlbl">{lbl}</div>
                <div className="pp-rval">{val || '—'}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── LIVE STATS ── */}
        <div className="pp-sec">
          <div className="pp-sec-ttl">LIVE ICU STATISTICS</div>
          <div className="pp-stats-grid">
            <div className="pp-stat">
              <div className="pp-stat-val">{stats.total}</div>
              <div className="pp-stat-lbl">TOTAL</div>
            </div>
            <div className="pp-stat ss">
              <div className="pp-stat-val">{stats.stable}</div>
              <div className="pp-stat-lbl">STABLE</div>
            </div>
            <div className="pp-stat sw">
              <div className="pp-stat-val">{stats.warning}</div>
              <div className="pp-stat-lbl">WARN</div>
            </div>
            <div className="pp-stat sc">
              <div className="pp-stat-val">{stats.critical}</div>
              <div className="pp-stat-lbl">CRIT</div>
            </div>
          </div>
        </div>

        {/* ── MAP ── */}
        <div className="pp-sec">
          <div className="pp-sec-ttl">HOSPITAL LOCATION</div>
          <div className="pp-map-wrap">
    <iframe
        src={`https://maps.google.com/maps?q=${q}&output=embed&z=15`}
        allowFullScreen
        loading="lazy"
        title="Hospital Map"
    />

    <a
        href={`https://www.google.com/maps/search/${q}`}
        target="_blank"
        rel="noopener noreferrer"
        className="pp-map-link"
    >
        Open Maps ↗
    </a>

          </div>
        </div>

        {/* ── MFA CODE ── */}
        <div className="pp-sec">
          <div className="pp-sec-ttl">MFA SECURITY CODE</div>
          <div className="pp-mfa-box">
            <div className="pp-mfa-code">{hosp.otp}</div>
            <div className="pp-mfa-note">Permanent OTP · Do not share</div>
          </div>
        </div>

        {/* ── STAFF (locked) ── */}
        <div className="pp-sec">
          <div className="pp-sec-ttl">
            STAFF <span className="cbadge-sm">{staff.length}</span>
            <span className="pp-staff-lock-badge">🔐 Owner Only</span>
          </div>

          {/* Staff badges — blurred/locked visually, click → gate */}
          <div className="pp-staff-badges-wrap" onClick={requestStaffAccess}>
            {staff.length === 0
              ? <span style={{ color:'var(--txt3)', fontSize:'.75rem' }}>No staff added yet.</span>
              : staff.map(s => (
                  <span key={s.id} className="pp-staff-badge">
                    {RICON[s.role] || '👤'} {s.name.split(' ')[0]}
                    <span style={{ color:'var(--txt3)', fontSize:'.58rem' }}>{s.role}</span>
                  </span>
                ))
            }
          </div>

          {/* Locked button */}
          <button className="pp-act-btn pp-act-locked" onClick={requestStaffAccess}>
            <span>🔐</span>
            <span>View / Add / Remove Staff</span>
            <span className="pp-locked-hint">Owner Auth Required</span>
          </button>
        </div>

      </div>

      {/* ── PASSWORD GATE MODAL ── */}
      {showGate && (
        <StaffPasswordGate
          hosp={hosp}
          onSuccess={onGateSuccess}
          onClose={() => setShowGate(false)}
        />
      )}
    </>
  )
}