import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
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
  const groupRef = useRef<THREE.Group>(null)
  const targetPos = useRef(new THREE.Vector3(toWorld(rover.x), 0.2, toWorld(rover.y)))

  useEffect(() => {
    targetPos.current.set(toWorld(rover.x), 0.2, toWorld(rover.y))
  }, [rover.x, rover.y])

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.lerp(targetPos.current, delta * 5)
    }
  })

  return (
    <group ref={groupRef} rotation={[0, rotation, 0]}>
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
