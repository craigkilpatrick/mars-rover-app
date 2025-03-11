import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const RoverControls = ({
  selectedRover,
  onSendCommands,
  error,
  onClearError
}) => {
  const [commands, setCommands] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const validCommands = commands
      .toLowerCase()
      .split('')
      .filter(cmd => ['f', 'b', 'l', 'r'].includes(cmd));
    
    if (validCommands.length > 0) {
      onSendCommands(validCommands);
      setCommands('');
    }
  };

  return (
    <Box sx={{ m: 2 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              label="Enter commands (f,b,l,r)"
              value={commands}
              onChange={(e) => setCommands(e.target.value)}
              disabled={!selectedRover}
              size="small"
              sx={{ flexGrow: 1 }}
              inputProps={{ maxLength: 20 }}
            />
            <Button
              type="submit"
              variant="contained"
              endIcon={<SendIcon />}
              disabled={!selectedRover || !commands}
            >
              Execute
            </Button>
          </Box>
        </form>

        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Selected Rover:
        </Typography>
        {selectedRover ? (
          <>
            <Typography>
              Position: ({selectedRover.x}, {selectedRover.y})
            </Typography>
            <Typography>
              Direction: {selectedRover.direction}
            </Typography>
          </>
        ) : (
          <Typography color="text.secondary">
            No rover selected
          </Typography>
        )}
      </Paper>

      {error && (
        <Alert 
          severity="error" 
          onClose={onClearError}
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default RoverControls;
