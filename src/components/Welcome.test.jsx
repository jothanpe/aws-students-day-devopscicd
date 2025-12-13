import { render, screen } from '@testing-library/react'
import Welcome from './Welcome'

describe('Welcome', () => {
  test('renders welcome heading', () => {
    render(<Welcome />)
    const heading = screen.getByText(/AWS Students Community Day/i)
    expect(heading).toBeInTheDocument()
  })

  test('renders subtitle', () => {
    render(<Welcome />)
    const subtitle = screen.getByText(/CI\/CD con CodePipeline/i)
    expect(subtitle).toBeInTheDocument()
  })

  test('renders description', () => {
    render(<Welcome />)
    const description = screen.getByText(/Esta aplicación está desplegada/i)
    expect(description).toBeInTheDocument()
  })

  test('renders AWS Communities image', () => {
    render(<Welcome />)
    const image = screen.getByAltText('AWS Communities')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/AWSCommunities.jpg')
  })

  test('renders AWS ReInvent image', () => {
    render(<Welcome />)
    const image = screen.getByAltText('AWS ReInvent Profile')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/AWSReInvent-Profile.jpg')
  })
})

