export function FocusPanel({ hotspot, onClose }) {
  if (!hotspot) return null

  return (
    <div className="focus-panel">
      <div className="focus-panel-header">
        <button onClick={onClose} className="focus-back-btn">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back to Full View
        </button>
      </div>
      
      <div className="focus-panel-content">
        <div className={`focus-category-badge ${hotspot.category}`}>
          {hotspot.category.toUpperCase()}
        </div>
        
        <h2 className="focus-title">{hotspot.title}</h2>
        
        <div className="focus-description">
          <p>{hotspot.content.description}</p>
        </div>
        
        {hotspot.content.videoUrl && (
          <div className="focus-video">
            <video controls width="100%">
              <source src={hotspot.content.videoUrl} type="video/mp4" />
            </video>
          </div>
        )}
        
        {hotspot.content.imageUrl && (
          <div className="focus-image">
            <img src={hotspot.content.imageUrl} alt={hotspot.title} />
          </div>
        )}
      </div>
    </div>
  )
}