import { Rover } from '../types/rover'

interface RoverMeshProps {
  rover: Rover
  isSelected: boolean
}

const toWorld = (n: number) => n - 49.5

const directionRotation: Record<string, number> = {
  N: 0,
  S: Math.PI,
  E: -Math.PI / 2,
  W: Math.PI / 2,
}

function RoverMesh({ rover, isSelected }: RoverMeshProps) {
  const rotation = directionRotation[rover.direction] ?? 0

  return (
    <group position={[toWorld(rover.x), 0.2, toWorld(rover.y)]} rotation={[0, rotation, 0]}>
      {/* Body */}
      <mesh castShadow>
        <boxGeometry args={[0.8, 0.4, 0.8]} />
        <meshStandardMaterial
          color={rover.color}
          emissive={isSelected ? rover.color : '#000000'}
          emissiveIntensity={isSelected ? 0.6 : 0}
          roughness={0.6}
        />
      </mesh>
      {/* Turret */}
      <mesh position={[0, 0.32, 0.15]} castShadow>
        <boxGeometry args={[0.35, 0.25, 0.5]} />
        <meshStandardMaterial color={rover.color} roughness={0.6} />
      </mesh>
    </group>
  )
}

export default RoverMesh
