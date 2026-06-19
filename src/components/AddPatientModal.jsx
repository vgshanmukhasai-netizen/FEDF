import { useState } from 'react'
import { genVitals } from '../utils/vitals'
import { getStaff }  from '../utils/hospital'

export default function AddPatientModal({ patients, hosp, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name:'', age:'', gender:'', bed:'', blood:'', condition:'', contact:'', doctor:'',
    notes:'', hr:'', spo2:'', temp:'', bp:'', rr:'', vent:'none', status:'normal',
  })
  const [error, setError] = useState('')
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const occupied = patients.map(p => p.bed)
  const allBeds  = Array.from({ length:20 }, (_,i) => 'ICU-' + String(i+1).padStart(2,'0'))
  const freeBeds = allBeds.filter(b => !occupied.includes(b))
  const doctors  = getStaff(hosp?.hospId).filter(s => s.role.toLowerCase().includes('doctor') || s.role.toLowerCase().includes('intensivist'))

  function handleSubmit() {
    setError('')
    const { name, age, gender, bed, condition } = form
    if (!name)          return setError('⚠ Patient name is required.')
    if (!age || +age<1) return setError('⚠ Please enter a valid age.')
    if (!gender)        return setError('⚠ Please select gender.')
    if (!bed)           return setError('⚠ Please select an ICU bed.')
    if (!condition)     return setError('⚠ Please enter the primary diagnosis.')

    const auto = genVitals(form.status)
    let sbp = null, dbp = null
    if (form.bp.includes('/')) { const [s,d] = form.bp.split('/'); sbp = parseInt(s); dbp = parseInt(d) }

    const vitals = {
      hr:   form.hr   ? +form.hr   : auto.hr,
      spo2: form.spo2 ? +form.spo2 : auto.spo2,
      temp: form.temp ? +form.temp : auto.temp,
      sbp:  sbp !== null ? sbp : auto.sbp,
      dbp:  dbp !== null ? dbp : auto.dbp,
      rr:   form.rr   ? +form.rr   : auto.rr,
    }

    onSubmit({
      id: form.bed, name, age: +age, gender, bed, condition,
      blood:   form.blood   || '—',
      contact: form.contact || '—',
      doctor:  form.doctor  || '—',
      notes: form.notes, variability: form.status,
      vitals,
      ventilator: { active: form.vent!=='none', mode: form.vent!=='none' ? form.vent : 'OFF', fio2: 40 },
      alertHistory: [], btDevice: null, lastUpdate: new Date(), addedAt: new Date().toISOString(),
    })
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card ap-modal-card">
        <div className="modal-hdr">
          <h2>➕ Add New ICU Patient</h2>
          <button className="modal-cls" onClick={onClose}>✕</button>
        </div>
        <div className="ap-grid">
          <div className="ap-sec-lbl">PATIENT INFORMATION</div>
          <div className="ap-grp full"><label>Full Name *</label>
            <div className="ap-inp-wrap"><span className="ap-ico">👤</span>
              <input type="text" placeholder="Patient full name" value={form.name} onChange={e => upd('name', e.target.value)}/>
            </div></div>
          <div className="ap-grp"><label>Age *</label>
            <div className="ap-inp-wrap"><span className="ap-ico">🎂</span>
              <input type="number" placeholder="e.g. 45" min="0" max="120" value={form.age} onChange={e => upd('age', e.target.value)}/>
            </div></div>
          <div className="ap-grp"><label>Gender *</label>
            <div className="ap-inp-wrap"><span className="ap-ico">⚥</span>
              <select value={form.gender} onChange={e => upd('gender', e.target.value)}>
                <option value="">—</option><option value="M">Male</option><option value="F">Female</option><option value="O">Other</option>
              </select>
            </div></div>
          <div className="ap-grp"><label>ICU Bed *</label>
            <div className="ap-inp-wrap"><span className="ap-ico">🛏️</span>
              <select value={form.bed} onChange={e => upd('bed', e.target.value)}>
                <option value="">— Select available bed —</option>
                {freeBeds.map(b => <option key={b} value={b}>{b} (Available)</option>)}
                {occupied.length > 0 && (
                  <optgroup label="──── Occupied ────">
                    {occupied.map(b => <option key={b} disabled>{b} (Occupied)</option>)}
                  </optgroup>
                )}
              </select>
            </div></div>
          <div className="ap-grp"><label>Blood Group</label>
            <div className="ap-inp-wrap"><span className="ap-ico">🩸</span>
              <select value={form.blood} onChange={e => upd('blood', e.target.value)}>
                <option value="">—</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => <option key={b}>{b}</option>)}
              </select>
            </div></div>
          <div className="ap-grp full"><label>Diagnosis / Condition *</label>
            <div className="ap-inp-wrap"><span className="ap-ico">🩺</span>
              <input type="text" placeholder="e.g. Post-Cardiac Surgery" value={form.condition} onChange={e => upd('condition', e.target.value)}/>
            </div></div>
          <div className="ap-grp full"><label>Emergency Contact</label>
            <div className="ap-inp-wrap"><span className="ap-ico">📞</span>
              <input type="text" placeholder="Relative name & phone" value={form.contact} onChange={e => upd('contact', e.target.value)}/>
            </div></div>
          <div className="ap-grp full"><label>Attending Doctor</label>
            <div className="ap-inp-wrap"><span className="ap-ico">👨‍⚕️</span>
              <select value={form.doctor} onChange={e => upd('doctor', e.target.value)}>
                <option value="">— Assign —</option>
                {doctors.map(d => <option key={d.id} value={d.name}>{d.name} ({d.role})</option>)}
              </select>
            </div></div>

          <div className="ap-sec-lbl">INITIAL VITALS (leave blank for auto-simulation)</div>
          <div className="ap-note">💡 Enter known admission values or leave blank — realistic vitals will be auto-generated.</div>
          <div className="ap-grp"><label>Heart Rate (BPM)</label>
            <div className="ap-inp-wrap"><span className="ap-ico">❤️</span>
              <input type="number" placeholder="60–100" value={form.hr} onChange={e => upd('hr', e.target.value)}/>
            </div></div>
          <div className="ap-grp"><label>SpO₂ (%)</label>
            <div className="ap-inp-wrap"><span className="ap-ico">🫁</span>
              <input type="number" placeholder="95–100" value={form.spo2} onChange={e => upd('spo2', e.target.value)}/>
            </div></div>
          <div className="ap-grp"><label>Temperature (°C)</label>
            <div className="ap-inp-wrap"><span className="ap-ico">🌡️</span>
              <input type="number" placeholder="36.5" step="0.1" value={form.temp} onChange={e => upd('temp', e.target.value)}/>
            </div></div>
          <div className="ap-grp"><label>Blood Pressure</label>
            <div className="ap-inp-wrap"><span className="ap-ico">💉</span>
              <input type="text" placeholder="120/80" value={form.bp} onChange={e => upd('bp', e.target.value)}/>
            </div></div>
          <div className="ap-grp"><label>Respiratory Rate</label>
            <div className="ap-inp-wrap"><span className="ap-ico">💨</span>
              <input type="number" placeholder="12–20" value={form.rr} onChange={e => upd('rr', e.target.value)}/>
            </div></div>
          <div className="ap-grp"><label>Ventilator</label>
            <div className="ap-inp-wrap"><span className="ap-ico">🫀</span>
              <select value={form.vent} onChange={e => upd('vent', e.target.value)}>
                <option value="none">Not required</option>
                <option value="SIMV">SIMV</option><option value="CPAP">CPAP</option>
                <option value="BIPAP">BiPAP</option><option value="AC">A/C</option>
              </select>
            </div></div>
          <div className="ap-grp"><label>Initial Status</label>
            <div className="ap-inp-wrap"><span className="ap-ico">📊</span>
              <select value={form.status} onChange={e => upd('status', e.target.value)}>
                <option value="normal">Stable</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div></div>
          <div className="ap-grp full"><label>Notes / Allergies</label>
            <div className="ap-inp-wrap"><span className="ap-ico">📝</span>
              <textarea placeholder="Allergies, history, instructions…" value={form.notes} onChange={e => upd('notes', e.target.value)}></textarea>
            </div></div>
        </div>
        {error && <div className="ap-err" style={{ display:'block' }}>{error}</div>}
        <button className="ap-submit" onClick={handleSubmit}>
          <span>ADD PATIENT TO ICU MONITORING</span><span style={{ fontSize:'1.2rem' }}>→</span>
        </button>
      </div>
    </div>
  )
}