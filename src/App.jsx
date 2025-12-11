import { useState, useRef } from 'react'
import { Scene } from './components/3D/Scene'
import { QRCodeComponent } from './components/UI/QRCode'
import { NavigationBar } from './components/UI/NavigationBar'
import { LoadingScreen } from './components/UI/LoadingScreen'
import { FocusPanel } from './components/UI/FocusPanel'

import { PasswordGate } from './components/Kiosk/PasswordGate'
import { IdleReset } from './components/Kiosk/IdleReset'
import './App.css'

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [focusHotspot, setFocusHotspot] = useState(null)
  const sceneRef = useRef()

  const handleReset = () => {
    setFocusHotspot(null)
    if (window.resetCamera) {
      window.resetCamera()
    }
  }

  const handleHotspotClick = (hotspot) => {
    setFocusHotspot(hotspot)
  }

  const handleCloseFocus = () => {
    setFocusHotspot(null)
  }

  const handleUnlock = () => {
    setIsUnlocked(true)
    // Enter fullscreen mode
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen()
    }
  }

  const handleLoadComplete = () => {
    setIsLoaded(true)
  }

  if (!isUnlocked) {
    return <PasswordGate onUnlock={handleUnlock} />
  }

  if (!isLoaded) {
    return <LoadingScreen onComplete={handleLoadComplete} />
  }

  return (
    <div className="app">
      <div className={`scene-container ${focusHotspot ? 'focus-mode' : ''}`} ref={sceneRef}>
        <Scene 
          focusMode={!!focusHotspot}
          focusHotspot={focusHotspot}
          onCameraReset={handleReset}
          onHotspotClick={handleHotspotClick}
        />
      </div>
      
      {focusHotspot && (
        <FocusPanel 
          hotspot={focusHotspot} 
          onClose={handleCloseFocus}
        />
      )}
      
      <div className="ui-overlay">
        <header className="header">
          <div className="logo-container">
            <h1 className="title">McLaren F1 Experience</h1>
            <p className="subtitle">Powered by Green Consulting</p>
          </div>
        </header>
        
        <NavigationBar onReset={handleReset} />
        {!focusHotspot && <QRCodeComponent />}
      </div>
      
      <IdleReset onReset={handleReset} timeout={60000} />
    </div>
  )
}

export default App
