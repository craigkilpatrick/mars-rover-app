import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RoverControls from '../RoverControls'
import { Rover } from '../../types/rover'

describe('RoverControls', () => {
  const mockRover: Rover = { id: 1, x: 5, y: 10, direction: 'N', color: '#ff0000' }
  const mockOnSendCommands = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render placeholder when rover is undefined', () => {
    render(<RoverControls rover={undefined} onSendCommands={mockOnSendCommands} />)
    expect(screen.getByTestId('no-rover-placeholder')).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('should render rover ID and position when rover is provided', () => {
    render(<RoverControls rover={mockRover} onSendCommands={mockOnSendCommands} />)
    expect(screen.getByText('ROV-01')).toBeInTheDocument()
    expect(screen.getByTestId('rover-position')).toHaveTextContent('X: 5 Y: 10 | DIR: N')
  })

  it('should call onSendCommands with ["f"] when forward button clicked', () => {
    render(<RoverControls rover={mockRover} onSendCommands={mockOnSendCommands} />)
    fireEvent.click(screen.getByRole('button', { name: /forward/i }))
    expect(mockOnSendCommands).toHaveBeenCalledWith(['f'])
  })

  it('should call onSendCommands with ["b"] when backward button clicked', () => {
    render(<RoverControls rover={mockRover} onSendCommands={mockOnSendCommands} />)
    fireEvent.click(screen.getByRole('button', { name: /backward/i }))
    expect(mockOnSendCommands).toHaveBeenCalledWith(['b'])
  })

  it('should call onSendCommands with ["l"] when turn left button clicked', () => {
    render(<RoverControls rover={mockRover} onSendCommands={mockOnSendCommands} />)
    fireEvent.click(screen.getByRole('button', { name: /turn left/i }))
    expect(mockOnSendCommands).toHaveBeenCalledWith(['l'])
  })

  it('should call onSendCommands with ["r"] when turn right button clicked', () => {
    render(<RoverControls rover={mockRover} onSendCommands={mockOnSendCommands} />)
    fireEvent.click(screen.getByRole('button', { name: /turn right/i }))
    expect(mockOnSendCommands).toHaveBeenCalledWith(['r'])
  })

  it('should strip invalid chars from command input', () => {
    render(<RoverControls rover={mockRover} onSendCommands={mockOnSendCommands} />)
    const input = screen.getByTestId('command-input')
    fireEvent.change(input, { target: { value: 'ffXZ12lr' } })
    expect(input).toHaveValue('fflr')
  })

  it('should call onSendCommands with split array on Execute click and clear input', () => {
    render(<RoverControls rover={mockRover} onSendCommands={mockOnSendCommands} />)
    const input = screen.getByTestId('command-input')
    fireEvent.change(input, { target: { value: 'ffb' } })
    fireEvent.click(screen.getByTestId('execute-btn'))
    expect(mockOnSendCommands).toHaveBeenCalledWith(['f', 'f', 'b'])
    expect(input).toHaveValue('')
  })
})
