import { getStatus } from '../utils/vitals'
import { aiRec }     from '../utils/vitals'

export default function PatientDetailModal({ patient: p, onClose }) {
  if (!p) return null
  const v  = p.vitals
  const st = getStatus(p)
  const rec = aiRec(p)

  return (
    <div className="modal-overlay">
      <div className="modal-card modal-wide">
        <div className="modal-hdr">
          <h2>{p.name} — {p.bed}</h2>
          <button className="modal-cls" onClick={onClose}>✕</button>
        </div>
        <div>
          <div style={{ marginBottom:'14px' }}>
            <span className={`cbadge ${st==='stable'?'bs':st==='warning'?'bw':'bc'}`} style={{ fontSize:'.72rem' }}>
              {st.toUpperCase()}
            </span>
            <span style={{ marginLeft:'12px', color:'var(--dim)', fontSize:'.78rem' }}>
              {p.age}y {p.gender} · {p.condition}
            </span>
            {p.blood && p.blood !== '—' &&
              <span style={{ marginLeft:'8px', color:'var(--dim)', fontSize:'.78rem' }}>· {p.blood}</span>
            }
          </div>

          <div className="det-grid">
            <div className="det-vit">
              <div className="det-vit-lbl">Heart Rate</div>
              <div className="det-vit-val" style={{ color:'#ff6680' }}>{v.hr.toFixed(0)} <small style={{ fontSize:'1rem' }}>BPM</small></div>
            </div>
            <div className="det-vit">
              <div className="det-vit-lbl">SpO₂</div>
              <div className="det-vit-val" style={{ color:'var(--neon)' }}>{v.spo2.toFixed(1)}<small style={{ fontSize:'1rem' }}>%</small></div>
            </div>
            <div className="det-vit">
              <div className="det-vit-lbl">Temperature</div>
              <div className="det-vit-val" style={{ color:'var(--orange)' }}>{v.temp.toFixed(1)}<small style={{ fontSize:'1rem' }}>°C</small></div>
            </div>
            <div className="det-vit">
              <div className="det-vit-lbl">Blood Pressure</div>
              <div className="det-vit-val" style={{ color:'#aa88ff' }}>{v.sbp.toFixed(0)}/{v.dbp.toFixed(0)}<small style={{ fontSize:'1rem' }}>mmHg</small></div>
            </div>
            <div className="det-vit">
              <div className="det-vit-lbl">Respiratory Rate</div>
              <div className="det-vit-val" style={{ color:'var(--green)' }}>{v.rr.toFixed(0)}<small style={{ fontSize:'1rem' }}>/min</small></div>
            </div>
            <div className="det-vit">
              <div className="det-vit-lbl">Ventilator</div>
              <div className="det-vit-val" style={{ color:'var(--txt)', fontSize:'1.2rem' }}>
                {p.ventilator.active
                  ? <>{p.ventilator.mode}<div style={{ fontSize:'.72rem', color:'var(--dim)', marginTop:'4px' }}>FiO₂: {p.ventilator.fio2}%</div></>
                  : 'OFF'
                }
              </div>
            </div>
          </div>

          {p.doctor && p.doctor !== '—' &&
            <div style={{ fontSize:'.78rem', color:'var(--dim)', marginBottom:'8px' }}>
              👨‍⚕️ Attending: <span style={{ color:'var(--txt)' }}>{p.doctor}</span>
            </div>
          }
          {p.contact && p.contact !== '—' &&
            <div style={{ fontSize:'.78rem', color:'var(--dim)', marginBottom:'8px' }}>
              📞 Emergency: <span style={{ color:'var(--txt)' }}>{p.contact}</span>
            </div>
          }
          {p.notes &&
            <div style={{ fontSize:'.76rem', color:'var(--dim)', marginBottom:'10px', padding:'8px 12px', background:'rgba(0,30,70,.4)', borderRadius:'7px', border:'1px solid rgba(0,180,255,.12)' }}>
              📝 {p.notes}
            </div>
          }

          <div className="ai-rec">
            <h4>🧠 ARIA AI Recommendation</h4>
            <p>{rec}</p>
          </div>
        </div>
      </div>
    </div>
  )
}