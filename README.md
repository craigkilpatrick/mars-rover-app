# Mars Rover App

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![codecov](https://codecov.io/gh/craigkilpatrick/mars-rover-app/branch/main/graph/badge.svg)](https://codecov.io/gh/craigkilpatrick/mars-rover-app)
[![Build Status](https://github.com/craigkilpatrick/mars-rover-app/workflows/CI/badge.svg)](https://github.com/craigkilpatrick/mars-rover-app/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF.svg)](https://vitejs.dev/)
[![Docker](https://img.shields.io/badge/Docker-24.0-2496ED.svg)](https://www.docker.com/)

A modern React application for controlling multiple Mars rovers on a grid. Built with React, Vite, TypeScript, and Material-UI.

## Features

- 🚀 Multiple rover management with unique color identification
- 🎮 Interactive grid visualization with real-time updates
- 📱 Modern, responsive UI using Material-UI components
- 🎯 Visual selection and highlighting of active rover
- ⌨️ Simple command interface (f,b,l,r)
- 🔄 Real-time state synchronization
- 🛡️ Type-safe development with TypeScript
- 🐳 Docker support for development and production
- 🔗 HAL-compliant API integration

## Prerequisites

- Docker and Docker Compose
  OR
- Node.js (v14 or higher)
- [Mars Rover API](https://github.com/craigkilpatrick/mars-rover-api) running on port 8080

## Installation

### Using Docker (Recommended)

1. Clone the repository:

```bash
git clone git@github.com:craigkilpatrick/mars-rover-app.git
cd mars-rover-app
```

2. Start the application:

```bash
docker compose up -d
```

The application will be available at `http://localhost:3000`.

### Manual Installation

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

The application communicates with the [Mars Rover API](https://github.com/craigkilpatrick/mars-rover-api) using HAL (Hypertext Application Language) for hypermedia-driven interaction.

### API Response Formats

1. **Collection Responses (HAL Format)**

   ```json
   {
     "_embedded": {
       "roverList": [
         {
           "id": 1,
           "x": 0,
           "y": 0,
           "direction": "N",
           "_links": {
             "self": { "href": "/rovers/1" },
             "rovers": { "href": "/rovers" }
           }
         }
       ]
     },
     "_links": {
       "self": { "href": "/rovers" }
     }
   }
   ```

2. **Individual Resource Responses**
   ```json
   {
     "id": 1,
     "x": 0,
     "y": 0,
     "direction": "N",
     "_links": {
       "self": { "href": "/rovers/1" },
       "rovers": { "href": "/rovers" }
     }
   }
   ```

### Available Endpoints

- `GET /rovers` - List all rovers (HAL collection format)
- `POST /rovers` - Create new rover (direct resource response)
- `GET /rovers/{id}` - Get specific rover (direct resource response)
- `DELETE /rovers/{id}` - Delete specific rover
- `POST /rovers/{id}/commands` - Send commands to rover (direct resource response)

## Development

This project uses:

- React for UI components
- TypeScript for type safety
- Vite for fast development and building
- Material-UI for styled components
- Conventional Commits for version control
- Vitest and React Testing Library for testing
- Docker for containerization

### Docker Development

The project includes a multi-stage Dockerfile and docker-compose configuration:

- Development mode with hot-reload
- Production-optimized builds
- Automatic network configuration
- Volume mounts for local development

### Testing

The application uses Vitest and React Testing Library for comprehensive testing:

#### Test Coverage

- **API Integration**

  - HAL response handling
  - Direct resource responses
  - Error handling and validation
  - Command processing

- **RoverGrid Component**
  - Grid rendering and dimensions
  - Coordinate system validation
  - Rover positioning and selection
  - Visual styling and accessibility

#### Running Tests

```bash
# In Docker
docker compose exec mars-rover-app npm run test:run

# Local Development
npm run test:run  # Run tests once
npm run test      # Run tests in watch mode
```

### TypeScript Support

The codebase is fully typed with TypeScript, providing:

- Type-safe component props
- Strict type checking
- Interface definitions for API responses
- Enhanced IDE support and code completion
- HAL response type definitions

## Contributing

1. Create a new branch
2. Make your changes
3. Submit a pull request

Please follow the conventional commits format (all lowercase):

```
type(scope): description

Example: feat(rover): add movement validation
```

## License

MIT License
