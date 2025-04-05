import { useState } from 'react'
import { Box, TextField, Button, Typography, Paper } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
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
    <Box sx={{ m: 2 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              label="Enter commands (f,b,l,r)"
              value={commands}
              onChange={e => setCommands(e.target.value)}
              size="small"
              sx={{ flexGrow: 1 }}
              inputProps={{ maxLength: 20 }}
            />
            <Button type="submit" variant="contained" endIcon={<SendIcon />} disabled={!commands}>
              Execute
            </Button>
          </Box>
        </form>

        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Selected Rover:
        </Typography>
        <Typography>
          Position: ({rover.x}, {rover.y})
        </Typography>
        <Typography>Direction: {rover.direction}</Typography>
      </Paper>
    </Box>
  )
}

export default RoverControls
