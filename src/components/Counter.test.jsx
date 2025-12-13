import { render, screen, fireEvent } from '@testing-library/react'
import Counter from './Counter'

describe('Counter', () => {
  test('renders counter with initial value 0', () => {
    render(<Counter />)
    const countValue = screen.getByText('0')
    expect(countValue).toBeInTheDocument()
  })

  test('increments count when + button is clicked', () => {
    render(<Counter />)
    const incrementButton = screen.getByText('+')
    const countValue = screen.getByText('0')
    
    fireEvent.click(incrementButton)
    expect(countValue).toHaveTextContent('1')
    
    fireEvent.click(incrementButton)
    expect(countValue).toHaveTextContent('2')
  })

  test('decrements count when - button is clicked', () => {
    render(<Counter />)
    const decrementButton = screen.getByText('-')
    const countValue = screen.getByText('0')
    
    fireEvent.click(decrementButton)
    expect(countValue).toHaveTextContent('-1')
  })

  test('resets count when Reset button is clicked', () => {
    render(<Counter />)
    const incrementButton = screen.getByText('+')
    const resetButton = screen.getByText('Reset')
    const countValue = screen.getByText('0')
    
    fireEvent.click(incrementButton)
    fireEvent.click(incrementButton)
    expect(countValue).toHaveTextContent('2')
    
    fireEvent.click(resetButton)
    expect(countValue).toHaveTextContent('0')
  })
})

