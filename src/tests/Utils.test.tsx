import { Line, Circle } from '@svgdotjs/svg.js';
import { updateLineProperties, updateCirclesPosition } from '../utils/utils';

const mockLine = (x1: number, y1: number, x2: number, y2: number): Line => {
  return {
    attr: jest.fn((attr: string) => {
      switch (attr) {
        case 'x1': return x1.toString();
        case 'y1': return y1.toString();
        case 'x2': return x2.toString();
        case 'y2': return y2.toString();
        default: return null;
      }
    }),
  } as unknown as Line;
};

const mockCircle = (): Circle => {
  return {
    center: jest.fn(),
  } as unknown as Circle;
};

describe('updateLineProperties', () => {
  test('should correctly calculate line length and angle', () => {
    const line = mockLine(0, 0, 0, 10); // vertical line from(0, 0) to (0, 10)
    const setLineLength = jest.fn();
    const setLineAngle = jest.fn();

    updateLineProperties(line, setLineLength, setLineAngle);

    // Verify the length calculation
    expect(setLineLength).toHaveBeenCalledWith(10); // Vertical line 

    // Verify the angle calculation
    expect(setLineAngle).toHaveBeenCalled();
    const angleCall = setLineAngle.mock.calls[0][0];
    expect(angleCall).toBeCloseTo(180, 2); 
  });

  test('should handle null line attributes gracefully', () => {
    const line = mockLine(0, 0, 0, 0); // A line where start and end points are the same
    const setLineLength = jest.fn();
    const setLineAngle = jest.fn();
    updateLineProperties(line, setLineLength, setLineAngle);
    // Check that length and angle are both correctly set to 0
    expect(setLineLength).toHaveBeenCalledWith(0);
    expect(setLineAngle).toHaveBeenCalledWith(0); // Zero length should yield zero angle
  });
});


describe('updateCirclesPosition', () => {
  test('should update the positions of the start and end circles', () => {
    const line = mockLine(0, 0, 3, 4);
    const startCircle = mockCircle();
    const endCircle = mockCircle();
    updateCirclesPosition(line, startCircle, endCircle);
    expect(startCircle.center).toHaveBeenCalledWith(0, 0);
    expect(endCircle.center).toHaveBeenCalledWith(3, 4);
  });
});
