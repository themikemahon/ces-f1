import { useRef, forwardRef } from 'react'
import { Box } from '@react-three/drei'
import * as THREE from 'three'

export const F1Car = forwardRef((props, ref) => {
  // ENHANCED MATERIALS - These now include envMapIntensity for proper reflections
  
  // McLaren Orange - The star of the show
  const mclarenOrange = {
    color: "#ff8000",
    metalness: 0.8,         // High metalness for reflective car paint
    roughness: 0.35,        // Slightly rough for realistic paint
    clearcoat: 1.0,         // Maximum clearcoat for glossy finish
    clearcoatRoughness: 0.05, // Very smooth clearcoat
    envMapIntensity: 2.5    // ← KEY: This makes it reflect the environment strongly
  }

  // Carbon Fiber - Technical and precise
  const carbonFiber = {
    color: "#1a1a1a",
    metalness: 0.9,
    roughness: 0.15,        // Smooth carbon weave
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
    envMapIntensity: 2.0    // ← Strong reflections for carbon
  }

  // Rubber - Matte black tires
  const rubberBlack = {
    color: "#0a0a0a",
    metalness: 0.0,         // Rubber isn't metallic
    roughness: 0.95,        // Very rough/matte
    envMapIntensity: 0.3    // ← Minimal reflections
  }

  // Chrome - Mirror-like metal parts
  const chrome = {
    color: "#e8e8e8",
    metalness: 1.0,         // Pure metal
    roughness: 0.05,        // Almost mirror smooth
    envMapIntensity: 3.0    // ← Maximum reflections for chrome
  }

  // Wheel Rims - Metallic but not quite chrome
  const rimMaterial = {
    color: "#b8b8b8",
    metalness: 1.0,
    roughness: 0.15,
    envMapIntensity: 2.5    // ← Strong reflections
  }

  // Matte Black - Non-reflective technical parts
  const matteBlack = {
    color: "#0f0f0f",
    metalness: 0.1,
    roughness: 0.8,
    envMapIntensity: 0.5    // ← Low reflections
  }

  return (
    <group ref={ref} position={[0, 0, 0]} {...props}>
      {/* Main chassis - sleek body */}
      <Box args={[1.5, 0.4, 4]} position={[0, 0.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...mclarenOrange} />
      </Box>

      {/* Nose cone - aerodynamic front */}
      <mesh position={[0, 0.5, 2.75]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.3, 1.5, 8]} />
        <meshStandardMaterial {...mclarenOrange} />
      </mesh>

      {/* Front wing - downforce generator */}
      <Box args={[2.2, 0.05, 0.4]} position={[0, 0.2, 3]} castShadow receiveShadow>
        <meshStandardMaterial {...carbonFiber} />
      </Box>

      {/* Front wing endplates */}
      {[-1.1, 1.1].map((x, index) => (
        <Box 
          key={`endplate-${index}`} 
          args={[0.05, 0.25, 0.4]} 
          position={[x, 0.3, 3]} 
          castShadow 
          receiveShadow
        >
          <meshStandardMaterial {...carbonFiber} />
        </Box>
      ))}

      {/* Cockpit halo - safety structure (chrome) */}
      <mesh position={[0, 0.9, 0.5]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.5, 0.08, 16, 32, Math.PI]} />
        <meshStandardMaterial {...chrome} />
      </mesh>

      {/* Cockpit opening */}
      <Box args={[0.8, 0.3, 1.5]} position={[0, 0.75, 0.5]} castShadow receiveShadow>
        <meshStandardMaterial {...matteBlack} />
      </Box>

      {/* Rear wing main element */}
      <Box args={[2, 0.05, 0.6]} position={[0, 1.2, -2.2]} castShadow receiveShadow>
        <meshStandardMaterial {...carbonFiber} />
      </Box>

      {/* Rear wing top element */}
      <Box args={[2, 0.05, 0.4]} position={[0, 1.5, -2.3]} castShadow receiveShadow>
        <meshStandardMaterial {...carbonFiber} />
      </Box>

      {/* Wing supports (vertical struts) */}
      {[-0.8, 0.8].map((x, index) => (
        <mesh key={`support-${index}`} position={[x, 1, -2.2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.8]} />
          <meshStandardMaterial {...carbonFiber} />
        </mesh>
      ))}

      {/* Engine cover - aerodynamic hump */}
      <Box args={[1, 0.6, 1.5]} position={[0, 0.7, -1.2]} castShadow receiveShadow>
        <meshStandardMaterial {...mclarenOrange} />
      </Box>

      {/* Air intake above driver */}
      <Box args={[0.4, 0.3, 0.4]} position={[0, 1.1, 0.3]} castShadow receiveShadow>
        <meshStandardMaterial {...matteBlack} />
      </Box>

      {/* Sidepods - aerodynamic channels with cooling */}
      {[-1, 1].map((side, index) => (
        <group key={`sidepod-group-${index}`}>
          {/* Main sidepod body */}
          <Box 
            args={[0.4, 0.3, 2]} 
            position={[side * 0.9, 0.4, 0]} 
            castShadow 
            receiveShadow
          >
            <meshStandardMaterial {...mclarenOrange} />
          </Box>
          
          {/* Sidepod air intake */}
          <Box 
            args={[0.35, 0.25, 0.3]} 
            position={[side * 0.9, 0.45, 1.2]} 
            castShadow 
            receiveShadow
          >
            <meshStandardMaterial {...matteBlack} />
          </Box>
        </group>
      ))}

      {/* Wheels - the contact patches */}
      {[
        { x: -0.8, z: 1.8, name: 'front-left' },
        { x: 0.8, z: 1.8, name: 'front-right' },
        { x: -0.85, z: -1.5, name: 'rear-left' },
        { x: 0.85, z: -1.5, name: 'rear-right' }
      ].map((pos, index) => (
        <group key={`wheel-${pos.name}`} position={[pos.x, 0.35, pos.z]}>
          {/* Tire - matte rubber */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.3, 32]} />
            <meshStandardMaterial {...rubberBlack} />
          </mesh>

          {/* Rim - shiny metal */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.25, 0.25, 0.32, 32]} />
            <meshStandardMaterial {...rimMaterial} />
          </mesh>

          {/* Brake disc (visible through rim) */}
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />
            <meshStandardMaterial {...chrome} />
          </mesh>
        </group>
      ))}

      {/* Diffuser - underside aerodynamics */}
      <Box args={[1.2, 0.1, 0.8]} position={[0, 0.15, -2]} castShadow receiveShadow>
        <meshStandardMaterial {...carbonFiber} />
      </Box>

      {/* Floor - generates ground effect */}
      <Box args={[1.4, 0.02, 3.5]} position={[0, 0.08, 0]} receiveShadow>
        <meshStandardMaterial {...carbonFiber} />
      </Box>

      {/* Rear crash structure */}
      <Box args={[0.3, 0.2, 0.3]} position={[0, 0.5, -2.8]} castShadow receiveShadow>
        <meshStandardMaterial {...carbonFiber} />
      </Box>
    </group>
  )
})
