import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MarsRoverApp from './MarsRoverApp';

// Mock axios
jest.mock('axios');

// Mock Konva components
jest.mock('react-konva', () => ({
  Stage: ({ children }) => <div data-testid="konva-stage">{children}</div>,
  Layer: ({ children }) => <div data-testid="konva-layer">{children}</div>,
  Rect: () => <div data-testid="konva-rect" />,
  RegularPolygon: () => <div data-testid="konva-polygon" />,
  Group: ({ children }) => <div data-testid="konva-group">{children}</div>
}));

describe('MarsRoverApp Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock successful API responses
    axios.get.mockResolvedValue({
      data: {
        id: 1,
        position: { x: 0, y: 0 },
        direction: 'NORTH',
        status: 'ACTIVE'
      }
    });
    
    axios.post.mockResolvedValue({
      data: {
        id: 1,
        position: { x: 0, y: 1 },
        direction: 'NORTH',
        status: 'ACTIVE'
      }
    });
  });

  test('renders grid and control panel', () => {
    render(<MarsRoverApp />);
    expect(screen.getByTestId('konva-stage')).toBeInTheDocument();
    expect(screen.getByTestId('control-panel')).toBeInTheDocument();
  });

  test('loads rover data on mount', async () => {
    render(<MarsRoverApp />);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/rovers'));
    });
  });

  test('handles movement commands', async () => {
    render(<MarsRoverApp />);
    
    // Wait for initial rover load
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });

    // Find and click movement buttons
    const forwardButton = screen.getByRole('button', { name: /forward/i });
    fireEvent.click(forwardButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/rovers/1/commands'),
        expect.arrayContaining(['M'])
      );
    });
  });

  test('displays loading state during API calls', async () => {
    // Mock a delayed API response
    axios.get.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<MarsRoverApp />);
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    // Mock API error
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch rover'));
    
    render(<MarsRoverApp />);
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
  });
});
