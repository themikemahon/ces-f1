import { useState } from 'react'

export function PasswordGate({ onUnlock }) {
  const [password, setPassword] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  
  const correctPassword = 'mclaren2025' // This should be configurable

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (password === correctPassword) {
      onUnlock()
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      
      if (newAttempts >= 3) {
        setIsLocked(true)
        setTimeout(() => {
          setIsLocked(false)
          setAttempts(0)
        }, 300000) // 5 minutes
      }
      
      setPassword('')
    }
  }

  if (isLocked) {
    return (
      <div className="password-gate">
        <div className="password-form">
          <h2 className="password-title">Access Temporarily Locked</h2>
          <p style={{textAlign: 'center', color: '#666'}}>Too many failed attempts. Please wait 5 minutes.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="password-gate">
      <div className="password-form">
        <h2 className="password-title">Enter Access Code</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="password-input"
            placeholder="Enter password"
            autoFocus
          />
          <button
            type="submit"
            className="password-submit"
          >
            Unlock Experience
          </button>
        </form>
        {attempts > 0 && (
          <p className="password-error">
            Incorrect password. {3 - attempts} attempts remaining.
          </p>
        )}
      </div>
    </div>
  )
}