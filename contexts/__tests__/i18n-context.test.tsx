import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { I18nProvider, useTranslation } from '../i18n-context';

// Test component to access i18n context
function TestComponent() {
  const { locale, setLocale, t } = useTranslation();
  return (
    <div>
      <div data-testid="current-locale">{locale}</div>
      <div data-testid="translated-text">{t('common.loading')}</div>
      <div data-testid="nested-translation">{t('attestation.form.title')}</div>
      <button onClick={() => setLocale('en')} data-testid="set-en">
        Set English
      </button>
      <button onClick={() => setLocale('es')} data-testid="set-es">
        Set Spanish
      </button>
    </div>
  );
}

describe('I18nProvider', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Mock navigator.language
    Object.defineProperty(window.navigator, 'language', {
      writable: true,
      value: 'en-US',
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should default to English when no preference exists', () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId('current-locale')).toHaveTextContent('en');
    expect(screen.getByTestId('translated-text')).toHaveTextContent('Loading...');
  });

  it('should persist locale to localStorage when changed', () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    act(() => {
      screen.getByTestId('set-es').click();
    });

    expect(localStorage.getItem('easy-attest-locale')).toBe('es');
    expect(screen.getByTestId('current-locale')).toHaveTextContent('es');
  });

  it('should load locale from localStorage on mount', () => {
    localStorage.setItem('easy-attest-locale', 'es');

    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId('current-locale')).toHaveTextContent('es');
    expect(screen.getByTestId('translated-text')).toHaveTextContent('Cargando...');
  });

  it('should translate text correctly in English', () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId('translated-text')).toHaveTextContent('Loading...');
    expect(screen.getByTestId('nested-translation')).toHaveTextContent('Create Attestation');
  });

  it('should translate text correctly in Spanish', () => {
    localStorage.setItem('easy-attest-locale', 'es');

    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId('translated-text')).toHaveTextContent('Cargando...');
    expect(screen.getByTestId('nested-translation')).toHaveTextContent('Crear Attestation');
  });

  it('should switch languages dynamically', () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId('translated-text')).toHaveTextContent('Loading...');

    act(() => {
      screen.getByTestId('set-es').click();
    });

    expect(screen.getByTestId('translated-text')).toHaveTextContent('Cargando...');

    act(() => {
      screen.getByTestId('set-en').click();
    });

    expect(screen.getByTestId('translated-text')).toHaveTextContent('Loading...');
  });

  it('should detect browser language on first load', () => {
    Object.defineProperty(window.navigator, 'language', {
      writable: true,
      value: 'es-ES',
    });

    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId('current-locale')).toHaveTextContent('es');
  });

  it('should handle partial browser language codes', () => {
    Object.defineProperty(window.navigator, 'language', {
      writable: true,
      value: 'es-MX',
    });

    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId('current-locale')).toHaveTextContent('es');
  });

  it('should fallback to English for unsupported languages', () => {
    Object.defineProperty(window.navigator, 'language', {
      writable: true,
      value: 'fr-FR',
    });

    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId('current-locale')).toHaveTextContent('en');
  });
});
