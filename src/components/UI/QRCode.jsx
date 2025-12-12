import { useState } from 'react'

export function QRCodeComponent({ selectedModel, onModalChange }) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const handleExpand = (expanded) => {
    setIsExpanded(expanded)
    if (onModalChange) {
      onModalChange(expanded)
    }
  }
  
  // Static Deloitte article URL
  const qrUrl = "https://www.deloitte.com/us/en/insights/topics/business-strategy-growth/racing-digital-twin-technology.html"
  
  // Generate QR code using QR Server API
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}`

  return (
    <>
      {/* Fixed QR button */}
      <div className="qr-button-container">
        <button
          onClick={() => handleExpand(true)}
          className="qr-button"
        >
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm6 0h2v2h-2V5zm4 0h2v2h-2V5zm-4 4h2v2h-2V9zm4 0h2v2h-2V9zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm8-2h2v2h-2v-2zm0 4h2v2h-2v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
          </svg>
        </button>
      </div>

      {/* Expanded QR Modal */}
      {isExpanded && (
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