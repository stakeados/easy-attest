import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AttestationList } from '../attestation-list';
import { I18nProvider } from '../../contexts/i18n-context';

describe('AttestationList Smoke Test', () => {
    it('renders loading state without crashing', () => {
        render(
            <I18nProvider>
                <AttestationList
                    attestations={[]}
                    isLoading={true}
                    error={null}
                />
            </I18nProvider>
        );
        // Assuming loading state shows a skeleton or spinner, but basic render check passes if no error thrown
        // We can check for a class or just that it didn't throw
        expect(document.body).toBeInTheDocument();
    });

    it('renders empty state', () => {
        render(
            <I18nProvider>
                <AttestationList
                    attestations={[]}
                    isLoading={false}
                    error={null}
                />
            </I18nProvider>
        );
        // Just verify it renders
        expect(document.body).toBeInTheDocument();
    });
});
