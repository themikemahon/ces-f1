import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer, ContactShadows, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Porsche911 } from './components/3D/Porsche911_Lambo_Style'
import { F1CarGeometry } from './components/3D/F1CarGeometry'
import { Hotspots } from './components/3D/Hotspots'
import { QRCodeComponent } from './components/UI/QRCode'
import { NavigationBar } from './components/UI/NavigationBar'
import { LoadingScreen } from './components/UI/LoadingScreen'
import { FocusPanel } from './components/UI/FocusPanel'
import { ModelSelector } from './components/UI/ModelSelector'
import { PasswordGate } from './components/Kiosk/PasswordGate'
import { IdleReset } from './components/Kiosk/IdleReset'
import { RotationPrompt } from './components/Mobile/RotationPrompt'
import './App.css'

// Post-processing effects - subtle bloom including orange paint
function Effects() {
  return (
    <EffectComposer>
      <Bloom 
        luminanceThreshold={0.6} 
        mipmapBlur 
        luminanceSmoothing={0.4} 
        intensity={1.2} 
      />
    </EffectComposer>
  )
}

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [focusHotspot, setFocusHotspot] = useState(null)
  const [isExitingFocus, setIsExitingFocus] = useState(false)
  const [selectedModel, setSelectedModel] = useState('f1-geometry')
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const controlsRef = useRef()

  // Reusable smooth camera animation with distance-based timing
  const animateCamera = (targetPos, targetLookAt, callback = null) => {
    if (!controlsRef.current) return
    
    const startPos = controlsRef.current.object.position.clone()
    const startTarget = controlsRef.current.target.clone()
    
    // Calculate distance to determine duration (same speed, variable time)
    const positionDistance = startPos.distanceTo(targetPos)
    const targetDistance = startTarget.distanceTo(targetLookAt)
    const maxDistance = Math.max(positionDistance, targetDistance)
    
    // Base speed: 10 units per second, minimum 800ms, maximum 3000ms
    const baseSpeed = 10
    const duration = Math.min(3000, Math.max(800, (maxDistance / baseSpeed) * 1000))
    
    const startTime = performance.now()
    
    const animate = () => {
      const elapsed = performance.now() - startTime
      const progress = Math.min(1, elapsed / duration)
      const easeProgress = 1 - Math.pow(1 - progress, 3) // Smooth easing
      
      if (progress < 1) {
        controlsRef.current.object.position.lerpVectors(startPos, targetPos, easeProgress)
        controlsRef.current.target.lerpVectors(startTarget, targetLookAt, easeProgress)
        controlsRef.current.update()
        requestAnimationFrame(animate)
      } else {
        controlsRef.current.object.position.copy(targetPos)
        controlsRef.current.target.copy(targetLookAt)
        controlsRef.current.update()
        if (callback) callback()
      }
    }
    animate()
  }

  const handleReset = () => {
    // If in focus mode, use the smooth close animation
    if (focusHotspot) {
      handleCloseFocus()
      return
    }
    
    // Otherwise just reset camera position
    if (controlsRef.current) {
      const currentPos = controlsRef.current.object.position.clone()
      const currentTarget = controlsRef.current.target.clone()
      
      // Calculate direction from target to camera and set distance to 15
      const direction = currentPos.clone().sub(currentTarget).normalize()
      const targetPos = currentTarget.clone().add(direction.multiplyScalar(15))
      const targetLookAt = new THREE.Vector3(0, 0, 0)
      
      animateCamera(targetPos, targetLookAt)
    }
  }

  const handleHotspotClick = (hotspot) => {
    setFocusHotspot(hotspot)
    
    // Smooth camera animation to focus on hotspot
    const hotspotPos = new THREE.Vector3(...hotspot.position)
    
    // Calculate camera offset based on hotspot type (closer for better zoom)
    let cameraOffset
    switch (hotspot.id) {
      case 'front-wing':
        cameraOffset = new THREE.Vector3(0, 1, 4)
        break
      case 'rear-wing':
        cameraOffset = new THREE.Vector3(0, 2, -4)
        break
      case 'cockpit':
        cameraOffset = new THREE.Vector3(-3, 2, 1)
        break
      case 'engine':
        cameraOffset = new THREE.Vector3(0, 2, -3)
        break
      case 'wheel-front-right':
        cameraOffset = new THREE.Vector3(3, 1, 2)
        break
      default:
        cameraOffset = new THREE.Vector3(0, 2, 4)
    }
    
    const targetPos = hotspotPos.clone().add(cameraOffset)
    const targetLookAt = hotspotPos.clone()
    animateCamera(targetPos, targetLookAt)
  }

  const handleCloseFocus = () => {
    // Start exit animation
    setIsExitingFocus(true)
    
    // Start camera animation immediately
    const currentPos = controlsRef.current?.object.position.clone()
    const currentTarget = controlsRef.current?.target.clone()
    
    if (currentPos && currentTarget) {
      const direction = currentPos.clone().sub(currentTarget).normalize()
      const targetPos = currentTarget.clone().add(direction.multiplyScalar(15))
      const targetLookAt = new THREE.Vector3(0, 0, 0)
      animateCamera(targetPos, targetLookAt)
    }
    
    // Remove focus panel after animation completes
    setTimeout(() => {
      setFocusHotspot(null)
      setIsExitingFocus(false)
    }, 600) // Match the CSS animation duration
  }

  const handleUnlock = () => {
    setIsUnlocked(true)
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
      <RotationPrompt />
      <Canvas 
        gl={{ logarithmicDepthBuffer: true, antialias: false }} 
        dpr={[1, 1.5]} 
        camera={{ position: [0, 0, 15], fov: 25 }}
        style={{ width: '100%', height: '100vh' }}
      >
        {/* Black background that fades from gray floor */}
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 8, 25]} />
        
        {/* Dynamic car model based on selection */}
        {selectedModel === 'f1-geometry' ? (
          <F1CarGeometry 
            rotation={[0, Math.PI / 1.5, 0]} 
            scale={1.25} 
            position={[0, -0.58, 0]}
          />
        ) : (
          <Porsche911 
            rotation={[0, Math.PI / 1.5, 0]} 
            scale={0.015} 
          />
        )}
        
        {/* Diffuse lighting to avoid harsh reflections */}
        <hemisphereLight intensity={1.2} />
        
        {/* High, wide-angle lights to minimize floor reflections */}
        <directionalLight 
          position={[0, 20, 0]} 
          intensity={0.6}
          target-position={[0, -1.16, 0]}
        />
        
        {/* Angled side lighting from high positions */}
        <directionalLight 
          position={[15, 15, 10]} 
          intensity={0.3}
          target-position={[0, -1.16, 0]}
        />
        <directionalLight 
          position={[-15, 15, 10]} 
          intensity={0.3}
          target-position={[0, -1.16, 0]}
        />
        
        {/* Soft ambient fill */}
        <ambientLight intensity={0.4} />
        
        {/* Darker studio floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.16, 0]} receiveShadow>
          <planeGeometry args={[100, 100, 32, 32]} />
          <meshStandardMaterial 
            color="#3a3a3a"
            roughness={0.2}
            metalness={0.6}
            envMapIntensity={1.5}
          />
        </mesh>
        
        {/* Contact shadows for depth */}
        <ContactShadows 
          resolution={1024} 
          frames={1} 
          position={[0, -1.15, 0]} 
          scale={15} 
          blur={0.5} 
          opacity={0.8} 
          far={20} 
        />
        

        
        {/* High-resolution environment for better reflections */}
        <Environment resolution={1024}>
          {/* Ceiling */}
          <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -9]} scale={[10, 1, 1]} />
          <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -6]} scale={[10, 1, 1]} />
          <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -3]} scale={[10, 1, 1]} />
          <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 0]} scale={[10, 1, 1]} />
          <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 3]} scale={[10, 1, 1]} />
          <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 6]} scale={[10, 1, 1]} />
          <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 9]} scale={[10, 1, 1]} />
          {/* Sides */}
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-50, 2, 0]} scale={[100, 2, 1]} />
          <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[50, 2, 0]} scale={[100, 2, 1]} />
          {/* McLaren orange key light - positioned to hit car, not floor */}
          <Lightformer form="ring" color="#ff8000" intensity={10} scale={2} position={[8, 8, 5]} onUpdate={(self) => self.lookAt(0, 0.5, 0)} />
        </Environment>
        
        {/* Post-processing effects */}
        <Effects />
        
        {/* Controls like lambo */}
        <OrbitControls 
          ref={controlsRef}
          enablePan={false} 
          enableZoom={true}
          minDistance={6}
          maxDistance={25}
          minPolarAngle={Math.PI / 2.2} 
          maxPolarAngle={Math.PI / 2.2}
          autoRotate={true}
          autoRotateSpeed={focusHotspot ? 0.1 : 0.5}
          target={[0, 0, 0]}
        />
        
        <Hotspots onHotspotClick={handleHotspotClick} focusMode={!!focusHotspot} hideHotspots={isQRModalOpen} />
      </Canvas>
      
      {/* Left-side click area to exit focus mode */}
      {focusHotspot && (
        <div 
          className="focus-exit-area"
          onClick={handleCloseFocus}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: '50%',
            height: '100vh',
            zIndex: 10,
            cursor: 'pointer',
            background: 'transparent'
          }}
        />
      )}

      {/* Focus Panel */}
      {focusHotspot && (
        <FocusPanel 
          hotspot={focusHotspot} 
          onClose={handleCloseFocus}
          isExiting={isExitingFocus}
        />
      )}
      
      {/* Model Selector */}
      <ModelSelector 
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />

      {/* UI Overlay */}
      <div className="ui-overlay">
        <header className="header">
          <div className="logo-container">
            <h1 className="title">McLaren F1 Experience</h1>
            <p className="subtitle">Powered by Green Consulting</p>
          </div>
        </header>
        
        <NavigationBar onReset={handleReset} />
        {!focusHotspot && <QRCodeComponent selectedModel={selectedModel} onModalChange={setIsQRModalOpen} />}
      </div>
      
      <IdleReset onReset={handleReset} timeout={60000} />
    </div>
  )
}

export default App