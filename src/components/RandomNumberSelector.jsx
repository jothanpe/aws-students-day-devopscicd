import { useState } from 'react'
import './RandomNumberSelector.css'

function RandomNumberSelector() {
  const [startNumber, setStartNumber] = useState(1)
  const [endNumber, setEndNumber] = useState(100)
  const [randomNumber, setRandomNumber] = useState(null)
  const [error, setError] = useState('')

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

  const generateRandomNumber = () => {
    if (startNumber >= endNumber) {
      setError('El número de inicio debe ser menor que el número de fin')
      setRandomNumber(null)
      return
    }

    const min = Math.ceil(startNumber)
    const max = Math.floor(endNumber)
    const random = Math.floor(Math.random() * (max - min + 1)) + min
    setRandomNumber(random)
    setError('')
  }

  const reset = () => {
    setRandomNumber(null)
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
          disabled={startNumber >= endNumber}
        >
          Generar Número Aleatorio
        </button>
        {randomNumber !== null && (
          <button className="btn btn-reset" onClick={reset}>
            Reiniciar
          </button>
        )}
      </div>

      {randomNumber !== null && (
        <div className="result-container">
          <div className="result-label">Número aleatorio generado:</div>
          <div className="result-number">{randomNumber}</div>
          <div className="result-range">
            (Rango: {startNumber} - {endNumber})
          </div>
        </div>
      )}
    </div>
  )
}

export default RandomNumberSelector

