import { useEffect, useRef } from 'react'
import { getStatus, vClass } from '../utils/vitals'

export default function PatientCard({ patient: p, onClick }) {
  const canvasRef = useRef(null)
  const animRef   = useRef(null)
  const ptsRef    = useRef([])
  const phaseRef  = useRef(0)

  const st = getStatus(p)
  const v  = p.vitals

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Size canvas to its actual rendered size
    const rect = canvas.getBoundingClientRect()
    canvas.width  = rect.width  || canvas.offsetWidth  || 300
    canvas.height = rect.height || canvas.offsetHeight || 44

    const ctx = canvas.getContext('2d')
    const W   = canvas.width
    const H   = canvas.height

    // Colour by status — single colour, no double lines
    const color =
      st === 'critical' ? '#F87171' :
      st === 'warning'  ? '#FCD34D' :
      '#22D3EE'

    // Reset points and phase when status changes
    ptsRef.current  = []
    phaseRef.current = 0

    let x = 0

    // ECG wave shape — one clean biological waveform
    function wave(ph) {
      const t = ((ph % 80) / 80)
      if (t < 0.10) return Math.sin(t / 0.10 * Math.PI) * 2.5
      if (t < 0.20) return -Math.sin((t - 0.10) / 0.10 * Math.PI) * 1.5
      if (t < 0.30) return 0
      if (t < 0.35) return Math.sin((t - 0.30) / 0.05 * Math.PI) * 16    // R peak
      if (t < 0.40) return -Math.sin((t - 0.35) / 0.05 * Math.PI) * 7   // S dip
      if (t < 0.55) return Math.sin((t - 0.40) / 0.15 * Math.PI) * 4    // T wave
      return 0
    }

    function draw() {
      // Clear fully each frame — prevents ghost/double lines
      ctx.clearRect(0, 0, W, H)

      phaseRef.current++

      // Add new point
      ptsRef.current.push({ x, y: H / 2 - wave(phaseRef.current) })

      // Keep only as many points as the canvas is wide
      if (ptsRef.current.length > W) ptsRef.current.shift()

      // Advance x
      x = (x + 2) % W

      if (ptsRef.current.length < 2) {
        animRef.current = requestAnimationFrame(draw)
        return
      }

      // ── SINGLE clean line — no background trace ──
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth   = 1.8
      ctx.lineJoin    = 'round'
      ctx.lineCap     = 'round'

      // Subtle glow — just one pass with shadowBlur
      ctx.shadowBlur  = st === 'critical' ? 8 : 6
      ctx.shadowColor = color

      ptsRef.current.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y)
        else         ctx.lineTo(pt.x, pt.y)
      })

      ctx.stroke()

      // Reset shadow so it doesn't affect next frame's clearRect
      ctx.shadowBlur  = 0
      ctx.shadowColor = 'transparent'

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  // Re-run when status changes so colour updates
  }, [st]) // eslint-disable-line

  return (
    <div
      className={`pcard ${st === 'warning' ? 'sw' : st === 'critical' ? 'sc' : ''}`}
      onClick={onClick}
    >
      <div className="ctop">
        <div>
          <div className="pname">{p.name}</div>
          <div className="pbed">🛏 {p.bed} · {p.age}y {p.gender} · {p.condition}</div>
        </div>
        <span className={`cbadge ${st === 'stable' ? 'bs' : st === 'warning' ? 'bw' : 'bc'}`}>
          {st.toUpperCase()}
        </span>
      </div>

      {/* ECG strip — canvas only, no SVG overlay */}
      <div className="ecg-cont">
        <canvas className="ecg-canvas" ref={canvasRef} />
      </div>

      <div className="vitals-grid">
        <div className="vitem vhr">
          <div className="vlbl">Heart Rate</div>
          <div className={`vval ${vClass('hr', v.hr)}`}>
            {v.hr.toFixed(0)}<span className="vunit">BPM</span>
          </div>
        </div>
        <div className="vitem vspo2">
          <div className="vlbl">SpO₂</div>
          <div className={`vval ${vClass('spo2', v.spo2)}`}>
            {v.spo2.toFixed(1)}<span className="vunit">%</span>
          </div>
        </div>
        <div className="vitem vtemp">
          <div className="vlbl">Temp</div>
          <div className={`vval ${vClass('temp', v.temp)}`}>
            {v.temp.toFixed(1)}<span className="vunit">°C</span>
          </div>
        </div>
        <div className="vitem vbp">
          <div className="vlbl">Blood Pressure</div>
          <div className={`vval ${vClass('sbp', v.sbp)}`}>
            {v.sbp.toFixed(0)}/{v.dbp.toFixed(0)}<span className="vunit">mmHg</span>
          </div>
        </div>
        <div className="vitem vrr">
          <div className="vlbl">Resp Rate</div>
          <div className={`vval ${vClass('rr', v.rr)}`}>
            {v.rr.toFixed(0)}<span className="vunit">/min</span>
          </div>
        </div>
        <div className="vitem">
          <div className="vlbl">Ventilator</div>
          <div className="vent-row">
            <div className="vent-st">
              <span className={`vdot ${p.ventilator.active ? '' : 'off'}`}></span>
              <span style={{ fontSize:'.68rem', color:'var(--txt3)' }}>
                {p.ventilator.active ? p.ventilator.mode : 'OFF'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {p.btDevice && (
        <div className="btag">🔵 {p.btDevice.name} live</div>
      )}
    </div>
  )
}