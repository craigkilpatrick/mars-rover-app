import React from 'react';
import PropTypes from 'prop-types';

const ControlPanel = ({
  rovers,
  selectedRover,
  error,
  isLoading,
  isCommandLoading,
  onRoverSelect,
  onCommandSubmit
}) => (
  <div className="control-panel" data-testid="control-panel">
    <h2>Rover Control Panel</h2>
    
    <div className="rover-selection">
      <select 
        value={selectedRover?.id || ''} 
        onChange={onRoverSelect}
        disabled={isLoading}
      >
        <option value="">Select a rover</option>
        {rovers.map(rover => (
          <option key={rover.id} value={rover.id}>
            Rover {rover.id} ({rover.direction} at {rover.position.x}, {rover.position.y})
          </option>
        ))}
      </select>
    </div>

    <div className="command-controls">
      <button
        onClick={() => onCommandSubmit('M')}
        disabled={isCommandLoading || !selectedRover}
      >
        Move Forward
      </button>
      <button
        onClick={() => onCommandSubmit('L')}
        disabled={isCommandLoading || !selectedRover}
      >
        Turn Left
      </button>
      <button
        onClick={() => onCommandSubmit('R')}
        disabled={isCommandLoading || !selectedRover}
      >
        Turn Right
      </button>
    </div>

    {error && (
      <div className="error-message" data-testid="error-message">
        {error}
      </div>
    )}
  </div>
);

ControlPanel.propTypes = {
  rovers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      position: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
      }).isRequired,
      direction: PropTypes.string.isRequired
    })
  ).isRequired,
  selectedRover: PropTypes.shape({
    id: PropTypes.string.isRequired,
    position: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }).isRequired,
    direction: PropTypes.string.isRequired
  }),
  error: PropTypes.string,
  isLoading: PropTypes.bool,
  isCommandLoading: PropTypes.bool,
  onRoverSelect: PropTypes.func.isRequired,
  onCommandSubmit: PropTypes.func.isRequired
};

ControlPanel.defaultProps = {
  selectedRover: null,
  error: null,
  isLoading: false,
  isCommandLoading: false
};

export default ControlPanel;
