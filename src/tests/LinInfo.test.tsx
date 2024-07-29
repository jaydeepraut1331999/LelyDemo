
import React from 'react';
import { render } from '@testing-library/react';
import LineInfo from '../components/LineInfo';

describe('LineInfo', () => {
  it('should render line length and angle', () => {
    const { getByText } = render(<LineInfo lineLength={100} lineAngle={45} />);
    expect(getByText(/Length: 100.00 px/i)).toBeInTheDocument();
    expect(getByText(/Angle: 45.00°/i)).toBeInTheDocument();
  });

  it('should render nothing when length and angle are null', () => {
    const { queryByText } = render(<LineInfo lineLength={null} lineAngle={null} />);
    expect(queryByText(/Length:/i)).not.toBeInTheDocument();
    expect(queryByText(/Angle:/i)).not.toBeInTheDocument();
  });
});
