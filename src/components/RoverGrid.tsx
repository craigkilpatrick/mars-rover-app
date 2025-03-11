import { useEffect, useRef, useCallback } from 'react';
import { Box } from '@mui/material';
import { Rover } from '../types/rover';

interface RoverGridProps {
  rovers: Rover[];
  selectedRoverId: string | null;
}

const CELL_SIZE = 5;
const GRID_SIZE = 100;
const CANVAS_SIZE = CELL_SIZE * GRID_SIZE;

const RoverGrid: React.FC<RoverGridProps> = ({ rovers, selectedRoverId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Draw grid lines
    ctx.strokeStyle = '#ccc';
    for (let i = 0; i <= CANVAS_SIZE; i += CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // Draw rovers
    rovers.forEach(rover => {
      // Convert coordinates to canvas position (flip Y axis)
      const canvasX = rover.x * CELL_SIZE;
      const canvasY = CANVAS_SIZE - (rover.y + 1) * CELL_SIZE;

      // Draw rover body
      ctx.fillStyle = rover.color;
      ctx.fillRect(
        canvasX,
        canvasY,
        CELL_SIZE,
        CELL_SIZE
      );

      // Draw direction indicator
      ctx.fillStyle = 'white';
      ctx.strokeStyle = '#333';
      const centerX = canvasX + CELL_SIZE/2;
      const centerY = canvasY + CELL_SIZE/2;
      ctx.beginPath();
      switch(rover.direction) {
        case 'N': ctx.arc(centerX, centerY - 1, 1, 0, Math.PI * 2); break;
        case 'S': ctx.arc(centerX, centerY + 1, 1, 0, Math.PI * 2); break;
        case 'E': ctx.arc(centerX + 1, centerY, 1, 0, Math.PI * 2); break;
        case 'W': ctx.arc(centerX - 1, centerY, 1, 0, Math.PI * 2); break;
      }
      ctx.fill();
      ctx.stroke();

      // Highlight selected rover
      if (rover.id === selectedRoverId) {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.strokeRect(
          canvasX - 1,
          canvasY - 1,
          CELL_SIZE + 2,
          CELL_SIZE + 2
        );
      }
    });
  }, [rovers, selectedRoverId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    drawGrid(ctx);
  }, [drawGrid]);

  return (
    <Box
      sx={{
        display: 'inline-block',
        m: 2,
        p: 2,
        border: '1px solid #ccc',
        borderRadius: 1,
        bgcolor: '#f8f8f8'
      }}
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        style={{ display: 'block' }}
      />
    </Box>
  );
};

export default RoverGrid;
