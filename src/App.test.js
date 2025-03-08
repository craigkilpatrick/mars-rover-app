import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App Component', () => {
  test('renders Mars Rover App', () => {
    render(<App />);
    const appElement = screen.getByTestId('mars-rover-app');
    expect(appElement).toBeInTheDocument();
  });
});
