import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AttestationSuccess } from '../attestation-success';
import { I18nProvider } from '../../contexts/i18n-context';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock ShareToFarcaster component
vi.mock('../share-to-farcaster', () => ({
  ShareToFarcaster: () => <div data-testid="share-to-farcaster">Share</div>,
}));

describe('AttestationSuccess Basescan Links', () => {
  const mockProps = {
    attestationUID: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    onCreateAnother: vi.fn(),
  };

  it('should display Basescan link after successful attestation', () => {
    render(
      <I18nProvider>
        <AttestationSuccess {...mockProps} />
      </I18nProvider>
    );

    const basescanLink = screen.getByRole('link', { name: /view on basescan/i });
    expect(basescanLink).toBeInTheDocument();
  });

  it('should format Basescan link correctly with transaction hash', () => {
    render(
      <I18nProvider>
        <AttestationSuccess {...mockProps} />
      </I18nProvider>
    );

    const basescanLink = screen.getByRole('link', { name: /view on basescan/i });
    expect(basescanLink).toHaveAttribute(
      'href',
      `https://basescan.org/tx/${mockProps.txHash}`
    );
  });

  it('should open Basescan link in new tab', () => {
    render(
      <I18nProvider>
        <AttestationSuccess {...mockProps} />
      </I18nProvider>
    );

    const basescanLink = screen.getByRole('link', { name: /view on basescan/i });
    expect(basescanLink).toHaveAttribute('target', '_blank');
  });

  it('should have proper rel attributes for security', () => {
    render(
      <I18nProvider>
        <AttestationSuccess {...mockProps} />
      </I18nProvider>
    );

    const basescanLink = screen.getByRole('link', { name: /view on basescan/i });
    expect(basescanLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should display Basescan link prominently with button styling', () => {
    render(
      <I18nProvider>
        <AttestationSuccess {...mockProps} />
      </I18nProvider>
    );

    const basescanLink = screen.getByRole('link', { name: /view on basescan/i });
    
    // Check for button-like styling classes
    expect(basescanLink.className).toContain('bg-blue-600');
    expect(basescanLink.className).toContain('px-4');
    expect(basescanLink.className).toContain('py-3');
  });

  it('should include external link icon', () => {
    const { container } = render(
      <I18nProvider>
        <AttestationSuccess {...mockProps} />
      </I18nProvider>
    );

    const basescanLink = screen.getByRole('link', { name: /view on basescan/i });
    
    // Check for SVG icon within the link
    const svg = basescanLink.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should display transaction hash', () => {
    render(
      <I18nProvider>
        <AttestationSuccess {...mockProps} />
      </I18nProvider>
    );

    expect(screen.getByText(mockProps.txHash)).toBeInTheDocument();
  });

  it('should display attestation UID', () => {
    render(
      <I18nProvider>
        <AttestationSuccess {...mockProps} />
      </I18nProvider>
    );

    expect(screen.getByText(mockProps.attestationUID)).toBeInTheDocument();
  });

  it('should translate Basescan link text in Spanish', () => {
    localStorage.setItem('easy-attest-locale', 'es');
    
    render(
      <I18nProvider>
        <AttestationSuccess {...mockProps} />
      </I18nProvider>
    );

    const basescanLink = screen.getByRole('link', { name: /ver en basescan/i });
    expect(basescanLink).toBeInTheDocument();
    
    localStorage.clear();
  });
});
