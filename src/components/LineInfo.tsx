import React from 'react';
import { useLineContext } from '../context/LineContext';

const LineInfo: React.FC = () => {
  const { lineNumber, lineLength, lineAngle } = useLineContext();

  return (
    <div className="line-info">
      <label>
        Line Number:
        <input type="text" value={lineNumber !== null ? lineNumber : 'N/A'} readOnly />
      </label>
      <label>
        Length (cm):
        <input type="text" value={lineLength !== null ? (lineLength / 10).toFixed(2) : 'N/A'} readOnly />
      </label>
      <label>
        Angle (°):
        <input type="text" value={lineAngle !== null ? lineAngle.toFixed(2) : 'N/A'} readOnly />
      </label>
    </div>
  );
};

export default LineInfo;
