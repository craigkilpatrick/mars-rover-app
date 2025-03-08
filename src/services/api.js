import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const roverService = {
  fetchRovers: async () => {
    const response = await axios.get(`${API_BASE_URL}/rovers`);
    if (response.data._embedded?.roverList) {
      return response.data._embedded.roverList.map(rover => ({
        ...rover,
        id: rover.id.toString(),
        x: parseInt(rover.x),
        y: parseInt(rover.y)
      }));
    }
    return [];
  },

  sendCommand: async (roverId, command) => {
    const response = await axios.post(`${API_BASE_URL}/rovers/${roverId}/commands`, [command]);
    return response.data;
  }
};
