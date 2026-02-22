import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import MarsScene from '../MarsScene'
import { Rover, Obstacle } from '../../types/rover'

// Mock R3F — Canvas renders children; useFrame and useThree are no-ops
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="r3f-canvas">{children}</div>
  ),
  useFrame: vi.fn(),
  useThree: vi.fn(),
}))

// Mock drei — all helpers render nothing
vi.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
  Stars: () => null,
  Grid: () => null,
}))

// Stub RoverMesh and ObstacleMesh so MarsScene tests focus on structure
vi.mock('../RoverMesh', () => ({
  default: ({ rover }: { rover: Rover }) => <div data-testid={`rover-mesh-${rover.id}`} />,
}))

vi.mock('../ObstacleMesh', () => ({
  default: ({ obstacle }: { obstacle: Obstacle }) => (
    <div data-testid={`obstacle-mesh-${obstacle.id}`} />
  ),
}))

describe('MarsScene', () => {
  const mockRovers: Rover[] = [
    { id: 1, x: 10, y: 20, direction: 'N', color: '#ff0000' },
    { id: 2, x: 50, y: 50, direction: 'E', color: '#00ff00' },
  ]
  const mockObstacles: Obstacle[] = [
    { id: 1, x: 30, y: 40 },
    { id: 2, x: 70, y: 80 },
  ]

  it('renders wrapper div with data-testid="mars-scene"', () => {
    const { getByTestId } = render(
      <MarsScene rovers={mockRovers} obstacles={mockObstacles} selectedRoverId={null} />
    )
    expect(getByTestId('mars-scene')).toBeInTheDocument()
  })

  it('renders one RoverMesh per rover', () => {
    const { getByTestId } = render(
      <MarsScene rovers={mockRovers} obstacles={mockObstacles} selectedRoverId={null} />
    )
    expect(getByTestId('rover-mesh-1')).toBeInTheDocument()
    expect(getByTestId('rover-mesh-2')).toBeInTheDocument()
  })

  it('renders one ObstacleMesh per obstacle', () => {
    const { getByTestId } = render(
      <MarsScene rovers={mockRovers} obstacles={mockObstacles} selectedRoverId={null} />
    )
    expect(getByTestId('obstacle-mesh-1')).toBeInTheDocument()
    expect(getByTestId('obstacle-mesh-2')).toBeInTheDocument()
  })

  it('renders no rover or obstacle meshes when arrays are empty', () => {
    const { queryByTestId } = render(
      <MarsScene rovers={[]} obstacles={[]} selectedRoverId={null} />
    )
    expect(queryByTestId('rover-mesh-1')).not.toBeInTheDocument()
    expect(queryByTestId('obstacle-mesh-1')).not.toBeInTheDocument()
  })

  it('accepts selectedRoverId prop without error', () => {
    const { getByTestId } = render(
      <MarsScene rovers={mockRovers} obstacles={mockObstacles} selectedRoverId={1} />
    )
    expect(getByTestId('mars-scene')).toBeInTheDocument()
  })
})
