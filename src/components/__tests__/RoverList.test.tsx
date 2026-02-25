import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RoverList from '../RoverList'
import { Rover } from '../../types/rover'

describe('RoverList', () => {
  const mockRovers: Rover[] = [
    { id: 1, x: 0, y: 0, direction: 'N', color: '#ff0000' },
    { id: 2, x: 50, y: 50, direction: 'E', color: '#00ff00' },
  ]

  const mockOnSelectRover = vi.fn()
  const mockOnDeleteRover = vi.fn()
  const mockOnAddRover = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render a card for each rover with correct ID, coordinates, and direction', () => {
    render(
      <RoverList
        rovers={mockRovers}
        selectedRoverId={null}
        onSelectRover={mockOnSelectRover}
        onDeleteRover={mockOnDeleteRover}
        onAddRover={mockOnAddRover}
      />
    )

    // Check rover IDs
    expect(screen.getByText('ROV-01')).toBeInTheDocument()
    expect(screen.getByText('ROV-02')).toBeInTheDocument()

    // Check coordinates
    expect(screen.getByText('X: 0 Y: 0')).toBeInTheDocument()
    expect(screen.getByText('X: 50 Y: 50')).toBeInTheDocument()

    // Check directions
    expect(screen.getByText('N')).toBeInTheDocument()
    expect(screen.getByText('E')).toBeInTheDocument()
  })

  it('should apply active selection style to selected card', () => {
    render(
      <RoverList
        rovers={mockRovers}
        selectedRoverId={1}
        onSelectRover={mockOnSelectRover}
        onDeleteRover={mockOnDeleteRover}
        onAddRover={mockOnAddRover}
      />
    )

    const selectedCard = screen.getByTestId('rover-card-1')
    expect(selectedCard).toHaveClass('border-cyan-400')
  })

  it('should call onSelectRover with correct rover ID when clicking a card', () => {
    render(
      <RoverList
        rovers={mockRovers}
        selectedRoverId={null}
        onSelectRover={mockOnSelectRover}
        onDeleteRover={mockOnDeleteRover}
        onAddRover={mockOnAddRover}
      />
    )

    fireEvent.click(screen.getByTestId('rover-card-1').querySelector('button')!)
    expect(mockOnSelectRover).toHaveBeenCalledWith(1)

    fireEvent.click(screen.getByTestId('rover-card-2').querySelector('button')!)
    expect(mockOnSelectRover).toHaveBeenCalledWith(2)
  })

  it('should call onDeleteRover with correct rover ID when clicking delete button on selected card', () => {
    render(
      <RoverList
        rovers={mockRovers}
        selectedRoverId={1}
        onSelectRover={mockOnSelectRover}
        onDeleteRover={mockOnDeleteRover}
        onAddRover={mockOnAddRover}
      />
    )

    const deleteButton = screen.getByTestId('delete-rover')
    fireEvent.click(deleteButton)
    expect(mockOnDeleteRover).toHaveBeenCalledWith(1)
  })

  it('should call onAddRover when clicking Add Rover button', () => {
    render(
      <RoverList
        rovers={mockRovers}
        selectedRoverId={null}
        onSelectRover={mockOnSelectRover}
        onDeleteRover={mockOnDeleteRover}
        onAddRover={mockOnAddRover}
      />
    )

    fireEvent.click(screen.getByTestId('add-rover'))
    expect(mockOnAddRover).toHaveBeenCalled()
  })

  it('should display the correct rover count in the fleet header badge', () => {
    render(
      <RoverList
        rovers={mockRovers}
        selectedRoverId={null}
        onSelectRover={mockOnSelectRover}
        onDeleteRover={mockOnDeleteRover}
        onAddRover={mockOnAddRover}
      />
    )

    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('should render without error when rovers array is empty', () => {
    render(
      <RoverList
        rovers={[]}
        selectedRoverId={null}
        onSelectRover={mockOnSelectRover}
        onDeleteRover={mockOnDeleteRover}
        onAddRover={mockOnAddRover}
      />
    )

    expect(screen.getByText('FLEET')).toBeInTheDocument()
    expect(screen.getByTestId('add-rover')).toBeInTheDocument()
    // Badge shows 0
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('should not show delete button on non-selected cards', () => {
    render(
      <RoverList
        rovers={mockRovers}
        selectedRoverId={2}
        onSelectRover={mockOnSelectRover}
        onDeleteRover={mockOnDeleteRover}
        onAddRover={mockOnAddRover}
      />
    )

    // Only one delete button visible — the one on card 2
    const deleteButtons = screen.getAllByTestId('delete-rover')
    expect(deleteButtons).toHaveLength(1)
  })
})
