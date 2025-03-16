import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RoverList from '../RoverList'
import { Rover } from '../../types/rover'
import { ThemeProvider, createTheme } from '@mui/material'

describe('RoverList', () => {
  const theme = createTheme()
  const mockRovers: Rover[] = [
    { id: 1, x: 0, y: 0, direction: 'N', color: '#ff0000' },
    { id: 2, x: 50, y: 50, direction: 'E', color: '#00ff00' },
  ]

  const mockOnSelectRover = vi.fn()
  const mockOnDeleteRover = vi.fn()
  const mockOnAddRover = vi.fn()

  const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all rovers in the list', () => {
    renderWithTheme(
      <RoverList
        rovers={mockRovers}
        selectedRoverId={null}
        onSelectRover={mockOnSelectRover}
        onDeleteRover={mockOnDeleteRover}
        onAddRover={mockOnAddRover}
      />
    )

    mockRovers.forEach(rover => {
      const roverText = screen.getByText(
        `Rover ${rover.id} (${rover.x}, ${rover.y}) ${rover.direction}`
      )
      expect(roverText).toBeInTheDocument()
    })
  })

  it('should highlight selected rover', () => {
    renderWithTheme(
      <RoverList
        rovers={mockRovers}
        selectedRoverId={1}
        onSelectRover={mockOnSelectRover}
        onDeleteRover={mockOnDeleteRover}
        onAddRover={mockOnAddRover}
      />
    )

    const roverButton = screen.getByRole('button', { name: `Rover 1 (0, 0) N` })
    expect(roverButton).toHaveClass('Mui-selected')
  })

  it('should call onSelectRover when clicking a rover', () => {
    renderWithTheme(
      <RoverList
        rovers={mockRovers}
        selectedRoverId={null}
        onSelectRover={mockOnSelectRover}
        onDeleteRover={mockOnDeleteRover}
        onAddRover={mockOnAddRover}
      />
    )

    const roverButton = screen.getByRole('button', { name: `Rover 1 (0, 0) N` })
    fireEvent.click(roverButton)
    expect(mockOnSelectRover).toHaveBeenCalledWith(1)
  })

  it('should call onDeleteRover when clicking delete button', () => {
    renderWithTheme(
      <RoverList
        rovers={mockRovers}
        selectedRoverId={1}
        onSelectRover={mockOnSelectRover}
        onDeleteRover={mockOnDeleteRover}
        onAddRover={mockOnAddRover}
      />
    )

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)
    expect(mockOnDeleteRover).toHaveBeenCalledWith(1)
  })

  it('should display correct coordinate information based on coordinate system', () => {
    const roverAtOrigin: Rover = { id: 1, x: 0, y: 0, direction: 'N', color: '#ff0000' }
    const roverAtMax: Rover = { id: 2, x: 99, y: 99, direction: 'E', color: '#00ff00' }

    renderWithTheme(
      <RoverList
        rovers={[roverAtOrigin, roverAtMax]}
        selectedRoverId={null}
        onSelectRover={mockOnSelectRover}
        onDeleteRover={mockOnDeleteRover}
        onAddRover={mockOnAddRover}
      />
    )

    // Check if rovers at boundary positions are displayed correctly
    expect(screen.getByText(`Rover 1 (0, 0) N`)).toBeInTheDocument()
    expect(screen.getByText(`Rover 2 (99, 99) E`)).toBeInTheDocument()
  })

  it('should handle empty rovers array', () => {
    renderWithTheme(
      <RoverList
        rovers={[]}
        selectedRoverId={null}
        onSelectRover={mockOnSelectRover}
        onDeleteRover={mockOnDeleteRover}
        onAddRover={mockOnAddRover}
      />
    )

    // With an empty list, we should still see the header and buttons
    expect(screen.getByText('Mars Rovers')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add new rover/i })).toBeInTheDocument()
  })

  it('should disable delete button when no rover is selected', () => {
    renderWithTheme(
      <RoverList
        rovers={mockRovers}
        selectedRoverId={null}
        onSelectRover={mockOnSelectRover}
        onDeleteRover={mockOnDeleteRover}
        onAddRover={mockOnAddRover}
      />
    )

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    expect(deleteButton).toBeDisabled()
  })

  it('should call onAddRover when clicking add button', () => {
    renderWithTheme(
      <RoverList
        rovers={mockRovers}
        selectedRoverId={null}
        onSelectRover={mockOnSelectRover}
        onDeleteRover={mockOnDeleteRover}
        onAddRover={mockOnAddRover}
      />
    )

    const addButton = screen.getByRole('button', { name: /add new rover/i })
    fireEvent.click(addButton)
    expect(mockOnAddRover).toHaveBeenCalled()
  })
})
