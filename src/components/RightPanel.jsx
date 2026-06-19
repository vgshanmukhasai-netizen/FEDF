import { useRef, useImperativeHandle } from 'react'
import AriaAssistant from './AriaAssistant'
import VitalsChart   from './VitalsChart'
import EmergencyFeed from './EmergencyFeed'

export default function RightPanel({ patients, chartHistories, alerts, aiMsgRef }) {
  const ariaRef = useRef(null)

  // Expose pushAiMsg to parent via aiMsgRef
  useImperativeHandle(aiMsgRef, () => (text, type) => {
    ariaRef.current?.pushMsg(text, type)
  })

  return (
    <div className="right-panel">
      <AriaAssistant ref={ariaRef} patients={patients} />
      <VitalsChart patients={patients} chartHistories={chartHistories} />
      <EmergencyFeed alerts={alerts} />
    </div>
  )
}