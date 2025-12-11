import { useRef, forwardRef } from 'react'
import { Box } from '@react-three/drei'
import * as THREE from 'three'

export const F1Car = forwardRef((props, ref) => {
  // Enhanced materials based on the reference model
  const mclarenOrange = {
    color: "#ff8000",
    metalness: 0.7,
    roughness: 0.3,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2
  }

  const carbonFiber = {
    color: "#1a1a1a",
    metalness: 0.9,
    roughness: 0.2,
    clearcoat: 0.6,
    clearcoatRoughness: 0.3
  }

  const rubberBlack = {
    color: "#0a0a0a",
    metalness: 0.1,
    roughness: 0.9
  }

  const chrome = {
    color: "#cccccc",
    metalness: 1.0,
    roughness: 0.1
  }

  const rimMaterial = {
    color: "#aaaaaa",
    metalness: 1.0,
    roughness: 0.2
  }

  return (
    <group ref={ref} position={[0, 0, 0]} {...props}>
      {/* Main chassis - cleaner proportions */}
      <Box args={[1.5, 0.4, 4]} position={[0, 0.5, 0]} castShadow>
        <meshStandardMaterial {...mclarenOrange} />
      </Box>

      {/* Nose cone - proper F1 shape */}
      <mesh position={[0, 0.5, 2.75]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.3, 1.5, 8]} />
        <meshStandardMaterial {...mclarenOrange} />
      </mesh>

      {/* Front wing - single clean element */}
      <Box args={[2.2, 0.05, 0.4]} position={[0, 0.2, 3]} castShadow>
        <meshStandardMaterial {...carbonFiber} />
      </Box>

      {/* Cockpit halo - safety structure */}
      <mesh position={[0, 0.9, 0.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.5, 0.08, 16, 32, Math.PI]} />
        <meshStandardMaterial {...chrome} />
      </mesh>

      {/* Cockpit */}
      <Box args={[0.8, 0.3, 1.5]} position={[0, 0.75, 0.5]} castShadow>
        <meshStandardMaterial {...carbonFiber} />
      </Box>

      {/* Rear wing main element */}
      <Box args={[2, 0.05, 0.6]} position={[0, 1.2, -2.2]} castShadow>
        <meshStandardMaterial {...carbonFiber} />
      </Box>

      {/* Rear wing top element */}
      <Box args={[2, 0.05, 0.4]} position={[0, 1.5, -2.3]} castShadow>
        <meshStandardMaterial {...carbonFiber} />
      </Box>

      {/* Wing supports */}
      {[-0.8, 0.8].map((x, index) => (
        <mesh key={`support-${index}`} position={[x, 1, -2.2]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.8]} />
          <meshStandardMaterial {...carbonFiber} />
        </mesh>
      ))}

      {/* Engine cover */}
      <Box args={[1, 0.6, 1.5]} position={[0, 0.7, -1.2]} castShadow>
        <meshStandardMaterial {...mclarenOrange} />
      </Box>

      {/* Sidepods - aerodynamic channels */}
      {[-1, 1].map((side, index) => (
        <Box key={`sidepod-${index}`} args={[0.4, 0.3, 2]} position={[side * 0.9, 0.4, 0]} castShadow>
          <meshStandardMaterial {...mclarenOrange} />
        </Box>
      ))}

      {/* Wheels - proper F1 proportions */}
      {[
        { x: -0.8, z: 1.8 },   // Front left
        { x: 0.8, z: 1.8 },    // Front right
        { x: -0.85, z: -1.5 }, // Rear left
        { x: 0.85, z: -1.5 }   // Rear right
      ].map((pos, index) => (
        <group key={`wheel-${index}`} position={[pos.x, 0.35, pos.z]}>
          {/* Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.3, 32]} />
            <meshStandardMaterial {...rubberBlack} />
          </mesh>

          {/* Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.25, 0.25, 0.32, 32]} />
            <meshStandardMaterial {...rimMaterial} />
          </mesh>
        </group>
      ))}

      {/* Diffuser - underside aerodynamics */}
      <Box args={[1.2, 0.1, 0.8]} position={[0, 0.15, -2]} castShadow>
        <meshStandardMaterial {...carbonFiber} />
      </Box>
    </group>
  )
})