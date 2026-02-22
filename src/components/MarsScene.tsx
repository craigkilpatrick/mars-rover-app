import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { Rover, Obstacle } from '../types/rover'
import RoverMesh from './RoverMesh'
import ObstacleMesh from './ObstacleMesh'

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
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.02
  })
  return (
    <group ref={groupRef}>
      <Stars radius={200} depth={60} count={3000} factor={4} saturation={0} />
    </group>
  )
}

function SceneLighting() {
  return (
    <>
      <ambientLight color="#ff8844" intensity={0.6} />
      <directionalLight color="#ff9944" intensity={2.5} position={[30, 60, 20]} castShadow />
    </>
  )
}

function MarsScene({ rovers, obstacles, selectedRoverId }: MarsSceneProps) {
  return (
    <div
      data-testid="mars-scene"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      <Canvas
        style={{ width: '100%', height: '100%' }}
        camera={{ position: [0, 60, 80], fov: 60 }}
        shadows
        onCreated={({ scene }) => {
          scene.background = new THREE.Color('#0a0305')
        }}
      >
        <SceneLighting />
        <MarsSurface />
        <gridHelper args={[100, 20, '#8B3A00', '#6B2A00']} position={[0, 0.05, 0]} />
        <DriftingStars />
        {rovers.map(rover => (
          <RoverMesh key={rover.id} rover={rover} isSelected={rover.id === selectedRoverId} />
        ))}
        {obstacles.map(obs => (
          <ObstacleMesh key={obs.id} obstacle={obs} />
        ))}
        <OrbitControls target={[0, 0, 0]} enableDamping dampingFactor={0.05} />
      </Canvas>
    </div>
  )
}

export default MarsScene
