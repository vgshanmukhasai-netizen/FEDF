import MedLogo from './UI/MedLogo'

export default function Navbar({ hosp, timeStr, dateStr, currentMode, onSetMode, onOpenBluetooth, onOpenProfile, onLogout }) {
  const shortName = hosp?.name?.split(' ').slice(0,3).join(' ') || 'MediCore AI'

  return (
    <nav className="top-nav">
      <div className="nav-left">
        <span className="nav-logo">✚ {shortName}</span>
        <span className="nav-tag">ICU Command Center</span>
      </div>
      <div className="nav-center">
        <div className="live-dot-wrap"><span className="live-dot"></span>LIVE</div>
        <div className="nav-clock">{timeStr}</div>
        <div className="nav-date">{dateStr}</div>
      </div>
      <div className="nav-right">
        <button className={`nav-btn ${currentMode==='sim'?'active':''}`} onClick={() => onSetMode('sim')}>SIM</button>
        <button className={`nav-btn ${currentMode==='hw'?'active':''}`}  onClick={() => onSetMode('hw')}>HW</button>
        <button className="nav-btn bt-btn"  onClick={onOpenBluetooth}>🔵 BT</button>
        <button className="nav-btn"         onClick={onOpenProfile}>🏥 PROFILE</button>
        <button className="nav-btn danger"  onClick={onLogout}>LOGOUT</button>
      </div>
    </nav>
  )
}