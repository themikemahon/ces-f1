import * as THREE from 'three'
import { useMemo, forwardRef } from 'react'
import { applyProps } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

export const Porsche911 = forwardRef((props, ref) => {
  const { scene, nodes, materials } = useGLTF('/lambo.glb')
  
  useMemo(() => {
    // Apply lambo-style materials for perfect reflections
    Object.values(nodes).forEach((node) => {
      if (node.isMesh) {
        // Fix glass materials
        if (node.name.toLowerCase().includes('glass') || node.name.toLowerCase().includes('window')) {
          node.geometry.computeVertexNormals()
          if (node.material) {
            applyProps(node.material, {
              transparent: true,
              opacity: 0.2,
              metalness: 0,
              roughness: 0,
              envMapIntensity: 1
            })
          }
        }
        
        // Fix metallic parts (wheels, chrome, etc.)
        if (node.name.toLowerCase().includes('wheel') || 
            node.name.toLowerCase().includes('rim') ||
            node.name.toLowerCase().includes('chrome')) {
          if (node.material) {
            applyProps(node.material, {
              metalness: 1,
              roughness: 0,
              color: '#333',
              envMapIntensity: 2
            })
          }
        }
        
        // Fix brake discs
        if (node.name.toLowerCase().includes('brake') || node.name.toLowerCase().includes('disc')) {
          if (node.material) {
            applyProps(node.material, {
              metalness: 0.2,
              roughness: 0.2,
              color: '#555'
            })
          }
        }
        
        // Fix tires
        if (node.name.toLowerCase().includes('tire') || node.name.toLowerCase().includes('tyre')) {
          if (node.material) {
            applyProps(node.material, {
              metalness: 0,
              roughness: 0.4,
              color: '#181818'
            })
          }
        }
        
        // Fix lights - make them emit
        if (node.name.toLowerCase().includes('light') || 
            node.name.toLowerCase().includes('led') ||
            node.name.toLowerCase().includes('headlight') ||
            node.name.toLowerCase().includes('taillight')) {
          if (node.material) {
            applyProps(node.material, {
              emissiveIntensity: 3,
              toneMapped: false
            })
          }
        }
        
        // Main car body - McLaren orange with clearcoat (only exterior paint)
        if (node.name === 'yellow_WhiteCar_0' || 
            node.name.toLowerCase().includes('body') || 
            node.name.toLowerCase().includes('paint') ||
            node.name.toLowerCase().includes('exterior')) {
          
          // Create new physical material like lambo
          node.material = new THREE.MeshPhysicalMaterial({
            roughness: 0.3,
            metalness: 0.05,
            color: '#ff8000', // McLaren orange
            envMapIntensity: 0.75,
            clearcoatRoughness: 0,
            clearcoat: 1 // This is key for realistic reflections!
          })
        }
      }
    })
  }, [nodes, materials])
  
  return <primitive ref={ref} object={scene} {...props} />
})

// Preload the model
useGLTF.preload('/lambo.glb')