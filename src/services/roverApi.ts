import { Rover, RoverResponse, Command } from '../types/rover'

const API_BASE_URL = 'http://localhost:8080/rovers'

const generateColor = (): string => {
  const colors = [
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFF00',
    '#FF00FF',
    '#00FFFF',
    '#FFA500',
    '#800080',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export const getRovers = async (): Promise<Rover[]> => {
  try {
    const response = await fetch(API_BASE_URL)
    if (!response.ok) {
      throw new Error('Failed to fetch rovers')
    }
    const data = await response.json()
    const rovers: RoverResponse[] = data._embedded?.roverList || []
    return rovers.map(rover => ({
      ...rover,
      color: generateColor(),
    }))
  } catch (error) {
    console.error('Error fetching rovers:', error)
    throw error
  }
}

export const createRover = async (): Promise<Rover> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        x: 0,
        y: 0,
        direction: 'N',
      }),
    })
    if (!response.ok) {
      throw new Error('Failed to create rover')
    }
    const rover: RoverResponse = await response.json()
    return {
      ...rover,
      color: generateColor(),
    }
  } catch (error) {
    console.error('Error creating rover:', error)
    throw error
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
    throw error
  }
}

export const sendCommands = async (id: number, commands: Command[]): Promise<RoverResponse> => {
  try {
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
    return await response.json()
  } catch (error) {
    console.error('Error sending commands:', error)
    throw error
  }
}
