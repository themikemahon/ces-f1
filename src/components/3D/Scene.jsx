import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { F1Car } from './F1Car'
import { Hotspots } from './Hotspots'

export function Scene({ focusMode, focusHotspot, onCameraReset, onHotspotClick }) {
  const controlsRef = useRef()
  const carRef = useRef()

  // Handle focus mode camera positioning based on hotspot
  useEffect(() => {
    if (controlsRef.current) {
      if (focusMode && focusHotspot) {
        // Calculate camera position to show hotspot on left side of screen
        const hotspotPos = new THREE.Vector3(...focusHotspot.position)
        
        // Position camera so hotspot appears on left side (for right panel overlay)
        // Adjust camera position based on hotspot location
        let cameraOffset
        
        // Different camera angles for different hotspots
        switch (focusHotspot.id) {
          case 'front-wing':
            cameraOffset = new THREE.Vector3(-2, 1, 3) // Left-front angle
            break
          case 'rear-wing':
            cameraOffset = new THREE.Vector3(-2, 2, -1) // Left-rear angle
            break
          case 'cockpit':
            cameraOffset = new THREE.Vector3(-3, 1.5, 1) // Left side angle
            break
          case 'engine':
            cameraOffset = new THREE.Vector3(-2, 2, 0) // Left-top angle
            break
          case 'wheel-front-right':
            cameraOffset = new THREE.Vector3(-1, 0.5, 2.5) // Left angle for wheel
            break
          default:
            cameraOffset = new THREE.Vector3(-2, 1.5, 2) // Default left angle
        }
        
        const targetPos = hotspotPos.clone().add(cameraOffset)
        const targetLookAt = hotspotPos.clone()
        
        // Animate to focus position with distance-based timing
        const startPos = controlsRef.current.object.position.clone()
        const startTarget = controlsRef.current.target.clone()
        
        // Calculate distances for timing
        const positionDistance = startPos.distanceTo(targetPos)
        const targetDistance = startTarget.distanceTo(targetLookAt)
        const maxDistance = Math.max(positionDistance, targetDistance)
        
        // Base duration + distance-based scaling (min 0.8s, max 2.5s)
        const baseDuration = 800 // milliseconds
        const scaleFactor = 200 // ms per unit distance
        const duration = Math.min(2500, Math.max(800, baseDuration + (maxDistance * scaleFactor)))
        
        const startTime = performance.now()
        
        const animate = () => {
          const elapsed = performance.now() - startTime
          const progress = Math.min(1, elapsed / duration)
          
          // Smooth easing curve (ease-out-cubic)
          const easeProgress = 1 - Math.pow(1 - progress, 3)
          
          if (progress < 1) {
            controlsRef.current.object.position.lerpVectors(startPos, targetPos, easeProgress)
            controlsRef.current.target.lerpVectors(startTarget, targetLookAt, easeProgress)
            controlsRef.current.update()
            requestAnimationFrame(animate)
          } else {
            // Ensure final position is exact
            controlsRef.current.object.position.copy(targetPos)
            controlsRef.current.target.copy(targetLookAt)
            controlsRef.current.update()
          }
        }
        animate()
      } else {
        // Return to normal position with distance-based timing
        const targetPos = new THREE.Vector3(4, 2, 6)
        const targetLookAt = new THREE.Vector3(0, 0, 0)
        
        const startPos = controlsRef.current.object.position.clone()
        const startTarget = controlsRef.current.target.clone()
        
        // Calculate distances for timing
        const positionDistance = startPos.distanceTo(targetPos)
        const targetDistance = startTarget.distanceTo(targetLookAt)
        const maxDistance = Math.max(positionDistance, targetDistance)
        
        // Base duration + distance-based scaling
        const baseDuration = 600 // Slightly faster return
        const scaleFactor = 150 // ms per unit distance
        const duration = Math.min(2000, Math.max(600, baseDuration + (maxDistance * scaleFactor)))
        
        const startTime = performance.now()
        
        const animate = () => {
          const elapsed = performance.now() - startTime
          const progress = Math.min(1, elapsed / duration)
          
          // Smooth easing curve (ease-out-cubic)
          const easeProgress = 1 - Math.pow(1 - progress, 3)
          
          if (progress < 1) {
            controlsRef.current.object.position.lerpVectors(startPos, targetPos, easeProgress)
            controlsRef.current.target.lerpVectors(startTarget, targetLookAt, easeProgress)
            controlsRef.current.update()
            requestAnimationFrame(animate)
          } else {
            // Ensure final position is exact
            controlsRef.current.object.position.copy(targetPos)
            controlsRef.current.target.copy(targetLookAt)
            controlsRef.current.update()
          }
        }
        animate()
      }
    }
  }, [focusMode, focusHotspot])

  // Reset camera function with smooth animation
  useEffect(() => {
    window.resetCamera = () => {
      if (controlsRef.current) {
        // Animate back to default position smoothly
        const targetPos = new THREE.Vector3(4, 2, 6)
        const targetLookAt = new THREE.Vector3(0, 0.5, 0)
        
        const startPos = controlsRef.current.object.position.clone()
        const startTarget = controlsRef.current.target.clone()
        
        // Calculate distances for timing
        const positionDistance = startPos.distanceTo(targetPos)
        const targetDistance = startTarget.distanceTo(targetLookAt)
        const maxDistance = Math.max(positionDistance, targetDistance)
        
        // Base duration + distance-based scaling
        const baseDuration = 800
        const scaleFactor = 150
        const duration = Math.min(2000, Math.max(800, baseDuration + (maxDistance * scaleFactor)))
        
        const startTime = performance.now()
        
        const animate = () => {
          const elapsed = performance.now() - startTime
          const progress = Math.min(1, elapsed / duration)
          
          // Smooth easing curve (ease-out-cubic)
          const easeProgress = 1 - Math.pow(1 - progress, 3)
          
          if (progress < 1) {
            controlsRef.current.object.position.lerpVectors(startPos, targetPos, easeProgress)
            controlsRef.current.target.lerpVectors(startTarget, targetLookAt, easeProgress)
            controlsRef.current.update()
            requestAnimationFrame(animate)
          } else {
            // Ensure final position is exact
            controlsRef.current.object.position.copy(targetPos)
            controlsRef.current.target.copy(targetLookAt)
            controlsRef.current.update()
          }
        }
        animate()
      }
    }
  }, [])

  return (
    <Canvas
      shadows="soft"
      camera={{ position: [4, 2, 6], fov: 50 }}
      style={{ width: '100%', height: '100vh' }}
      gl={{ 
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
        shadowMap: {
          enabled: true,
          type: THREE.PCFSoftShadowMap
        },
        logarithmicDepthBuffer: true,
        precision: 'highp'
      }}
    >
      {/* Studio background - professional dark gray */}
      <color attach="background" args={['#2a2a2a']} />
      {/* Simple environment-based lighting */}
      <Environment preset="studio" background={false} />
      
      {/* Minimal ambient for visibility */}
      <ambientLight intensity={0.2} />
      
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={2.5}
        maxDistance={12}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        autoRotate={true}
        autoRotateSpeed={focusMode ? 0.05 : 0.5}
        zoomSpeed={0.3}
        touchZoomSpeed={0.2}
        target={[0, 0.5, 0]}
      />
      
      {/* Studio floor with subtle reflections */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          roughness={0.3} 
          metalness={0.4}
          envMapIntensity={0.3}
        />
      </mesh>
      
      <F1Car ref={carRef} />
      <Hotspots onHotspotClick={onHotspotClick} focusMode={focusMode} />
    </Canvas>
  )
}