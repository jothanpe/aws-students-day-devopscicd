import { useState } from 'react'
import './App.css'
import Counter from './components/Counter'
import Welcome from './components/Welcome'

function App() {
  const [showCounter, setShowCounter] = useState(true)

  return (
    <div className="App">
      <Welcome />
      <div className="container">
        <button 
          className="toggle-button"
          onClick={() => setShowCounter(!showCounter)}
        >
          {showCounter ? 'Ocultar' : 'Mostrar'} Contador
        </button>
        {showCounter && <Counter />}
      </div>
    </div>
  )
}

export default App

