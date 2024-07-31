import React from 'react';
import { useLineContext } from '../context/LineContext';

const LineInfo: React.FC = () => {
  const { lineNumber, lineLength, lineAngle } = useLineContext();

  return (
    <div className="line-info">
      <ul>
        <li>
          <span className="line-number">Line {lineNumber}</span>
        </li>
        <li>
          <span className="label">Length</span>
          <span className="value">{lineLength !== null ? (lineLength / 10).toFixed(2) + ' cm' : 'N/A'}</span>
        </li>
        <li>
          <span className="label">Angle</span>
          <span className="value">{lineAngle !== null ? lineAngle.toFixed(2) + '°' : 'N/A'}</span>
        </li>
      </ul>
    </div>
  );
};

export default LineInfo;
