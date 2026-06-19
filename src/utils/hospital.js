export function getHosps() {
  try { return JSON.parse(localStorage.getItem('mc_h') || '{}') } catch { return {} }
}
export function saveHosps(d) { localStorage.setItem('mc_h', JSON.stringify(d)) }
export function getCurH()    { try { return JSON.parse(sessionStorage.getItem('mc_cur') || 'null') } catch { return null } }
export function setCurH(h)   { sessionStorage.setItem('mc_cur', JSON.stringify(h)) }
export function clearCurH()  { sessionStorage.removeItem('mc_cur') }
export function hKey(n)      { return n.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }
export function genOTP()     { return String(Math.floor(100000 + Math.random() * 900000)) }
export function genID()      { return 'HOSP-' + Date.now().toString(36).toUpperCase().slice(-6) }
export function maskPh(p)    { return '+91 ' + p.slice(0,2) + '×'.repeat(6) + p.slice(-2) }

export function getStaff(hospId) {
  try { return JSON.parse(localStorage.getItem('mc_sf_' + hospId) || '[]') } catch { return [] }
}
export function saveStaff(hospId, list) {
  localStorage.setItem('mc_sf_' + hospId, JSON.stringify(list))
}

export function ensureDefaultStaff(hosp) {
  if (!hosp) return
  const k = 'mc_sf_' + hosp.hospId
  if (!localStorage.getItem(k)) {
    localStorage.setItem(k, JSON.stringify([
      { id:'S001', name: hosp.admin || 'Admin Doctor', role:'Doctor / Intensivist', phone: hosp.phone, shift:'Full Day',               spec:'General ICU',  empid:'EMP-001' },
      { id:'S002', name: 'Head Nurse Priya',           role:'Head Nurse',           phone: '',          shift:'Morning (6AM–2PM)',      spec:'ICU Care',     empid:'EMP-002' },
      { id:'S003', name: 'Dr. Rajan Kumar',            role:'Resident Doctor',      phone: '',          shift:'Night (10PM–6AM)',       spec:'Pulmonology',  empid:'EMP-003' },
    ]))
  }
}

export function seedDemo() {
  const h = getHosps()
  if (!h['demo-hospital']) {
    h['demo-hospital'] = {
      name:'Demo Hospital', type:'Government', city:'Hyderabad, Telangana',
      address:'Banjara Hills Road No.2, Hyderabad 500034',
      admin:'Dr. Demo Admin', phone:'9999999999', pass:'demo1234',
      beds:'1–10', spec:'Multi-Speciality', otp:'247356',
      hospId:'HOSP-DEMO01', registered: new Date().toISOString(),
    }
    saveHosps(h)
  }
}