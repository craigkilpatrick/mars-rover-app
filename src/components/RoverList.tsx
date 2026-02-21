import { Rover } from '../types/rover'

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
    <div>
      <h2>Mars Rovers</h2>
      <ul>
        {rovers.map(rover => (
          <li key={rover.id}>
            <button
              onClick={() => onSelectRover(rover.id)}
              data-testid={`rover-item-${rover.id}`}
              data-selected={rover.id === selectedRoverId ? 'true' : 'false'}
            >
              Rover {rover.id} ({rover.x}, {rover.y}) {rover.direction}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={onAddRover}>Add New Rover</button>
      <button
        data-testid="delete-rover"
        onClick={() => selectedRoverId && onDeleteRover(selectedRoverId)}
        disabled={!selectedRoverId}
      >
        Delete
      </button>
    </div>
  )
}

export default RoverList
