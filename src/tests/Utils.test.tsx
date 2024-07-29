import { Line, Circle } from '@svgdotjs/svg.js';
import { updateLineInfo, updateCirclesPosition } from '../utils/utils';

// Mocking the SVG.js Line and Circle methods
const mockLine = (x1: number, y1: number, x2: number, y2: number): Line => {
  return {
    attr: jest.fn((attr: string) => {
      switch (attr) {
        case 'x1':
          return x1;
        case 'y1':
          return y1;
        case 'x2':
          return x2;
        case 'y2':
          return y2;
        default:
          return null;
      }
    }),
  } as unknown as Line;
};

const mockCircle = (): Circle => {
  return {
    center: jest.fn(),
  } as unknown as Circle;
};

describe('updateLineInfo', () => {
  test('should return length and angle of the line', () => {
    const line = mockLine(0, 0, 3, 4); // A line from (0, 0) to (3, 4)
    const { length, angle } = updateLineInfo(line);
    expect(length).toBeCloseTo(5); // 3-4-5 triangle
    expect(angle).toBeCloseTo(53.1301, 4); // Angle should be approximately 53.1301 degres
  });

  test('should return null length and angle for an invalid line', () => {
    const result = updateLineInfo(null as unknown as Line);
    expect(result).toEqual({ length: null, angle: null });
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
