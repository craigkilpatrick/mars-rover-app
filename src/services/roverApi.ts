/// <reference types="vite/client" />
import { Rover, Direction, Command } from '../types/rover'

const API_BASE_URL = '/api/rovers'

// Export ROVER_COLORS for testing
export const ROVER_COLORS = [
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
]

// Validate coordinates are within grid boundaries (0-99)
export const validateCoordinates = (x: number, y: number): boolean => {
  return x >= 0 && x <= 99 && y >= 0 && y <= 99
}

// Validate direction is one of N,S,E,W
export const validateDirection = (direction: string): direction is Direction => {
  return ['N', 'S', 'E', 'W'].includes(direction)
}

// Validate commands are valid (f,b,l,r)
export const validateCommands = (commands: string[]): commands is Command[] => {
  return commands.every((cmd): cmd is Command => ['f', 'b', 'l', 'r'].includes(cmd))
}

// Get a color for a rover based on its ID
export const getRoverColor = (id: number): string => {
  return ROVER_COLORS[id % ROVER_COLORS.length]
}

interface ApiRover {
  id: number
  x: number
  y: number
  direction: string
  _links?: {
    self?: { href: string }
    rovers?: { href: string }
  }
}

interface HalResponse {
  _embedded?: {
    roverList?: ApiRover[]
  }
  _links?: {
    self?: { href: string }
  }
}

interface RoverResponse {
  _embedded?: {
    rover?: ApiRover
  }
  _links?: {
    self?: { href: string }
  }
}

// Convert API rover to frontend rover with color
const convertApiRover = (apiRover: ApiRover): Rover | null => {
  if (!validateCoordinates(apiRover.x, apiRover.y) || !validateDirection(apiRover.direction)) {
    return null
  }

  return {
    id: apiRover.id,
    x: apiRover.x,
    y: apiRover.y,
    direction: apiRover.direction,
    color: getRoverColor(apiRover.id),
  }
}

export const getRovers = async (): Promise<Rover[]> => {
  try {
    const response = await fetch(API_BASE_URL)
    if (!response.ok) {
      throw new Error('Failed to fetch rovers')
    }

    const data: HalResponse = await response.json()
    const apiRovers = data._embedded?.roverList || []

    // Convert and filter out any invalid rovers
    return apiRovers.map(convertApiRover).filter((rover): rover is Rover => rover !== null)
  } catch (error) {
    console.error('Error fetching rovers:', error)
    throw new Error('Failed to fetch rovers')
  }
}

export const createRover = async (x: number, y: number, direction: Direction): Promise<Rover> => {
  try {
    // Validate input before making API call
    if (!validateCoordinates(x, y)) {
      throw new Error('Invalid coordinates')
    }

    if (!validateDirection(direction)) {
      throw new Error('Invalid direction')
    }

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ x, y, direction }),
    })

    if (!response.ok) {
      throw new Error('Failed to create rover')
    }

    const data: RoverResponse = await response.json()
    const apiRover = data._embedded?.rover

    if (!apiRover) {
      throw new Error('Invalid rover data received from server')
    }

    const rover = convertApiRover(apiRover)
    if (!rover) {
      throw new Error('Invalid rover data received from server')
    }

    return rover
  } catch (error) {
    console.error('Error creating rover:', error)
    if (
      error instanceof Error &&
      (error.message === 'Invalid coordinates' ||
        error.message === 'Invalid direction' ||
        error.message === 'Invalid rover data received from server')
    ) {
      throw error // Re-throw validation and data errors
    }
    throw new Error('Failed to create rover')
  }
}

export const deleteRover = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete rover')
    }
  } catch (error) {
    console.error('Error deleting rover:', error)
    throw new Error('Failed to delete rover')
  }
}

export const sendCommands = async (id: number, commands: Command[]): Promise<Rover> => {
  try {
    // Validate commands before making API call
    if (!validateCommands(commands)) {
      throw new Error('Invalid command')
    }

    const response = await fetch(`${API_BASE_URL}/${id}/commands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commands),
    })

    if (!response.ok) {
      throw new Error('Failed to send commands')
    }

    const apiRover: ApiRover = await response.json()
    const rover = convertApiRover(apiRover)
    if (!rover) {
      throw new Error('Invalid rover data received from server')
    }

    return rover
  } catch (error) {
    console.error('Error sending commands:', error)
    if (
      error instanceof Error &&
      (error.message === 'Invalid command' ||
        error.message === 'Invalid rover data received from server')
    ) {
      throw error // Re-throw validation and data errors
    }
    throw new Error('Failed to send commands')
  }
}
