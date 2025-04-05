export type Direction = 'N' | 'S' | 'E' | 'W'
export type Command = 'f' | 'b' | 'l' | 'r'

export interface Rover {
  id: number
  x: number
  y: number
  direction: Direction
  color: string
}

export interface Obstacle {
  id: number
  x: number
  y: number
}

export interface RoverResponse {
  id: number
  x: number
  y: number
  direction: Direction
  _links?: {
    self: { href: string }
    rovers: { href: string }
  }
}

export interface CommandResult {
  rover: RoverResponse
  status?: string
  message?: string
}
