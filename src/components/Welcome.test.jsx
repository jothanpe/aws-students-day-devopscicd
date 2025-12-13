import { render, screen } from '@testing-library/react'
import Welcome from './Welcome'

describe('Welcome', () => {
  test('renders welcome heading', () => {
    render(<Welcome />)
    const heading = screen.getByText(/AWS S3 Static Application/i)
    expect(heading).toBeInTheDocument()
  })

  test('renders subtitle', () => {
    render(<Welcome />)
    const subtitle = screen.getByText(/DevOps CI\/CD con CodeBuild/i)
    expect(subtitle).toBeInTheDocument()
  })

  test('renders description', () => {
    render(<Welcome />)
    const description = screen.getByText(/Esta aplicación está desplegada/i)
    expect(description).toBeInTheDocument()
  })
})

