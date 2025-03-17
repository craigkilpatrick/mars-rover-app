# Mars Rover App

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![codecov](https://codecov.io/gh/craigkilpatrick/mars-rover-app/branch/main/graph/badge.svg)](https://codecov.io/gh/craigkilpatrick/mars-rover-app)
[![Build Status](https://github.com/craigkilpatrick/mars-rover-app/workflows/CI/badge.svg)](https://github.com/craigkilpatrick/mars-rover-app/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF.svg)](https://vitejs.dev/)
[![Docker](https://img.shields.io/badge/Docker-24.0-2496ED.svg)](https://www.docker.com/)

A React-based web application for controlling Mars rovers. This application provides a user interface to create, control, and monitor rovers on a simulated Martian surface.

## Features

- Create and position new rovers
- Send movement commands to rovers
- Real-time position tracking
- Interactive grid visualization
- HAL+JSON API integration

## Prerequisites

- Docker
- Make
- Git

## Quick Start

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd mars-rover-app
   ```

2. Set up environment:

   ```bash
   make install
   ```

   This will create a `.env` file from `.env.template`. Review and update the values as needed.

3. Start the application:
   ```bash
   make up     # Starts in development mode by default
   ```

## Development

### Available Commands

Run `make help` to see all available commands. Here are the most common ones:

```bash
# Development Commands
make up           # Start development server (default)
make down         # Stop all containers
make lint         # Run code linting
make format       # Format code
make test         # Run tests

# Build Commands
make build        # Build the application
make docker-build # Build production Docker image

# Deployment Commands
make up-dev       # Start development environment
make up-prod      # Start production environment
```

### Development Mode

Development mode provides:

- Hot Module Reloading (HMR)
- Source maps for debugging
- Live code updates
- Development server at http://localhost:3000
- Node.js debugger on port 9229

To start in development mode:

```bash
make up    # or make up-dev
```

### Production Mode

Production mode provides:

- Optimized production build
- Code splitting and chunk optimization
- Nginx serving static files
- Production server at http://localhost:80

To start in production mode:

```bash
make up-prod
```

### Switching Between Modes

To switch between development and production:

```bash
make down         # Stop current environment
make up-dev       # Start development mode
# or
make up-prod      # Start production mode
```

## API Integration

The application communicates with the Mars Rover API through:

- HAL+JSON format for resource discovery
- Nginx reverse proxy configuration
- Automatic network discovery via Docker

### API Endpoints

- `GET /api/rovers` - List all rovers
- `POST /api/rovers` - Create a new rover
- `POST /api/rovers/{id}/commands` - Send commands to a rover
- `DELETE /api/rovers/{id}` - Delete a rover

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `make test`
4. Run linting: `make lint`
5. Format code: `make format`
6. Submit a pull request

## License

MIT License
