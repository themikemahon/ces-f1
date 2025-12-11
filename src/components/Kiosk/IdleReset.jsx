import { useEffect, useState } from 'react'

export function IdleReset({ onReset, timeout = 60000 }) {
  const [timeLeft, setTimeLeft] = useState(null)
  const [lastActivity, setLastActivity] = useState(Date.now())

  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now())
      setTimeLeft(null)
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    const interval = setInterval(() => {
      const now = Date.now()
      const timeSinceActivity = now - lastActivity
      
      if (timeSinceActivity >= timeout) {
        onReset()
        setLastActivity(now)
        setTimeLeft(null)
      } else if (timeSinceActivity >= timeout - 10000) {
        // Show countdown in last 10 seconds
        setTimeLeft(Math.ceil((timeout - timeSinceActivity) / 1000))
      }
    }, 1000)

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
      clearInterval(interval)
    }
  }, [lastActivity, timeout, onReset])

  if (timeLeft === null) return null

  return (
    <div className="idle-overlay">
      <div className="idle-modal">
        <h3 className="idle-title">Returning to start...</h3>
        <div className="idle-countdown">{timeLeft}</div>
        <p className="idle-instruction">Touch screen to continue</p>
      </div>
    </div>
  )
}