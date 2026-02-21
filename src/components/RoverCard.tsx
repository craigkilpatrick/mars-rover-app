import { cn } from '@/lib/utils'
import { Rover } from '../types/rover'

interface RoverCardProps {
  rover: Rover
  isSelected: boolean
  onSelect: (id: number) => void
  onDelete: (id: number) => void
}

const RoverCard: React.FC<RoverCardProps> = ({ rover, isSelected, onSelect, onDelete }) => {
  return (
    <div
      data-testid={`rover-card-${rover.id}`}
      className={cn(
        'w-full flex items-center border-l-2 rounded-sm transition-colors',
        isSelected ? 'border-cyan-400 bg-white/[0.05]' : 'border-transparent hover:bg-white/[0.03]'
      )}
    >
      {/* Selectable area */}
      <button
        onClick={() => onSelect(rover.id)}
        className="flex-1 min-w-0 flex items-center gap-2 px-3 py-2 text-left"
      >
        {/* Color swatch */}
        <span
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: rover.color }}
        />

        {/* Rover info */}
        <span className="flex-1 min-w-0 flex flex-col gap-0.5">
          <span className="font-mono text-sm truncate" style={{ color: '#e2e8f0' }}>
            ROV-{String(rover.id).padStart(2, '0')}
          </span>
          <span className="font-mono text-xs" style={{ color: '#64748b' }}>
            X: {rover.x} Y: {rover.y}
          </span>
        </span>

        {/* Direction */}
        <span className="font-mono text-sm font-bold flex-shrink-0" style={{ color: '#06b6d4' }}>
          {rover.direction}
        </span>
      </button>

      {/* Delete button — only visible when selected, outside the select button */}
      {isSelected && (
        <button
          aria-label="delete rover"
          data-testid="delete-rover"
          onClick={() => onDelete(rover.id)}
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded text-xs hover:bg-white/10 mr-1"
          style={{ color: '#ef4444' }}
        >
          ✕
        </button>
      )}
    </div>
  )
}

export default RoverCard
