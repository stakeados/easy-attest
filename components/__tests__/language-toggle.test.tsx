import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageToggle } from '../language-toggle';
import { I18nProvider } from '../../contexts/i18n-context';

describe('LanguageToggle Accessibility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should have proper ARIA label', () => {
    render(
      <I18nProvider>
        <LanguageToggle />
      </I18nProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label');
  });

  it('should be keyboard accessible with Enter key', async () => {
    const user = userEvent.setup();
    render(
      <I18nProvider>
        <LanguageToggle />
      </I18nProvider>
    );

    const button = screen.getByRole('button');
    button.focus();
    
    expect(document.activeElement).toBe(button);
    
    const initialLocale = localStorage.getItem('easy-attest-locale') || 'en';
    
    await user.keyboard('{Enter}');
    
    // Locale should have changed
    const newLocale = localStorage.getItem('easy-attest-locale');
    expect(newLocale).not.toBe(initialLocale);
  });

  it('should be keyboard accessible with Space key', async () => {
    const user = userEvent.setup();
    render(
      <I18nProvider>
        <LanguageToggle />
      </I18nProvider>
    );

    const button = screen.getByRole('button');
    button.focus();
    
    const initialLocale = localStorage.getItem('easy-attest-locale') || 'en';
    
    await user.keyboard(' ');
    
    // Locale should have changed
    const newLocale = localStorage.getItem('easy-attest-locale');
    expect(newLocale).not.toBe(initialLocale);
  });

  it('should be focusable with Tab key', async () => {
    const user = userEvent.setup();
    render(
      <I18nProvider>
        <LanguageToggle />
      </I18nProvider>
    );

    await user.tab();
    
    const button = screen.getByRole('button');
    expect(document.activeElement).toBe(button);
  });

  it('should toggle locale on click', async () => {
    const user = userEvent.setup();
    render(
      <I18nProvider>
        <LanguageToggle />
      </I18nProvider>
    );

    const button = screen.getByRole('button');
    
    // Start with English
    expect(localStorage.getItem('easy-attest-locale') || 'en').toBe('en');
    
    await user.click(button);
    
    // Should switch to Spanish
    expect(localStorage.getItem('easy-attest-locale')).toBe('es');
    
    await user.click(button);
    
    // Should switch back to English
    expect(localStorage.getItem('easy-attest-locale')).toBe('en');
  });
});
