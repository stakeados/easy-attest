import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SchemaBuilder } from '../schema-builder';
import { I18nProvider } from '../../contexts/i18n-context';

vi.mock('../schema-field-input', () => ({
    SchemaFieldInput: () => <div>Field Input Mock</div>,
}));

describe('SchemaBuilder Smoke Test', () => {
    it('renders without crashing', () => {
        render(
            <I18nProvider>
                <SchemaBuilder onSubmit={vi.fn()} />
            </I18nProvider>
        );
        expect(screen.getByText(/Create Schema/i)).toBeInTheDocument();
    });
});
