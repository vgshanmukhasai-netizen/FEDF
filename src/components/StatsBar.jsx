export default function StatsBar({ stats, searchQuery, onSearch, activeFilter, onFilter, onAddPatient }) {
  const filters = [
    { key:'all',      label:'All',      cls:'' },
    { key:'stable',   label:'Stable',   cls:'' },
    { key:'warning',  label:'Warning',  cls:'fw' },
    { key:'critical', label:'Critical', cls:'fc' },
  ]

  return (
    <div className="stats-bar">
      <div className="stat-chip">
        <span className="stat-ico">🛏️</span>
        <div><span className="stat-v">{stats.total}</span><span className="stat-l">Total Beds</span></div>
      </div>
      <div className="stat-chip">
        <span className="stat-ico">✅</span>
        <div><span className="stat-v">{stats.stable}</span><span className="stat-l">Stable</span></div>
      </div>
      <div className="stat-chip warn">
        <span className="stat-ico">⚠️</span>
        <div><span className="stat-v">{stats.warning}</span><span className="stat-l">Warning</span></div>
      </div>
      <div className="stat-chip crit">
        <span className="stat-ico">🚨</span>
        <div><span className="stat-v">{stats.critical}</span><span className="stat-l">Critical</span></div>
      </div>
      <div className="stat-chip">
        <span className="stat-ico">📊</span>
        <div><span className="stat-v">{stats.occupancy}</span><span className="stat-l">Occupancy</span></div>
      </div>
      <div className="srch-wrap">
        <input type="text" placeholder="🔍 Search patient..." value={searchQuery}
          onChange={e => onSearch(e.target.value)}/>
      </div>
      <div className="flt-wrap">
        {filters.map(f => (
          <button key={f.key}
            className={`flt-btn ${f.cls} ${activeFilter===f.key?'active':''}`}
            onClick={() => onFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>
      <button className="add-btn" onClick={onAddPatient}>➕ Add Patient</button>
    </div>
  )
}