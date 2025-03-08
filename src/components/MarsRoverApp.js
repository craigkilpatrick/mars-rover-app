import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Stage, Layer, Rect, RegularPolygon, Group } from 'react-konva';
import axios from 'axios';

// Constants
const GRID_CONFIG = {
  SIZE: 100,
  CELL_SIZE: 6,
  COLORS: {
    SURFACE: '#8B4513',
    GRID_LINES: '#A0522D',
    SELECTED_ROVER: '#FFD700',
    UNSELECTED_ROVER: '#FFFFFF'
  }
};

const DIRECTION_ANGLES = {
  'N': 0,
  'E': 90,
  'S': 180,
  'W': 270
};

const API_BASE_URL = 'http://localhost:8080';

// Loading spinner component
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #4CAF50',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    }} />
  </div>
);

// Add keyframes for the spinner animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

// PropTypes for rover shape
const RoverShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  direction: PropTypes.oneOf(['N', 'E', 'S', 'W']).isRequired
});

// Component for the control panel
const ControlPanel = ({ 
  rovers = [], 
  selectedRover = null, 
  commands = '', 
  error = null,
  isLoading = false,
  isCommandLoading = false,
  onRoverSelect, 
  onCommandChange, 
  onCommandSubmit 
}) => (
  <div style={{ flex: '1' }} data-testid="control-panel">
    <h1 style={{ marginBottom: '20px' }}>Mars Rover Control</h1>
    
    <div style={{ marginBottom: '20px' }}>
      <h3>Select Rover</h3>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <select 
          value={selectedRover?.id || ''}
          onChange={onRoverSelect}
          style={{ width: '100%', padding: '8px', marginTop: '8px' }}
        >
          <option value="">-- Select a Rover --</option>
          {rovers.map(rover => (
            <option key={rover.id} value={rover.id}>
              Rover {rover.id} (Position: {rover.x}, {rover.y}, {rover.direction})
            </option>
          ))}
        </select>
      )}
    </div>

    <form onSubmit={onCommandSubmit}>
      <h3>Enter Commands</h3>
      <div style={{ marginBottom: '10px' }}>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Available commands:
          <br />
          f - Move Forward
          <br />
          b - Move Backward
          <br />
          l - Turn Left
          <br />
          r - Turn Right
        </p>
      </div>
      <input
        type="text"
        value={commands}
        onChange={onCommandChange}
        placeholder="Enter commands (e.g., fflr)"
        pattern="[fblr]+"
        title="Only f, b, l, r commands are allowed"
        style={{ width: '100%', padding: '8px', marginTop: '8px', marginBottom: '8px' }}
        disabled={isCommandLoading}
      />
      <button 
        type="submit"
        disabled={isCommandLoading || !selectedRover}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: isCommandLoading ? '#cccccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isCommandLoading ? 'not-allowed' : 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        {isCommandLoading ? (
          <>
            <div style={{
              width: '20px',
              height: '20px',
              border: '3px solid #ffffff',
              borderTop: '3px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            Sending Commands...
          </>
        ) : (
          'Send Commands'
        )}
      </button>
    </form>

    {error && (
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px' }} data-testid="error-message">
        {error}
      </div>
    )}
  </div>
);

ControlPanel.propTypes = {
  rovers: PropTypes.arrayOf(RoverShape).isRequired,
  selectedRover: RoverShape,
  commands: PropTypes.string.isRequired,
  error: PropTypes.string,
  isLoading: PropTypes.bool,
  isCommandLoading: PropTypes.bool,
  onRoverSelect: PropTypes.func.isRequired,
  onCommandChange: PropTypes.func.isRequired,
  onCommandSubmit: PropTypes.func.isRequired
};

ControlPanel.defaultProps = {
  selectedRover: null,
  error: null,
  isLoading: false,
  isCommandLoading: false
};

