import React from 'react';
import SVGCanvas from './components/SVGCanvas';
import LineInfo from './components/LineInfo';
import { LineProvider } from './context/LineContext'; // Import the provider
import './App.css';

const App: React.FC = () => {
  return (
    <LineProvider>
      <div className="App">
        <SVGCanvas />
        <LineInfo />
      </div>
    </LineProvider>
  );
};

export default App;
