import { useEffect, useRef } from 'react'

// ICU Monitoring System — circular neon logo matching Image 1
// Cyan outer ring + green inner ring + ECG + heart + ventilator + stethoscope
export default function StethoscopeLogo({ size = 1, animate = true }) {
  const heartRef      = useRef(null)
  const heartGlowRef  = useRef(null)
  const outerRingRef  = useRef(null)
  const innerRingRef  = useRef(null)
  const ecgRef        = useRef(null)
  const frameRef      = useRef(null)

  useEffect(() => {
    if (!animate) return
    let t = 0

    function tick() {
      t += 0.035

      // Heartbeat double-bump
      const beat =
        Math.max(0, Math.sin(t * 3.2) * 0.60) +
        Math.max(0, Math.sin(t * 6.4 - 1.2) * 0.28)

      // Heart pulse
      if (heartRef.current) {
        const s = 1 + beat * 0.22
        heartRef.current.setAttribute(
          'transform',
          `translate(200,165) scale(${s}) translate(-200,-165)`
        )
      }

      // Heart glow pulse
      if (heartGlowRef.current) {
        heartGlowRef.current.style.opacity = String(0.20 + beat * 0.55)
      }

      // Outer ring brightness pulse
      if (outerRingRef.current) {
        const b = 0.70 + beat * 0.30
        outerRingRef.current.style.filter =
          `drop-shadow(0 0 ${6 + beat * 10}px rgba(0,245,255,${b})) drop-shadow(0 0 ${14 + beat * 18}px rgba(0,200,255,${b * 0.50}))`
      }

      // Inner ring green pulse
      if (innerRingRef.current) {
        const g = 0.55 + beat * 0.35
        innerRingRef.current.style.filter =
          `drop-shadow(0 0 ${4 + beat * 7}px rgba(0,255,128,${g}))`
      }

      frameRef.current = requestAnimationFrame(tick)
    }

    tick()
    return () => cancelAnimationFrame(frameRef.current)
  }, [animate])

  const W = Math.round(360 * size)
  const H = Math.round(420 * size)

  return (
    <svg
      viewBox="0 0 400 470"
      width={W} height={H}
      xmlns="http://www.w3.org/2000/svg"
      className="icu-circle-logo"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Cyan gradient — outer ring */}
        <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#00F5FF" stopOpacity="0.95"/>
          <stop offset="50%"  stopColor="#FFFFFF" stopOpacity="1.00"/>
          <stop offset="100%" stopColor="#00C8FF" stopOpacity="0.90"/>
        </linearGradient>

        {/* Green gradient — inner ring */}
        <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#00FF88" stopOpacity="0.90"/>
          <stop offset="50%"  stopColor="#AAFFCC" stopOpacity="1.00"/>
          <stop offset="100%" stopColor="#00DD66" stopOpacity="0.85"/>
        </linearGradient>

        {/* Heart fill — cyan */}
        <radialGradient id="heartCyan" cx="38%" cy="32%" r="65%">
          <stop offset="0%"   stopColor="#AAFFFF"/>
          <stop offset="45%"  stopColor="#00D8FF"/>
          <stop offset="100%" stopColor="#0088CC"/>
        </radialGradient>

        {/* Cyan neon glow filter */}
        <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3"  result="b1"/>
          <feGaussianBlur in="SourceGraphic" stdDeviation="8"  result="b2"/>
          <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="b3"/>
          <feMerge>
            <feMergeNode in="b3"/>
            <feMergeNode in="b2"/>
            <feMergeNode in="b1"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Green glow filter */}
        <filter id="greenGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3"  result="b1"/>
          <feGaussianBlur in="SourceGraphic" stdDeviation="9"  result="b2"/>
          <feMerge>
            <feMergeNode in="b2"/>
            <feMergeNode in="b1"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Heart glow filter */}
        <filter id="heartGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5"  result="b1"/>
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="b2"/>
          <feMerge>
            <feMergeNode in="b2"/>
            <feMergeNode in="b1"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Floor reflection gradient */}
        <linearGradient id="reflectFade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#00C8FF" stopOpacity="0.20"/>
          <stop offset="100%" stopColor="#00C8FF" stopOpacity="0"/>
        </linearGradient>

        {/* Circle clip */}
        <clipPath id="circleClip">
          <circle cx="200" cy="200" r="160"/>
        </clipPath>
      </defs>

      {/* ════════════════════════
          BACKGROUND GLOW DISC
      ════════════════════════ */}
      <circle cx="200" cy="200" r="168"
        fill="rgba(0,20,60,0.55)"
        stroke="none"/>

      {/* Subtle inner radial glow */}
      <circle cx="200" cy="200" r="150"
        fill="none"
        stroke="rgba(0,200,255,0.06)"
        strokeWidth="60"/>

      {/* ════════════════════════
          OUTER CYAN RING
      ════════════════════════ */}
      <circle
        ref={outerRingRef}
        cx="200" cy="200" r="182"
        fill="none"
        stroke="url(#cyanGrad)"
        strokeWidth="4.5"
        style={{
          filter:
            'drop-shadow(0 0 8px rgba(0,245,255,0.80)) drop-shadow(0 0 18px rgba(0,200,255,0.45))',
        }}
      />
      {/* Outer ring inner highlight */}
      <circle cx="200" cy="200" r="182"
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.2"/>

      {/* ════════════════════════
          INNER GREEN RING
      ════════════════════════ */}
      <circle
        ref={innerRingRef}
        cx="200" cy="200" r="154"
        fill="none"
        stroke="url(#greenGrad)"
        strokeWidth="3"
        style={{
          filter: 'drop-shadow(0 0 5px rgba(0,255,128,0.65))',
        }}
      />

      {/* ════════════════════════
          VENTILATOR / BREATHING
          DEVICE — left side
      ════════════════════════ */}
      {/* Main body */}
      <rect x="60" y="148" width="28" height="42" rx="6"
        fill="none" stroke="url(#cyanGrad)" strokeWidth="2.5"
        filter="url(#cyanGlow)"/>
      {/* Corrugated tube segments */}
      <line x1="74" y1="148" x2="74" y2="140" stroke="url(#cyanGrad)" strokeWidth="2.5" strokeLinecap="round" filter="url(#cyanGlow)"/>
      <line x1="74" y1="140" x2="88" y2="128" stroke="url(#cyanGrad)" strokeWidth="2.5" strokeLinecap="round" filter="url(#cyanGlow)"/>
      <rect x="62" y="154" width="24" height="3" rx="1.5" fill="rgba(0,245,255,0.20)"/>
      <rect x="62" y="162" width="24" height="3" rx="1.5" fill="rgba(0,245,255,0.20)"/>
      <rect x="62" y="170" width="24" height="3" rx="1.5" fill="rgba(0,245,255,0.20)"/>
      {/* Connector plug */}
      <rect x="66" y="188" width="16" height="10" rx="3"
        fill="none" stroke="url(#cyanGrad)" strokeWidth="2" filter="url(#cyanGlow)"/>
      <line x1="74" y1="198" x2="74" y2="210" stroke="url(#cyanGrad)" strokeWidth="2.5" strokeLinecap="round" filter="url(#cyanGlow)"/>
      {/* Connector end */}
      <rect x="68" y="208" width="12" height="7" rx="3"
        fill="url(#cyanGrad)" opacity="0.7" filter="url(#cyanGlow)"/>

      {/* ════════════════════════
          ECG LINE — across middle
      ════════════════════════ */}
      {/* Single animated ECG trace */}
      <polyline
        ref={ecgRef}
        className="icu-ecg-anim"
        points="100,195 122,195 132,195 140,165 148,225 156,140 164,252 174,195 192,195 200,195 208,195 218,175 226,215 232,195 252,195 275,195"
        fill="none"
        stroke="url(#cyanGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#cyanGlow)"
      />

      {/* ════════════════════════
          HEART — centre
      ════════════════════════ */}
      {/* Glow layer */}
      <path
        ref={heartGlowRef}
        d="M183,152 C183,140 196,135 200,145 C204,135 217,140 217,152 C217,166 200,178 200,178 C200,178 183,166 183,152 Z"
        fill="rgba(0,220,255,0.22)"
        filter="url(#heartGlow)"
        style={{ opacity: 0.25 }}
      />
      {/* Heart outline — cyan */}
      <path
        ref={heartRef}
        d="M183,152 C183,140 196,135 200,145 C204,135 217,140 217,152 C217,166 200,178 200,178 C200,178 183,166 183,152 Z"
        fill="none"
        stroke="url(#cyanGrad)"
        strokeWidth="2.8"
        strokeLinejoin="round"
        filter="url(#cyanGlow)"
      />
      {/* Heart specular */}
      <ellipse cx="193" cy="148" rx="4.5" ry="3"
        fill="rgba(255,255,255,0.30)"
        transform="rotate(-20,193,148)"/>

      {/* ════════════════════════
          STETHOSCOPE — right side
      ════════════════════════ */}
      {/* Ear tips */}
      <circle cx="298" cy="132" r="5"
        fill="none" stroke="url(#greenGrad)" strokeWidth="2"
        filter="url(#greenGlow)"/>
      <circle cx="318" cy="148" r="5"
        fill="none" stroke="url(#greenGrad)" strokeWidth="2"
        filter="url(#greenGlow)"/>
      {/* Ear arch */}
      <path d="M298,132 Q312,122 318,148"
        fill="none" stroke="url(#greenGrad)" strokeWidth="2.5"
        strokeLinecap="round" filter="url(#greenGlow)"/>
      {/* Tube down */}
      <path d="M308,154 C310,168 310,182 304,194 C299,205 290,210 282,210"
        fill="none" stroke="url(#greenGrad)" strokeWidth="2.5"
        strokeLinecap="round" filter="url(#greenGlow)"/>
      {/* Chest piece */}
      <circle cx="278" cy="214" r="10"
        fill="none" stroke="url(#greenGrad)" strokeWidth="2.5"
        filter="url(#greenGlow)"/>
      <circle cx="278" cy="214" r="5"
        fill="rgba(0,255,128,0.12)"
        stroke="url(#greenGrad)" strokeWidth="1.5"
        filter="url(#greenGlow)"/>

      {/* ════════════════════════
          CURVED TEXT — bottom arc
          "ICU MONITORING SYSTEM"
      ════════════════════════ */}
      <path
        id="textArc"
        d="M 46,200 A 154,154 0 0,0 354,200"
        fill="none"
      />
      <text
        fontFamily="'Orbitron', sans-serif"
        fontSize="19"
        fontWeight="700"
        letterSpacing="3"
        fill="white"
        filter="url(#cyanGlow)"
      >
        <textPath
          href="#textArc"
          startOffset="50%"
          textAnchor="middle"
        >
          ICU MONITORING SYSTEM
        </textPath>
      </text>

      {/* ════════════════════════
          FLOOR REFLECTION
      ════════════════════════ */}
      {/* Reflected circle — flipped, faded */}
      <g transform="translate(200,400) scale(1,-0.22) translate(-200,0)">
        <circle cx="200" cy="200" r="182"
          fill="none"
          stroke="url(#cyanGrad)"
          strokeWidth="4"
          opacity="0.18"/>
        <circle cx="200" cy="200" r="154"
          fill="none"
          stroke="url(#greenGrad)"
          strokeWidth="2.5"
          opacity="0.12"/>
        <text
          fontFamily="'Orbitron', sans-serif"
          fontSize="19" fontWeight="700" letterSpacing="3"
          fill="rgba(0,200,255,0.22)" textAnchor="middle"
          x="200" y="365"
        >
          ICU MONITORING SYSTEM
        </text>
      </g>

      {/* Floor glow ellipse */}
      <ellipse cx="200" cy="398" rx="130" ry="14"
        fill="url(#reflectFade)"
        style={{ filter: 'blur(6px)' }}/>
    </svg>
  )
}