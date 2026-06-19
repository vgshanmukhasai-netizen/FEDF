import { useState } from 'react'
import { BT_DEVICES } from '../utils/constants'

export default function BluetoothModal({ patients, onClose, onConnect, onToast }) {
  const [devices,   setDevices]   = useState([])
  const [scanning,  setScanning]  = useState(false)
  const [connected, setConnected] = useState([])

  async function scan() {
    setScanning(true)
    setDevices([])

    if (navigator.bluetooth) {
      try {
        const dev = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['heart_rate','health_thermometer','blood_pressure','pulse_oximeter'],
        })
        setScanning(false)
        setDevices([{ name: dev.name || 'Unknown Device', id: dev.id, sub: 'Real BT Device' }])
        return
      } catch {}
    }

    await new Promise(r => setTimeout(r, 2000))
    setScanning(false)
    setDevices(BT_DEVICES.map(d => ({
      name: d.name,
      id: 'sim-' + Math.random().toString(36).slice(2),
      sub: `${d.type} · Signal: ${d.sig} dBm`,
    })))
  }

  function connect(dev) {
    const free = patients.find(p => !p.btDevice)
    if (!free) { onToast?.('All beds already have connected devices.', 'warn'); return }
    const info = { name: dev.name, id: dev.id }
    onConnect(info)
    setConnected(prev => [...prev, { ...info, bed: free.bed, patientName: free.name }])
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-hdr">
          <h2>🔵 Bluetooth Device Manager</h2>
          <button className="modal-cls" onClick={onClose}>✕</button>
        </div>

        <button
          className={`bt-scan-btn ${scanning ? 'scanning' : ''}`}
          onClick={scan} disabled={scanning}>
          {scanning ? '📡 Scanning…' : '📡 Scan for Devices'}
        </button>

        <div id="btDeviceList">
          {devices.length === 0 && !scanning
            ? <p className="bt-hint">Click Scan to discover nearby ICU devices</p>
            : devices.map(d => (
                <div key={d.id} className="bt-dev">
                  <div>
                    <div className="bt-dev-name">🔵 {d.name}</div>
                    <div className="bt-dev-sig">{d.sub}</div>
                  </div>
                  <button className="bt-conn-btn" onClick={() => connect(d)}>Connect</button>
                </div>
              ))
          }
        </div>

        {connected.length > 0 && (
          <div id="btConnectedSection">
            <div style={{ fontFamily:'var(--fh)', fontSize:'.7rem', color:'var(--green)', marginBottom:'8px', letterSpacing:'2px' }}>✅ CONNECTED DEVICES</div>
            {connected.map((c, i) => (
              <div key={i} style={{ fontSize:'.78rem', color:'var(--green)', padding:'5px 0' }}>
                ✅ {c.name} → {c.bed} ({c.patientName})
              </div>
            ))}
          </div>
        )}

        <div className="bt-info">
          <p>⚠️ Supports: ESP32, Pulse Oximeters, BT Heart Rate Monitors, Smart BP Cuffs</p>
          <p>Data auto-syncs to the next available patient bed on connect.</p>
        </div>
      </div>
    </div>
  )
}