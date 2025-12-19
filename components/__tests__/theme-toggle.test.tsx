import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '../theme-toggle';
import { ThemeProvider } from '../../contexts/theme-context';

describe('ThemeToggle Accessibility', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('should have proper ARIA label', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label');
  });

  it('should be keyboard accessible with Enter key', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    button.focus();
    
    expect(document.activeElement).toBe(button);
    
    await user.keyboard('{Enter}');
    
    // Theme should have changed
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should be keyboard accessible with Space key', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    button.focus();
    
    await user.keyboard(' ');
    
    // Theme should have changed
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should be focusable with Tab key', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await user.tab();
    
    const button = screen.getByRole('button');
    expect(document.activeElement).toBe(button);
  });

  it('should toggle theme on click', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    
    await user.click(button);
    
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    
    await user.click(button);
    
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
