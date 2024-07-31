import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { LineProvider, useLineContext } from '../context/LineContext';

// Component to test context 
const TestComponent: React.FC = () => {
  const { lineLength, lineAngle, setLineLength, setLineAngle } = useLineContext();

  return (
    <div>
      <div data-testid="line-length">{lineLength}</div>
      <div data-testid="line-angle">{lineAngle}</div>
      <button
        data-testid="set-line-length"
        onClick={() => setLineLength(10)}
      >
        Set Line Length
      </button>
      <button
        data-testid="set-line-angle"
        onClick={() => setLineAngle(45)}
      >
        Set Line Angle
      </button>
    </div>
  );
};


describe('LineContext', () => {
  test('provides context values correctly', () => {
    render(
      <LineProvider>
        <TestComponent />
      </LineProvider>
    );

    // Check initial context values
    expect(screen.getByTestId('line-length').textContent).toBe('');
    expect(screen.getByTestId('line-angle').textContent).toBe('');

    //setting values
    act(() => {
      screen.getByTestId('set-line-length').click();
      screen.getByTestId('set-line-angle').click();
    });
    expect(screen.getByTestId('line-length').textContent).toBe('10');
    expect(screen.getByTestId('line-angle').textContent).toBe('45');
  });
});
