import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Lightformer, Float } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { F1Car } from './F1Car'
import { Hotspots } from './Hotspots'

// Custom Lightformers component - this creates the studio lighting
function StudioLightformers() {
  const group = useRef()
  
  // Animate some lights for subtle movement
  useFrame((state, delta) => {
    if (group.current) {
      group.current.position.z += delta * 10
      if (group.current.position.z > 20) {
        group.current.position.z = -60
      }
    }
  })

  return (
    <>
      {/* Main ceiling light - creates soft top lighting */}
      <Lightformer 
        intensity={0.75} 
        rotation-x={Math.PI / 2} 
        position={[0, 5, -9]} 
        scale={[10, 10, 1]} 
      />
      
      {/* Rotating strip lights - adds depth and dimension */}
      <group rotation={[0, 0.5, 0]}>
        <group ref={group}>
          {[2, 0, 2, 0, 2, 0, 2, 0].map((x, i) => (
            <Lightformer 
              key={i} 
              form="circle" 
              intensity={2} 
              rotation={[Math.PI / 2, 0, 0]} 
              position={[x, 4, i * 4]} 
              scale={[3, 1, 1]} 
            />
          ))}
        </group>
      </group>
      
      {/* Side lights - fills in shadows and creates edge lighting */}
      <Lightformer 
        intensity={4} 
        rotation-y={Math.PI / 2} 
        position={[-5, 1, -1]} 
        scale={[20, 0.1, 1]} 
      />
      <Lightformer 
        rotation-y={Math.PI / 2} 
        position={[-5, -1, -1]} 
        scale={[20, 0.5, 1]} 
      />
      <Lightformer 
        rotation-y={-Math.PI / 2} 
        position={[10, 1, 0]} 
        scale={[20, 1, 1]} 
      />
      
      {/* Accent light - adds McLaren orange glow (optional) */}
      <Float speed={5} floatIntensity={2} rotationIntensity={2}>
        <Lightformer 
          form="ring" 
          color="#ff8000" 
          intensity={1} 
          scale={10} 
          position={[-15, 4, -18]} 
          target={[0, 0, 0]} 
        />
      </Float>
      
      {/* Additional rim lights for more definition */}
      <Lightformer 
        intensity={2} 
        rotation-y={-Math.PI / 2} 
        position={[5, 2, 0]} 
        scale={[10, 2, 1]} 
      />
      <Lightformer 
        intensity={1.5} 
        rotation-y={Math.PI} 
        position={[0, 1, -5]} 
        scale={[10, 2, 1]} 
      />
    </>
  )
}

// Background sphere with gradient - creates depth
function BackgroundSphere() {
  return (
    <mesh scale={100}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial 
        color="#2a2a2a" 
        side={THREE.BackSide} 
        toneMapped={false}
      />
    </mesh>
  )
}

