import React, { useEffect, useRef } from 'react'

const ECGCanvas = () => {
  const canvasRef = useRef(null)
  const requestRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let frame = 0

    const draw = () => {
      if (!ctx) return
      const width = canvas.width
      const height = canvas.height
      ctx.clearRect(0, 0, width, height)
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 2
      ctx.beginPath()
      const amplitude = 20
      const offset = height / 2
      for (let x = 0; x <= width; x += 5) {
        const y = offset + Math.sin((x + frame) * 0.045) * amplitude
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
      frame += 2
      requestRef.current = requestAnimationFrame(draw)
    }

    requestRef.current = requestAnimationFrame(draw)
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [])

  return <canvas ref={canvasRef} width={320} height={100} className="ecg-canvas" aria-label="ECG waveform" />
}

export default ECGCanvas
