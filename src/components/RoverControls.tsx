import { useState } from 'react'
import { Rover, Command } from '../types/rover'

interface RoverControlsProps {
  rover: Rover
  onSendCommands: (commands: Command[]) => void
}

const RoverControls: React.FC<RoverControlsProps> = ({ rover, onSendCommands }) => {
  const [commands, setCommands] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validCommands = commands
      .toLowerCase()
      .split('')
      .filter((cmd): cmd is Command => ['f', 'b', 'l', 'r'].includes(cmd))

    if (validCommands.length > 0) {
      onSendCommands(validCommands)
      setCommands('')
    }
  }

  return (
    <div data-testid="rover-controls">
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Enter commands (f,b,l,r)"
              value={commands}
              onChange={e => setCommands(e.target.value)}
              maxLength={20}
            />
            <button type="submit" disabled={!commands}>
              Execute
            </button>
          </div>
        </form>

        <div>
          <span>Selected Rover:</span>
          <span data-testid="rover-position">
            Position: ({rover.x}, {rover.y}) {rover.direction}
          </span>
        </div>
        <button data-testid="move-forward" onClick={() => onSendCommands(['f'])}>
          Forward
        </button>
      </div>
    </div>
  )
}

export default RoverControls
