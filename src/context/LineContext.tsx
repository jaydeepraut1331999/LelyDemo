
import React, { createContext, useState, useContext } from 'react';

interface LineContextType {
  lineLength: number | null;
  lineAngle: number | null;
  lineNumber: number | null;
  setLineLength: React.Dispatch<React.SetStateAction<number | null>>;
  setLineAngle: React.Dispatch<React.SetStateAction<number | null>>;
  setLineNumber: React.Dispatch<React.SetStateAction<number | null>>;
}

const LineContext = createContext<LineContextType | undefined>(undefined);

export const useLineContext = () => {
  const context = useContext(LineContext);
  if (context === undefined) {
    throw new Error('useLineContext must be used within a LineProvider');
  }
  return context;
};

export const LineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lineLength, setLineLength] = useState<number | null>(null);
  const [lineAngle, setLineAngle] = useState<number | null>(null);
  const [lineNumber, setLineNumber] = useState<number | null>(null);

  return (
    <LineContext.Provider value={{ lineLength, setLineLength, lineAngle, setLineAngle, lineNumber, setLineNumber }}>
      {children}
    </LineContext.Provider>
  );
};
