import { useRef, forwardRef } from 'react'
import { Box } from '@react-three/drei'
import * as THREE from 'three'

export const F1CarGeometry = forwardRef((props, ref) => {
  // PHOTOREALISTIC MATERIALS
  // Key insight: envMapIntensity makes materials reflect the environment lighting
  
  // McLaren Orange - Glossy car paint
  const mclarenOrange = {
    color: "#ff8000",
    metalness: 0.8,
    roughness: 0.45,        // Slightly more rough for realism
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    envMapIntensity: 2.0    // Reflects environment strongly
  }

  // Carbon Fiber - Technical weave
  const carbonFiber = {
    color: "#1a1a1a",
    metalness: 0.9,
    roughness: 0.2,
    clearcoat: 0.6,
    clearcoatRoughness: 0.3,
    envMapIntensity: 1.5    // Moderate reflections
  }

  // Rubber - Matte tires
  const rubberBlack = {
    color: "#0a0a0a",
    metalness: 0.0,
    roughness: 0.9,
    envMapIntensity: 0.2    // Minimal reflections
  }

  // Chrome - Mirror finish
  const chrome = {
    color: "#cccccc",
    metalness: 1.0,
    roughness: 0.1,
    envMapIntensity: 3.0    // Maximum reflections
  }

  // Wheel Rims - Metallic
  const rimMaterial = {
    color: "#aaaaaa",
    metalness: 1.0,
    roughness: 0.2,
    envMapIntensity: 2.0    // Strong reflections
  }

  // Matte Black - Non-reflective parts
  const matteBlack = {
    color: "#0f0f0f",
    metalness: 0.1,
    roughness: 0.8,
    envMapIntensity: 0.4    // Low reflections
  }

  return (
    <group ref={ref} position={[0, 0, 0]} {...props}>
      {/* Main chassis - sleek body */}
      <Box args={[1.5, 0.4, 4]} position={[0, 0.3, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...mclarenOrange} />
      </Box>

      {/* Nose cone - aerodynamic front */}
      <mesh position={[0, 0.3, 2.75]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.3, 1.5, 8]} />
        <meshStandardMaterial {...mclarenOrange} />
      </mesh>

      {/* Front wing - downforce generator */}
      <Box args={[2.2, 0.05, 0.4]} position={[0, 0.05, 3]} castShadow receiveShadow>
        <meshStandardMaterial {...carbonFiber} />
      </Box>

      {/* Front wing endplates */}
      {[-1.1, 1.1].map((x, index) => (
        <Box key={`endplate-${index}`} args={[0.05, 0.25, 0.4]} position={[x, 0.15, 3]} castShadow receiveShadow>
          <meshStandardMaterial {...carbonFiber} />
        </Box>
      ))}

      {/* Cockpit halo - safety structure (chrome) */}
      <mesh position={[0, 0.7, 0.5]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.5, 0.08, 16, 32, Math.PI]} />
        <meshStandardMaterial {...chrome} />
      </mesh>

      {/* Cockpit opening */}
      <Box args={[0.8, 0.3, 1.5]} position={[0, 0.55, 0.5]} castShadow receiveShadow>
        <meshStandardMaterial {...matteBlack} />
      </Box>

      {/* Rear wing main element */}
      <Box args={[2, 0.05, 0.6]} position={[0, 1.0, -2.2]} castShadow receiveShadow>
        <meshStandardMaterial {...carbonFiber} />
      </Box>

      {/* Rear wing top element */}
      <Box args={[2, 0.05, 0.4]} position={[0, 1.3, -2.3]} castShadow receiveShadow>
        <meshStandardMaterial {...carbonFiber} />
      </Box>

      {/* Wing supports (vertical struts) */}
      {[-0.8, 0.8].map((x, index) => (
        <mesh key={`support-${index}`} position={[x, 0.8, -2.2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.8]} />
          <meshStandardMaterial {...carbonFiber} />
        </mesh>
      ))}

      {/* Engine cover - aerodynamic hump */}
      <Box args={[1, 0.6, 1.5]} position={[0, 0.5, -1.2]} castShadow receiveShadow>
        <meshStandardMaterial {...mclarenOrange} />
      </Box>

      {/* Air intake above driver */}
      <Box args={[0.4, 0.3, 0.4]} position={[0, 0.9, 0.3]} castShadow receiveShadow>
        <meshStandardMaterial {...matteBlack} />
      </Box>

      {/* Sidepods - aerodynamic channels with cooling */}
      {[-1, 1].map((side, index) => (
        <group key={`sidepod-group-${index}`}>
          {/* Main sidepod body */}
          <Box args={[0.4, 0.3, 2]} position={[side * 0.9, 0.2, 0]} castShadow receiveShadow>
            <meshStandardMaterial {...mclarenOrange} />
          </Box>
          {/* Sidepod air intake */}
          <Box args={[0.35, 0.25, 0.3]} position={[side * 0.9, 0.25, 1.2]} castShadow receiveShadow>
            <meshStandardMaterial {...matteBlack} />
          </Box>
        </group>
      ))}

      {/* Wheels - the contact patches */}
      {[
        { x: -0.8, z: 1.8, name: 'front-left', radius: 0.45 },
        { x: 0.8, z: 1.8, name: 'front-right', radius: 0.45 },
        { x: -0.85, z: -1.5, name: 'rear-left', radius: 0.45 },
        { x: 0.85, z: -1.5, name: 'rear-right', radius: 0.45 }
      ].map((pos, index) => (
        <group key={`wheel-${pos.name}`} position={[pos.x, 0.0, pos.z]}>
          {/* Tire - matte rubber */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
            <cylinderGeometry args={[pos.radius, pos.radius, 0.35, 32]} />
            <meshStandardMaterial {...rubberBlack} />
          </mesh>
          {/* Rim - shiny metal */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[pos.radius * 0.75, pos.radius * 0.75, 0.37, 32]} />
            <meshStandardMaterial {...rimMaterial} />
          </mesh>
          {/* Brake disc (visible through rim) */}
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
            <cylinderGeometry args={[pos.radius * 0.6, pos.radius * 0.6, 0.06, 32]} />
            <meshStandardMaterial {...chrome} />
          </mesh>
        </group>
      ))}

      {/* Diffuser - underside aerodynamics */}
      <Box args={[1.2, 0.1, 0.8]} position={[0, 0.05, -2]} castShadow receiveShadow>
        <meshStandardMaterial {...carbonFiber} />
      </Box>

      {/* Floor - generates ground effect */}
      <Box args={[1.4, 0.02, 3.5]} position={[0, 0.01, 0]} receiveShadow>
        <meshStandardMaterial {...carbonFiber} />
      </Box>

      {/* Rear crash structure */}
      <Box args={[0.3, 0.2, 0.3]} position={[0, 0.3, -2.8]} castShadow receiveShadow>
        <meshStandardMaterial {...carbonFiber} />
      </Box>


    </group>
  )
})