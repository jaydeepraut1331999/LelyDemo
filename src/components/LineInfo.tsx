import React from 'react';
import { useLineContext } from '../context/LineContext';

const LineInfo: React.FC = () => {
  const { lineLength, lineAngle } = useLineContext();

  return (
    <div className="line-info">
      <label>
        Length:
        <input type="text" value={lineLength !== null ? lineLength.toFixed(2) : 'N/A'} readOnly />
      </label>
      <label>
        Angle:
        <input type="text" value={lineAngle !== null ? lineAngle.toFixed(2) : 'N/A'} readOnly />
      </label>
    </div>
  );
};

export default LineInfo;

