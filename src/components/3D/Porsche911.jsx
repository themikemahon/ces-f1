import { useRef, forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'

export const Porsche911 = forwardRef((props, ref) => {
  const { nodes, materials } = useGLTF('/models/911-transformed.glb')
  
  return (
    <group ref={ref} {...props} dispose={null}>
      <group 
        scale={[1, 1, 1]} 
        position={[0, .65, 1.5]}
        rotation={[0, 0, 0]}
      >
        <mesh castShadow receiveShadow>
          <primitive 
            object={nodes.Scene || nodes.RootNode || Object.values(nodes)[0]} 
          />
        </mesh>
      </group>
    </group>
  )
})

// Preload the model for better performance
useGLTF.preload('/models/911-transformed.glb')