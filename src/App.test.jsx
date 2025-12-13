import { render, screen } from '@testing-library/react'
import App from './App'

// Test simple de ejemplo - verifica que la aplicación se renderiza
describe('App', () => {
  test('renders application', () => {
    render(<App />)
    const welcomeElement = screen.getByText(/AWS Students Community Day/i)
    expect(welcomeElement).toBeInTheDocument()
  })
})

