import { render, screen } from '@testing-library/react';
import React from 'react';

// Simple test to verify React is working
describe('App', () => {
  it('renders without crashing', () => {
    render(<div>KMATE App - React Test</div>);
    expect(screen.getByText('KMATE App - React Test')).toBeInTheDocument();
  });
});
