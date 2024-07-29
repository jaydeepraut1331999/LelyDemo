
import { Line, Circle } from '@svgdotjs/svg.js';


//props for the SVGCanvas component
export interface SVGCanvasProps {
    setLineLength: (length: number | null) => void;
    setLineAngle: (angle: number | null) => void;
  }
  
  //props for the LineInfo component
  export interface LineInfoProps {
    lineLength: number | null;
    lineAngle: number | null;
  }
  
  //data structure to store a line with its start and end circles
  export interface LineData {
    line: Line;
    start: Circle;
    end: Circle;
  }
  
