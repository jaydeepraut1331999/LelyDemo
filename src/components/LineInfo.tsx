
import React from 'react';
import { LineInfoProps } from '../models/interfaces';

const LineInfo: React.FC<LineInfoProps> = ({ lineLength, lineAngle }) => {
  return (
    <div id="line-info">
      {lineLength !== null && (
        <p><strong>Length:</strong> {lineLength.toFixed(2)} px</p>
      )}
      {lineAngle !== null && (
        <p><strong>Angle:</strong> {lineAngle.toFixed(2)}°</p>
      )}
    </div>
  );
};

export default LineInfo;
