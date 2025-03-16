import { useState, useEffect, useCallback } from 'react'
import { Container, CircularProgress, Box } from '@mui/material'
import RoverGrid from './components/RoverGrid'
import RoverList from './components/RoverList'
import RoverControls from './components/RoverControls'
import * as roverApi from './services/roverApi'
import { Rover, Command } from './types/rover'

function App() {
  const [rovers, setRovers] = useState<Rover[]>([])
  const [selectedRoverId, setSelectedRoverId] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

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
    } finally {
      setLoading(false)
    }
  }, [selectedRoverId])

  useEffect(() => {
    loadRovers()
  }, [loadRovers])

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
      const updatedRover = await roverApi.sendCommands(selectedRoverId, commands)
      if (updatedRover) {
        setRovers(prev =>
          prev.map(rover => (rover.id === selectedRoverId ? { ...rover, ...updatedRover } : rover))
        )
      }
    } catch (error) {
      setError(
        'Failed to send commands: ' + (error instanceof Error ? error.message : String(error))
      )
    }
  }

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
      <RoverGrid rovers={rovers} selectedRoverId={selectedRoverId} />
      <RoverList
        rovers={rovers}
        selectedRoverId={selectedRoverId}
        onSelectRover={setSelectedRoverId}
        onAddRover={handleAddRover}
        onDeleteRover={handleDeleteRover}
      />
      <RoverControls
        selectedRover={selectedRover}
        onSendCommands={handleSendCommands}
        error={error}
        onClearError={() => setError(null)}
      />
    </Container>
  )
}

export default App
