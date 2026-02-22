import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Toaster, toast } from 'sonner'
import MarsScene from './components/MarsScene'
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
      toast.error(
        'Failed to load rovers: ' + (error instanceof Error ? error.message : String(error))
      )
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
      toast.error(
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
      toast.error(
        'Failed to delete rover: ' + (error instanceof Error ? error.message : String(error))
      )
    }
  }

  const handleSendCommands = async (
    commands: Command[]
  ): Promise<{ obstacleDetected?: boolean } | void> => {
    if (!selectedRoverId) return

    try {
      const result = await roverApi.sendCommands(selectedRoverId, commands)

      if (result.rover) {
        setRovers(prev =>
          prev.map(rover => (rover.id === selectedRoverId ? { ...rover, ...result.rover } : rover))
        )
      }

      if (result.obstacleDetected) {
        toast.warning(result.message || 'Obstacle detected! The rover stopped before hitting it.')
      } else {
        toast.success('Commands executed')
      }
      return { obstacleDetected: result.obstacleDetected }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      toast.error('Failed to send commands: ' + errorMessage)
    }
  }

  const addRandomObstacle = useCallback(async () => {
    try {
      const x = Math.floor(Math.random() * 100)
      const y = Math.floor(Math.random() * 100)

      const newObstacle = await roverApi.createObstacle(x, y)

      if (newObstacle) {
        setObstacles(prev => [...prev, newObstacle])
        toast.success(`Obstacle added at (${x}, ${y})`)
      }
    } catch {
      toast.error('Failed to add obstacle')
    }
  }, [])

  if (loading) {
    return (
      <div
        data-testid="loading"
        className="flex h-screen w-screen items-center justify-center bg-background"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="h-8 w-8 rounded-full border-2 border-transparent border-t-cyan-400"
          />
          <span className="font-mono text-xs" style={{ color: '#64748b' }}>
            Initializing...
          </span>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      {/* Full-viewport canvas as backdrop */}
      <MarsScene rovers={rovers} obstacles={obstacles} selectedRoverId={selectedRoverId} />

      {/* Fixed top bar overlay */}
      <TopBar isConnected={isConnected} />

      {/* Left HUD panel — Rover Fleet */}
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

      {/* Right HUD panel — Mission HQ */}
      <div
        className="fixed right-0 top-12 w-72 h-[calc(100vh-3rem)] border-l backdrop-blur-md overflow-y-auto flex flex-col"
        style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(15,17,23,0.8)' }}
      >
        <div className="flex-1">
          <RoverControls rover={selectedRover} onSendCommands={handleSendCommands} />
        </div>
        <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <button
            onClick={addRandomObstacle}
            className="w-full text-xs py-1.5 px-3 rounded border font-mono hover:bg-white/[0.05] transition-colors"
            style={{ color: '#64748b', borderColor: 'rgba(255,255,255,0.08)' }}
          >
            + Add Obstacle
          </button>
        </div>
      </div>

      <Toaster position="bottom-center" theme="dark" />
    </div>
  )
}

export default App
