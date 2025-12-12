import { useState } from 'react'

export function ModelSelector({ selectedModel, onModelChange }) {
  const [isOpen, setIsOpen] = useState(false)
  
  const models = [
    { id: 'f1-geometry', name: 'F1 Car (Geometry)' },
    { id: 'lamborghini', name: 'Lamborghini Urus' }
  ]
  
  const currentModel = models.find(m => m.id === selectedModel) || models[0]
  
  return (
    <div className="model-selector">
      <button 
        className="model-selector-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="model-name">{currentModel.name}</span>
        <svg 
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
          width="12" 
          height="12" 
          viewBox="0 0 12 12"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="model-dropdown">
          {models.map(model => (
            <button
              key={model.id}
              className={`model-option ${selectedModel === model.id ? 'selected' : ''}`}
              onClick={() => {
                onModelChange(model.id)
                setIsOpen(false)
              }}
            >
              <span className="model-name">{model.name}</span>
              {selectedModel === model.id && (
                <svg width="16" height="16" viewBox="0 0 16 16" className="check-icon">
                  <path d="M13.5 3.5L6 11l-3.5-3.5" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}