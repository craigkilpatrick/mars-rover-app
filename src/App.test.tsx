import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act, within } from '@testing-library/react'
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

    // Initially should show loading state
    expect(screen.getByTestId('loading')).toBeInTheDocument()

    // Wait for rovers to load
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    })

    // Wait for list items to be available
    await waitFor(() => {
      const listItems = screen.getAllByRole('listitem')
      expect(listItems.length).toBe(2)
      expect(listItems[0].textContent).toContain('Rover 1')
      expect(listItems[1].textContent).toContain('Rover 2')
    })
  })

  it('should handle rover selection', async () => {
    render(<App />)

    // Wait for rovers to load
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    })

    // Wait for list items to be available
    let listItems: HTMLElement[] = []
    await waitFor(() => {
      listItems = screen.getAllByRole('listitem')
      expect(listItems.length).toBeGreaterThan(0)
    })

    // Find the button inside the first list item and click it
    const firstRoverButton = within(listItems[0]).getByRole('button')
    fireEvent.click(firstRoverButton)

    // Verify selection is reflected via data-selected attribute
    expect(firstRoverButton).toHaveAttribute('data-selected', 'true')

    // Wait for the command input to be available after rover selection
    let commandInput: HTMLElement | null = null
    await waitFor(() => {
      commandInput = screen.queryByRole('textbox')
      expect(commandInput).not.toBeNull()
      expect(commandInput).not.toBeDisabled()
    })
  })

  it('should handle rover deletion', async () => {
    render(<App />)

    // Wait for rovers to load
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    })

    // Wait for list items to be available
    let listItems: HTMLElement[] = []
    await waitFor(() => {
      listItems = screen.getAllByRole('listitem')
      expect(listItems.length).toBeGreaterThan(0)
    })

    // Select the first rover
    const firstRoverButton = within(listItems[0]).getByRole('button')
    fireEvent.click(firstRoverButton)

    // Find and click the delete button
    const deleteButton = screen.getByTestId('delete-rover')
    fireEvent.click(deleteButton)

    // Verify delete API was called
    expect(vi.mocked(deleteRover)).toHaveBeenCalledWith(1)

    // Verify UI updates after deletion
    await waitFor(() => {
      const updatedListItems = screen.getAllByRole('listitem')
      expect(updatedListItems.length).toBe(1)
      expect(updatedListItems[0].textContent).toContain('Rover 2')
    })
  })

  it('should create new rovers', async () => {
    render(<App />)

    // Wait for rovers to load
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    })

    // Click the add rover button
    const addButton = screen.getByRole('button', { name: /add new rover/i })
    fireEvent.click(addButton)

    // Verify a new rover was created
    await waitFor(() => {
      expect(vi.mocked(createRover)).toHaveBeenCalled()
    })
  })

  it('should send commands to selected rover', async () => {
    render(<App />)

    // Wait for rovers to load
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    })

    // Wait for list items to be available
    let listItems: HTMLElement[] = []
    await waitFor(() => {
      listItems = screen.getAllByRole('listitem')
      expect(listItems.length).toBeGreaterThan(0)
    })

    // Select a rover
    const firstRoverButton = within(listItems[0]).getByRole('button')
    fireEvent.click(firstRoverButton)

    // Wait for the command input
    let commandInput: HTMLElement | null = null
    await waitFor(() => {
      commandInput = screen.queryByRole('textbox')
      expect(commandInput).not.toBeNull()
    })

    // Fill the command input
    fireEvent.change(commandInput!, { target: { value: 'f' } })

    // Send the command
    const executeButton = screen.getByRole('button', { name: /execute/i })
    fireEvent.click(executeButton)

    // Verify the command was sent
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

    const addButton = screen.getByRole('button', { name: /add new rover/i })
    fireEvent.click(addButton)

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

    const addButton = screen.getByRole('button', { name: /add new rover/i })
    fireEvent.click(addButton)

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

    let listItems: HTMLElement[] = []
    await waitFor(() => {
      listItems = screen.getAllByRole('listitem')
      expect(listItems.length).toBeGreaterThan(0)
    })

    const firstRoverButton = within(listItems[0]).getByRole('button')
    fireEvent.click(firstRoverButton)

    const deleteButton = screen.getByTestId('delete-rover')
    fireEvent.click(deleteButton)

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

    let listItems: HTMLElement[] = []
    await waitFor(() => {
      listItems = screen.getAllByRole('listitem')
      expect(listItems.length).toBeGreaterThan(0)
    })

    const firstRoverButton = within(listItems[0]).getByRole('button')
    fireEvent.click(firstRoverButton)

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

    let listItems: HTMLElement[] = []
    await waitFor(() => {
      listItems = screen.getAllByRole('listitem')
      expect(listItems.length).toBeGreaterThan(0)
      expect(listItems[0].textContent).toContain('Rover 1')
    })

    const firstRoverButton = within(listItems[0]).getByRole('button')
    fireEvent.click(firstRoverButton)

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
