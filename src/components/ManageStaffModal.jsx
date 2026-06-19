import { useState } from 'react'
import { getStaff, saveStaff } from '../utils/hospital'
import { RICON } from '../utils/constants'

export default function ManageStaffModal({ hosp, onClose, onToast }) {
  const [staff, setStaff] = useState(() => getStaff(hosp?.hospId))
  const [form,  setForm]  = useState({ name:'', role:'', phone:'', shift:'', spec:'', empid:'' })
  const [error, setError] = useState('')
  const upd = (k,v) => setForm(f => ({ ...f, [k]:v }))

  function submitAdd() {
    setError('')
    if (!form.name) return setError('⚠ Name is required.')
    if (!form.role) return setError('⚠ Role is required.')
    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) return setError('⚠ Enter valid 10-digit mobile or leave blank.')
    const next = [...staff, {
      id: 'S' + Date.now().toString(36).toUpperCase(),
      name: form.name, role: form.role, phone: form.phone,
      shift: form.shift, spec: form.spec,
      empid: form.empid || 'EMP-' + String(staff.length+1).padStart(3,'0'),
    }]
    saveStaff(hosp?.hospId, next)
    setStaff(next)
    setForm({ name:'', role:'', phone:'', shift:'', spec:'', empid:'' })
    onToast?.('✅ ' + form.name + ' added to staff', 'success')
  }

  function delStaff(id) {
    if (!confirm('Remove this staff member?')) return
    const next = staff.filter(s => s.id !== id)
    saveStaff(hosp?.hospId, next)
    setStaff(next)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card sf-modal-card">
        <div className="modal-hdr">
          <h2>👥 Staff Management</h2>
          <button className="modal-cls" onClick={onClose}>✕</button>
        </div>
        <div className="sf-add-box">
          <h4>➕ ADD NEW STAFF MEMBER</h4>
          <div className="sf-grid">
            <div className="sf-grp"><label>Full Name *</label>
              <div className="sf-wrap"><span className="sf-ico">👤</span>
                <input type="text" placeholder="Dr. / Nurse name" value={form.name} onChange={e => upd('name', e.target.value)}/>
              </div></div>
            <div className="sf-grp"><label>Role *</label>
              <div className="sf-wrap"><span className="sf-ico">🏷️</span>
                <select value={form.role} onChange={e => upd('role', e.target.value)}>
                  <option value="">— Select —</option>
                  {Object.keys(RICON).map(r => <option key={r}>{r}</option>)}
                  <option>Admin Staff</option>
                </select>
              </div></div>
            <div className="sf-grp"><label>Mobile</label>
              <div className="sf-wrap"><span className="sf-ico">📱</span>
                <input type="tel" placeholder="10-digit" maxLength={10} value={form.phone} onChange={e => upd('phone', e.target.value)}/>
              </div></div>
            <div className="sf-grp"><label>Shift</label>
              <div className="sf-wrap"><span className="sf-ico">🕐</span>
                <select value={form.shift} onChange={e => upd('shift', e.target.value)}>
                  <option value="">— Select —</option>
                  <option>Morning (6AM–2PM)</option><option>Afternoon (2PM–10PM)</option>
                  <option>Night (10PM–6AM)</option><option>On-Call</option><option>Full Day</option>
                </select>
              </div></div>
            <div className="sf-grp"><label>Specialisation</label>
              <div className="sf-wrap"><span className="sf-ico">🩺</span>
                <input type="text" placeholder="e.g. Cardiology" value={form.spec} onChange={e => upd('spec', e.target.value)}/>
              </div></div>
            <div className="sf-grp"><label>Employee ID</label>
              <div className="sf-wrap"><span className="sf-ico">🪪</span>
                <input type="text" placeholder="EMP-001" value={form.empid} onChange={e => upd('empid', e.target.value)}/>
              </div></div>
          </div>
          {error && <div className="sf-err" style={{ display:'block' }}>{error}</div>}
          <button className="sf-add-btn" onClick={submitAdd}>➕ ADD STAFF MEMBER</button>
        </div>
        <div style={{ fontFamily:'var(--fh)', fontSize:'.65rem', color:'var(--neon)', letterSpacing:'3px', padding:'0 0 10px', borderBottom:'1px solid rgba(0,200,255,.12)', marginBottom:'12px' }}>
          CURRENT STAFF <span className="cbadge-sm">{staff.length}</span>
        </div>
        <div className="staff-list">
          {staff.length === 0
            ? <div style={{ color:'var(--dim)', fontSize:'.82rem', textAlign:'center', padding:'20px' }}>No staff yet.</div>
            : staff.map(s => (
                <div key={s.id} className="staff-item">
                  <div className="staff-av">{RICON[s.role]||'👤'}</div>
                  <div className="staff-info">
                    <div className="staff-nm">{s.name}</div>
                    <div className="staff-rl">{s.role}{s.spec ? ' · '+s.spec : ''}{s.shift ? ' | '+s.shift : ''}</div>
                    {s.phone && <div className="staff-ct">📱 +91 {s.phone}</div>}
                    {s.empid && <div style={{ fontSize:'.63rem', color:'var(--dim)' }}>{s.empid}</div>}
                  </div>
                  <button className="staff-del" onClick={() => delStaff(s.id)}>🗑 Remove</button>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  )
}