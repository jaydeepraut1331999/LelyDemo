
import React, { createContext, useContext, useState } from 'react';
import {LineContextProps} from '../models/interfaces'


const LineContext = createContext<LineContextProps>({
  lineLength: null,
  lineAngle: null,
  setLineLength: () => {},
  setLineAngle: () => {},
});

export const LineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lineLength, setLineLength] = useState<number | null>(null);
  const [lineAngle, setLineAngle] = useState<number | null>(null);

  return (
    <LineContext.Provider value={{ lineLength, lineAngle, setLineLength, setLineAngle }}>
      {children}
    </LineContext.Provider>
  );
};

export const useLineContext = () => useContext(LineContext);
