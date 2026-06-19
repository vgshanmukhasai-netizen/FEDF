import { NR, AI_RECS } from './constants'

const rFrom = arr => arr[Math.floor(Math.random() * arr.length)]

export function genVitals(v = 'normal') {
  if (v === 'critical') {
    const w = Math.floor(Math.random() * 3)
    if (w === 0) return { hr: rand(142,18,.3), spo2: rand(82,5,-.3), temp: rand(39.9,.4,.2), sbp: rand(172,18), dbp: rand(112,14), rr: rand(28,4,.2) }
    if (w === 1) return { hr: rand(34,9,-.2),  spo2: rand(86,4,-.2), temp: rand(38.5,.5),     sbp: rand(74,14,-.2), dbp: rand(44,10), rr: rand(8,3,-.2) }
    return { hr: rand(146,14), spo2: rand(81,5,-.3), temp: rand(40.3,.4,.3), sbp: rand(182,18,.2), dbp: rand(116,10), rr: rand(33,4,.3) }
  }
  if (v === 'warning') return { hr: rand(108,12), spo2: rand(92,3), temp: rand(38.2,.5), sbp: rand(146,14), dbp: rand(95,10), rr: rand(22,4) }
  return { hr: rand(76,10), spo2: rand(97.5,2), temp: rand(36.8,.4), sbp: rand(118,14), dbp: rand(76,9), rr: rand(16,3) }
}

function rand(b, r, sk = 0) {
  return +(b + (Math.random() - 0.5 + sk) * r).toFixed(1)
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)) }

export function updateVitals(p) {
  const v = { ...p.vitals }
  const d = (val, rng, n = .4) => +(val + (Math.random() - .5) * n * rng).toFixed(1)
  v.hr   = clamp(d(v.hr, 3), 25, 195)
  v.spo2 = clamp(+d(v.spo2, 1, .25).toFixed(1), 70, 100)
  v.temp = clamp(+d(v.temp, .3, .2).toFixed(1), 33, 42)
  v.sbp  = clamp(d(v.sbp, 5), 50, 225)
  v.dbp  = clamp(d(v.dbp, 3), 30, 135)
  v.rr   = clamp(d(v.rr, 2), 4, 42)
  if (p.variability !== 'normal' && Math.random() < .05) {
    const w = Math.floor(Math.random() * 3)
    if (w === 0) v.hr   = clamp(v.hr + (Math.random() > .5 ? 22 : -22), 25, 195)
    if (w === 1) v.spo2 = clamp(v.spo2 - Math.random() * 5, 70, 100)
    if (w === 2) v.temp = clamp(+(v.temp + 0.5).toFixed(1), 33, 42)
  }
  return v
}

export function getStatus(p) {
  const v = p.vitals
  const c =
    v.hr < NR.hr.cMin || v.hr > NR.hr.cMax ||
    v.spo2 < NR.spo2.cMin ||
    v.temp < NR.temp.cMin || v.temp > NR.temp.cMax ||
    v.sbp < NR.sbp.cMin  || v.sbp > NR.sbp.cMax
  const w = !c && (
    v.hr < NR.hr.min || v.hr > NR.hr.max ||
    v.spo2 < NR.spo2.min ||
    v.temp > NR.temp.max ||
    v.sbp > NR.sbp.max || v.rr > NR.rr.max
  )
  return c ? 'critical' : w ? 'warning' : 'stable'
}

export function vClass(key, val) {
  const r = NR[key]; if (!r) return ''
  if (val < r.cMin || val > r.cMax) return 'vc'
  if (val < r.min  || val > r.max)  return 'vw'
  return ''
}

export function aiRec(p) {
  const v = p.vitals, st = getStatus(p), recs = []
  if (v.hr   > NR.hr.max)   recs.push(...AI_RECS.highHR.slice(0,2))
  if (v.hr   < NR.hr.min)   recs.push(...AI_RECS.lowHR.slice(0,2))
  if (v.spo2 < NR.spo2.min) recs.push(...AI_RECS.lowSpO2.slice(0,2))
  if (v.temp > NR.temp.max) recs.push(...AI_RECS.highTemp.slice(0,2))
  if (v.sbp  > NR.sbp.max)  recs.push(...AI_RECS.highBP.slice(0,2))
  if (v.sbp  < NR.sbp.min)  recs.push(...AI_RECS.lowBP.slice(0,2))
  if (v.rr   > NR.rr.max)   recs.push(...AI_RECS.highRR.slice(0,2))
  if (!recs.length)
    return `${p.name} shows stable vitals. Continue current monitoring protocol. All parameters within acceptable ranges. Schedule routine labs and physician review.`
  return `${st === 'critical' ? '⚠ URGENT INTERVENTION REQUIRED: ' : ''}${recs.slice(0,3).join('. ')}. Physician consultation recommended.${st === 'critical' ? ' Notify on-call physician immediately.' : ' Continue close monitoring.'}`
}