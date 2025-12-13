import { render, screen } from '@testing-library/react'
import Welcome from './Welcome'

// Test simple de ejemplo - verifica que el componente se renderiza
describe('Welcome', () => {
  test('renders welcome component', () => {
    render(<Welcome />)
    const heading = screen.getByText(/AWS Students Community Day/i)
    expect(heading).toBeInTheDocument()
  })
})

