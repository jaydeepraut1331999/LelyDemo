import React, { useRef, useEffect, useState } from 'react';
import { SVG, Svg, Line, Circle } from '@svgdotjs/svg.js';
import '@svgdotjs/svg.draggable.js';
import { LineData } from '../models/interfaces';
import { useLineContext } from '../context/LineContext';
import { updateLineProperties } from '../utils/utils';
import { updateCirclesPosition } from '../utils/utils';

const SVGCanvas: React.FC = () => {
  const drawingRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [draw, setDraw] = useState<Svg | null>(null);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [lines, setLines] = useState<LineData[]>([]);
  const [selectedLine, setSelectedLine] = useState<Line | null>(null);

  const { setLineLength, setLineAngle } = useLineContext();

  // Initialize the SVG canvas
  useEffect(() => {
    if (drawingRef.current && !draw) {
      const svgCanvas = SVG().addTo(drawingRef.current).size(500, 500);
      setDraw(svgCanvas);

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

  // Update line information on selection change
  useEffect(() => {
    if (selectedLine) {
      const { start, end } = lines.find(({ line }) => line === selectedLine) || {};
      if (start && end) {
        start.show();
        end.show();
        updateLineProperties(selectedLine, setLineLength, setLineAngle);
      }
    } else {
      lines.forEach(({ start, end, line }) => {
        if (line !== currentLine) {
          line.stroke({ color: 'black', width: 3 });
        }
        start.hide();
        end.hide();
      });
      setLineLength(null);
      setLineAngle(null);
    }
  }, [selectedLine, lines, setLineLength, setLineAngle, currentLine]);

  // Create a new line with draggable start and end circles
  const createLine = (startX: number, startY: number, endX: number, endY: number) => {
    if (!draw) return;

    const newLine = draw.line(startX, startY, endX, endY).stroke({ width: 3, color: '#33a394' });
    newLine.draggable();
    newLine.attr({ style: 'cursor: pointer;' });

    const startCircle = draw.circle(8).fill('#33a394').center(startX, startY).draggable().addClass('draggable-circle');
    const endCircle = draw.circle(8).fill('#33a394').center(endX, endY).draggable().addClass('draggable-circle');

    const updateFromCircle = (circle: Circle, x: number, y: number) => {
      if (circle === startCircle) {
        newLine.plot(x, y, parseFloat(newLine.attr('x2')), parseFloat(newLine.attr('y2')));
      } else {
        newLine.plot(parseFloat(newLine.attr('x1')), parseFloat(newLine.attr('y1')), x, y);
      }
      updateCirclesPosition(newLine, startCircle, endCircle);
      updateLineProperties(newLine, setLineLength, setLineAngle);
    };

    startCircle.on('dragmove', (event: any) => {
      const { box } = event.detail;
      updateFromCircle(startCircle, box.x + 4, box.y + 4);
    });

    endCircle.on('dragmove', (event: any) => {
      const { box } = event.detail;
      updateFromCircle(endCircle, box.x + 4, box.y + 4);
    });

    newLine.on('dragstart', () => {
      newLine.stroke({ color: '#33a394', width: 3 });
      startCircle.fill('#33a394');
      endCircle.fill('#33a394');
      setSelectedLine(newLine);
    });

    newLine.on('dragmove', () => {
      updateCirclesPosition(newLine, startCircle, endCircle);
      updateLineProperties(newLine, setLineLength, setLineAngle);
    });

    newLine.on('dragend', () => {
      if (newLine !== selectedLine) {
        newLine.stroke({ color: 'black', width: 3 });
      }
      startCircle.fill('black');
      endCircle.fill('black');
      setSelectedLine(null);
    });

    newLine.on('mouseover', () => {
      if (newLine !== selectedLine) {
        startCircle.show();
        endCircle.show();
      }
    });

    newLine.on('mouseout', () => {
      if (newLine !== selectedLine) {
        startCircle.hide();
        endCircle.hide();
      }
    });

    startCircle.on('mouseover', () => {
      startCircle.show();
      endCircle.show();
    });

    startCircle.on('mouseout', () => {
      if (selectedLine === null) {
        startCircle.hide();
        endCircle.hide();
      }
    });

    endCircle.on('mouseover', () => {
      startCircle.show();
      endCircle.show();
    });

    endCircle.on('mouseout', () => {
      if (selectedLine === null) {
        startCircle.hide();
        endCircle.hide();
      }
    });

    setLines((prevLines) => [...prevLines, { line: newLine, start: startCircle, end: endCircle }]);
    updateCirclesPosition(newLine, startCircle, endCircle);
    return newLine;
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    if (!draw) return;
    const { offsetX, offsetY } = event.nativeEvent;
    setStartPoint({ x: offsetX, y: offsetY });
    setIsDrawing(true);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDrawing && startPoint && draw) {
      const { offsetX, offsetY } = event.nativeEvent;
      if (currentLine) {
        // Update line plot and properties in real-time
        currentLine.plot(startPoint.x, startPoint.y, offsetX, offsetY);
        const { start, end } = lines.find(({ line }) => line === currentLine) || {};
        if (start && end) {
          updateCirclesPosition(currentLine, start, end);
        }
        updateLineProperties(currentLine, setLineLength, setLineAngle);
      } else {
        const newLine = createLine(startPoint.x, startPoint.y, offsetX, offsetY);
        setCurrentLine(newLine ?? null);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setCurrentLine(null);
  };

  const handleMouseLeave = () => {
    setIsDrawing(false);
  };

  return (
      <div
        ref={drawingRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      ></div>
  );
};

export default SVGCanvas;
