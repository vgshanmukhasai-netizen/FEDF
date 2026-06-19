export default function EmergencyFeed({ alerts }) {
  return (
    <div className="emr-panel">
      <div className="emr-title">
        <span className="pulse-dot"></span>Emergency Alert Feed
      </div>
      <div id="emergencyList">
        {alerts.length === 0
          ? <div className="no-alerts">✅ No active alerts — all patients nominal</div>
          : alerts.map(a => (
              <div key={a.id} className={`alert-item ${a.cls}`}>
                {a.msg}
                <div className="alert-time">{a.time}</div>
              </div>
            ))
        }
      </div>
    </div>
  )
}