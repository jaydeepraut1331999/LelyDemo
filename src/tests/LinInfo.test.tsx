
import React from 'react';
import { render, screen } from '@testing-library/react';
import LineInfo from '../components/LineInfo';
import { useLineContext } from '../context/LineContext';

// Mock the context
jest.mock('../context/LineContext', () => ({
  useLineContext: jest.fn(),
}));

describe('LineInfo', () => {
  it('should display length and angle when provided', () => {
    // Set up mock values
    (useLineContext as jest.Mock).mockReturnValue({
      lineLength: 123.456,
      lineAngle: 45.678,
    });
    render(<LineInfo />);
    // Assertions using standard matchers
    const lengthInput = screen.getByLabelText(/Length:/i) as HTMLInputElement;
    const angleInput = screen.getByLabelText(/Angle:/i) as HTMLInputElement;

    expect(lengthInput.value).toBe('123.46'); 
    expect(angleInput.value).toBe('45.68'); 
  });

  it('should display "N/A" when length and angle are null', () => {
    // Set up mock values
    (useLineContext as jest.Mock).mockReturnValue({
      lineLength: null,
      lineAngle: null,
    });

    render(<LineInfo />);
    // Assertions using standard matchers
    const lengthInput = screen.getByLabelText(/Length:/i) as HTMLInputElement;
    const angleInput = screen.getByLabelText(/Angle:/i) as HTMLInputElement;

    expect(lengthInput.value).toBe('N/A'); 
    expect(angleInput.value).toBe('N/A');
  });
});
