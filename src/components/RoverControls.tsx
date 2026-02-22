import { useState, useEffect } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { Rover, Command } from '../types/rover'
import DirectionalPad from './DirectionalPad'

interface RoverControlsProps {
  rover: Rover | undefined
  onSendCommands: (commands: Command[]) => Promise<{ obstacleDetected?: boolean } | void>
}

const RoverControls: React.FC<RoverControlsProps> = ({ rover, onSendCommands }) => {
  const [commandString, setCommandString] = useState('')
  const [commandResult, setCommandResult] = useState<'idle' | 'success' | 'obstacle'>('idle')
  const shakeControls = useAnimation()

  useEffect(() => {
    if (commandResult === 'obstacle') {
      shakeControls.start({ x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.35 } })
    }
  }, [commandResult, shakeControls])

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
    const commands = commandString.split('') as Command[]
    setCommandString('')
    onSendCommands(commands).then(result => {
      const outcome = result?.obstacleDetected ? 'obstacle' : 'success'
      setCommandResult(outcome)
      setTimeout(() => setCommandResult('idle'), 800)
    })
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
        <div
          data-testid="rover-position"
          className="font-mono text-xs flex items-center gap-0"
          style={{ color: '#64748b', overflow: 'hidden' }}
        >
          <span>X: </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={`x-${rover.x}`}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.15 }}
              style={{ display: 'inline-block' }}
            >
              {rover.x}
            </motion.span>
          </AnimatePresence>
          <span> Y: </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={`y-${rover.y}`}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.15 }}
              style={{ display: 'inline-block' }}
            >
              {rover.y}
            </motion.span>
          </AnimatePresence>
          <span> | DIR: </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={`dir-${rover.direction}`}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.15 }}
              style={{ display: 'inline-block' }}
            >
              {rover.direction}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Directional pad */}
      <DirectionalPad onCommand={cmd => onSendCommands([cmd])} />

      {/* Command string input + execute */}
      <motion.div className="flex flex-col gap-2 px-1" animate={shakeControls}>
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
        <motion.button
          data-testid="execute-btn"
          onClick={handleExecute}
          disabled={!commandString}
          whileTap={{ scale: 0.93 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          animate={{
            borderColor:
              commandResult === 'success'
                ? '#06b6d4'
                : commandResult === 'obstacle'
                  ? '#ef4444'
                  : 'rgba(255,255,255,0.15)',
          }}
          className="w-full font-mono text-xs py-2 px-3 rounded border transition-colors disabled:opacity-40 hover:border-cyan-400 hover:text-cyan-400"
          style={{
            color: '#e2e8f0',
            backgroundColor: 'transparent',
          }}
        >
          Execute
        </motion.button>
      </motion.div>
    </div>
  )
}

export default RoverControls
