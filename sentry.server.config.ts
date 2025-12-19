import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // Adjust this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  environment: process.env.NODE_ENV,
  
  // Filter out sensitive data
  beforeSend(event, hint) {
    // Don't send events in development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    
    // Filter out wallet addresses from error messages
    if (event.message) {
      event.message = event.message.replace(/0x[a-fA-F0-9]{40}/g, '[ADDRESS_REDACTED]');
    }
    
    // Filter sensitive environment variables
    if (event.contexts?.runtime?.env) {
      const env = event.contexts.runtime.env as Record<string, any>;
      Object.keys(env).forEach((key) => {
        if (key.includes('KEY') || key.includes('SECRET') || key.includes('TOKEN')) {
          env[key] = '[REDACTED]';
        }
      });
    }
    
    return event;
  },
  
  // Ignore common errors
  ignoreErrors: [
    'User rejected',
    'User denied',
    'ACTION_REJECTED',
  ],
});
