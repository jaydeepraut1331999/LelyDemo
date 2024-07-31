import React from 'react';
import SVGCanvas from './components/SVGCanvas';
import LineInfo from './components/LineInfo';
import { LineProvider } from './context/LineContext'; // Import the provider
import './App.css';

const App: React.FC = () => {
  return (
    <LineProvider>
      <div className="App">
        <h1 className='linear-text-gradient'>SVG Drawing</h1>
        <LineInfo />
        <SVGCanvas />
      </div>
    </LineProvider>
  );
};

export default App;
