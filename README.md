# Mars Rover App

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![codecov](https://codecov.io/gh/craigkilpatrick/mars-rover-app/branch/main/graph/badge.svg)](https://codecov.io/gh/craigkilpatrick/mars-rover-app)
[![Build Status](https://github.com/craigkilpatrick/mars-rover-app/workflows/CI/badge.svg)](https://github.com/craigkilpatrick/mars-rover-app/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF.svg)](https://vitejs.dev/)

A modern React application for controlling multiple Mars rovers on a grid. Built with React, Vite, TypeScript, and Material-UI.

## Features

- 🚀 Multiple rover management with unique color identification
- 🎮 Interactive grid visualization with real-time updates
- 📱 Modern, responsive UI using Material-UI components
- 🎯 Visual selection and highlighting of active rover
- ⌨️ Simple command interface (f,b,l,r)
- 🔄 Real-time state synchronization
- 🛡️ Type-safe development with TypeScript

## Prerequisites

- Node.js (v14 or higher)
- [Mars Rover API](https://github.com/craigkilpatrick/mars-rover-api) running on port 8080

## Installation

1. Clone the repository:
```bash
git clone git@github.com:craigkilpatrick/mars-rover-app.git
cd mars-rover-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Usage

1. **Adding Rovers**
   - Click "Add New Rover" to create a rover
   - Each rover appears with a unique color on the grid
   - New rovers start at position (0,0) facing North

2. **Selecting Rovers**
   - Click on a rover in the list to select it
   - Selected rover is highlighted on both list and grid

3. **Controlling Rovers**
   - Use the command input to send instructions:
     - `f`: Move forward
     - `b`: Move backward
     - `l`: Turn left
     - `r`: Turn right
   - Multiple commands can be sent at once (e.g., "fflr")

4. **Removing Rovers**
   - Select a rover and click "Delete" to remove it

## API Integration

The application communicates with the [Mars Rover API](https://github.com/craigkilpatrick/mars-rover-api) running on `http://localhost:8080`. Please refer to the API repository for setup instructions.

Available endpoints:

- `GET /rovers` - List all rovers
- `POST /rovers` - Create new rover
- `GET /rovers/{id}` - Get specific rover state
- `DELETE /rovers/{id}` - Delete specific rover
- `POST /rovers/{id}/commands` - Send commands to rover

## Component Structure

1. **App (Root)**
   - Manages global state
   - Handles API communication
   - Coordinates component updates

2. **RoverGrid**
   - Canvas-based visualization
   - Renders rovers with unique colors
   - Highlights selected rover
   - Handles grid cell sizing

3. **RoverList**
   - Displays all rovers with info
   - Handles rover selection
   - Shows color indicators
   - Includes add/delete buttons

4. **RoverControls**
   - Command input field
   - Execute button
   - Error display
   - Selected rover status

## Development

This project uses:
- React for UI components
- TypeScript for type safety
- Vite for fast development and building
- Material-UI for styled components
- Conventional Commits for version control
- Vitest and React Testing Library for testing

### Testing

The application uses Vitest and React Testing Library for comprehensive testing:

#### Test Coverage
- **RoverGrid Component**
  - Grid rendering and dimensions (100x100 grid, 5px cells)
  - Coordinate system validation (0,0 at bottom-left, increasing north/east)
  - Rover positioning and selection
  - Visual styling and accessibility

#### Running Tests
```bash
# Run tests once
npm run test:run

# Run tests in watch mode
npm run test
```

### TypeScript Support

The codebase is fully typed with TypeScript, providing:
- Type-safe component props
- Strict type checking
- Interface definitions for API responses
- Enhanced IDE support and code completion

## Contributing

1. Create a new branch
2. Make your changes
3. Submit a pull request

Please follow the conventional commits format:
```
type(scope): description

Example: feat(rover): add movement validation
```

## License

MIT License
