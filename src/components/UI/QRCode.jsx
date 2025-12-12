import { useState, useEffect } from 'react'

export function QRCodeComponent({ selectedModel, onModalChange }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const handleExpand = (expanded) => {
    setIsExpanded(expanded)
    if (onModalChange) {
      onModalChange(expanded)
    }
  }
  
  // Static Deloitte article URL
  const qrUrl = "https://www.deloitte.com/us/en/insights/topics/business-strategy-growth/racing-digital-twin-technology.html"
  
  // For mobile, directly navigate to URL instead of showing modal
  const handleClick = () => {
    if (isMobile) {
      window.open(qrUrl, '_blank')
    } else {
      handleExpand(true)
    }
  }
  
  // Generate QR code using QR Server API (only for desktop)
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}`

  return (
    <>
      {/* Info button - smaller on mobile */}
      <div className={`info-button-container ${isMobile ? 'mobile' : ''}`}>
        <button
          onClick={handleClick}
          className={`info-button ${isMobile ? 'mobile' : ''}`}
          title={isMobile ? "Learn more about racing digital twin technology" : "Share this experience"}
        >
          {isMobile ? (
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          ) : (
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm6 0h2v2h-2V5zm4 0h2v2h-2V5zm-4 4h2v2h-2V9zm4 0h2v2h-2V9zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm8-2h2v2h-2v-2zm0 4h2v2h-2v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Desktop QR Modal */}
      {!isMobile && isExpanded && (
        <div className="qr-modal-overlay" onClick={() => handleExpand(false)}>
          <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="qr-modal-header">
              <h3>Share This Experience</h3>
              <button
                onClick={() => handleExpand(false)}
                className="qr-close-btn"
              >
                ×
              </button>
            </div>
            
            <div className="qr-code-container">
              <img 
                src={qrCodeImageUrl}
                alt="QR Code"
                style={{ 
                  width: '200px', 
                  height: '200px',
                  border: '1px solid #ddd',
                  borderRadius: '8px'
                }}
              />
            </div>
            
            <p className="qr-description">
              Scan to learn more about racing digital twin technology and Deloitte's insights
            </p>
            
            <div className="qr-url-display">
              <small>{qrUrl}</small>
            </div>
          </div>
        </div>
      )}
    </>
  )
}