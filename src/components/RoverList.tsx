import { AnimatePresence, motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Rover } from '../types/rover'
import RoverCard from './RoverCard'

interface RoverListProps {
  rovers: Rover[]
  selectedRoverId: number | null
  onSelectRover: (id: number) => void
  onAddRover: () => void
  onDeleteRover: (id: number) => void
}

const RoverList: React.FC<RoverListProps> = ({
  rovers,
  selectedRoverId,
  onSelectRover,
  onAddRover,
  onDeleteRover,
}) => {
  return (
    <div className="flex flex-col h-full p-3 gap-2">
      {/* Panel header */}
      <div
        className="flex items-center gap-2 px-1 pb-1 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <span className="font-mono text-xs tracking-widest uppercase" style={{ color: '#64748b' }}>
          FLEET
        </span>
        <Badge
          variant="outline"
          className="font-mono text-xs px-1.5 py-0 h-4"
          style={{ color: '#64748b', borderColor: 'rgba(255,255,255,0.15)' }}
        >
          {rovers.length}
        </Badge>
      </div>

      {/* Rover cards */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-1">
        <AnimatePresence>
          {rovers.map(rover => (
            <motion.div
              key={rover.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden' }}
            >
              <RoverCard
                rover={rover}
                isSelected={rover.id === selectedRoverId}
                onSelect={onSelectRover}
                onDelete={onDeleteRover}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add rover footer */}
      <button
        data-testid="add-rover"
        onClick={onAddRover}
        className="w-full text-xs py-1.5 px-3 rounded border font-mono hover:bg-white/[0.05] transition-colors"
        style={{ color: '#64748b', borderColor: 'rgba(255,255,255,0.08)' }}
      >
        + Add Rover
      </button>
    </div>
  )
}

export default RoverList
