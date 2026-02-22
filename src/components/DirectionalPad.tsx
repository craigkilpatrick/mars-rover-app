import { motion } from 'framer-motion'
import { Command } from '../types/rover'

interface DirectionalPadProps {
  onCommand: (cmd: Command) => void
  disabled?: boolean
}

const springTransition = { type: 'spring', stiffness: 400, damping: 17 } as const

const DirectionalPad: React.FC<DirectionalPadProps> = ({ onCommand, disabled = false }) => {
  const btnClass =
    'w-12 h-12 flex items-center justify-center rounded border font-mono text-sm font-bold transition-colors hover:border-cyan-400 hover:text-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed'
  const btnStyle = {
    borderColor: 'rgba(255,255,255,0.2)',
    color: '#e2e8f0',
    backgroundColor: 'transparent',
  }

  return (
    <div className="grid grid-cols-3 gap-1 w-fit mx-auto">
      <div />
      <motion.button
        aria-label="forward"
        disabled={disabled}
        onClick={() => onCommand('f')}
        className={btnClass}
        style={btnStyle}
        whileTap={{ scale: 0.93 }}
        transition={springTransition}
      >
        ↑
      </motion.button>
      <div />
      <motion.button
        aria-label="turn left"
        disabled={disabled}
        onClick={() => onCommand('l')}
        className={btnClass}
        style={btnStyle}
        whileTap={{ scale: 0.93 }}
        transition={springTransition}
      >
        ←
      </motion.button>
      <div />
      <motion.button
        aria-label="turn right"
        disabled={disabled}
        onClick={() => onCommand('r')}
        className={btnClass}
        style={btnStyle}
        whileTap={{ scale: 0.93 }}
        transition={springTransition}
      >
        →
      </motion.button>
      <div />
      <motion.button
        aria-label="backward"
        disabled={disabled}
        onClick={() => onCommand('b')}
        className={btnClass}
        style={btnStyle}
        whileTap={{ scale: 0.93 }}
        transition={springTransition}
      >
        ↓
      </motion.button>
      <div />
    </div>
  )
}

export default DirectionalPad
