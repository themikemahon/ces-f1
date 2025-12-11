import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Lightformer, Float, AccumulativeShadows, RandomizedLight } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { F1Car } from './F1Car'
import { Hotspots } from './Hotspots'

// Studio Lightformers
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
      {/* Main ceiling light - strong */}
      <Lightformer 
        intensity={2} 
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
              intensity={4} 
              rotation={[Math.PI / 2, 0, 0]} 
              position={[x, 4, i * 4]} 
              scale={[3, 1, 1]} 
            />
          ))}
        </group>
      </group>
      
      {/* Side fill lights - bright */}
      <Lightformer 
        intensity={6} 
        rotation-y={Math.PI / 2} 
        position={[-5, 1, -1]} 
        scale={[20, 0.1, 1]} 
      />
      <Lightformer 
        rotation-y={Math.PI / 2} 
        position={[-5, -1, -1]} 
        scale={[20, 0.5, 1]} 
        intensity={3}
      />
      <Lightformer 
        rotation-y={-Math.PI / 2} 
        position={[10, 1, 0]} 
        scale={[20, 1, 1]} 
        intensity={4}
      />
      
      {/* Back fill light */}
      <Lightformer 
        intensity={3} 
        rotation-y={Math.PI} 
        position={[0, 2, -5]} 
        scale={[10, 5, 1]} 
      />
      
      {/* McLaren orange accent light */}
      <Float speed={5} floatIntensity={2} rotationIntensity={2}>
        <Lightformer 
          form="ring" 
          color="#ff8000" 
          intensity={2} 
          scale={10} 
          position={[-15, 4, -18]} 
          target={[0, 0, 0]} 
        />
      </Float>
    </>
  )
}

// Studio Cyclorama - Creates the seamless floor-to-wall effect
function StudioCyclorama() {
  return (
    <group>
      {/* Main floor - visible and bright */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.01, 0]} 
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#d0d0d0"          // Light gray floor like mockup
          roughness={0.2}           // Slightly glossy
          metalness={0.1}           // Subtle reflection
          envMapIntensity={1.5}     // Reflects environment
        />
      </mesh>

      {/* Background wall - creates seamless transition */}
      <mesh 
        position={[0, 25, -15]} 
        receiveShadow
      >
        <planeGeometry args={[100, 50]} />
        <meshStandardMaterial 
          color="#b8b8b8"           // Slightly darker for depth
          roughness={0.3}
          metalness={0.0}
          envMapIntensity={1.0}
        />
      </mesh>

      {/* Curved transition (cyclorama curve) - creates seamless look */}
      <mesh 
        position={[0, 0, -14]} 
        rotation={[Math.PI / 4, 0, 0]}
        receiveShadow
      >
        <cylinderGeometry args={[100, 100, 20, 32, 1, true, 0, Math.PI]} />
        <meshStandardMaterial 
          color="#c4c4c4"
          roughness={0.25}
          metalness={0.05}
          envMapIntensity={1.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
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
        toneMappingExposure: 1.8,      // Bright but not blown out
        outputColorSpace: THREE.SRGBColorSpace,
        logarithmicDepthBuffer: true,
        precision: 'highp'
      }}
    >
      {/* Bright neutral background color */}
      <color attach="background" args={['#808080']} />
      
      {/* Strong key spotlight */}
      <spotLight 
        position={[5, 15, 5]} 
        angle={0.3} 
        penumbra={1} 
        castShadow 
        intensity={3} 
        shadow-bias={-0.0001}
        shadow-mapSize={[2048, 2048]}
      />
      
      {/* Fill light from opposite side */}
      <spotLight 
        position={[-5, 10, 5]} 
        angle={0.4} 
        penumbra={1} 
        intensity={2} 
        castShadow={false}
      />
      
      {/* Strong ambient for overall brightness */}
      <ambientLight intensity={1.5} />
      
      {/* 
        Studio Cyclorama - visible floor and background
        This creates the seamless studio look
      */}
      <StudioCyclorama />
      
      {/* 
        AccumulativeShadows - soft contact shadows ON TOP of the floor
        This adds the realistic soft shadows
      */}
      <AccumulativeShadows 
        temporal
        frames={100} 
        color="#9e9e9e"           // Gray shadow color
        colorBlend={2}             // Strong shadow presence
        toneMapped={true}
        alphaTest={0.7}
        opacity={0.8}              // Visible but not too dark
        scale={12} 
        position={[0, 0.001, 0]}   // Just above floor
      >
        <RandomizedLight 
          amount={8} 
          radius={10} 
          ambient={0.5} 
          intensity={1}
          position={[2, 5, -1]} 
          bias={0.001}
        />
      </AccumulativeShadows>
      
      {/* 
        Environment with custom Lightformers
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
