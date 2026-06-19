import { useState, useEffect, useRef, useCallback } from 'react'
import { TEMPLATES, NR } from '../utils/constants'
import { genVitals, updateVitals, getStatus } from '../utils/vitals'

const rFrom = arr => arr[Math.floor(Math.random() * arr.length)]

function buildPatient(t, variability) {
  return {
    ...t,
    id:           t.bed,
    variability,
    vitals:       genVitals(variability),
    ventilator:   {
      active: Math.random() > .4,
      mode:   rFrom(['SIMV','CPAP','BIPAP','A/C']),
      fio2:   Math.round(40 + Math.random() * 50)
    },
    alertHistory: [],
    btDevice:     null,
    lastUpdate:   new Date(),
    blood: '—', contact: '—', doctor: '—', notes: '',
  }
}

// ── 5 minutes between alerts per patient ──
const ALERT_COOLDOWN_MS = 5 * 60 * 1000   // 300 000 ms

export function useICUMonitor() {
  const [patients,        setPatients]       = useState([])
  const [chartHistories,  setChartHistories] = useState({})
  const [activeFilter,    setActiveFilter]   = useState('all')
  const [searchQuery,     setSearchQuery]    = useState('')
  const [currentMode,     setCurrentMode]    = useState('sim')
  const [alerts,          setAlerts]         = useState([])
  const [criticalAlert,   setCriticalAlert]  = useState(null)
  const [alertBanner,     setAlertBanner]    = useState(null)
  const [alarmPlaying,    setAlarmPlaying]   = useState(false)

  const lastAlertTime = useRef({})   // { [patientId]: timestamp }
  const alarmCtxRef   = useRef(null)
  const intervalRef   = useRef(null)
  const alarmRef      = useRef(false)
  const onAiAlertRef  = useRef(null)

  // ── expose AI callback setter ──
  const setOnAiAlert = useCallback(cb => { onAiAlertRef.current = cb }, [])

  // ── init ──
  const initPatients = useCallback(() => {
    const initialPatients = TEMPLATES.map((t, i) => {
      const v = i === 3 ? 'critical' : (i === 1 || i === 4) ? 'warning' : 'normal'
      return buildPatient(t, v)
    })
    const initHistories = {}
    TEMPLATES.forEach(t => {
      initHistories[t.bed] = { hr:[], spo2:[], sbp:[], temp:[], labels:[] }
    })
    setPatients(initialPatients)
    setChartHistories(initHistories)
    setAlerts([])
    lastAlertTime.current = {}
  }, [])

  // ── alarm ──
  const playAlarm = useCallback(() => {
    if (alarmRef.current) return
    alarmRef.current = true
    setAlarmPlaying(true)
    try {
      const actx = new (window.AudioContext || window.webkitAudioContext)()
      alarmCtxRef.current = actx
      function beep() {
        if (!alarmRef.current) return
        const osc  = actx.createOscillator()
        const gain = actx.createGain()
        osc.connect(gain)
        gain.connect(actx.destination)
        osc.type = 'square'
        osc.frequency.value = 880
        gain.gain.setValueAtTime(.22, actx.currentTime)
        gain.gain.exponentialRampToValueAtTime(.001, actx.currentTime + .3)
        osc.start()
        osc.stop(actx.currentTime + .3)
        setTimeout(beep, 700)
      }
      beep()
    } catch {}
  }, [])

  const stopAlarm = useCallback(() => {
    alarmRef.current = false
    setAlarmPlaying(false)
    if (alarmCtxRef.current) {
      try { alarmCtxRef.current.close() } catch {}
      alarmCtxRef.current = null
    }
  }, [])

  const dismissAlert = useCallback(() => {
    setCriticalAlert(null)
    stopAlarm()
  }, [stopAlarm])

  // ── alert feed ──
  const addAlertFeed = useCallback((msg, cls) => {
    setAlerts(prev => {
      const item = { msg, cls, time: new Date().toLocaleTimeString(), id: Date.now() }
      return [item, ...prev].slice(0, 12)
    })
  }, [])

  // ── check alerts — 5 min cooldown per patient ──
  const checkAlerts = useCallback((p) => {
    const st  = getStatus(p)
    const v   = p.vitals
    const now = Date.now()

    // Skip if this patient had an alert within the last 5 minutes
    if ((lastAlertTime.current[p.id] || 0) > now - ALERT_COOLDOWN_MS) return

    if (st === 'critical') {
      const issues = []
      if (v.hr   < NR.hr.cMin)   issues.push(`HR LOW: ${v.hr.toFixed(0)} BPM`)
      if (v.hr   > NR.hr.cMax)   issues.push(`HR HIGH: ${v.hr.toFixed(0)} BPM`)
      if (v.spo2 < NR.spo2.cMin) issues.push(`SpO₂ CRITICAL: ${v.spo2.toFixed(1)}%`)
      if (v.temp > NR.temp.cMax) issues.push(`HYPERTHERMIA: ${v.temp.toFixed(1)}°C`)
      if (v.sbp  > NR.sbp.cMax)  issues.push(`BP HIGH: ${v.sbp.toFixed(0)} mmHg`)
      if (v.sbp  < NR.sbp.cMin)  issues.push(`BP LOW: ${v.sbp.toFixed(0)} mmHg`)

      if (issues.length === 0) return   // critical status but no specific issue yet

      const msg = `🚨 CRITICAL: ${p.name} (${p.bed}) — ${issues.join(' | ')}`
      lastAlertTime.current[p.id] = now

      setCriticalAlert({ msg, patient: p })
      setAlertBanner(`🚨 CRITICAL — ${p.name} (${p.bed}) NEEDS IMMEDIATE ATTENTION`)
      addAlertFeed(msg, 'ac')
      playAlarm()

      if (onAiAlertRef.current) {
        onAiAlertRef.current(
          `🚨 CRITICAL: ${p.name} requires immediate intervention. ${issues.join('. ')}.`,
          'ca'
        )
      }
    } else if (st === 'warning') {
      // Warning alerts also on 5-min cooldown
      lastAlertTime.current[p.id] = now
      addAlertFeed(`⚠ WARNING: ${p.name} (${p.bed}) — vitals trending abnormal`, 'aw')
    }
  }, [addAlertFeed, playAlarm])

  // ── chart history ──
  const pushChart = useCallback((p) => {
    const v   = p.vitals
    const now = new Date().toLocaleTimeString('en-US', {
      hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
    })
    setChartHistories(prev => {
      const h   = prev[p.bed] || { hr:[], spo2:[], sbp:[], temp:[], labels:[] }
      const MAX = 30
      return {
        ...prev,
        [p.bed]: {
          labels: [...h.labels, now].slice(-MAX),
          hr:     [...h.hr,   v.hr].slice(-MAX),
          spo2:   [...h.spo2, v.spo2].slice(-MAX),
          sbp:    [...h.sbp,  v.sbp].slice(-MAX),
          temp:   [...h.temp, v.temp].slice(-MAX),
        }
      }
    })
  }, [])

  // ── monitoring loop (2 s vitals update, alert check every cycle) ──
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (currentMode !== 'sim' || !patients.length) return

    intervalRef.current = setInterval(() => {
      setPatients(prev => prev.map(p => {
        const newVitals = updateVitals(p)
        const updated   = { ...p, vitals: newVitals, lastUpdate: new Date() }
        pushChart(updated)
        checkAlerts(updated)
        return updated
      }))
    }, 2000)

    return () => clearInterval(intervalRef.current)
  }, [currentMode, patients.length, pushChart, checkAlerts])

  // ── add / connect ──
  const addPatient = useCallback((np) => {
    setPatients(prev => [...prev.filter(p => p.bed !== np.bed), np])
    setChartHistories(prev => ({
      ...prev,
      [np.bed]: { hr:[], spo2:[], sbp:[], temp:[], labels:[] }
    }))
  }, [])

  const connectBTDevice = useCallback((deviceInfo) => {
    setPatients(prev => {
      const freeIdx = prev.findIndex(p => !p.btDevice)
      if (freeIdx === -1) return prev
      const updated = [...prev]
      updated[freeIdx] = { ...updated[freeIdx], btDevice: deviceInfo }
      return updated
    })
  }, [])

  // ── filtered view ──
  const filteredPatients = patients.filter(p => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (!p.name.toLowerCase().includes(q) && !p.bed.toLowerCase().includes(q)) return false
    }
    if (activeFilter !== 'all' && getStatus(p) !== activeFilter) return false
    return true
  })

  // ── stats ──
  const stats = {
    total:     patients.length,
    stable:    patients.filter(p => getStatus(p) === 'stable').length,
    warning:   patients.filter(p => getStatus(p) === 'warning').length,
    critical:  patients.filter(p => getStatus(p) === 'critical').length,
    occupancy: patients.length ? Math.round(patients.length / 10 * 100) + '%' : '0%',
  }

  return {
    patients, filteredPatients, chartHistories, stats,
    activeFilter, setActiveFilter,
    searchQuery,  setSearchQuery,
    currentMode,  setCurrentMode,
    alerts,
    criticalAlert, dismissAlert,
    alertBanner, setAlertBanner,
    alarmPlaying, stopAlarm,
    addPatient, connectBTDevice,
    initPatients,
    setOnAiAlert,
  }
}