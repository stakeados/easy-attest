import { useTranslation } from '@/contexts/i18n-context';

export interface TutorialStep {
    title: string;
    description: string;
    target?: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    action?: string;
}

export function useTutorialSteps() {
    const { t } = useTranslation();

    const schemaTutorialSteps: TutorialStep[] = [
        {
            title: t('tutorial.schema.step1.title'),
            description: t('tutorial.schema.step1.description'),
        },
        {
            title: t('tutorial.schema.step2.title'),
            description: t('tutorial.schema.step2.description'),
            target: '[data-tutorial="add-field-button"]',
            position: 'top',
            action: t('tutorial.schema.step2.action'),
        },
        {
            title: t('tutorial.schema.step3.title'),
            description: t('tutorial.schema.step3.description'),
            target: '[data-tutorial="field-name-input"]',
            position: 'bottom',
            action: t('tutorial.schema.step3.action'),
        },
        {
            title: t('tutorial.schema.step4.title'),
            description: t('tutorial.schema.step4.description'),
            target: '[data-tutorial="field-type-select"]',
            position: 'bottom',
            action: t('tutorial.schema.step4.action'),
        },
        {
            title: t('tutorial.schema.step5.title'),
            description: t('tutorial.schema.step5.description'),
            target: '[data-tutorial="field-required-toggle"]',
            position: 'bottom',
            action: t('tutorial.schema.step5.action'),
        },
        {
            title: t('tutorial.schema.step6.title'),
            description: t('tutorial.schema.step6.description'),
            target: '[data-tutorial="schema-preview"]',
            position: 'top',
        },
        {
            title: t('tutorial.schema.step7.title'),
            description: t('tutorial.schema.step7.description'),
            target: '[data-tutorial="submit-button"]',
            position: 'top',
            action: t('tutorial.schema.step7.action'),
        },
        {
            title: t('tutorial.schema.step8.title'),
            description: t('tutorial.schema.step8.description'),
        },
    ];

    return {
        schemaTutorialSteps,
    };
}
