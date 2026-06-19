import { useEffect, useRef, useState } from 'react'
import Chart from 'chart.js/auto'
import { CHART_COLORS } from '../utils/constants'

const TABS = [
  { key:'hr',   label:'Heart Rate'    },
  { key:'spo2', label:'SpO₂'         },
  { key:'bp',   label:'Blood Pressure'},
  { key:'temp', label:'Temperature'  },
]

export default function VitalsChart({ patients, chartHistories }) {
  const canvasRef  = useRef(null)
  const chartRef   = useRef(null)
  const [active, setActive] = useState('hr')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null }
    const ctx = canvas.getContext('2d')
    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: { labels: [], datasets: [] },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { display: false },
          y: {
            grid:   { color: 'rgba(0,180,255,.1)' },
            ticks:  { color: '#5a8aaa', font: { size: 10 } },
            border: { color: 'rgba(0,180,255,.2)' },
          },
        },
        elements: { point: { radius: 0 }, line: { tension: .4, borderWidth: 2 } },
      },
    })
    return () => { chartRef.current?.destroy(); chartRef.current = null }
  }, [])

  useEffect(() => {
    if (!chartRef.current || !patients.length) return
    const dataKey = active==='bp' ? 'sbp' : active
    const refBed  = patients[0]?.bed
    if (!refBed || !chartHistories[refBed]) return
    chartRef.current.data.labels   = chartHistories[refBed].labels
    chartRef.current.data.datasets = patients.map((p, i) => ({
      label: p.name,
      data:  (chartHistories[p.bed] || { hr:[] })[dataKey] || [],
      borderColor:     CHART_COLORS[i % CHART_COLORS.length],
      backgroundColor: CHART_COLORS[i % CHART_COLORS.length] + '18',
      fill: false,
    }))
    chartRef.current.update('none')
  }, [active, patients, chartHistories])

  return (
    <div className="charts-panel">
      <div className="chart-tabs">
        {TABS.map(t => (
          <button key={t.key}
            className={`chart-tab ${active===t.key?'active':''}`}
            onClick={() => setActive(t.key)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="chart-wrap">
        <canvas ref={canvasRef}></canvas>
      </div>
      <div className="chart-leg">
        {patients.map((p, i) => (
          <span key={p.id} className="leg-item">
            <span className="leg-dot" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}></span>
            {p.name.split(' ')[0]}
          </span>
        ))}
      </div>
    </div>
  )
}