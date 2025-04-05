import { useState, useEffect, useCallback } from 'react'
import { Container, CircularProgress, Box, Snackbar, Alert, Button } from '@mui/material'
import RoverGrid from './components/RoverGrid'
import RoverList from './components/RoverList'
import RoverControls from './components/RoverControls'
import * as roverApi from './services/roverApi'
import { Rover, Command, Obstacle } from './types/rover'

function App() {
  const [rovers, setRovers] = useState<Rover[]>([])
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [selectedRoverId, setSelectedRoverId] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState<string | null>(null)

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
      setRovers([]) // Reset to empty array on error
    }
  }, [selectedRoverId])

  const loadObstacles = useCallback(async () => {
    try {
      const fetchedObstacles = await roverApi.getObstacles()
      setObstacles(fetchedObstacles || [])
    } catch (error) {
      console.error('Failed to load obstacles:', error)
      // Don't set an error state here to avoid blocking the UI
      // Just log the error and continue with empty obstacles
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
      // Start new rovers at a random position within valid boundaries
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

      // Update rover position
      if (result.rover) {
        setRovers(prev =>
          prev.map(rover => (rover.id === selectedRoverId ? { ...rover, ...result.rover } : rover))
        )
      }

      // Show obstacle notification if detected
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
      // Generate random coordinates
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
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <h1>Mars Rover Mission Control</h1>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          <Box sx={{ flexGrow: 1, minWidth: '300px' }}>
            <RoverGrid rovers={rovers} obstacles={obstacles} selectedRoverId={selectedRoverId} />
          </Box>

          <Box sx={{ minWidth: '300px' }}>
            <RoverList
              rovers={rovers}
              selectedRoverId={selectedRoverId}
              onSelectRover={setSelectedRoverId}
              onAddRover={handleAddRover}
              onDeleteRover={handleDeleteRover}
            />
            <Box sx={{ mt: 2 }}>
              <Button
                onClick={addRandomObstacle}
                variant="contained"
                color="secondary"
                sx={{ width: '100%' }}
              >
                Add Random Obstacle
              </Button>
            </Box>
            {selectedRover && (
              <RoverControls rover={selectedRover} onSendCommands={handleSendCommands} />
            )}
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setNotification(null)} severity="warning">
          {notification}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default App
