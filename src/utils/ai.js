import { NR } from './constants'
import { getStatus, aiRec } from './vitals'

export function processQuery(q, patients) {
  const ql  = q.toLowerCase()
  const crits = patients.filter(p => getStatus(p) === 'critical')
  const warns  = patients.filter(p => getStatus(p) === 'warning')

  if (ql.includes('critical')) {
    if (!crits.length) return 'No patients are currently in critical condition. All monitored patients are stable or at warning level.'
    return `${crits.length} critical patient(s): ${crits.map(p => `${p.name} (${p.bed}) — HR: ${p.vitals.hr.toFixed(0)}, SpO₂: ${p.vitals.spo2.toFixed(1)}%, Temp: ${p.vitals.temp.toFixed(1)}°C`).join(' | ')}. Immediate physician response required.`
  }
  if (ql.includes('urgent') || ql.includes('immediate') || ql.includes('attention')) {
    const u = [...crits, ...warns]
    if (!u.length) return 'No patients require immediate attention. All vitals within acceptable ranges.'
    return `Patients needing attention: ${u.map(p => `${p.name} (${getStatus(p).toUpperCase()})`).join(', ')}.`
  }
  if (ql.includes('summary') || ql.includes('overview')) {
    const s      = patients.filter(p => getStatus(p) === 'stable').length
    const avgHR  = patients.length ? (patients.reduce((a,p) => a + p.vitals.hr,   0) / patients.length).toFixed(0) : 0
    const avgSpo2 = patients.length ? (patients.reduce((a,p) => a + p.vitals.spo2, 0) / patients.length).toFixed(1) : 0
    return `ICU Summary: ${patients.length} beds occupied. ${s} stable, ${warns.length} warning, ${crits.length} critical. Avg HR: ${avgHR} BPM. Avg SpO₂: ${avgSpo2}%. ${crits.length > 0 ? '⚠ CRITICAL PATIENTS REQUIRE ATTENTION.' : '✅ ICU operations nominal.'}`
  }
  if (ql.includes('spo2') || ql.includes('oxygen')) {
    const low = patients.filter(p => p.vitals.spo2 < 95)
    if (!low.length) return 'All patients have acceptable SpO₂ levels (≥95%).'
    return `Patients with low SpO₂: ${low.map(p => `${p.name}: ${p.vitals.spo2.toFixed(1)}%`).join(', ')}. Consider increasing FiO₂.`
  }
  if (ql.includes('heart') || ql.includes('hr')) {
    const ab = patients.filter(p => p.vitals.hr < 60 || p.vitals.hr > 100)
    if (!ab.length) return 'All patients have normal heart rates (60–100 BPM).'
    return `Abnormal heart rates: ${ab.map(p => `${p.name}: ${p.vitals.hr.toFixed(0)} BPM (${p.vitals.hr > 100 ? 'TACHY' : 'BRADY'})`).join(', ')}.`
  }
  if (ql.includes('temp') || ql.includes('fever')) {
    const f = patients.filter(p => p.vitals.temp > 37.5)
    if (!f.length) return 'No patients are currently febrile.'
    return `Febrile patients: ${f.map(p => `${p.name}: ${p.vitals.temp.toFixed(1)}°C`).join(', ')}. Consider blood cultures and antipyretics.`
  }
  const fp = patients.find(p =>
    ql.includes(p.name.toLowerCase().split(' ')[0]) || ql.includes(p.bed.toLowerCase())
  )
  if (fp) {
    const v = fp.vitals, st = getStatus(fp)
    return `${fp.name} (${fp.bed}) — Status: ${st.toUpperCase()}. HR: ${v.hr.toFixed(0)} BPM, SpO₂: ${v.spo2.toFixed(1)}%, Temp: ${v.temp.toFixed(1)}°C, BP: ${v.sbp.toFixed(0)}/${v.dbp.toFixed(0)}. ${aiRec(fp)}`
  }
  return `ARIA analysing… I can help with patient vitals, critical alerts, ICU statistics, and clinical recommendations. Try: "Who is critical?", "ICU summary", or a patient name like "${patients[0]?.name.split(' ')[0] || 'Arjun'}".`
}