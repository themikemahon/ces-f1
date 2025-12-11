import { Html } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'
import hotspotData from '../../data/hotspots.json'

export function Hotspots({ onHotspotClick, focusMode }) {
  
  const { camera } = useThree()
  const [hotspotOpacities, setHotspotOpacities] = useState({})
  
  useFrame(() => {
    const newOpacities = {}
    hotspotData.hotspots.forEach((hotspot) => {
      const hotspotPos = new THREE.Vector3(...hotspot.position)
      const distance = camera.position.distanceTo(hotspotPos)
      
      // Keep hotspots bright and visible at all distances
      // Only slight dimming at very far distances
      const normalizedDistance = Math.max(0, Math.min(1, (distance - 6) / 15))
      const opacity = Math.max(0.8, 1 - normalizedDistance * 0.2)
      
      newOpacities[hotspot.id] = opacity
    })
    setHotspotOpacities(newOpacities)
  })
  
  return (
    <>
      {hotspotData.hotspots.map((hotspot) => (
        <Html
          key={hotspot.id}
          position={hotspot.position}
          distanceFactor={8}
          occlude={true}
          zIndexRange={[100, 0]}
        >
          <div
            className={`hotspot-marker ${hotspot.category} ${focusMode ? 'focus-mode' : ''}`}
            onClick={() => onHotspotClick && onHotspotClick(hotspot)}
            style={{ 
              opacity: hotspotOpacities[hotspot.id] || 1
            }}
          >
            <div className="pulse-ring"></div>
            <div className="hotspot-dot"></div>
          </div>
        </Html>
      ))}
    </>
  )
}