import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const roverService = {
  fetchRovers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/rovers/1`);
      return [{
        id: response.data.id.toString(),
        position: {
          x: response.data.x,
          y: response.data.y
        },
        direction: response.data.direction === 'N' ? 'NORTH' :
                  response.data.direction === 'E' ? 'EAST' :
                  response.data.direction === 'S' ? 'SOUTH' : 'WEST',
        status: 'ACTIVE'
      }];
    } catch (error) {
      console.error('Error fetching rovers:', error);
      throw error;
    }
  },

  sendCommand: async (roverId, command) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/rovers/${roverId}/command`,
        command
      );
      return {
        id: response.data.id.toString(),
        position: {
          x: response.data.x,
          y: response.data.y
        },
        direction: response.data.direction === 'N' ? 'NORTH' :
                  response.data.direction === 'E' ? 'EAST' :
                  response.data.direction === 'S' ? 'SOUTH' : 'WEST',
        status: 'ACTIVE'
      };
    } catch (error) {
      console.error('Error sending command:', error);
      throw error;
    }
  }
};
