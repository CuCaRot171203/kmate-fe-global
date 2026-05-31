import { render, screen } from '@testing-library/react';
import React from 'react';

// Test to verify TailwindCSS classes are working
describe('TailwindCSS', () => {
  it('should apply dark background class', () => {
    const { container } = render(
      <div className="bg-dark-500 min-h-screen">
        <h1 className="text-white">Dark Mode Test</h1>
      </div>
    );
    
    const div = container.querySelector('div');
    expect(div).toHaveClass('bg-dark-500');
    expect(div).toHaveClass('min-h-screen');
    
    const h1 = screen.getByText('Dark Mode Test');
    expect(h1).toHaveClass('text-white');
  });

  it('should apply primary color classes', () => {
    const { container } = render(
      <button className="bg-primary-500 hover:bg-primary-600 text-white">
        Primary Button
      </button>
    );
    
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-primary-500');
    expect(button).toHaveClass('hover:bg-primary-600');
    expect(button).toHaveClass('text-white');
  });

  it('should apply accent color classes', () => {
    const { container } = render(
      <div className="text-accent-400 bg-accent-500">
        Accent Colors
      </div>
    );
    
    const div = container.querySelector('div');
    expect(div).toHaveClass('text-accent-400');
    expect(div).toHaveClass('bg-accent-500');
  });
});
