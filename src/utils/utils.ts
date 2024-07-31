
import { Line, Circle } from '@svgdotjs/svg.js';


export const updateLineProperties = (
  line: Line,
  setLineLength: (length: number | null) => void,
  setLineAngle: (angle: number | null) => void
) => {
  const x1 = parseFloat(line.attr('x1'));
  const y1 = parseFloat(line.attr('y1'));
  const x2 = parseFloat(line.attr('x2'));
  const y2 = parseFloat(line.attr('y2'));

  // Calculate length
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

  // Calculate angle
  let angle = Math.atan2(x2 - x1, y1 - y2) * (180 / Math.PI);

  if (angle < 0) {
    angle += 360;   // Ensure the angle is positive
  }
  setLineLength(length);
  setLineAngle(angle);
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


