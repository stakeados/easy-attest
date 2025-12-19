import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from '../tooltip';

describe('Tooltip HTML Structure', () => {
  it('should use inline elements only (no div nesting)', () => {
    const { container } = render(
      <Tooltip content="Test tooltip">
        <button>Hover me</button>
      </Tooltip>
    );

    // Check that the root element is a span (inline element)
    const rootElement = container.firstChild;
    expect(rootElement?.nodeName).toBe('SPAN');

    // Check that all wrapper elements are spans
    const spans = container.querySelectorAll('span');
    expect(spans.length).toBeGreaterThan(0);

    // Ensure no divs are used in the tooltip structure
    const divs = container.querySelectorAll('div');
    expect(divs.length).toBe(0);
  });

  it('should render tooltip content on hover', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Test tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByRole('button');
    
    // Tooltip should not be visible initially
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    // Hover over the button
    await user.hover(button);

    // Tooltip should now be visible
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText('Test tooltip content')).toBeInTheDocument();
  });

  it('should hide tooltip when mouse leaves', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Test tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByRole('button');
    
    await user.hover(button);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.unhover(button);
    
    // Wait for tooltip to disappear
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should have proper semantic structure', () => {
    const { container } = render(
      <Tooltip content="Test tooltip">
        <button>Hover me</button>
      </Tooltip>
    );

    // Root should be a span with relative positioning
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain('relative');
    expect(root.className).toContain('inline-block');
  });

  it('should support different positions', () => {
    const positions: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'left', 'right'];
    
    positions.forEach((position) => {
      const { container } = render(
        <Tooltip content="Test" position={position}>
          <button>Test</button>
        </Tooltip>
      );
      
      // Should render without errors
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
