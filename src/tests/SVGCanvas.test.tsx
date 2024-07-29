import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SVGCanvas from '../components/SVGCanvas';

describe('SVGCanvas Component', () => {
  let setLineLength: jest.Mock;
  let setLineAngle: jest.Mock;

  beforeEach(() => {
    setLineLength = jest.fn();
    setLineAngle = jest.fn();
  });

  test('renders SVGCanvas component', () => {
    render(<SVGCanvas setLineLength={setLineLength} setLineAngle={setLineAngle} />);
    const drawingElement = screen.getByTestId('drawing-container');
    expect(drawingElement).toBeInTheDocument();
  });

  test('starts drawing a line on mouse down', () => {
    render(<SVGCanvas setLineLength={setLineLength} setLineAngle={setLineAngle} />);
    const drawingElement = screen.getByTestId('drawing-container');

    fireEvent.mouseDown(drawingElement, { clientX: 50, clientY: 50 });
    fireEvent.mouseMove(drawingElement, { clientX: 100, clientY: 100 });
    fireEvent.mouseUp(drawingElement);

    // Check if line is drawn
    expect(setLineLength).toHaveBeenCalled();
    expect(setLineAngle).toHaveBeenCalled();
  });

  test('updates line length and angle on line move', () => {
    render(<SVGCanvas setLineLength={setLineLength} setLineAngle={setLineAngle} />);
    const drawingElement = screen.getByTestId('drawing-container');

    fireEvent.mouseDown(drawingElement, { clientX: 50, clientY: 50 });
    fireEvent.mouseMove(drawingElement, { clientX: 100, clientY: 100 });
    fireEvent.mouseUp(drawingElement);

    // Select the line by clicking on it
    fireEvent.click(drawingElement, { target: { nodeName: 'line' } });

    // Simulate line dragging
    fireEvent.dragStart(drawingElement, { clientX: 100, clientY: 100 });
    fireEvent.drag(drawingElement, { clientX: 150, clientY: 150 });
    fireEvent.dragEnd(drawingElement);

    // Check if line length and angle are updated
    expect(setLineLength).toHaveBeenCalledTimes(2);
    expect(setLineAngle).toHaveBeenCalledTimes(2);
  });

  test('hides circles on line deselection', () => {
    render(<SVGCanvas setLineLength={setLineLength} setLineAngle={setLineAngle} />);
    const drawingElement = screen.getByTestId('drawing-container');

    fireEvent.mouseDown(drawingElement, { clientX: 50, clientY: 50 });
    fireEvent.mouseMove(drawingElement, { clientX: 100, clientY: 100 });
    fireEvent.mouseUp(drawingElement);

    // Select the line by clicking on it
    fireEvent.click(drawingElement, { target: { nodeName: 'line' } });

    // Deselect the line by clicking outside
    fireEvent.click(drawingElement, { target: { nodeName: 'div' } });

    // Check if line circles are hidden
    const circles = screen.queryAllByRole('circle');
    circles.forEach((circle) => {
      expect(circle).not.toBeVisible();
    });
  });
});
