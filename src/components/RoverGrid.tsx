import { useEffect, useRef, useCallback } from 'react'
import { Rover, Obstacle } from '../types/rover'

interface RoverGridProps {
  rovers: Rover[]
  obstacles: Obstacle[]
  selectedRoverId: number | null
}

const CELL_SIZE = 5

const RoverGrid: React.FC<RoverGridProps> = ({ rovers, obstacles, selectedRoverId }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawGrid = useCallback(
    (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      // Draw grid lines
      ctx.strokeStyle = '#ccc'
      for (let i = 0; i <= canvasWidth; i += CELL_SIZE) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvasHeight)
        ctx.stroke()
      }
      for (let i = 0; i <= canvasHeight; i += CELL_SIZE) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(canvasWidth, i)
        ctx.stroke()
      }

      // Draw obstacles
      obstacles.forEach(obstacle => {
        const canvasX = obstacle.x * CELL_SIZE
        const canvasY = canvasHeight - (obstacle.y + 1) * CELL_SIZE

        ctx.strokeStyle = '#8B0000'
        ctx.lineWidth = 2

        ctx.beginPath()
        ctx.moveTo(canvasX, canvasY)
        ctx.lineTo(canvasX + CELL_SIZE, canvasY + CELL_SIZE)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(canvasX + CELL_SIZE, canvasY)
        ctx.lineTo(canvasX, canvasY + CELL_SIZE)
        ctx.stroke()

        ctx.lineWidth = 1
      })

      // Draw rovers
      rovers.forEach(rover => {
        const canvasX = rover.x * CELL_SIZE
        const canvasY = canvasHeight - (rover.y + 1) * CELL_SIZE

        ctx.fillStyle = rover.color
        ctx.fillRect(canvasX, canvasY, CELL_SIZE, CELL_SIZE)

        ctx.fillStyle = 'white'
        ctx.strokeStyle = '#333'
        const centerX = canvasX + CELL_SIZE / 2
        const centerY = canvasY + CELL_SIZE / 2
        ctx.beginPath()
        switch (rover.direction) {
          case 'N':
            ctx.arc(centerX, centerY - 1, 1, 0, Math.PI * 2)
            break
          case 'S':
            ctx.arc(centerX, centerY + 1, 1, 0, Math.PI * 2)
            break
          case 'E':
            ctx.arc(centerX + 1, centerY, 1, 0, Math.PI * 2)
            break
          case 'W':
            ctx.arc(centerX - 1, centerY, 1, 0, Math.PI * 2)
            break
        }
        ctx.fill()
        ctx.stroke()

        if (rover.id === selectedRoverId) {
          ctx.strokeStyle = '#333'
          ctx.lineWidth = 1
          ctx.strokeRect(canvasX - 1, canvasY - 1, CELL_SIZE + 2, CELL_SIZE + 2)
        }
      })
    },
    [rovers, obstacles, selectedRoverId]
  )

  // ResizeObserver: keep canvas dimensions in sync with container
  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (ctx) drawGrid(ctx, width, height)
      }
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [drawGrid])

  // Initial draw when props change (ResizeObserver handles resize redraws)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawGrid(ctx, canvas.width, canvas.height)
  }, [drawGrid])

  return (
    <div ref={containerRef} data-testid="rover-grid" className="w-full h-full">
      <canvas ref={canvasRef} />
    </div>
  )
}

export default RoverGrid
