
import { Line, Circle } from '@svgdotjs/svg.js';

// Function to update the length and angle of a line
export const updateLineInfo = (line: Line) => {
  if (!line) return { length: null, angle: null };
  const x1 = parseFloat(line.attr('x1'));
  const y1 = parseFloat(line.attr('y1'));
  const x2 = parseFloat(line.attr('x2'));
  const y2 = parseFloat(line.attr('y2'));
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI); // Convert radians to degres
  return { length, angle };
};

// Function to update the positions of the start and end circles
export const updateCirclesPosition = (line: Line, startCircle: Circle, endCircle: Circle) => {
  const x1 = parseFloat(line.attr('x1'));
  const y1 = parseFloat(line.attr('y1'));
  const x2 = parseFloat(line.attr('x2'));
  const y2 = parseFloat(line.attr('y2'));
  startCircle.center(x1, y1);
  endCircle.center(x2, y2);
};
