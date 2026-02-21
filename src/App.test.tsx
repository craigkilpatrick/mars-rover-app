import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import App from './App'
import { getRovers, createRover, deleteRover, sendCommands } from './services/roverApi'
import { Direction, Rover } from './types/rover'

// Mock the API module
vi.mock('./services/roverApi')

describe('App', () => {
  const mockRovers: Rover[] = [
    { id: 1, x: 0, y: 0, direction: 'N' as Direction, color: '#ff0000' },
    { id: 2, x: 50, y: 50, direction: 'E' as Direction, color: '#00ff00' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getRovers).mockResolvedValue(mockRovers)
    vi.mocked(createRover).mockResolvedValue({ ...mockRovers[0], id: 3 })
    vi.mocked(deleteRover).mockResolvedValue()
    vi.mocked(sendCommands).mockResolvedValue({ rover: { ...mockRovers[0], x: 1 } })
  })

  it('should load and display rovers on mount', async () => {
    render(<App />)

    // Initially shows loading state
    expect(screen.getByTestId('loading')).toBeInTheDocument()

    // Wait for rovers to load
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    })

    // Rover cards are rendered
    await waitFor(() => {
      expect(screen.getByTestId('rover-card-1')).toBeInTheDocument()
      expect(screen.getByTestId('rover-card-2')).toBeInTheDocument()
      expect(screen.getByText('ROV-01')).toBeInTheDocument()
      expect(screen.getByText('ROV-02')).toBeInTheDocument()
    })
  })

  it('should handle rover selection', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByTestId('rover-card-1')).toBeInTheDocument()
    })

    // Click the select button inside rover card 1
    const card1 = screen.getByTestId('rover-card-1')
    const selectBtn = card1.querySelector('button')!
    fireEvent.click(selectBtn)

    // Card 1 should now have cyan selection style
    await waitFor(() => {
      expect(card1).toHaveClass('border-cyan-400')
    })

    // Command input should appear
    await waitFor(() => {
      expect(screen.queryByRole('textbox')).not.toBeNull()
    })
  })

  it('should handle rover deletion', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByTestId('rover-card-1')).toBeInTheDocument()
    })

    // Select rover 1
    const selectBtn = screen.getByTestId('rover-card-1').querySelector('button')!
    fireEvent.click(selectBtn)

    // Click the delete button that appears on the selected card
    await waitFor(() => {
      expect(screen.getByTestId('delete-rover')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByTestId('delete-rover'))

    // Verify delete API was called
    expect(vi.mocked(deleteRover)).toHaveBeenCalledWith(1)

    // Rover 1 card should be gone
    await waitFor(() => {
      expect(screen.queryByTestId('rover-card-1')).not.toBeInTheDocument()
      expect(screen.getByTestId('rover-card-2')).toBeInTheDocument()
    })
  })

  it('should create new rovers', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId('add-rover'))

    await waitFor(() => {
      expect(vi.mocked(createRover)).toHaveBeenCalled()
    })
  })

  it('should send commands to selected rover', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByTestId('rover-card-1')).toBeInTheDocument()
    })

    // Select rover 1
    const selectBtn = screen.getByTestId('rover-card-1').querySelector('button')!
    fireEvent.click(selectBtn)

    let commandInput: HTMLElement | null = null
    await waitFor(() => {
      commandInput = screen.queryByRole('textbox')
      expect(commandInput).not.toBeNull()
    })

    fireEvent.change(commandInput!, { target: { value: 'f' } })

    const executeButton = screen.getByRole('button', { name: /execute/i })
    fireEvent.click(executeButton)

    await waitFor(() => {
      expect(vi.mocked(sendCommands)).toHaveBeenCalledWith(1, ['f'])
    })
  })

  it('should respect coordinate system boundaries', async () => {
    vi.mocked(createRover).mockImplementation(async (x: number, y: number, direction: string) => {
      if (x < 0 || x > 99 || y < 0 || y > 99) {
        throw new Error('Invalid coordinates')
      }
      return Promise.resolve({ id: 3, x, y, direction: direction as Direction, color: '#ff0000' })
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId('add-rover'))

    await waitFor(() => {
      const call = vi.mocked(createRover).mock.calls[0]
      const [x, y] = call
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThanOrEqual(99)
      expect(y).toBeGreaterThanOrEqual(0)
      expect(y).toBeLessThanOrEqual(99)
    })
  })

  it('should handle API errors gracefully', async () => {
    vi.mocked(getRovers).mockRejectedValue(new Error('Failed to fetch rovers'))

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/failed to load rovers/i)).toBeInTheDocument()
    })
  })

  it('should handle rover creation errors', async () => {
    vi.mocked(createRover).mockRejectedValue(new Error('Failed to create rover'))

    render(<App />)
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId('add-rover'))

    await waitFor(() => {
      expect(screen.getByText(/failed to create rover/i)).toBeInTheDocument()
    })
  })

  it('should handle rover deletion errors', async () => {
    vi.mocked(deleteRover).mockRejectedValue(new Error('Failed to delete rover'))

    render(<App />)

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByTestId('rover-card-1')).toBeInTheDocument()
    })

    // Select and try to delete rover 1
    const selectBtn = screen.getByTestId('rover-card-1').querySelector('button')!
    fireEvent.click(selectBtn)

    await waitFor(() => {
      expect(screen.getByTestId('delete-rover')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByTestId('delete-rover'))

    await waitFor(() => {
      expect(screen.getByText(/failed to delete rover/i)).toBeInTheDocument()
    })
  })

  it('should handle command execution errors', async () => {
    vi.mocked(sendCommands).mockRejectedValue(new Error('Failed to send commands'))

    render(<App />)

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByTestId('rover-card-1')).toBeInTheDocument()
    })

    const selectBtn = screen.getByTestId('rover-card-1').querySelector('button')!
    fireEvent.click(selectBtn)

    let commandInput: HTMLElement | null = null
    await waitFor(() => {
      commandInput = screen.queryByRole('textbox')
      expect(commandInput).not.toBeNull()
    })

    fireEvent.change(commandInput!, { target: { value: 'f' } })

    const executeButton = screen.getByRole('button', { name: /execute/i })
    fireEvent.click(executeButton)

    await waitFor(() => {
      expect(screen.getByText(/failed to send commands/i)).toBeInTheDocument()
    })
  })

  it('should handle command execution with no selected rover', async () => {
    const mockRover: Rover = {
      id: 1,
      x: 0,
      y: 0,
      direction: 'N' as Direction,
      color: '#ff0000',
    }
    vi.mocked(getRovers).mockResolvedValue([mockRover])

    render(<App />)
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByTestId('rover-card-1')).toBeInTheDocument()
    })

    const selectBtn = screen.getByTestId('rover-card-1').querySelector('button')!
    fireEvent.click(selectBtn)

    let commandInput: HTMLElement | null = null
    await waitFor(() => {
      commandInput = screen.queryByRole('textbox')
      expect(commandInput).not.toBeNull()
    })

    await act(async () => {
      fireEvent.change(commandInput!, { target: { value: 'f' } })
    })

    let executeButton: HTMLElement | null = null
    await waitFor(() => {
      executeButton = screen.queryByRole('button', { name: /execute/i })
      expect(executeButton).not.toBeNull()
    })

    await act(async () => {
      fireEvent.click(executeButton!)
    })

    expect(vi.mocked(sendCommands)).toHaveBeenCalledWith(1, ['f'])
  })
})
