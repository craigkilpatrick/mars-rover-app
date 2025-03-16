import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import RoverGrid from '../RoverGrid'
import { Rover } from '../../types/rover'

describe('RoverGrid', () => {
  // Define type-safe mock data
  const mockRovers: Rover[] = [
    {
      id: 1,
      x: 0,
      y: 0,
      direction: 'N',
      color: '#ff0000',
    },
    {
      id: 2,
      x: 99,
      y: 99,
      direction: 'S',
      color: '#00ff00',
    },
  ]

  it('should render canvas element', () => {
    const { container } = render(<RoverGrid rovers={mockRovers} selectedRoverId={null} />)

    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
    expect(canvas).toHaveStyle({ display: 'block' })
  })

  it('should maintain correct grid dimensions', () => {
    const { container } = render(<RoverGrid rovers={mockRovers} selectedRoverId={null} />)

    const canvas = container.querySelector('canvas')
    // Grid size should be 100x100 cells, each 5px
    expect(canvas).toHaveAttribute('width', '500')
    expect(canvas).toHaveAttribute('height', '500')
  })

  it('should render with proper container styling', () => {
    const { container } = render(<RoverGrid rovers={mockRovers} selectedRoverId={null} />)
    const gridContainer = container.firstChild as HTMLElement

    // Test critical styling that affects usability
    expect(gridContainer).toHaveStyle({
      backgroundColor: '#f8f8f8', // Light background for contrast
      border: '1px solid #ccc', // Border for grid visibility
    })
  })

  it('should handle rover updates at coordinate boundaries', () => {
    // Test rover at maximum coordinates according to coordinate system memory
    const updatedRovers: Rover[] = [
      {
        id: 1,
        x: 99, // Maximum X (East)
        y: 99, // Maximum Y (North)
        direction: 'N',
        color: '#ff0000',
      },
    ]

    const { container } = render(<RoverGrid rovers={updatedRovers} selectedRoverId={null} />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('should handle rover selection changes', () => {
    const { container } = render(<RoverGrid rovers={mockRovers} selectedRoverId={1} />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('should render rovers at coordinate system boundaries', () => {
    // Test rovers at critical boundary positions based on coordinate system memory
    const boundaryRovers: Rover[] = [
      {
        id: 1,
        x: 0, // Left-most (West) boundary
        y: 0, // Bottom-most (South) boundary
        direction: 'N',
        color: '#ff0000',
      },
      {
        id: 2,
        x: 99, // Right-most (East) boundary
        y: 99, // Top-most (North) boundary
        direction: 'S',
        color: '#00ff00',
      },
    ]

    const { container } = render(<RoverGrid rovers={boundaryRovers} selectedRoverId={null} />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })
})
