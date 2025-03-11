import { useState, useEffect, useCallback } from 'react';
import { Container, CircularProgress, Box } from '@mui/material';
import RoverGrid from './components/RoverGrid';
import RoverList from './components/RoverList';
import RoverControls from './components/RoverControls';
import * as roverApi from './services/roverApi';

function App() {
  const [rovers, setRovers] = useState([]);
  const [selectedRoverId, setSelectedRoverId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectedRover = rovers.find(rover => rover.id === selectedRoverId);

  const loadRovers = useCallback(async () => {
    try {
      const fetchedRovers = await roverApi.getRovers();
      setRovers(fetchedRovers);
      if (fetchedRovers.length > 0 && !selectedRoverId) {
        setSelectedRoverId(fetchedRovers[0].id);
      }
    } catch (error) {
      setError('Failed to load rovers: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [selectedRoverId]);

  useEffect(() => {
    loadRovers();
  }, [loadRovers]);

  const handleAddRover = async () => {
    try {
      const newRover = await roverApi.createRover();
      setRovers(prev => [...prev, newRover]);
      setSelectedRoverId(newRover.id);
    } catch (error) {
      setError('Failed to create rover: ' + error.message);
    }
  };

  const handleDeleteRover = async (id) => {
    if (!id) return;
    
    try {
      await roverApi.deleteRover(id);
      setRovers(prev => prev.filter(rover => rover.id !== id));
      if (selectedRoverId === id) {
        const remaining = rovers.filter(rover => rover.id !== id);
        setSelectedRoverId(remaining.length > 0 ? remaining[0].id : null);
      }
    } catch (error) {
      setError('Failed to delete rover: ' + error.message);
    }
  };

  const handleSendCommands = async (commands) => {
    if (!selectedRoverId) return;

    try {
      const updatedRover = await roverApi.sendCommands(selectedRoverId, commands);
      setRovers(prev =>
        prev.map(rover =>
          rover.id === selectedRoverId
            ? { ...rover, ...updatedRover }
            : rover
        )
      );
    } catch (error) {
      setError('Failed to send commands: ' + error.message);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <RoverGrid
        rovers={rovers}
        selectedRoverId={selectedRoverId}
      />
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
  );
}

export default App;
