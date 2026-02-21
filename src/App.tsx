import { useState, useEffect, useCallback } from 'react'
import RoverGrid from './components/RoverGrid'
import RoverList from './components/RoverList'
import RoverControls from './components/RoverControls'
import TopBar from './components/TopBar'
import { useApiHealth } from './hooks/useApiHealth'
import * as roverApi from './services/roverApi'
import { Rover, Command, Obstacle } from './types/rover'

function App() {
  const [rovers, setRovers] = useState<Rover[]>([])
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [selectedRoverId, setSelectedRoverId] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState<string | null>(null)

  const { isConnected } = useApiHealth()
  const selectedRover = rovers?.find(rover => rover.id === selectedRoverId) || undefined

  const loadRovers = useCallback(async () => {
    try {
      const fetchedRovers = await roverApi.getRovers()
      setRovers(fetchedRovers || [])
      if (fetchedRovers?.length > 0 && !selectedRoverId) {
        setSelectedRoverId(fetchedRovers[0].id)
      }
    } catch (error) {
      setError('Failed to load rovers: ' + (error instanceof Error ? error.message : String(error)))
      setRovers([])
    }
  }, [selectedRoverId])

  const loadObstacles = useCallback(async () => {
    try {
      const fetchedObstacles = await roverApi.getObstacles()
      setObstacles(fetchedObstacles || [])
    } catch (error) {
      console.error('Failed to load obstacles:', error)
      setObstacles([])
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([loadRovers(), loadObstacles()])
      setLoading(false)
    }
    loadData()
  }, [loadRovers, loadObstacles])

  const handleAddRover = async () => {
    try {
      const x = Math.floor(Math.random() * 100)
      const y = Math.floor(Math.random() * 100)
      const directions = ['N', 'S', 'E', 'W'] as const
      const direction = directions[Math.floor(Math.random() * directions.length)]

      const newRover = await roverApi.createRover(x, y, direction)
      if (newRover) {
        setRovers(prev => [...prev, newRover])
        setSelectedRoverId(newRover.id)
      }
    } catch (error) {
      setError(
        'Failed to create rover: ' + (error instanceof Error ? error.message : String(error))
      )
    }
  }

  const handleDeleteRover = async (id: number) => {
    try {
      await roverApi.deleteRover(id)
      setRovers(prev => prev.filter(rover => rover.id !== id))
      if (selectedRoverId === id) {
        const remaining = rovers.filter(rover => rover.id !== id)
        setSelectedRoverId(remaining.length > 0 ? remaining[0].id : null)
      }
    } catch (error) {
      setError(
        'Failed to delete rover: ' + (error instanceof Error ? error.message : String(error))
      )
    }
  }

  const handleSendCommands = async (commands: Command[]) => {
    if (!selectedRoverId) return

    try {
      const result = await roverApi.sendCommands(selectedRoverId, commands)

      if (result.rover) {
        setRovers(prev =>
          prev.map(rover => (rover.id === selectedRoverId ? { ...rover, ...result.rover } : rover))
        )
      }

      if (result.obstacleDetected) {
        setNotification(result.message || 'Obstacle detected! The rover stopped before hitting it.')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      setError('Failed to send commands: ' + errorMessage)
    }
  }

  const addRandomObstacle = useCallback(async () => {
    try {
      const x = Math.floor(Math.random() * 100)
      const y = Math.floor(Math.random() * 100)

      const newObstacle = await roverApi.createObstacle(x, y)

      if (newObstacle) {
        setObstacles(prev => [...prev, newObstacle])
        setNotification(`Added obstacle at (${x}, ${y})`)
      }
    } catch (error) {
      setError('Failed to add random obstacle')
    }
  }, [])

  if (loading) {
    return <div data-testid="loading">Loading...</div>
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      {/* Full-viewport canvas as backdrop */}
      <RoverGrid rovers={rovers} obstacles={obstacles} selectedRoverId={selectedRoverId} />

      {/* Fixed top bar overlay */}
      <TopBar isConnected={isConnected} />

      {/* Left HUD panel — Rover Fleet (empty slot for Task 3.0) */}
      <div
        className="fixed left-0 top-12 w-60 h-[calc(100vh-3rem)] border-r backdrop-blur-md overflow-y-auto"
        style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(15,17,23,0.8)' }}
      >
        <RoverList
          rovers={rovers}
          selectedRoverId={selectedRoverId}
          onSelectRover={setSelectedRoverId}
          onAddRover={handleAddRover}
          onDeleteRover={handleDeleteRover}
        />
      </div>

      {/* Right HUD panel — Mission HQ (empty slot for Task 4.0) */}
      <div
        className="fixed right-0 top-12 w-72 h-[calc(100vh-3rem)] border-l backdrop-blur-md overflow-y-auto"
        style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(15,17,23,0.8)' }}
      >
        <div className="p-3">
          <button onClick={addRandomObstacle} className="w-full text-xs">
            Add Random Obstacle
          </button>
        </div>
        {selectedRover && (
          <RoverControls rover={selectedRover} onSendCommands={handleSendCommands} />
        )}
      </div>

      {/* Temporary error/notification stubs (replaced by toasts in Task 4.0) */}
      {error && (
        <div data-testid="error-banner">
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      {notification && <div data-testid="notification">{notification}</div>}
    </div>
  )
}

export default App
