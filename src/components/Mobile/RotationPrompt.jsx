import { useState, useEffect } from 'react'

export function RotationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const checkOrientation = () => {
      // Show prompt if on mobile and in portrait mode
      const isMobile = window.innerWidth <= 768
      const isPortrait = window.innerHeight > window.innerWidth
      setShowPrompt(isMobile && isPortrait)
    }

    // Check on mount
    checkOrientation()

    // Listen for orientation changes
    window.addEventListener('resize', checkOrientation)
    window.addEventListener('orientationchange', checkOrientation)

    return () => {
      window.removeEventListener('resize', checkOrientation)
      window.removeEventListener('orientationchange', checkOrientation)
    }
  }, [])

  if (!showPrompt) return null

  return (
    <div className="rotation-prompt-overlay">
      <div className="rotation-prompt">
        <div className="rotation-icon">
          <svg width="48" height="48" viewBox="0 0 120 120" fill="currentColor">
            <g transform="translate(60, 60)">
              <g transform="translate(-50.67, -65.18)">
                <path d="M53.85,86.24v13.96c12-.12,24.19-9.29,29-20.1,5.45-12.25,3.96-26.52-4.59-36.96-1.52-1.85-3.83-3.26-4.93-5.43.11-.67,9.61-7.63,10.76-8.22,2.32-1.19,3.1.5,4.65,2.18,15.42,16.78,16.65,43.55,3.91,62.2-8.67,12.69-20.25,18.84-35.11,21.72-1.28.25-2.83-.41-3.68.81v13.46l-.99.51-29.4-21.94,30.4-22.18Z"/>
                <path d="M47.87,44.36v-13.21c-3.06-1.79-9.44.77-12.65,2.3-23.28,11.12-26.42,43.24-6.8,59.51-3.71,1.9-7.96,6.8-11.48,8.45-.57.27-1.31.51-1.89.17-5.52-6.29-10.15-12.86-12.68-20.96C-7.6,48.61,15.02,17.08,47.87,14.46V0l29.91,22.66-29.91,21.7Z"/>
              </g>
            </g>
          </svg>
        </div>
        
        <h2 className="rotation-title">A Better Experience Awaits</h2>
        <p className="rotation-message">
          Rotate your device to landscape mode for the optimal McLaren F1 experience
        </p>
        
        <div className="rotation-animation">
          <div className="phone-portrait">
            <div className="phone-body">
              <div className="phone-screen"></div>
            </div>
          </div>
          <div className="arrow-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14"/>
              <path d="M12 5l7 7-7 7"/>
            </svg>
          </div>
          <div className="phone-landscape">
            <div className="phone-body landscape">
              <div className="phone-screen"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}