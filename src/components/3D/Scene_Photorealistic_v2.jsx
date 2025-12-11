import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Lightformer, Float, AccumulativeShadows, RandomizedLight } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { F1Car } from './F1Car'
import { Hotspots } from './Hotspots'

// Studio Lightformers - creates professional photo studio lighting
function StudioLightformers() {
  const group = useRef()
  
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
      {/* Main ceiling light */}
      <Lightformer 
        intensity={0.75} 
        rotation-x={Math.PI / 2} 
        position={[0, 5, -9]} 
        scale={[10, 10, 1]} 
      />
      
      {/* Rotating strip lights */}
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
      
      {/* Side fill lights */}
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
      
      {/* McLaren orange accent light */}
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
    </>
  )
}

// Gradient background - creates depth and atmosphere
function GradientBackground() {
  return (
    <mesh scale={100} rotation={[0, Math.PI / 2, 0]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial 
        color="#1a1a1a" 
        side={THREE.BackSide}
        toneMapped={false}
      />
    </mesh>
  )
}

// Subtle camera animation
function CameraRig() {
  return useFrame((state) => {
    const t = state.clock.elapsedTime
    state.camera.position.x += Math.sin(t / 5) * 0.0005
    state.camera.position.y += Math.cos(t / 7) * 0.0005
  })
}

export function Scene({ focusMode, focusHotspot, onCameraReset, onHotspotClick }) {
  const controlsRef = useRef()
  const carRef = useRef()

  // Handle focus mode camera positioning
  useEffect(() => {
    if (controlsRef.current) {
      if (focusMode && focusHotspot) {
        const hotspotPos = new THREE.Vector3(...focusHotspot.position)
        
        let cameraOffset
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
        toneMappingExposure: 1.2,
        outputColorSpace: THREE.SRGBColorSpace,
        logarithmicDepthBuffer: true,
        precision: 'highp'
      }}
    >
      {/* Gradient background for depth */}
      <GradientBackground />
      
      {/* Key spotlight for primary illumination */}
      <spotLight 
        position={[0, 15, 0]} 
        angle={0.3} 
        penumbra={1} 
        castShadow 
        intensity={2} 
        shadow-bias={-0.0001}
        shadow-mapSize={[2048, 2048]}
      />
      
      {/* Soft ambient fill */}
      <ambientLight intensity={0.5} />
      
      {/* 
        THIS IS THE GAME CHANGER: AccumulativeShadows
        Creates soft, photorealistic contact shadows like the mockup
      */}
      <AccumulativeShadows 
        temporal
        frames={100} 
        color="#000000"
        colorBlend={0.5}
        toneMapped={true}
        alphaTest={0.75}
        opacity={0.85}
        scale={10} 
        position={[0, -0.01, 0]}
      >
        <RandomizedLight 
          amount={8} 
          radius={10} 
          ambient={0.5} 
          intensity={1}
          position={[1, 5, -1]} 
          bias={0.001}
        />
      </AccumulativeShadows>
      
      {/* 
        Environment with custom Lightformers
        This creates the studio lighting reflections
      */}
      <Environment resolution={256} background={false}>
        <StudioLightformers />
      </Environment>
      
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
      
      {/* Subtle camera movement */}
      <CameraRig />
      
      <F1Car ref={carRef} />
      <Hotspots onHotspotClick={onHotspotClick} focusMode={focusMode} />
    </Canvas>
  )
}