// Subtle camera drift - adds life to the scene
function CameraRig() {
  return useFrame((state) => {
    const t = state.clock.elapsedTime
    // Very subtle sine wave movement
    state.camera.position.x += Math.sin(t / 5) * 0.001
    state.camera.position.y += Math.cos(t / 7) * 0.001
  })
}

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
        let cameraOffset
        
        // Different camera angles for different hotspots
        switch (focusHotspot.id) {
          case 'front-wing':
            cameraOffset = new THREE.Vector3(-2, 1, 3)
            break
          case 'rear-wing':
            cameraOffset = new THREE.Vector3(-2, 2, -1)
            break
          case 'cockpit':
            cameraOffset = new THREE.Vector3(-3, 1.5, 1)
            break
          case 'engine':
            cameraOffset = new THREE.Vector3(-2, 2, 0)
            break
          case 'wheel-front-right':
            cameraOffset = new THREE.Vector3(-1, 0.5, 2.5)
            break
          default:
            cameraOffset = new THREE.Vector3(-2, 1.5, 2)
        }
        
        const targetPos = hotspotPos.clone().add(cameraOffset)
        const targetLookAt = hotspotPos.clone()
        
        // Animate to focus position
        const startPos = controlsRef.current.object.position.clone()
        const startTarget = controlsRef.current.target.clone()
        
        const positionDistance = startPos.distanceTo(targetPos)
        const targetDistance = startTarget.distanceTo(targetLookAt)
        const maxDistance = Math.max(positionDistance, targetDistance)
        
        const baseDuration = 800
        const scaleFactor = 200
        const duration = Math.min(2500, Math.max(800, baseDuration + (maxDistance * scaleFactor)))
        
        const startTime = performance.now()
        
        const animate = () => {
          const elapsed = performance.now() - startTime
          const progress = Math.min(1, elapsed / duration)
          const easeProgress = 1 - Math.pow(1 - progress, 3)
          
          if (progress < 1) {
            controlsRef.current.object.position.lerpVectors(startPos, targetPos, easeProgress)
            controlsRef.current.target.lerpVectors(startTarget, targetLookAt, easeProgress)
            controlsRef.current.update()
            requestAnimationFrame(animate)
          } else {
            controlsRef.current.object.position.copy(targetPos)
            controlsRef.current.target.copy(targetLookAt)
            controlsRef.current.update()
          }
        }
        animate()
      } else {
        // Return to normal position
        const targetPos = new THREE.Vector3(4, 2, 6)
        const targetLookAt = new THREE.Vector3(0, 0, 0)
        
        const startPos = controlsRef.current.object.position.clone()
        const startTarget = controlsRef.current.target.clone()
        
        const positionDistance = startPos.distanceTo(targetPos)
        const targetDistance = startTarget.distanceTo(targetLookAt)
        const maxDistance = Math.max(positionDistance, targetDistance)
        
        const baseDuration = 600
        const scaleFactor = 150
        const duration = Math.min(2000, Math.max(600, baseDuration + (maxDistance * scaleFactor)))
        
        const startTime = performance.now()
        
        const animate = () => {
          const elapsed = performance.now() - startTime
          const progress = Math.min(1, elapsed / duration)
          const easeProgress = 1 - Math.pow(1 - progress, 3)
          
          if (progress < 1) {
            controlsRef.current.object.position.lerpVectors(startPos, targetPos, easeProgress)
            controlsRef.current.target.lerpVectors(startTarget, targetLookAt, easeProgress)
            controlsRef.current.update()
            requestAnimationFrame(animate)
          } else {
            controlsRef.current.object.position.copy(targetPos)
            controlsRef.current.target.copy(targetLookAt)
            controlsRef.current.update()
          }
        }
        animate()
      }
    }
  }, [focusMode, focusHotspot])

  // Reset camera function
  useEffect(() => {
    window.resetCamera = () => {
      if (controlsRef.current) {
        const targetPos = new THREE.Vector3(4, 2, 6)
        const targetLookAt = new THREE.Vector3(0, 0.5, 0)
        
        const startPos = controlsRef.current.object.position.clone()
        const startTarget = controlsRef.current.target.clone()
        
        const positionDistance = startPos.distanceTo(targetPos)
        const targetDistance = startTarget.distanceTo(targetLookAt)
        const maxDistance = Math.max(positionDistance, targetDistance)
        
        const baseDuration = 800
        const scaleFactor = 150
        const duration = Math.min(2000, Math.max(800, baseDuration + (maxDistance * scaleFactor)))
        
        const startTime = performance.now()
        
        const animate = () => {
          const elapsed = performance.now() - startTime
          const progress = Math.min(1, elapsed / duration)
          const easeProgress = 1 - Math.pow(1 - progress, 3)
          
          if (progress < 1) {
            controlsRef.current.object.position.lerpVectors(startPos, targetPos, easeProgress)
            controlsRef.current.target.lerpVectors(startTarget, targetLookAt, easeProgress)
            controlsRef.current.update()
            requestAnimationFrame(animate)
          } else {
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
      shadows
      camera={{ position: [4, 2, 6], fov: 50 }}
      style={{ width: '100%', height: '100vh' }}
      gl={{ 
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.5, // Increased from 1.2 for brighter, more vibrant look
        shadowMap: {
          enabled: true,
          type: THREE.PCFSoftShadowMap
        },
        outputColorSpace: THREE.SRGBColorSpace, // Better color reproduction
        logarithmicDepthBuffer: true,
        precision: 'highp'
      }}
    >
      {/* Background sphere - creates depth instead of flat color */}
      <BackgroundSphere />
      
      {/* 
        THIS IS THE KEY DIFFERENCE: Custom Environment with Lightformers
        Instead of just using a preset, we're creating custom studio lighting
      */}
      <Environment resolution={256} background={false}>
        <StudioLightformers />
      </Environment>
      
      {/* Subtle ambient to prevent pure black shadows */}
      <ambientLight intensity={0.3} />
      
      {/* Optional: Add a key light for more dramatic lighting */}
      <spotLight 
        position={[10, 10, 5]} 
        angle={0.3} 
        penumbra={1} 
        intensity={1} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
      
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
      
      {/* 
        Enhanced floor with better reflections
        Key changes: Lower roughness, higher metalness, much higher envMapIntensity
      */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          roughness={0.15}        // Reduced from 0.3 - smoother surface
          metalness={0.8}         // Increased from 0.4 - more reflective
          envMapIntensity={2.0}   // Massively increased from 0.3 - picks up environment
        />
      </mesh>
      
      {/* Subtle camera drift for life */}
      <CameraRig />
      
      <F1Car ref={carRef} />
      <Hotspots onHotspotClick={onHotspotClick} focusMode={focusMode} />
    </Canvas>
  )
}
