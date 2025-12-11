import { useGesture } from '@use-gesture/react'
import { useThree } from '@react-three/fiber'

export function useCustomGestures() {
  const { camera, gl } = useThree()
  
  const bind = useGesture({
    onDrag: ({ offset: [x, y], memo = camera.position.clone() }) => {
      // Custom drag behavior for camera rotation
      const spherical = new THREE.Spherical()
      spherical.setFromVector3(camera.position)
      
      spherical.theta = memo.theta - x * 0.01
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, memo.phi - y * 0.01))
      
      camera.position.setFromSpherical(spherical)
      camera.lookAt(0, 0, 0)
      
      return { theta: spherical.theta, phi: spherical.phi }
    },
    onPinch: ({ offset: [scale], memo = camera.position.length() }) => {
      // Custom pinch-to-zoom
      const newDistance = Math.max(3, Math.min(12, memo / scale))
      const direction = camera.position.clone().normalize()
      camera.position.copy(direction.multiplyScalar(newDistance))
    },
    onDoubleClick: () => {
      // Reset to default position
      camera.position.set(4, 2, 6)
      camera.lookAt(0, 0, 0)
    }
  })

  return bind
}