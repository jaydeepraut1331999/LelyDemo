
import React, { useRef, useEffect, useState } from 'react';
import { SVG, Svg, Line, Circle } from '@svgdotjs/svg.js';
import '@svgdotjs/svg.draggable.js';
import { SVGCanvasProps, LineData } from '../models/interfaces';
import { updateLineInfo, updateCirclesPosition } from '../utils/utils';

const SVGCanvas: React.FC<SVGCanvasProps> = ({ setLineLength, setLineAngle }) => {
  const drawingRef = useRef<HTMLDivElement>(null); // Ref for the drawing container
  const [isDrawing, setIsDrawing] = useState(false); // State to track if a line is being drawn
  const [currentLine, setCurrentLine] = useState<Line | null>(null); // State to track the current line being drawn
  const [draw, setDraw] = useState<Svg | null>(null); // State to hold the SVG.js drawing instance
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null); // State to track the starting point of a line
  const [lines, setLines] = useState<LineData[]>([]); // State to store all drawn lines with their start and end circles
  const [selectedLine, setSelectedLine] = useState<Line | null>(null); // State to track the currently selected line

  // Initialize the SVG canvas when the component mounts
  useEffect(() => {
    if (drawingRef.current && !draw) {
      const svgCanvas = SVG().addTo(drawingRef.current).size(500, 500);
      setDraw(svgCanvas);

      // event listener to handle line selection
      svgCanvas.on('click', (event) => {
        const target = event.target as SVGElement;
        const targetLine = lines.find(({ line }) => line.node === target);
        if (targetLine) {
          setSelectedLine(targetLine.line);
        } else {
          setSelectedLine(null);
        }
      });
    }
  }, [draw, lines]);

  // Update line information and show/hide circles based on line selection
  useEffect(() => {
    if (selectedLine) {
      const { start, end } = lines.find(({ line }) => line === selectedLine) || {};
      if (start && end) {
        start.show();
        end.show();
        const { length, angle } = updateLineInfo(selectedLine);
        setLineLength(length);
        setLineAngle(angle);
      }
    } else {
      lines.forEach(({ start, end }) => {
        start.hide();
        end.hide();
      });
      setLineLength(null);
      setLineAngle(null);
    }
  }, [selectedLine, lines, setLineLength, setLineAngle]);

  //create a new line with draggable start and end circles
  const createLine = (startX: number, startY: number, endX: number, endY: number) => {
    if (!draw) return;

    //create the line
    const newLine = draw.line(startX, startY, endX, endY).stroke({ width: 2, color: '#f06' });
    newLine.draggable();
    newLine.attr({ style: 'cursor: pointer;' });

    //create the start and end circles
    const startCircle = draw.circle(8).fill('#f06').center(startX, startY).draggable().hide();
    const endCircle = draw.circle(8).fill('#f06').center(endX, endY).draggable().hide();

    //Update line position based on circle drag
    const updateFromCircle = (circle: Circle, x: number, y: number) => {
      if (circle === startCircle) {
        newLine.plot(x, y, parseFloat(newLine.attr('x2')), parseFloat(newLine.attr('y2')));
      } else {
        newLine.plot(parseFloat(newLine.attr('x1')), parseFloat(newLine.attr('y1')), x, y);
      }
      const { length, angle } = updateLineInfo(newLine);
      setLineLength(length);
      setLineAngle(angle);
    };

    //event listeners for circle drag
    startCircle.on('dragmove', (event: any) => {
      const { box } = event.detail;
      updateFromCircle(startCircle, box.x + 4, box.y + 4);
    });

    endCircle.on('dragmove', (event: any) => {
      const { box } = event.detail;
      updateFromCircle(endCircle, box.x + 4, box.y + 4);
    });

    // event listener for line drag
    newLine.on('dragmove', () => {
      updateCirclesPosition(newLine, startCircle, endCircle);
      const { length, angle } = updateLineInfo(newLine);
      setLineLength(length);
      setLineAngle(angle);
    });

    // Show circles on hover
    newLine.on('mouseover', () => {
      startCircle.show();
      endCircle.show();
    });

    // Hide circles when not hovered,unless the line is selected
    newLine.on('mouseout', () => {
      if (newLine !== selectedLine) {
        startCircle.hide();
        endCircle.hide();
      }
    });

    // Add the new line and circles to the lines state
    setLines((prevLines) => [...prevLines, { line: newLine, start: startCircle, end: endCircle }]);
    updateCirclesPosition(newLine, startCircle, endCircle); // Initial position update for the new line
    return newLine;
  };

  // Handle mouse down event to start drawing a line
  const handleMouseDown = (event: React.MouseEvent) => {
    if (!draw) return;
    const { offsetX, offsetY } = event.nativeEvent;
    setStartPoint({ x: offsetX, y: offsetY });
    setIsDrawing(true);
  };

  // Handle mouse move event to draw the line dynamically
  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDrawing && startPoint && draw) {
      const { offsetX, offsetY } = event.nativeEvent;
      if (currentLine) {
        currentLine.plot(startPoint.x, startPoint.y, offsetX, offsetY);
        const { start, end } = lines.find(({ line }) => line === currentLine) || {};
        if (start && end) {
          updateCirclesPosition(currentLine, start, end);
        }
        const { length, angle } = updateLineInfo(currentLine);
        setLineLength(length);
        setLineAngle(angle);
      } else {
        const newLine = createLine(startPoint.x, startPoint.y, offsetX, offsetY);
        setCurrentLine(newLine ?? null);
      }
    }
  };

  // Handle mouse up event to stop drawing
  const handleMouseUp = () => {
    setIsDrawing(false);
    setCurrentLine(null);
  };

  // Handle mouse leave event to stop drawing
  const handleMouseLeave = () => {
    setIsDrawing(false);
  };

  return (
    <div
      id="drawing"
      ref={drawingRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ border: '1px solid #000', height: '500px' }}
    ></div>
  );
};

export default SVGCanvas;
