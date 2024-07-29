
import React, { useState } from 'react';
import SVGCanvas from './components/SVGCanvas';
import LineInfo from './components/LineInfo';
import './App.css';

const App: React.FC = () => {
  // State to manage the length and angle of the selected line
  const [lineLength, setLineLength] = useState<number | null>(null);
  const [lineAngle, setLineAngle] = useState<number | null>(null);

  return (
    <div className="App">
      <h1 className='linear-text-gradient'>SVG Drawing</h1>
      <SVGCanvas setLineLength={setLineLength} setLineAngle={setLineAngle} />
      <LineInfo lineLength={lineLength} lineAngle={lineAngle} />
    </div>
  );
};

export default App;
