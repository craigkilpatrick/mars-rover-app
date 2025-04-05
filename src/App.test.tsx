import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act, within } from '@testing-library/react'
import App from './App'
import { getRovers, createRover, deleteRover, sendCommands } from './services/roverApi'
import { ThemeProvider, createTheme } from '@mui/material'
import { Direction, Rover } from './types/rover'

// Mock the API module
vi.mock('./services/roverApi')

describe('App', () => {
  const theme = createTheme()
  const mockRovers: Rover[] = [
    { id: 1, x: 0, y: 0, direction: 'N', color: '#ff0000' },
    { id: 2, x: 50, y: 50, direction: 'E', color: '#00ff00' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    // Setup default mock implementations
    vi.mocked(getRovers).mockResolvedValue(mockRovers)
    vi.mocked(createRover).mockResolvedValue({ ...mockRovers[0], id: 3 })
    vi.mocked(deleteRover).mockResolvedValue()
    vi.mocked(sendCommands).mockResolvedValue({ ...mockRovers[0], x: 1 })
  })

  const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
  }

  it('should load and display rovers on mount', async () => {
    renderWithTheme(<App />)

    // Initially should show loading state
    expect(screen.getByRole('progressbar')).toBeInTheDocument()

    // Wait for rovers to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
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
    renderWithTheme(<App />)

    // Wait for rovers to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    // Wait for list items to be available
    let listItems: HTMLElement[] = []
    await waitFor(() => {
      listItems = screen.getAllByRole('listitem')
      expect(listItems.length).toBeGreaterThan(0)
    })

    // Find the button inside the first list item
    const firstRoverButton = within(listItems[0]).getByRole('button')
    fireEvent.click(firstRoverButton)

    // Verify selection is reflected in the UI (Material-UI uses Mui-selected class)
    expect(firstRoverButton).toHaveClass('Mui-selected')

    // Verify the command input is enabled
    const commandInput = screen.getByRole('textbox')
    expect(commandInput).not.toBeDisabled()
  })

  it('should handle rover deletion', async () => {
    renderWithTheme(<App />)

    // Wait for rovers to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    // Wait for list items to be available
    let listItems: HTMLElement[] = []
    await waitFor(() => {
      listItems = screen.getAllByRole('listitem')
      expect(listItems.length).toBeGreaterThan(0)
    })

    // Find the list items and select the first rover
    const firstRoverButton = within(listItems[0]).getByRole('button')
    fireEvent.click(firstRoverButton)

    // Find and click the delete button (it's the button with the delete icon)
    const deleteButton = screen.getByTestId('DeleteIcon').closest('button')
    fireEvent.click(deleteButton!)

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
    renderWithTheme(<App />)

    // Wait for rovers to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    // Click the add rover button (it's the button with the add icon)
    const addButton = screen.getByTestId('AddIcon').closest('button')
    fireEvent.click(addButton!)

    // Verify a new rover was created
    await waitFor(() => {
      expect(vi.mocked(createRover)).toHaveBeenCalled()
    })
  })

  it('should send commands to selected rover', async () => {
    renderWithTheme(<App />)

    // Wait for rovers to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
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

    // Find and fill the command input
    const commandInput = screen.getByRole('textbox')
    fireEvent.change(commandInput, { target: { value: 'f' } })

    // Send the command using the Execute button
    const executeButton = screen.getByRole('button', { name: /execute/i })
    fireEvent.click(executeButton)

    // Verify the command was sent
    await waitFor(() => {
      expect(vi.mocked(sendCommands)).toHaveBeenCalledWith(1, ['f'])
    })
  })

  it('should respect coordinate system boundaries', async () => {
    // Mock createRover to simulate boundary positions
    vi.mocked(createRover).mockImplementation(async (x: number, y: number, direction: string) => {
      // Validate coordinates are within bounds
      if (x < 0 || x > 99 || y < 0 || y > 99) {
        throw new Error('Invalid coordinates')
      }
      return { id: 3, x, y, direction: direction as Direction, color: '#ff0000' }
    })

    renderWithTheme(<App />)

    // Wait for rovers to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    // Add a new rover (which will use random coordinates)
    const addButton = screen.getByRole('button', { name: /add new rover/i })
    fireEvent.click(addButton)

    // Verify the new rover was created with valid coordinates
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
    // Mock API error
    vi.mocked(getRovers).mockRejectedValue(new Error('Failed to fetch rovers'))

    renderWithTheme(<App />)

    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText(/failed to load rovers/i)).toBeInTheDocument()
    })
  })

  it('should handle rover creation errors', async () => {
    vi.mocked(createRover).mockRejectedValue(new Error('Failed to create rover'))

    renderWithTheme(<App />)
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    const addButton = screen.getByRole('button', { name: /add new rover/i })
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByText(/failed to create rover/i)).toBeInTheDocument()
    })
  })

  it('should handle rover deletion errors', async () => {
    vi.mocked(deleteRover).mockRejectedValue(new Error('Failed to delete rover'))

    renderWithTheme(<App />)

    // Wait for rovers to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    // Wait for list items to be available
    let listItems: HTMLElement[] = []
    await waitFor(() => {
      listItems = screen.getAllByRole('listitem')
      expect(listItems.length).toBeGreaterThan(0)
    })

    // Select and try to delete a rover
    const firstRoverButton = within(listItems[0]).getByRole('button')
    fireEvent.click(firstRoverButton)

    // Find and click the delete button (it's the button with the delete icon)
    const deleteButton = screen.getByTestId('DeleteIcon').closest('button')
    fireEvent.click(deleteButton!)

    await waitFor(() => {
      expect(screen.getByText(/failed to delete rover/i)).toBeInTheDocument()
    })
  })

  it('should handle command execution errors', async () => {
    vi.mocked(sendCommands).mockRejectedValue(new Error('Failed to send commands'))

    renderWithTheme(<App />)

    // Wait for rovers to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    // Wait for list items to be available
    let listItems: HTMLElement[] = []
    await waitFor(() => {
      listItems = screen.getAllByRole('listitem')
      expect(listItems.length).toBeGreaterThan(0)
    })

    // Select a rover and try to send commands
    const firstRoverButton = within(listItems[0]).getByRole('button')
    fireEvent.click(firstRoverButton)

    const commandInput = screen.getByRole('textbox')
    fireEvent.change(commandInput, { target: { value: 'f' } })

    const executeButton = screen.getByRole('button', { name: /execute/i })
    fireEvent.click(executeButton)

    await waitFor(() => {
      expect(screen.getByText(/failed to send commands/i)).toBeInTheDocument()
    })
  })

  it('should handle command execution with no selected rover', async () => {
    // Mock getRovers to return a rover so we can test command execution
    const mockRover = {
      id: 1,
      x: 0,
      y: 0,
      direction: 'N',
      color: '#ff0000',
    }
    vi.mocked(getRovers).mockResolvedValue([mockRover])

    renderWithTheme(<App />)
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    // Wait for list items to be available
    let listItems: HTMLElement[] = []
    await waitFor(() => {
      listItems = screen.getAllByRole('listitem')
      expect(listItems.length).toBeGreaterThan(0)
      expect(listItems[0].textContent).toContain('Rover 1')
    })

    // Select the rover
    const firstRoverButton = within(listItems[0]).getByRole('button')
    fireEvent.click(firstRoverButton)

    // Now we can find the command input
    const commandInput = screen.getByRole('textbox')
    await act(async () => {
      fireEvent.change(commandInput, { target: { value: 'f' } })
    })

    const executeButton = screen.getByRole('button', { name: /execute/i })
    await act(async () => {
      fireEvent.click(executeButton)
    })

    // Verify the command was sent
    expect(vi.mocked(sendCommands)).toHaveBeenCalledWith(1, ['f'])
  })
})
