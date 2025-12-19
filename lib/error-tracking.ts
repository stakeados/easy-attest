import * as Sentry from '@sentry/nextjs';

/**
 * Capture an exception and send it to Sentry
 */
export function captureException(
  error: Error,
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, any>;
    level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  }
) {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error captured:', error, context);
    return;
  }

  Sentry.captureException(error, {
    tags: context?.tags,
    extra: context?.extra,
    level: context?.level || 'error',
  });
}

/**
 * Capture a message and send it to Sentry
 */
export function captureMessage(
  message: string,
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, any>;
    level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  }
) {
  if (process.env.NODE_ENV === 'development') {
    console.log('Message captured:', message, context);
    return;
  }

  Sentry.captureMessage(message, {
    tags: context?.tags,
    extra: context?.extra,
    level: context?.level || 'info',
  });
}

/**
 * Set user context for error tracking
 */
export function setUser(user: {
  id?: string;
  address?: string;
  username?: string;
  email?: string;
}) {
  Sentry.setUser({
    id: user.id,
    username: user.username || user.address,
    email: user.email,
  });
}

/**
 * Clear user context
 */
export function clearUser() {
  Sentry.setUser(null);
}

/**
 * Add breadcrumb for tracking user actions
 */
export function addBreadcrumb(
  message: string,
  data?: Record<string, any>,
  category?: string
) {
  Sentry.addBreadcrumb({
    message,
    data,
    category: category || 'user-action',
    level: 'info',
  });
}

/**
 * Track transaction performance
 */
export function trackTransaction(name: string, operation: string) {
  if (process.env.NODE_ENV === 'development') {
    return {
      finish: () => {},
      setStatus: () => {},
      setData: () => {},
    };
  }

  // Start a span for performance tracking
  const span = Sentry.startSpan({
    name,
    op: operation,
  }, () => {
    // Span will be automatically finished
  });

  return {
    finish: () => {}, // Span is auto-finished
    setStatus: () => {}, // Not available in new API
    setData: () => {}, // Not available in new API
  };
}

/**
 * Track Web3 transaction errors with context
 */
export function captureWeb3Error(
  error: Error,
  context: {
    action: 'schema_creation' | 'attestation_creation' | 'wallet_connection' | 'network_switch';
    schemaUID?: string;
    attestationUID?: string;
    address?: string;
    chainId?: number;
  }
) {
  captureException(error, {
    tags: {
      error_type: 'web3',
      action: context.action,
    },
    extra: {
      schemaUID: context.schemaUID,
      attestationUID: context.attestationUID,
      address: context.address ? `[REDACTED]` : undefined,
      chainId: context.chainId,
    },
  });
}

/**
 * Track API errors
 */
export function captureAPIError(
  error: Error,
  context: {
    endpoint: string;
    method: string;
    statusCode?: number;
  }
) {
  captureException(error, {
    tags: {
      error_type: 'api',
      endpoint: context.endpoint,
      method: context.method,
    },
    extra: {
      statusCode: context.statusCode,
    },
  });
}

/**
 * Track subgraph query errors
 */
export function captureSubgraphError(
  error: Error,
  context: {
    query: string;
    variables?: Record<string, any>;
  }
) {
  captureException(error, {
    tags: {
      error_type: 'subgraph',
    },
    extra: {
      query: context.query,
      variables: context.variables,
    },
  });
}
