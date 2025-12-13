import { render, screen, fireEvent } from '@testing-library/react'
import RandomNumberSelector from './RandomNumberSelector'

describe('RandomNumberSelector', () => {
  test('renders component with default values', () => {
    render(<RandomNumberSelector />)
    
    expect(screen.getByText('Selector de Número Aleatorio')).toBeInTheDocument()
    expect(screen.getByLabelText('Número de inicio:')).toBeInTheDocument()
    expect(screen.getByLabelText('Número de fin:')).toBeInTheDocument()
    expect(screen.getByText('Generar Número Aleatorio')).toBeInTheDocument()
  })

  test('allows changing start number', () => {
    render(<RandomNumberSelector />)
    const startInput = screen.getByLabelText('Número de inicio:')
    
    fireEvent.change(startInput, { target: { value: '10' } })
    expect(startInput).toHaveValue(10)
  })

  test('allows changing end number', () => {
    render(<RandomNumberSelector />)
    const endInput = screen.getByLabelText('Número de fin:')
    
    fireEvent.change(endInput, { target: { value: '50' } })
    expect(endInput).toHaveValue(50)
  })

  test('shows error when start number is greater than or equal to end number', () => {
    render(<RandomNumberSelector />)
    const startInput = screen.getByLabelText('Número de inicio:')
    const endInput = screen.getByLabelText('Número de fin:')
    const generateButton = screen.getByText('Generar Número Aleatorio')
    
    fireEvent.change(startInput, { target: { value: '100' } })
    fireEvent.change(endInput, { target: { value: '50' } })
    fireEvent.click(generateButton)
    
    expect(screen.getByText(/El número de inicio debe ser menor que el número de fin/i)).toBeInTheDocument()
  })

  test('generates random number within range', () => {
    render(<RandomNumberSelector />)
    const startInput = screen.getByLabelText('Número de inicio:')
    const endInput = screen.getByLabelText('Número de fin:')
    const generateButton = screen.getByText('Generar Número Aleatorio')
    
    fireEvent.change(startInput, { target: { value: '1' } })
    fireEvent.change(endInput, { target: { value: '10' } })
    fireEvent.click(generateButton)
    
    const resultNumber = screen.getByText(/Número aleatorio generado:/i)
    expect(resultNumber).toBeInTheDocument()
    
    const numberElement = screen.getByText(/\d+/)
    const generatedNumber = parseInt(numberElement.textContent, 10)
    expect(generatedNumber).toBeGreaterThanOrEqual(1)
    expect(generatedNumber).toBeLessThanOrEqual(10)
  })

  test('shows reset button after generating number', () => {
    render(<RandomNumberSelector />)
    const generateButton = screen.getByText('Generar Número Aleatorio')
    
    fireEvent.click(generateButton)
    
    expect(screen.getByText('Reiniciar')).toBeInTheDocument()
  })

  test('resets result when reset button is clicked', () => {
    render(<RandomNumberSelector />)
    const generateButton = screen.getByText('Generar Número Aleatorio')
    
    fireEvent.click(generateButton)
    expect(screen.getByText(/Número aleatorio generado:/i)).toBeInTheDocument()
    
    const resetButton = screen.getByText('Reiniciar')
    fireEvent.click(resetButton)
    
    expect(screen.queryByText(/Número aleatorio generado:/i)).not.toBeInTheDocument()
  })

  test('disables generate button when start >= end', () => {
    render(<RandomNumberSelector />)
    const startInput = screen.getByLabelText('Número de inicio:')
    const endInput = screen.getByLabelText('Número de fin:')
    const generateButton = screen.getByText('Generar Número Aleatorio')
    
    fireEvent.change(startInput, { target: { value: '50' } })
    fireEvent.change(endInput, { target: { value: '50' } })
    
    expect(generateButton).toBeDisabled()
  })
})

