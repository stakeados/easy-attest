import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SchemaDiscoveryEmptyState } from '../schema-discovery-empty-state';
import { I18nProvider } from '../../contexts/i18n-context';

describe('SchemaDiscoveryEmptyState', () => {
  it('should display loading state with spinner', () => {
    render(
      <I18nProvider>
        <SchemaDiscoveryEmptyState status="loading" />
      </I18nProvider>
    );

    expect(screen.getByText(/loading schemas/i)).toBeInTheDocument();
    
    // Check for spinner element
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should display no-schemas state with appropriate message', () => {
    render(
      <I18nProvider>
        <SchemaDiscoveryEmptyState status="no-schemas" />
      </I18nProvider>
    );

    expect(screen.getByText(/no schemas found/i)).toBeInTheDocument();
    expect(screen.getByText(/create schema/i)).toBeInTheDocument();
  });

  it('should display subgraph-unavailable state with error message', () => {
    render(
      <I18nProvider>
        <SchemaDiscoveryEmptyState status="subgraph-unavailable" />
      </I18nProvider>
    );

    expect(screen.getByText(/subgraph unavailable/i)).toBeInTheDocument();
    expect(screen.getByText(/learn more/i)).toBeInTheDocument();
  });

  it('should display subgraph-indexing state with progress indicator', () => {
    render(
      <I18nProvider>
        <SchemaDiscoveryEmptyState status="subgraph-indexing" />
      </I18nProvider>
    );

    expect(screen.getByText(/indexing in progress/i)).toBeInTheDocument();
    
    // Check for animated spinner
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked in subgraph-unavailable state', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    
    render(
      <I18nProvider>
        <SchemaDiscoveryEmptyState status="subgraph-unavailable" onRetry={onRetry} />
      </I18nProvider>
    );

    const retryButton = screen.getByRole('button', { name: /retry/i });
    await user.click(retryButton);
    
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should call onRetry when retry button is clicked in subgraph-indexing state', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    
    render(
      <I18nProvider>
        <SchemaDiscoveryEmptyState status="subgraph-indexing" onRetry={onRetry} />
      </I18nProvider>
    );

    const retryButton = screen.getByRole('button', { name: /retry/i });
    await user.click(retryButton);
    
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should not display retry button when onRetry is not provided', () => {
    render(
      <I18nProvider>
        <SchemaDiscoveryEmptyState status="subgraph-unavailable" />
      </I18nProvider>
    );

    const retryButton = screen.queryByRole('button', { name: /retry/i });
    expect(retryButton).not.toBeInTheDocument();
  });

  it('should have external link to documentation in subgraph-unavailable state', () => {
    render(
      <I18nProvider>
        <SchemaDiscoveryEmptyState status="subgraph-unavailable" />
      </I18nProvider>
    );

    const learnMoreLink = screen.getByRole('link', { name: /learn more/i });
    expect(learnMoreLink).toHaveAttribute('target', '_blank');
    expect(learnMoreLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should translate messages in Spanish', () => {
    localStorage.setItem('easy-attest-locale', 'es');
    
    render(
      <I18nProvider>
        <SchemaDiscoveryEmptyState status="loading" />
      </I18nProvider>
    );

    expect(screen.getByText(/cargando schemas/i)).toBeInTheDocument();
    
    localStorage.clear();
  });

  it('should render different visual elements for different states', () => {
    // Test loading state - has spinner
    const { container: loadingContainer, unmount: unmountLoading } = render(
      <I18nProvider>
        <SchemaDiscoveryEmptyState status="loading" />
      </I18nProvider>
    );
    expect(loadingContainer.querySelector('.animate-spin')).toBeTruthy();
    unmountLoading();

    // Test no-schemas state - has SVG icon
    const { container: noSchemasContainer, unmount: unmountNoSchemas } = render(
      <I18nProvider>
        <SchemaDiscoveryEmptyState status="no-schemas" />
      </I18nProvider>
    );
    expect(noSchemasContainer.querySelectorAll('svg').length).toBeGreaterThan(0);
    unmountNoSchemas();

    // Test subgraph-unavailable state - has SVG icon
    const { container: unavailableContainer, unmount: unmountUnavailable } = render(
      <I18nProvider>
        <SchemaDiscoveryEmptyState status="subgraph-unavailable" />
      </I18nProvider>
    );
    expect(unavailableContainer.querySelectorAll('svg').length).toBeGreaterThan(0);
    unmountUnavailable();

    // Test subgraph-indexing state - has SVG icon and spinner
    const { container: indexingContainer } = render(
      <I18nProvider>
        <SchemaDiscoveryEmptyState status="subgraph-indexing" />
      </I18nProvider>
    );
    expect(indexingContainer.querySelectorAll('svg').length).toBeGreaterThan(0);
    expect(indexingContainer.querySelector('.animate-spin')).toBeTruthy();
  });
});
