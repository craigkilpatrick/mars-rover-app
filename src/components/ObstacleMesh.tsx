import { Obstacle } from '../types/rover'

interface ObstacleMeshProps {
  obstacle: Obstacle
}

const toWorld = (n: number) => n - 49.5

function ObstacleMesh({ obstacle }: ObstacleMeshProps) {
  const scale = 0.8 + (obstacle.id % 5) * 0.08

  return (
    <mesh position={[toWorld(obstacle.x), 0.4, toWorld(obstacle.y)]} scale={scale} castShadow>
      <icosahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#5c2a00" roughness={1} />
    </mesh>
  )
}

export default ObstacleMesh
