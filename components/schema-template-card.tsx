'use client';

import { useState } from 'react';
import { StandardSchema } from '@/lib/config/standard-schemas';
import { useRouter } from 'next/navigation';
import {
    Calendar,
    Star,
    BadgeCheck,
    User,
    CreditCard,
    GitPullRequest,
    FileText,
    Loader2,
    ArrowRight,
    LucideIcon,
    Vote,
    Flag,
    Receipt,
    Handshake,
    Pen,
    Copyright,
    Trophy,
    Shield,
    Award,
    IdCard
} from 'lucide-react';
import { useToast } from '@/components/toast';
import { useTranslation } from '@/contexts/i18n-context';

const ICON_MAP: Record<string, LucideIcon> = {
    'Calendar': Calendar,
    'Star': Star,
    'BadgeCheck': BadgeCheck,
    'User': User,
    'CreditCard': CreditCard,
    'GitPullRequest': GitPullRequest,
    'Vote': Vote,
    'Flag': Flag,
    'Receipt': Receipt,
    'Handshake': Handshake,
    'Pen': Pen,
    'Copyright': Copyright,
    'Trophy': Trophy,
    'Shield': Shield,
    'Award': Award,
    'IdCard': IdCard
};

interface SchemaTemplateCardProps {
    template: StandardSchema;
}

export function SchemaTemplateCard({ template }: SchemaTemplateCardProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const { t } = useTranslation();
    const [isChecking, setIsChecking] = useState(false);

    // Get the icon component safely
    const IconComponent = ICON_MAP[template.icon] || FileText;

    const handleUseTemplate = async () => {
        setIsChecking(true);
        try {
            if (template.uid) {
                // If UID exists, go directly to create attestation
                router.push(`/attest?schema=${template.uid}`);
            } else {
                // If no UID (custom or not registered yet), go to create schema with pre-filled fields
                // We need to convert the fields array to a schema string
                const schemaString = template.fields.map(f => `${f.type} ${f.name}`).join(', ');
                const encodedSchema = encodeURIComponent(schemaString);
                router.push(`/schema/create?schemaString=${encodedSchema}`);
            }
        } catch (error) {
            console.error('Failed to process template:', error);
            showToast('Failed to process template', 'error');
        } finally {
            setIsChecking(false);
        }
    };

    const handleCopyUID = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (template.uid) {
            navigator.clipboard.writeText(template.uid);
            showToast(t('attestation.success.copied'), 'success');
        }
    };

    const schemaString = template.fields.map(f => `${f.type} ${f.name}`).join(', ');

    // Get translated title and description if available, fallback to template values
    // We use a safe access pattern to avoid errors if keys don't exist yet
    const titleKey = `schema.template.${template.id}.title`;
    const descKey = `schema.template.${template.id}.description`;

    // Check if translation exists by comparing with key (simple heuristic)
    // A better way would be if t() returns the key when missing, or we have a hasKey function
    // For now, we'll assume if we added the keys, they exist.
    const translatedTitle = t(titleKey);
    const translatedDescription = t(descKey);

    const displayTitle = translatedTitle !== titleKey ? translatedTitle : template.title;
    const displayDescription = translatedDescription !== descKey ? translatedDescription : template.description;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-500 transition-all flex flex-col h-full group relative">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                    <IconComponent className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {template.category}
                    </span>
                </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {displayTitle}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow">
                {displayDescription}
            </p>

            <div className="space-y-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 relative group/code">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-gray-500 dark:text-gray-500 font-mono uppercase tracking-wider">Schema Structure</p>
                        {template.uid && (
                            <button
                                onClick={handleCopyUID}
                                className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors opacity-0 group-hover/code:opacity-100"
                                title={t('attestation.success.copy')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                            </button>
                        )}
                    </div>
                    <p className="text-xs text-gray-700 dark:text-gray-300 font-mono break-all line-clamp-2">
                        {schemaString}
                    </p>
                </div>

                <button
                    onClick={handleUseTemplate}
                    disabled={isChecking}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isChecking ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <>
                            <span>{template.uid ? t('attestation.form.submit') : t('schema.create.submit')}</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>

                {template.uid && (
                    <button
                        onClick={handleCopyUID}
                        className="w-full py-2 px-4 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                        {t('attestation.success.copy')} UID
                    </button>
                )}
            </div>
        </div>
    );
}
