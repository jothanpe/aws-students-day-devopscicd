import { render, screen } from '@testing-library/react'
import RandomNumberSelector from './RandomNumberSelector'

// Test simple de ejemplo - verifica que el componente se renderiza
describe('RandomNumberSelector', () => {
  test('renders component', () => {
    render(<RandomNumberSelector />)
    expect(screen.getByText('Selector de Número Aleatorio')).toBeInTheDocument()
  })
})