// Component for the Mars grid visualization
const MarsGrid = ({ 
  rovers = [], 
  selectedRover = null 
}) => {
  const renderGrid = () => {
    const cells = [];
    for (let x = 0; x < GRID_CONFIG.SIZE; x++) {
      for (let y = 0; y < GRID_CONFIG.SIZE; y++) {
        cells.push(
          <Rect
            key={`${x}-${y}`}
            x={x * GRID_CONFIG.CELL_SIZE}
            y={y * GRID_CONFIG.CELL_SIZE}
            width={GRID_CONFIG.CELL_SIZE}
            height={GRID_CONFIG.CELL_SIZE}
            fill={GRID_CONFIG.COLORS.SURFACE}
            stroke={GRID_CONFIG.COLORS.GRID_LINES}
            strokeWidth={0.5}
          />
        );
      }
    }
    return cells;
  };

  const renderRovers = () => {
    return rovers.map(rover => {
      const centerX = (rover.x * GRID_CONFIG.CELL_SIZE) + (GRID_CONFIG.CELL_SIZE / 2);
      const centerY = (rover.y * GRID_CONFIG.CELL_SIZE) + (GRID_CONFIG.CELL_SIZE / 2);
      const isSelected = selectedRover?.id === rover.id;
      
      return (
        <Group key={rover.id}>
          {isSelected && (
            <RegularPolygon
              x={centerX}
              y={centerY}
              sides={20}
              radius={GRID_CONFIG.CELL_SIZE * 0.8}
              fill="rgba(255, 215, 0, 0.3)"
              stroke={GRID_CONFIG.COLORS.SELECTED_ROVER}
              strokeWidth={0.5}
            />
          )}
          <RegularPolygon
            x={centerX}
            y={centerY}
            sides={3}
            radius={GRID_CONFIG.CELL_SIZE * 0.4}
            fill={isSelected ? GRID_CONFIG.COLORS.SELECTED_ROVER : GRID_CONFIG.COLORS.UNSELECTED_ROVER}
            stroke="#000"
            strokeWidth={1}
            rotation={DIRECTION_ANGLES[rover.direction]}
          />
        </Group>
      );
    });
  };

  return (
    <div style={{ flex: '2', backgroundColor: '#000', padding: '10px', borderRadius: '8px' }}>
      <Stage width={GRID_CONFIG.SIZE * GRID_CONFIG.CELL_SIZE} height={GRID_CONFIG.SIZE * GRID_CONFIG.CELL_SIZE}>
        <Layer>
          {renderGrid()}
          {renderRovers()}
        </Layer>
      </Stage>
    </div>
  );
};

MarsGrid.propTypes = {
  rovers: PropTypes.arrayOf(RoverShape).isRequired,
  selectedRover: RoverShape
};

MarsGrid.defaultProps = {
  selectedRover: null
};

// Main component
const MarsRoverApp = () => {
  const [rovers, setRovers] = useState([]);
  const [selectedRover, setSelectedRover] = useState(null);
  const [commands, setCommands] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCommandLoading, setIsCommandLoading] = useState(false);

  // Fetch rovers from API
  useEffect(() => {
    const fetchRovers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/rovers`);
        if (response.data._embedded?.roverList) {
          const transformedRovers = response.data._embedded.roverList.map(rover => ({
            ...rover,
            id: rover.id.toString(),
            x: parseInt(rover.x),
            y: parseInt(rover.y)
          }));
          setRovers(transformedRovers);
        }
      } catch (err) {
        console.error('Error fetching rovers:', err);
        setError('Failed to fetch rovers. Please check if the API is running.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRovers();
  }, []);

  const handleRoverSelect = (e) => {
    const selectedId = e.target.value;
    const rover = rovers.find(r => r.id === selectedId);
    setSelectedRover(rover || null);
    setError(null);
  };

  const handleCommandChange = (e) => {
    setCommands(e.target.value.toLowerCase());
    setError(null);
  };

  const handleCommandSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRover) {
      setError('Please select a rover first');
      return;
    }

    try {
      setIsCommandLoading(true);
      setError(null);
      const commandsArray = Array.from(commands.toLowerCase());
      const response = await axios.post(
        `${API_BASE_URL}/rovers/${selectedRover.id}/commands`,
        commandsArray,
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      const updatedRover = {
        ...selectedRover,
        x: parseInt(response.data.x),
        y: parseInt(response.data.y),
        direction: response.data.direction
      };
      
      setRovers(rovers.map(rover => 
        rover.id === selectedRover.id ? updatedRover : rover
      ));
      setSelectedRover(updatedRover);
      setCommands('');
    } catch (err) {
      console.error('Error sending commands:', err);
      setError('Failed to send commands to the rover. Make sure to use only f, b, l, or r commands.');
    } finally {
      setIsCommandLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', display: 'flex', gap: '20px' }}>
      {isLoading && <div data-testid="loading-indicator">Loading...</div>}
      <ControlPanel 
        rovers={rovers}
        selectedRover={selectedRover}
        commands={commands}
        error={error}
        isLoading={isLoading}
        isCommandLoading={isCommandLoading}
        onRoverSelect={handleRoverSelect}
        onCommandChange={handleCommandChange}
        onCommandSubmit={handleCommandSubmit}
      />
      <MarsGrid 
        rovers={rovers}
        selectedRover={selectedRover}
      />
    </div>
  );
};

MarsRoverApp.propTypes = {
  // No props
};

export default MarsRoverApp;
