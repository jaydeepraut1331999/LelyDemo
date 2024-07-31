import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SVGCanvas from '../components/SVGCanvas'; 
import { useLineContext } from '../context/LineContext';
import { Line, Circle, SVG } from '@svgdotjs/svg.js';

jest.mock('@svgdotjs/svg.js', () => ({
  SVG: jest.fn().mockImplementation(() => ({
    addTo: jest.fn().mockReturnThis(),
    size: jest.fn().mockReturnThis(),
    line: jest.fn(),
    circle: jest.fn(),
    on: jest.fn(),
  })),
  Line: jest.fn(),
  Circle: jest.fn(),
}));

// Define the shape of the mock context
const mockSetLineLength = jest.fn();
const mockSetLineAngle = jest.fn();

jest.mock('../context/LineContext', () => ({
  useLineContext: jest.fn().mockReturnValue({
    setLineLength: mockSetLineLength,
    setLineAngle: mockSetLineAngle,
  }),
}));

describe('SVGCanvas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component', () => {
    render(<SVGCanvas />);
    expect(screen.getByRole('presentation')).toBeInTheDocument(); // 'presentation' is a default role for div, adjust if necessary
  });

  test('creates a line when mouse is dragged', () => {
    // Create a mock implementation of Line and Circle
    const mockLine = { node: {} } as unknown as Line;
    const mockCircle = { center: jest.fn(), draggable: jest.fn(), addClass: jest.fn() } as unknown as Circle;

    // Mock SVG methods to return mockLine and mockCircle
    (SVG as jest.Mock).mockImplementation(() => ({
      addTo: jest.fn().mockReturnThis(),
      size: jest.fn().mockReturnThis(),
      line: jest.fn().mockReturnValue(mockLine),
      circle: jest.fn().mockReturnValue(mockCircle),
      on: jest.fn(),
    }));

    render(<SVGCanvas />);

    // Simulate mouse down to start drawing
    act(() => {
      fireEvent.mouseDown(screen.getByRole('presentation'), { clientX: 10, clientY: 10 });
    });
    // Simulate mouse move to draw the line
    act(() => {
      fireEvent.mouseMove(screen.getByRole('presentation'), { clientX: 50, clientY: 50 });
    });
    // Simulate mouse up to finish drawing
    act(() => {
      fireEvent.mouseUp(screen.getByRole('presentation'));
    });

    expect(SVG().line).toHaveBeenCalled();
    expect(SVG().circle).toHaveBeenCalled();
  });

  test('updates circles position and line properties', () => {
    const mockLine = { attr: jest.fn(), plot: jest.fn() } as unknown as Line;
    const mockCircle = { center: jest.fn() } as unknown as Circle;

    (SVG as jest.Mock).mockImplementation(() => ({
      addTo: jest.fn().mockReturnThis(),
      size: jest.fn().mockReturnThis(),
      line: jest.fn().mockReturnValue(mockLine),
      circle: jest.fn().mockReturnValue(mockCircle),
      on: jest.fn(),
    }));

    render(<SVGCanvas />);

    // Simulate mouse events to create and drag the line
    act(() => {
      fireEvent.mouseDown(screen.getByRole('presentation'), { clientX: 10, clientY: 10 });
      fireEvent.mouseMove(screen.getByRole('presentation'), { clientX: 50, clientY: 50 });
      fireEvent.mouseUp(screen.getByRole('presentation'));
    });

    // Simulate dragging of circles
    act(() => {
      fireEvent.dragStart(mockLine as unknown as HTMLElement);
      fireEvent.drag(mockLine as unknown as HTMLElement, { clientX: 60, clientY: 60 });
      fireEvent.dragEnd(mockLine as unknown as HTMLElement);
    });

    expect(mockCircle.center).toHaveBeenCalled();
    expect(mockSetLineLength).toHaveBeenCalled();
    expect(mockSetLineAngle).toHaveBeenCalled();
  });
});
