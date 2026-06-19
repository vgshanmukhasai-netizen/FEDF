import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurH, clearCurH, ensureDefaultStaff } from '../utils/hospital'
import { useICUMonitor } from '../hooks/useICUMonitor'
import { useClock }      from '../hooks/useClock'
import Navbar            from '../components/Navbar'
import StatsBar          from '../components/StatsBar'
import PatientCard       from '../components/PatientCard'
import RightPanel        from '../components/RightPanel'
import HospitalProfile   from '../components/HospitalProfile'
import AddPatientModal   from '../components/AddPatientModal'
import ManageStaffModal  from '../components/ManageStaffModal'
import BluetoothModal    from '../components/BluetoothModal'
import PatientDetailModal from '../components/PatientDetailModal'
import CriticalAlertPopup from '../components/CriticalAlertPopup'
import AlertBanner       from '../components/AlertBanner'
import Toast             from '../components/UI/Toast'

export default function Dashboard() {
  const navigate  = useNavigate()
  const hosp      = getCurH()
  const { timeStr, dateStr } = useClock()
  const monitor   = useICUMonitor()
  const aiMsgRef  = useRef(null)   // exposed from RightPanel
  const toastRef  = useRef(null)

  const [showProfile,    setShowProfile]    = useState(false)
  const [showAddPatient, setShowAddPatient] = useState(false)
  const [showStaff,      setShowStaff]      = useState(false)
  const [showBluetooth,  setShowBluetooth]  = useState(false)
  const [selectedPatient,setSelectedPatient]= useState(null)
  const [toastMsg,       setToastMsg]       = useState(null)

  // Wire up AI alert callback
  const pushAiMsg = useCallback((text, type) => {
    aiMsgRef.current?.(text, type)
  }, [])

  useEffect(() => {
    monitor.setOnAiAlert(pushAiMsg)
  }, [pushAiMsg])  // eslint-disable-line

  useEffect(() => {
    if (!hosp) { navigate('/'); return }
    ensureDefaultStaff(hosp)
    monitor.initPatients()
  }, []) // eslint-disable-line

  function showToast(msg, type = 'info') {
    setToastMsg({ msg, type, id: Date.now() })
  }

  function logout() {
    monitor.stopAlarm()
    clearCurH()
    navigate('/')
  }

  if (!hosp) return null

  return (
    <div className="page dashboard-page">
      <Navbar
        hosp={hosp}
        timeStr={timeStr}
        dateStr={dateStr}
        currentMode={monitor.currentMode}
        onSetMode={monitor.setCurrentMode}
        onOpenBluetooth={() => setShowBluetooth(true)}
        onOpenProfile={() => setShowProfile(true)}
        onLogout={logout}
      />

      <StatsBar
        stats={monitor.stats}
        searchQuery={monitor.searchQuery}
        onSearch={monitor.setSearchQuery}
        activeFilter={monitor.activeFilter}
        onFilter={monitor.setActiveFilter}
        onAddPatient={() => setShowAddPatient(true)}
      />

      <div className="main-content">
        {/* PATIENT GRID */}
        <div className="cards-section">
          <div className="patient-grid">
            {monitor.filteredPatients.length === 0
              ? <div className="no-patients">No patients match the current filter.</div>
              : monitor.filteredPatients.map(p => (
                  <PatientCard key={p.id} patient={p} onClick={() => setSelectedPatient(p)} />
                ))
            }
          </div>
        </div>

        {/* RIGHT PANEL */}
        <RightPanel
          patients={monitor.patients}
          chartHistories={monitor.chartHistories}
          alerts={monitor.alerts}
          aiMsgRef={aiMsgRef}
        />
      </div>

      {/* OVERLAYS */}
      <HospitalProfile
        open={showProfile}
        hosp={hosp}
        stats={monitor.stats}
        onClose={() => setShowProfile(false)}
        onAddPatient={() => { setShowProfile(false); setShowAddPatient(true) }}
        onManageStaff={() => { setShowProfile(false); setShowStaff(true) }}
      />

      {showAddPatient && (
        <AddPatientModal
          patients={monitor.patients}
          hosp={hosp}
          onClose={() => setShowAddPatient(false)}
          onSubmit={np => {
            monitor.addPatient(np)
            setShowAddPatient(false)
            pushAiMsg(`✅ ${np.name} admitted to ${np.bed}. Condition: ${np.condition}. Monitoring active.`, 'ai')
            showToast(`✅ ${np.name} admitted to ${np.bed}`, 'success')
          }}
        />
      )}

      {showStaff && (
        <ManageStaffModal hosp={hosp} onClose={() => setShowStaff(false)} onToast={showToast} />
      )}

      {showBluetooth && (
        <BluetoothModal
          patients={monitor.patients}
          onClose={() => setShowBluetooth(false)}
          onConnect={dev => {
            monitor.connectBTDevice(dev)
            pushAiMsg(`Bluetooth "${dev.name}" connected. Live streaming active.`, 'ai')
            showToast(`🔵 ${dev.name} connected`, 'success')
          }}
          onToast={showToast}
        />
      )}

      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}

      {monitor.criticalAlert && (
        <CriticalAlertPopup
          msg={monitor.criticalAlert.msg}
          onDismiss={monitor.dismissAlert}
        />
      )}

      {monitor.alertBanner && (
        <AlertBanner
          text={monitor.alertBanner}
          onDismiss={() => monitor.setAlertBanner(null)}
        />
      )}

      {toastMsg && (
        <Toast key={toastMsg.id} msg={toastMsg.msg} type={toastMsg.type} />
      )}
    </div>
  )
}