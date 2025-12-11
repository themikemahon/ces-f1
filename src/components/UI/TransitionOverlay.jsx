import { useState, useEffect } from 'react'

export function TransitionOverlay({ isTransitioning }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isTransitioning) {
      setShow(true)
      // Hide after animation completes
      setTimeout(() => setShow(false), 600)
    }
  }, [isTransitioning])

  if (!show) return null

  return (
    <div className="transition-overlay">
      <div className="transition-blur"></div>
    </div>
  )
}