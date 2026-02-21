import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TopBar from '../TopBar'

describe('TopBar', () => {
  it('should render MISSION CONTROL title', () => {
    render(<TopBar isConnected={true} />)
    expect(screen.getByText('MISSION CONTROL')).toBeInTheDocument()
  })

  it('should render CONNECTED status when isConnected is true', () => {
    render(<TopBar isConnected={true} />)
    expect(screen.getByText(/CONNECTED/)).toBeInTheDocument()
    const status = screen.getByText(/● CONNECTED/)
    expect(status).toHaveStyle({ color: '#4ade80' })
  })

  it('should render DISCONNECTED status when isConnected is false', () => {
    render(<TopBar isConnected={false} />)
    expect(screen.getByText(/DISCONNECTED/)).toBeInTheDocument()
    const status = screen.getByText(/● DISCONNECTED/)
    expect(status).toHaveStyle({ color: '#ef4444' })
  })
})
