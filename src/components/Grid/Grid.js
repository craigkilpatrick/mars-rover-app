import React from 'react';
import PropTypes from 'prop-types';
import { Stage, Layer, Rect, RegularPolygon } from 'react-konva';
import { GRID_CONFIG, ROVER_CONFIG, DIRECTION_ROTATIONS } from '../../constants/config';

const Grid = ({ rovers, selectedRover }) => {
  const renderGrid = () => {
    const cells = [];
    const numCells = GRID_CONFIG.width / GRID_CONFIG.cellSize;

    for (let i = 0; i < numCells; i++) {
      for (let j = 0; j < numCells; j++) {
        cells.push(
          <Rect
            key={`${i}-${j}`}
            x={i * GRID_CONFIG.cellSize}
            y={j * GRID_CONFIG.cellSize}
            width={GRID_CONFIG.cellSize}
            height={GRID_CONFIG.cellSize}
            stroke={GRID_CONFIG.lineColor}
          />
        );
      }
    }
    return cells;
  };

  const renderRovers = () => {
    return rovers.map(rover => {
      const x = rover.x * GRID_CONFIG.cellSize + GRID_CONFIG.cellSize / 2;
      const y = rover.y * GRID_CONFIG.cellSize + GRID_CONFIG.cellSize / 2;
      const isSelected = selectedRover?.id === rover.id;

      return (
        <RegularPolygon
          key={rover.id}
          x={x}
          y={y}
          sides={3}
          radius={ROVER_CONFIG.size / 2}
          fill={isSelected ? '#2ecc71' : ROVER_CONFIG.color}
          rotation={DIRECTION_ROTATIONS[rover.direction]}
          shadowBlur={isSelected ? 10 : 0}
          shadowColor={isSelected ? '#27ae60' : 'transparent'}
          shadowOpacity={0.5}
        />
      );
    });
  };

  return (
    <Stage
      width={GRID_CONFIG.width}
      height={GRID_CONFIG.height}
      style={{ backgroundColor: GRID_CONFIG.backgroundColor }}
    >
      <Layer>
        {renderGrid()}
        {renderRovers()}
      </Layer>
    </Stage>
  );
};

Grid.propTypes = {
  rovers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      direction: PropTypes.string.isRequired
    })
  ).isRequired,
  selectedRover: PropTypes.shape({
    id: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    direction: PropTypes.string.isRequired
  })
};

Grid.defaultProps = {
  selectedRover: null
};

export default Grid;
