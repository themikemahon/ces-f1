import { useState } from 'react'
import { QRCodeSVG } from 'react-qr-code'

export function QRCodeComponent() {
  const [isExpanded, setIsExpanded] = useState(false)
  const qrUrl = "https://www.deloitte.com/uk/en/about/story/impact/circularity-handbook-formula-one.html"

  return (
    <>
      {/* Fixed QR button */}
      <div className="qr-button-container">
        <button
          onClick={() => setIsExpanded(true)}
          className="qr-button"
        >
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm6 0h2v2h-2V5zm4 0h2v2h-2V5zm-4 4h2v2h-2V9zm4 0h2v2h-2V9zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm8-2h2v2h-2v-2zm0 4h2v2h-2v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
          </svg>
        </button>
      </div>

      {/* Expanded QR Modal */}
      {isExpanded && (
        <div className="qr-modal-overlay">
          <div className="qr-modal">
            <div className="qr-modal-header">
              <h3>Get This Experience</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="qr-close-btn"
              >
                ×
              </button>
            </div>
            
            <div className="qr-code-container">
              <QRCodeSVG value={qrUrl} size={200} />
            </div>
            
            <p className="qr-description">
              Scan to learn more about McLaren F1 and Deloitte's sustainability initiatives
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