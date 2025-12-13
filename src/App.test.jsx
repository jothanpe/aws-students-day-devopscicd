import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  test('renders welcome message', () => {
    render(<App />)
    const welcomeElement = screen.getByText(/AWS S3 Static Application/i)
    expect(welcomeElement).toBeInTheDocument()
  })

  test('renders welcome component', () => {
    render(<App />)
    const subtitle = screen.getByText(/DevOps CI\/CD con CodeBuild/i)
    expect(subtitle).toBeInTheDocument()
  })
})

