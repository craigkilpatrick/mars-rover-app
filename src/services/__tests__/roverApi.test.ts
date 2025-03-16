import { vi, describe, it, expect, beforeEach } from 'vitest'
import { getRovers, createRover, deleteRover, sendCommands, ROVER_COLORS } from '../roverApi'
import { Direction, Command } from '../../types/rover'

describe('roverApi', () => {
  const mockFetch = vi.fn()
  global.fetch = mockFetch

  beforeEach(() => {
    mockFetch.mockReset()
  })

  describe('getRovers', () => {
    it('should fetch rovers from the correct endpoint', async () => {
      const mockRovers = [
        {
          id: 0, // Using ID 0 to get first color
          x: 0,
          y: 0,
          direction: 'N' as Direction,
          color: ROVER_COLORS[0],
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          _embedded: {
            roverList: [
              {
                id: 0,
                x: 0,
                y: 0,
                direction: 'N',
              },
            ],
          },
        }),
      })

      const result = await getRovers()
      expect(result).toEqual(mockRovers)
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/rovers')
    })

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      })

      await expect(getRovers()).rejects.toThrow('Failed to fetch rovers')
    })
  })

  describe('createRover', () => {
    it('should create rover with valid coordinates and direction', async () => {
      const mockRover = {
        id: 0, // Using ID 0 to get first color
        x: 5,
        y: 5,
        direction: 'N' as Direction,
        color: ROVER_COLORS[0],
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          _embedded: {
            rover: {
              id: 0,
              x: 5,
              y: 5,
              direction: 'N',
            },
          },
        }),
      })

      const result = await createRover(5, 5, 'N')
      expect(result).toEqual(mockRover)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/rovers',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ x: 5, y: 5, direction: 'N' }),
        })
      )
    })

    it('should validate coordinate boundaries (0-99)', async () => {
      await expect(createRover(-1, 5, 'N')).rejects.toThrow('Invalid coordinates')
      await expect(createRover(100, 5, 'N')).rejects.toThrow('Invalid coordinates')
      await expect(createRover(5, -1, 'N')).rejects.toThrow('Invalid coordinates')
      await expect(createRover(5, 100, 'N')).rejects.toThrow('Invalid coordinates')
    })

    it('should validate direction', async () => {
      await expect(createRover(5, 5, 'X' as Direction)).rejects.toThrow('Invalid direction')
    })
  })

  describe('deleteRover', () => {
    it('should delete rover with specified ID', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      })

      await deleteRover(1)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/rovers/1',
        expect.objectContaining({
          method: 'DELETE',
        })
      )
    })

    it('should handle deletion errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      })

      await expect(deleteRover(1)).rejects.toThrow('Failed to delete rover')
    })
  })

  describe('sendCommands', () => {
    it('should send valid commands to rover', async () => {
      const mockRover = {
        id: 0, // Using ID 0 to get first color
        x: 5,
        y: 5,
        direction: 'N' as Direction,
        color: ROVER_COLORS[0],
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          _embedded: {
            rover: {
              id: 0,
              x: 5,
              y: 5,
              direction: 'N',
            },
          },
        }),
      })

      const result = await sendCommands(0, ['f', 'r'] as Command[])
      expect(result).toEqual(mockRover)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/rovers/0/commands',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(['f', 'r']),
        })
      )
    })

    it('should validate commands', async () => {
      await expect(sendCommands(1, [])).rejects.toThrow('Invalid command')
      await expect(sendCommands(1, ['invalid'] as unknown as Command[])).rejects.toThrow(
        'Invalid command'
      )
    })

    it('should handle command execution errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      })

      await expect(sendCommands(1, ['f'] as Command[])).rejects.toThrow('Failed to send commands')
    })
  })
})
