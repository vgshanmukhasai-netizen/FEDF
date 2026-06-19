import { useRef, useCallback } from 'react'

export function useAlarm() {
  const ctxRef    = useRef(null)
  const activeRef = useRef(false)

  const play = useCallback(() => {
    if (activeRef.current) return
    activeRef.current = true
    try {
      const actx = new (window.AudioContext || window.webkitAudioContext)()
      ctxRef.current = actx
      function beep() {
        if (!activeRef.current) return
        const osc  = actx.createOscillator()
        const gain = actx.createGain()
        osc.connect(gain); gain.connect(actx.destination)
        osc.type = 'square'; osc.frequency.value = 880
        gain.gain.setValueAtTime(.25, actx.currentTime)
        gain.gain.exponentialRampToValueAtTime(.001, actx.currentTime + .3)
        osc.start(); osc.stop(actx.currentTime + .3)
        setTimeout(beep, 700)
      }
      beep()
    } catch {}
  }, [])

  const stop = useCallback(() => {
    activeRef.current = false
    if (ctxRef.current) {
      try { ctxRef.current.close() } catch {}
      ctxRef.current = null
    }
  }, [])

  return { play, stop }
}