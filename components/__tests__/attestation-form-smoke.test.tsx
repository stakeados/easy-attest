import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AttestationForm } from '../attestation-form';

// Mock translation hook
vi.mock('@/contexts/i18n-context', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        locale: 'en',
        setLocale: vi.fn(),
        isLoading: false
    }),
}));

// Mock child components
vi.mock('../address-display', () => ({
    AddressDisplay: ({ address }: { address: string }) => <span>{address}</span>,
}));
vi.mock('../help-icon', () => ({
    HelpIcon: ({ content }: any) => <span>?</span>,
}));

describe('AttestationForm Smoke Test', () => {
    const mockOnSubmit = vi.fn();
    const mockSchemaUID = '0x123...';

    it('renders without crashing', () => {
        // Remove I18nProvider as we mocked the hook
        render(
            <AttestationForm
                schemaUID={mockSchemaUID}
                fields={[{ name: 'test', type: 'string', required: true }]}
                onSubmit={mockOnSubmit}
            />
        );
        // Debug: print body to see what rendered if it fails
        // screen.debug(); 
        expect(screen.getByText('attestation.form.title')).toBeInTheDocument(); // Expecting key if t returns key, or mocking exact text?
        // t('attestation.form.title') -> 'attestation.form.title'
        // But 'Create Attestation' is likely the text in English.
        // If I mock t => key, then I should expect the KEY.
        // I need to know what text/key is rendered for the header.
        // Line 46 in previous view: `t('attestation.form.title')`?
        // I will check the component source for the header text.
    });
});
