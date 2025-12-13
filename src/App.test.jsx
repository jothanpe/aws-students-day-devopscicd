import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  test('renders welcome message', () => {
    render(<App />)
    const welcomeElement = screen.getByText(/AWS S3 Static Application/i)
    expect(welcomeElement).toBeInTheDocument()
  })

  test('renders counter component', () => {
    render(<App />)
    const counterElement = screen.getByText(/Contador/i)
    expect(counterElement).toBeInTheDocument()
  })

  test('renders toggle button', () => {
    render(<App />)
    const toggleButton = screen.getByText(/Ocultar Contador/i)
    expect(toggleButton).toBeInTheDocument()
  })
})

