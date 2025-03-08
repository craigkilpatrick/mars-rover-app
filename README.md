# Mars Rover Control Application

[![React](https://img.shields.io/badge/React-18.0.0-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

An interactive web application for controlling and visualizing Mars rovers on a grid-based terrain. Built with React and integrated with a Java Spring Boot backend API.

## Features

- Real-time rover control and visualization
- Interactive 100x100 grid with Mars-like terrain
- Simple command interface (forward, backward, left, right)
- Multiple rover support with individual tracking
- Visual position and direction indicators
- Responsive UI with loading states and error handling

## Prerequisites

Before running the application, ensure you have:

- Node.js (v14 or higher)
- npm (v6 or higher)
- Java 11 or higher (for the backend API)
- Maven (for building the backend)

## Getting Started

1. **Start the Backend API**
   ```bash
   cd mars-rover-api
   mvn spring-boot:run
   ```
   The API will start on http://localhost:8080

2. **Install Frontend Dependencies**
   ```bash
   cd mars-rover-app
   npm install
   ```

3. **Start the Frontend Application**
   ```bash
   npm start
   ```
   The app will open in your browser at http://localhost:3000

## Using the Application

### Controlling Rovers

1. **Select a Rover**
   - Use the dropdown menu to select one of the available rovers
   - Each rover's current position and direction are displayed

2. **Send Commands**
   - Use the command input to send instructions to the selected rover
   - Available commands:
     - `f` - Move Forward
     - `b` - Move Backward
     - `l` - Turn Left
     - `r` - Turn Right
   - Commands can be chained (e.g., "fflr" to move forward twice, turn left, then right)

3. **Visual Feedback**
   - Selected rover is highlighted in gold
   - Rover direction is indicated by a triangle
   - Loading spinners show when commands are being processed
   - Error messages display if something goes wrong

### Grid Navigation

- The grid is 100x100 cells
- Rovers wrap around the edges (e.g., moving forward at the top takes you to the bottom)
- Each rover's position is shown in (x, y) coordinates
- The grid uses a Mars-like color scheme for better visualization

## Technical Details

### Frontend Stack
- React 18
- Konva.js for canvas rendering
- Axios for API communication
- PropTypes for type checking

### API Endpoints

- `GET /rovers` - List all rovers
- `POST /rovers/{id}/commands` - Send commands to a specific rover

## Development

### Available Scripts

- `npm start` - Run the development server
- `npm test` - Run tests
- `npm run build` - Create production build

### Project Structure

```
src/
  ├── components/
  │   └── MarsRoverApp.js    # Main application component
  ├── App.js                 # Root component
  ├── index.js              # Entry point
  └── index.css             # Global styles
```

## Error Handling

The application includes comprehensive error handling for:
- API connection issues
- Invalid commands
- Rover selection errors
- Network timeouts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
