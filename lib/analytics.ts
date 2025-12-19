// Replaced Vercel Analytics with a no-op/logger for self-hosting
const track = (event: string, properties?: any) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Analytics] ${event}`, properties);
  }
};

/**
 * Analytics event types
 */
export type AnalyticsEvent =
  // Wallet events
  | 'wallet_connected'
  | 'wallet_disconnected'
  | 'network_switched'
  // Schema events
  | 'schema_created'
  | 'schema_viewed'
  | 'schema_selected'
  | 'schema_searched'
  // Attestation events
  | 'attestation_created'
  | 'attestation_viewed'
  | 'attestation_shared'
  // Dashboard events
  | 'dashboard_viewed'
  | 'attestations_filtered'
  | 'attestations_sorted'
  // Frame events
  | 'frame_viewed'
  | 'frame_interacted'
  // Error events
  | 'transaction_failed'
  | 'transaction_rejected'
  // Onboarding events
  | 'onboarding_started'
  | 'onboarding_completed'
  | 'help_viewed';

/**
 * Track an analytics event
 */
export function trackEvent(
  event: AnalyticsEvent,
  properties?: Record<string, string | number | boolean>
) {
  // Only track in production
  if (process.env.NODE_ENV !== 'production') {
    console.log('Analytics event:', event, properties);
    return;
  }

  // Filter out sensitive data
  const sanitizedProperties = properties
    ? Object.entries(properties).reduce(
      (acc, [key, value]) => {
        // Don't track wallet addresses or private keys
        if (key.toLowerCase().includes('address') || key.toLowerCase().includes('key')) {
          return acc;
        }
        acc[key] = value;
        return acc;
      },
      {} as Record<string, string | number | boolean>
    )
    : undefined;

  track(event, sanitizedProperties);
}

/**
 * Track wallet connection
 */
export function trackWalletConnection(walletType: string) {
  trackEvent('wallet_connected', {
    wallet_type: walletType,
  });
}

/**
 * Track wallet disconnection
 */
export function trackWalletDisconnection() {
  trackEvent('wallet_disconnected');
}

/**
 * Track network switch
 */
export function trackNetworkSwitch(fromChainId: number, toChainId: number) {
  trackEvent('network_switched', {
    from_chain_id: fromChainId,
    to_chain_id: toChainId,
  });
}

/**
 * Track schema creation
 */
export function trackSchemaCreation(fieldCount: number, hasDescription: boolean) {
  trackEvent('schema_created', {
    field_count: fieldCount,
    has_description: hasDescription,
  });
}

/**
 * Track schema view
 */
export function trackSchemaView(source: 'list' | 'direct' | 'frame') {
  trackEvent('schema_viewed', {
    source,
  });
}

/**
 * Track schema selection
 */
export function trackSchemaSelection(source: 'search' | 'list' | 'manual') {
  trackEvent('schema_selected', {
    source,
  });
}

/**
 * Track schema search
 */
export function trackSchemaSearch(query: string, resultCount: number) {
  trackEvent('schema_searched', {
    query_length: query.length,
    result_count: resultCount,
  });
}

/**
 * Track attestation creation
 */
export function trackAttestationCreation(fieldCount: number, hasExpiration: boolean) {
  trackEvent('attestation_created', {
    field_count: fieldCount,
    has_expiration: hasExpiration,
  });
}

/**
 * Track attestation view
 */
export function trackAttestationView(source: 'dashboard' | 'direct' | 'frame') {
  trackEvent('attestation_viewed', {
    source,
  });
}

/**
 * Track attestation share
 */
export function trackAttestationShare(platform: 'farcaster' | 'twitter' | 'copy') {
  trackEvent('attestation_shared', {
    platform,
  });
}

/**
 * Track dashboard view
 */
export function trackDashboardView(tab: 'received' | 'given') {
  trackEvent('dashboard_viewed', {
    tab,
  });
}

/**
 * Track attestations filter
 */
export function trackAttestationsFilter(filterType: 'schema' | 'date' | 'both') {
  trackEvent('attestations_filtered', {
    filter_type: filterType,
  });
}

/**
 * Track attestations sort
 */
export function trackAttestationsSort(sortBy: 'date_asc' | 'date_desc') {
  trackEvent('attestations_sorted', {
    sort_by: sortBy,
  });
}

/**
 * Track frame view
 */
export function trackFrameView(frameType: 'schema' | 'attestation') {
  trackEvent('frame_viewed', {
    frame_type: frameType,
  });
}

/**
 * Track frame interaction
 */
export function trackFrameInteraction(frameType: 'schema' | 'attestation', action: string) {
  trackEvent('frame_interacted', {
    frame_type: frameType,
    action,
  });
}

/**
 * Track transaction failure
 */
export function trackTransactionFailure(
  transactionType: 'schema' | 'attestation',
  errorType: string
) {
  trackEvent('transaction_failed', {
    transaction_type: transactionType,
    error_type: errorType,
  });
}

/**
 * Track transaction rejection
 */
export function trackTransactionRejection(transactionType: 'schema' | 'attestation') {
  trackEvent('transaction_rejected', {
    transaction_type: transactionType,
  });
}

/**
 * Track onboarding start
 */
export function trackOnboardingStart() {
  trackEvent('onboarding_started');
}

/**
 * Track onboarding completion
 */
export function trackOnboardingComplete() {
  trackEvent('onboarding_completed');
}

/**
 * Track help view
 */
export function trackHelpView(topic: string) {
  trackEvent('help_viewed', {
    topic,
  });
}

/**
 * Track page view (for custom page tracking)
 */
export function trackPageView(page: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Page view:', page);
    return;
  }

  // Vercel Analytics automatically tracks page views,
  // but this can be used for custom tracking
  track('page_view', { page });
}

/**
 * Track conversion funnel step
 */
export function trackFunnelStep(
  funnel: 'schema_creation' | 'attestation_creation',
  step: number,
  stepName: string
) {
  trackEvent(`${funnel}_step_${step}` as AnalyticsEvent, {
    step_name: stepName,
  });
}

/**
 * Track user engagement time
 */
export function trackEngagementTime(feature: string, durationMs: number) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Engagement time:', feature, durationMs);
    return;
  }

  track('engagement_time', {
    feature,
    duration_seconds: Math.round(durationMs / 1000),
  });
}
