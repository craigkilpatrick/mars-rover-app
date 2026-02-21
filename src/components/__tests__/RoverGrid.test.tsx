import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import RoverGrid from '../RoverGrid'
import { Rover, Obstacle } from '../../types/rover'

describe('RoverGrid', () => {
  const mockRovers: Rover[] = [
    { id: 1, x: 0, y: 0, direction: 'N', color: '#ff0000' },
    { id: 2, x: 99, y: 99, direction: 'S', color: '#00ff00' },
  ]

  const mockObstacles: Obstacle[] = [{ id: 1, x: 50, y: 50 }]

  it('should render canvas element', () => {
    const { container } = render(
      <RoverGrid rovers={mockRovers} obstacles={mockObstacles} selectedRoverId={null} />
    )
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('should render the grid container with data-testid', () => {
    const { getByTestId } = render(
      <RoverGrid rovers={mockRovers} obstacles={mockObstacles} selectedRoverId={null} />
    )
    expect(getByTestId('rover-grid')).toBeInTheDocument()
  })

  it('should handle empty rovers array', () => {
    const { container } = render(
      <RoverGrid rovers={[]} obstacles={mockObstacles} selectedRoverId={null} />
    )
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('should accept rover selection prop', () => {
    const { container } = render(
      <RoverGrid rovers={mockRovers} obstacles={mockObstacles} selectedRoverId={1} />
    )
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('should render with rovers at coordinate boundaries', () => {
    const boundaryRovers: Rover[] = [
      { id: 1, x: 0, y: 0, direction: 'N', color: '#ff0000' },
      { id: 2, x: 99, y: 99, direction: 'S', color: '#00ff00' },
    ]
    const { container } = render(
      <RoverGrid rovers={boundaryRovers} obstacles={mockObstacles} selectedRoverId={null} />
    )
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('should render with empty obstacles array', () => {
    const { container } = render(
      <RoverGrid rovers={mockRovers} obstacles={[]} selectedRoverId={null} />
    )
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })
})
