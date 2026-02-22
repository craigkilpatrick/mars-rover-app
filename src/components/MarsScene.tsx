import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Grid } from '@react-three/drei'
import * as THREE from 'three'
import { Rover, Obstacle } from '../types/rover'

interface MarsSceneProps {
  rovers: Rover[]
  obstacles: Obstacle[]
  selectedRoverId: number | null
}

function MarsSurface() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#c1440e" roughness={0.9} metalness={0.1} />
    </mesh>
  )
}

function DriftingStars() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.02
    }
  })

  return (
    <group ref={groupRef}>
      <Stars radius={200} depth={60} count={3000} factor={4} />
    </group>
  )
}

function SceneLighting() {
  return (
    <>
      <ambientLight color="#331100" intensity={0.5} />
      <directionalLight color="#ff9944" intensity={1.5} position={[30, 60, 20]} castShadow />
    </>
  )
}

function MarsScene({ rovers, obstacles, selectedRoverId }: MarsSceneProps) {
  // Suppress unused vars until meshes are added in Task 2.0
  void rovers
  void obstacles
  void selectedRoverId

  return (
    <div data-testid="mars-scene" className="absolute inset-0">
      <Canvas camera={{ position: [0, 100, 0.001], fov: 60 }} shadows>
        <SceneLighting />
        <MarsSurface />
        <Grid
          position={[0, 0.01, 0]}
          args={[100, 100]}
          cellColor="#8B3A00"
          sectionColor="#6B2A00"
          fadeDistance={200}
          infiniteGrid={false}
        />
        <DriftingStars />
        <OrbitControls enableDamping dampingFactor={0.05} minDistance={5} maxDistance={200} />
      </Canvas>
    </div>
  )
}

export default MarsScene
