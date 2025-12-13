import { useState, useEffect } from 'react'
import './RandomNumberSelector.css'

function RandomNumberSelector() {
  const [startNumber, setStartNumber] = useState(1)
  const [endNumber, setEndNumber] = useState(100)
  const [randomNumber, setRandomNumber] = useState(null)
  const [error, setError] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [displayNumber, setDisplayNumber] = useState(null)

  const handleStartChange = (e) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value)) {
      setStartNumber(value)
      setError('')
    }
  }

  const handleEndChange = (e) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value)) {
      setEndNumber(value)
      setError('')
    }
  }

  useEffect(() => {
    if (isGenerating) {
      const min = Math.ceil(startNumber)
      const max = Math.floor(endNumber)
      const interval = setInterval(() => {
        // Genera números aleatorios rápidamente para crear efecto de "ruleta"
        const tempNumber = Math.floor(Math.random() * (max - min + 1)) + min
        setDisplayNumber(tempNumber)
      }, 50) // Cambia cada 50ms para efecto rápido

      // Después de 2.5 segundos, revela el número final
      const timeout = setTimeout(() => {
        const min = Math.ceil(startNumber)
        const max = Math.floor(endNumber)
        const finalNumber = Math.floor(Math.random() * (max - min + 1)) + min
        setRandomNumber(finalNumber)
        setDisplayNumber(finalNumber)
        setIsGenerating(false)
        clearInterval(interval)
      }, 2500)

      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    }
  }, [isGenerating, startNumber, endNumber])

  const generateRandomNumber = () => {
    if (startNumber >= endNumber) {
      setError('El número de inicio debe ser menor que el número de fin')
      setRandomNumber(null)
      setDisplayNumber(null)
      return
    }

    setError('')
    setRandomNumber(null)
    setDisplayNumber(null)
    setIsGenerating(true)
  }

  const reset = () => {
    setRandomNumber(null)
    setDisplayNumber(null)
    setIsGenerating(false)
    setError('')
  }

  return (
    <div className="random-selector">
      <h2>Selector de Número Aleatorio</h2>
      
      <div className="input-group">
        <div className="input-field">
          <label htmlFor="start-number">Número de inicio:</label>
          <input
            id="start-number"
            type="number"
            value={startNumber}
            onChange={handleStartChange}
            min="-999999"
            max="999999"
          />
        </div>

        <div className="input-field">
          <label htmlFor="end-number">Número de fin:</label>
          <input
            id="end-number"
            type="number"
            value={endNumber}
            onChange={handleEndChange}
            min="-999999"
            max="999999"
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="button-group">
        <button 
          className="btn btn-generate" 
          onClick={generateRandomNumber}
          disabled={startNumber >= endNumber || isGenerating}
        >
          {isGenerating ? 'Generando...' : 'Generar Número Aleatorio'}
        </button>
        {(randomNumber !== null || isGenerating) && (
          <button className="btn btn-reset" onClick={reset} disabled={isGenerating}>
            Reiniciar
          </button>
        )}
      </div>

      {isGenerating && (
        <div className="result-container generating">
          <div className="result-label">🎲 Generando número aleatorio...</div>
          <div className="result-number suspense-number">{displayNumber || '?'}</div>
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
          <div className="result-range">
            (Rango: {startNumber} - {endNumber})
          </div>
        </div>
      )}

      {randomNumber !== null && !isGenerating && (
        <div className="result-container final-result">
          <div className="result-label">🎉 ¡Número aleatorio generado!</div>
          <div className="result-number final-number">{randomNumber}</div>
          <div className="result-range">
            (Rango: {startNumber} - {endNumber})
          </div>
        </div>
      )}
    </div>
  )
}

export default RandomNumberSelector

