import { useState, useEffect } from 'react'

export function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 500) // Small delay before showing main app
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div>
          <h1 className="loading-title">McLaren F1</h1>
          <p className="loading-subtitle">Interactive Experience</p>
        </div>
        
        <div className="loading-bar">
          <div 
            className="loading-progress"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="loading-text">Loading 3D Experience... {progress}%</p>
      </div>
    </div>
  )
}