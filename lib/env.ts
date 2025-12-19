'use client';

// Helper to access environment variables that might be injected at runtime
// This bypasses Next.js build-time inlining issues in Docker environments

export function getEnv(key: string, defaultValue: string = ''): string {
    // 1. Try process.env first (Works on Server, and if inlined by Webpack on Client)
    if (process.env[key]) {
        return process.env[key] as string;
    }

    // 2. Try window.ENV (Runtime injection for Client)
    if (typeof window !== 'undefined' && (window as any).ENV) {
        if ((window as any).ENV[key]) {
            return (window as any).ENV[key];
        } else {
            // Debug log only for WC Project ID to avoid spam
            if (key === 'NEXT_PUBLIC_WC_PROJECT_ID') {
                console.warn('[getEnv] Key not found in window.ENV:', key);
                console.log('[getEnv] Current window.ENV:', (window as any).ENV);
            }
        }
    }

    return defaultValue;
}
