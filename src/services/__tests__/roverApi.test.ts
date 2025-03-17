import { vi, describe, it, expect, beforeEach } from 'vitest'
import {
  getRovers,
  createRover,
  deleteRover,
  sendCommands,
  validateCoordinates,
  validateDirection,
  validateCommands,
  getRoverColor,
  ROVER_COLORS,
} from '../roverApi'
import { Direction, Command } from '../../types/rover'

// Mock fetch
global.fetch = vi.fn()
console.error = vi.fn() // Mock console.error to avoid cluttering test output

describe('roverApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getRovers', () => {
    it('should fetch and convert rovers', async () => {
      const mockApiResponse = {
        _embedded: {
          roverList: [
            { id: 1, x: 0, y: 0, direction: 'N' },
            { id: 2, x: 5, y: 5, direction: 'E' },
          ],
        },
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })

      const rovers = await getRovers()
      expect(rovers).toHaveLength(2)
      expect(rovers[0]).toEqual({
        id: 1,
        x: 0,
        y: 0,
        direction: 'N',
        color: ROVER_COLORS[1],
      })
    })

    it('should handle empty response', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      })

      const rovers = await getRovers()
      expect(rovers).toEqual([])
    })

    it('should handle API errors', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))

      await expect(getRovers()).rejects.toThrow('Failed to fetch rovers')
    })

    it('should handle non-ok response', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(getRovers()).rejects.toThrow('Failed to fetch rovers')
    })

    it('should handle invalid rover data', async () => {
      const mockApiResponse = {
        _embedded: {
          roverList: [{ id: 1, x: 0, y: 0, direction: 'INVALID' }],
        },
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })

      const rovers = await getRovers()
      expect(rovers).toHaveLength(0) // Invalid rovers are filtered out
    })
  })

  describe('createRover', () => {
    it('should create and return a new rover', async () => {
      const mockApiResponse = { id: 1, x: 0, y: 0, direction: 'N' }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })

      const rover = await createRover(0, 0, 'N')
      expect(rover).toEqual({
        id: 1,
        x: 0,
        y: 0,
        direction: 'N',
        color: ROVER_COLORS[1],
      })
    })

    it('should validate coordinate boundaries (0-99)', async () => {
      await expect(createRover(-1, 0, 'N')).rejects.toThrow('Invalid coordinates')
      await expect(createRover(100, 0, 'N')).rejects.toThrow('Invalid coordinates')
      await expect(createRover(0, -1, 'N')).rejects.toThrow('Invalid coordinates')
      await expect(createRover(0, 100, 'N')).rejects.toThrow('Invalid coordinates')
    })

    it('should validate direction', async () => {
      await expect(createRover(0, 0, 'X' as Direction)).rejects.toThrow('Invalid direction')
    })

    it('should handle API errors', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))

      await expect(createRover(0, 0, 'N')).rejects.toThrow('Failed to create rover')
    })

    it('should handle non-ok response', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(createRover(0, 0, 'N')).rejects.toThrow('Failed to create rover')
    })

    it('should handle missing rover in response', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      })

      await expect(createRover(0, 0, 'N')).rejects.toThrow('Invalid rover data')
    })

    it('should handle invalid rover data in response', async () => {
      const mockApiResponse = { id: 1, x: 0, y: 0, direction: 'INVALID' }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })

      await expect(createRover(0, 0, 'N')).rejects.toThrow('Invalid rover data')
    })
  })

  describe('deleteRover', () => {
    it('should delete a rover', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
      })

      await expect(deleteRover(1)).resolves.not.toThrow()
    })

    it('should handle deletion errors', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))

      await expect(deleteRover(1)).rejects.toThrow('Failed to delete rover')
    })

    it('should handle non-ok response', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      await expect(deleteRover(1)).rejects.toThrow('Failed to delete rover')
    })
  })

  describe('sendCommands', () => {
    it('should send commands and return updated rover', async () => {
      const mockApiResponse = { id: 1, x: 1, y: 0, direction: 'N' }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })

      const rover = await sendCommands(1, ['f'])
      expect(rover).toEqual({
        id: 1,
        x: 1,
        y: 0,
        direction: 'N',
        color: ROVER_COLORS[1],
      })
    })

    it('should validate commands', async () => {
      await expect(sendCommands(1, ['x' as unknown as Command])).rejects.toThrow('Invalid command')
    })

    it('should handle API errors', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))

      await expect(sendCommands(1, ['f'])).rejects.toThrow('Failed to send commands')
    })

    it('should handle non-ok response', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(sendCommands(1, ['f'])).rejects.toThrow('Failed to send commands')
    })

    it('should handle invalid rover data in response', async () => {
      const mockApiResponse = { id: 1, x: 0, y: 0, direction: 'INVALID' }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })

      await expect(sendCommands(1, ['f'])).rejects.toThrow('Invalid rover data')
    })
  })

  describe('validation functions', () => {
    describe('validateCoordinates', () => {
      it('should validate coordinates within bounds', () => {
        expect(validateCoordinates(0, 0)).toBe(true)
        expect(validateCoordinates(99, 99)).toBe(true)
        expect(validateCoordinates(50, 50)).toBe(true)
      })

      it('should reject coordinates outside bounds', () => {
        expect(validateCoordinates(-1, 0)).toBe(false)
        expect(validateCoordinates(0, -1)).toBe(false)
        expect(validateCoordinates(100, 0)).toBe(false)
        expect(validateCoordinates(0, 100)).toBe(false)
      })
    })

    describe('validateDirection', () => {
      it('should validate valid directions', () => {
        expect(validateDirection('N')).toBe(true)
        expect(validateDirection('S')).toBe(true)
        expect(validateDirection('E')).toBe(true)
        expect(validateDirection('W')).toBe(true)
      })

      it('should reject invalid directions', () => {
        expect(validateDirection('X')).toBe(false)
        expect(validateDirection('')).toBe(false)
        expect(validateDirection('n')).toBe(false)
      })
    })

    describe('validateCommands', () => {
      it('should validate valid commands', () => {
        expect(validateCommands(['f', 'b', 'l', 'r'])).toBe(true)
      })

      it('should reject invalid commands', () => {
        expect(validateCommands(['x'])).toBe(false)
        expect(validateCommands(['F'])).toBe(false)
        expect(validateCommands([''])).toBe(false)
      })
    })

    describe('getRoverColor', () => {
      it('should return consistent colors for same IDs', () => {
        const color1 = getRoverColor(1)
        const color2 = getRoverColor(1)
        expect(color1).toBe(color2)
      })

      it('should cycle through colors for different IDs', () => {
        const colors = new Set()
        for (let i = 0; i < 10; i++) {
          colors.add(getRoverColor(i))
        }
        expect(colors.size).toBeGreaterThan(1) // Should use multiple colors
      })
    })
  })
})
