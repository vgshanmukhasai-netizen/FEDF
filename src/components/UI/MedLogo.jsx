// Small version of the circular ICU logo — used inside login card
import { useEffect, useRef } from 'react'

export default function MedLogo({ size = 52 }) {
  const heartRef = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    let t = 0
    function tick() {
      t += 0.04
      const beat =
        Math.max(0, Math.sin(t * 3.2) * 0.55) +
        Math.max(0, Math.sin(t * 6.4 - 1.2) * 0.22)
      if (heartRef.current) {
        const s = 1 + beat * 0.20
        heartRef.current.setAttribute(
          'transform',
          `translate(50,42) scale(${s}) translate(-50,-42)`
        )
      }
      frameRef.current = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  return (
    <svg
      viewBox="0 0 100 100"
      width={size} height={size}
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="smCyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"  stopColor="#00F5FF" stopOpacity="0.95"/>
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1"/>
          <stop offset="100%" stopColor="#00C8FF" stopOpacity="0.90"/>
        </linearGradient>
        <linearGradient id="smGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#00FF88" stopOpacity="0.90"/>
          <stop offset="100%" stopColor="#00CC66" stopOpacity="0.85"/>
        </linearGradient>
        <filter id="smGlow">
          <feGaussianBlur stdDeviation="1.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Background disc */}
      <circle cx="50" cy="50" r="46"
        fill="rgba(0,10,40,0.60)"/>

      {/* Outer cyan ring */}
      <circle cx="50" cy="50" r="46"
        fill="none" stroke="url(#smCyan)" strokeWidth="2.5"
        filter="url(#smGlow)"/>

      {/* Inner green ring */}
      <circle cx="50" cy="50" r="38"
        fill="none" stroke="url(#smGreen)" strokeWidth="1.8"
        filter="url(#smGlow)"/>

      {/* ECG line */}
      <polyline
        className="icu-ecg-anim"
        points="14,50 22,50 26,50 30,38 34,62 38,30 42,68 47,50 50,50 54,50 58,42 62,58 66,50 78,50"
        fill="none" stroke="url(#smCyan)" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"
        filter="url(#smGlow)"/>

      {/* Heart */}
      <path
        ref={heartRef}
        d="M43,40 C43,34 50,32 50,37 C50,32 57,34 57,40 C57,47 50,53 50,53 C50,53 43,47 43,40 Z"
        fill="none"
        stroke="url(#smCyan)" strokeWidth="1.8"
        strokeLinejoin="round"
        filter="url(#smGlow)"/>

      {/* Text arc */}
      <path id="smArc" d="M 8,50 A 42,42 0 0,0 92,50" fill="none"/>
      <text
        fontFamily="'Orbitron', sans-serif"
        fontSize="7" fontWeight="700" letterSpacing="1"
        fill="white" filter="url(#smGlow)"
      >
        <textPath href="#smArc" startOffset="50%" textAnchor="middle">
          ICU MONITORING SYSTEM
        </textPath>
      </text>
    </svg>
  )
}