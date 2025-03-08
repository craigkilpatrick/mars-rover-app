import React, { useState, useEffect } from 'react';
import { roverService } from '../services/api';
import Grid from './Grid/Grid';
import ControlPanel from './ControlPanel/ControlPanel';
import LoadingSpinner from './common/LoadingSpinner/LoadingSpinner';

const MarsRoverApp = () => {
  const [rovers, setRovers] = useState([]);
  const [selectedRover, setSelectedRover] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCommandLoading, setIsCommandLoading] = useState(false);

  useEffect(() => {
    fetchRovers();
  }, []);

  const fetchRovers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const roverList = await roverService.fetchRovers();
      setRovers(roverList);
      if (roverList.length > 0) {
        setSelectedRover(roverList[0]);
      }
    } catch (err) {
      setError('Failed to fetch rovers');
      console.error('Error fetching rovers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoverSelect = (e) => {
    const selectedId = e.target.value;
    const rover = rovers.find(r => r.id === selectedId);
    setSelectedRover(rover || null);
  };

  const handleCommandSubmit = async (command) => {
    if (!selectedRover) return;

    setIsCommandLoading(true);
    setError(null);
    try {
      const updatedRover = await roverService.sendCommand(selectedRover.id, command);
      setRovers(rovers.map(r => r.id === updatedRover.id ? updatedRover : r));
      setSelectedRover(updatedRover);
    } catch (err) {
      setError('Failed to send command');
      console.error('Error sending command:', err);
    } finally {
      setIsCommandLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mars-rover-app">
      <Grid rovers={rovers} selectedRover={selectedRover} />
      <ControlPanel
        rovers={rovers}
        selectedRover={selectedRover}
        error={error}
        isLoading={isLoading}
        isCommandLoading={isCommandLoading}
        onRoverSelect={handleRoverSelect}
        onCommandChange={() => {}} // Removed unused command input
        onCommandSubmit={handleCommandSubmit}
      />
    </div>
  );
};

export default MarsRoverApp;
