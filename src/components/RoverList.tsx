import { Box, List, ListItem, ListItemButton, Typography, Button, Stack } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
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
    <Box
      sx={{
        m: 2,
        p: 2,
        border: '1px solid #ccc',
        borderRadius: 1,
        minWidth: 250,
        display: 'inline-block',
        verticalAlign: 'top',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Mars Rovers
      </Typography>

      <List sx={{ mb: 2 }}>
        {rovers.map(rover => (
          <ListItem key={rover.id} disablePadding>
            <ListItemButton
              selected={rover.id === selectedRoverId}
              onClick={() => onSelectRover(rover.id)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: rover.color,
                  border: '1px solid rgba(0,0,0,0.1)',
                  mr: 1,
                  flexShrink: 0,
                }}
              />
              <Typography>
                Rover {rover.id} ({rover.x}, {rover.y}) {rover.direction}
              </Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAddRover}
          sx={{ flexGrow: 1 }}
        >
          Add New Rover
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => selectedRoverId && onDeleteRover(selectedRoverId)}
          disabled={!selectedRoverId}
        >
          Delete
        </Button>
      </Stack>
    </Box>
  )
}

export default RoverList
