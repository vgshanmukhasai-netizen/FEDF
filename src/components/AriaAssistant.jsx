import { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { processQuery } from '../utils/ai'

const INIT_MSG = { id: 0, text: 'ARIA online. Monitoring all ICU patients in real-time. Ask me anything about patient status or request analysis.', type: 'ai' }

const AriaAssistant = forwardRef(function AriaAssistant({ patients }, ref) {
  const [messages, setMessages] = useState([INIT_MSG])
  const [input,    setInput]    = useState('')
  const msgsEndRef = useRef(null)

  function scrollBottom() {
    setTimeout(() => msgsEndRef.current?.scrollIntoView({ behavior:'smooth' }), 50)
  }

  function pushMsg(text, type = 'ai') {
    setMessages(prev => {
      const next = [...prev, { id: Date.now() + Math.random(), text, type }]
      return next.slice(-22)
    })
    scrollBottom()
  }

  useImperativeHandle(ref, () => ({ pushMsg }))

  function sendMsg(text) {
    if (!text.trim()) return
    pushMsg(text, 'user')
    setInput('')
    setTimeout(() => pushMsg(processQuery(text, patients)), 600)
  }

  const QUICK = [
    'Analyze all critical patients',
    'Who needs immediate attention?',
    'Give overall ICU summary',
    'Check SpO2 levels',
  ]

  return (
    <div className="ai-panel">
      <div className="ai-ph">
        <span style={{ fontSize:'1.4rem' }}>🧠</span>
        <div>
          <h3>ARIA <span className="ai-badge">AI</span></h3>
          <p>Adaptive Response Intelligence Assistant</p>
        </div>
        <div className="ai-sdot"></div>
      </div>
      <div className="ai-msgs">
        {messages.map(m => (
          <div key={m.id} className={`ai-msg ${m.type}`}>
            <span className="ai-mico">{m.type==='user'?'👤':m.type==='ca'?'🚨':'🤖'}</span>
            <div className="ai-mtxt">{m.text}</div>
          </div>
        ))}
        <div ref={msgsEndRef}/>
      </div>
      <div className="ai-inp">
        <input
          type="text" placeholder="Ask ARIA about patients…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==='Enter' && sendMsg(input)}
        />
        <button onClick={() => sendMsg(input)}>▶</button>
      </div>
      <div className="ai-qbtns">
        {QUICK.map(q => (
          <button key={q} onClick={() => sendMsg(q)}>{q}</button>
        ))}
      </div>
    </div>
  )
})

export default AriaAssistant