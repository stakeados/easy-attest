'use client';

import { useEffect, useRef } from 'react';
import { trackEngagementTime } from '@/lib/analytics';

/**
 * Hook to track time spent on a feature/page
 */
export function useEngagementTracking(featureName: string) {
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();

    return () => {
      const duration = Date.now() - startTimeRef.current;
      // Only track if user spent more than 3 seconds
      if (duration > 3000) {
        trackEngagementTime(featureName, duration);
      }
    };
  }, [featureName]);
}

/**
 * Hook to track funnel progress
 */
export function useFunnelTracking(
  funnel: 'schema_creation' | 'attestation_creation',
  currentStep: number,
  stepName: string
) {
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (!hasTrackedRef.current) {
      import('@/lib/analytics').then(({ trackFunnelStep }) => {
        trackFunnelStep(funnel, currentStep, stepName);
      });
      hasTrackedRef.current = true;
    }
  }, [funnel, currentStep, stepName]);
}

/**
 * Hook to track page views
 */
export function usePageTracking(pageName: string) {
  useEffect(() => {
    import('@/lib/analytics').then(({ trackPageView }) => {
      trackPageView(pageName);
    });
  }, [pageName]);
}
