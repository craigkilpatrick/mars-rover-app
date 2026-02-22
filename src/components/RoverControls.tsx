import { useState } from 'react'
import { Rover, Command } from '../types/rover'
import DirectionalPad from './DirectionalPad'

interface RoverControlsProps {
  rover: Rover | undefined
  onSendCommands: (commands: Command[]) => void
}

const RoverControls: React.FC<RoverControlsProps> = ({ rover, onSendCommands }) => {
  const [commandString, setCommandString] = useState('')

  if (!rover) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6">
        <div
          data-testid="no-rover-placeholder"
          className="font-mono text-xs text-center"
          style={{ color: '#64748b' }}
        >
          Select a rover to begin
        </div>
      </div>
    )
  }

  const handleExecute = () => {
    if (!commandString) return
    onSendCommands(commandString.split('') as Command[])
    setCommandString('')
  }

  return (
    <div data-testid="rover-controls" className="flex flex-col h-full p-3 gap-4">
      {/* Panel header */}
      <div
        className="flex items-center gap-2 px-1 pb-1 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <span className="font-mono text-xs tracking-widest uppercase" style={{ color: '#64748b' }}>
          MISSION HQ
        </span>
      </div>

      {/* Rover info */}
      <div className="flex flex-col gap-0.5 px-1">
        <span className="font-mono text-sm" style={{ color: '#e2e8f0' }}>
          ROV-{String(rover.id).padStart(2, '0')}
        </span>
        <span
          data-testid="rover-position"
          className="font-mono text-xs"
          style={{ color: '#64748b' }}
        >
          X: {rover.x} Y: {rover.y} | DIR: {rover.direction}
        </span>
      </div>

      {/* Directional pad */}
      <DirectionalPad onCommand={cmd => onSendCommands([cmd])} />

      {/* Command string input + execute */}
      <div className="flex flex-col gap-2 px-1">
        <input
          type="text"
          data-testid="command-input"
          placeholder="f b l r …"
          value={commandString}
          onChange={e => setCommandString(e.target.value.replace(/[^fblr]/gi, '').toLowerCase())}
          maxLength={20}
          className="w-full font-mono text-xs px-3 py-2 rounded border bg-transparent outline-none focus:border-cyan-400 transition-colors"
          style={{ borderColor: 'rgba(255,255,255,0.15)', color: '#e2e8f0' }}
        />
        <button
          data-testid="execute-btn"
          onClick={handleExecute}
          disabled={!commandString}
          className="w-full font-mono text-xs py-2 px-3 rounded border transition-colors disabled:opacity-40 hover:border-cyan-400 hover:text-cyan-400"
          style={{
            borderColor: 'rgba(255,255,255,0.15)',
            color: '#e2e8f0',
            backgroundColor: 'transparent',
          }}
        >
          Execute
        </button>
      </div>
    </div>
  )
}

export default RoverControls
