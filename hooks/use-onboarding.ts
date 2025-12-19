'use client';

import { useState, useEffect } from 'react';

const ONBOARDING_KEY = 'easy-attest-onboarding';
const TUTORIAL_KEY = 'easy-attest-tutorial';

interface OnboardingState {
  hasSeenWelcome: boolean;
  hasCompletedSchemaTutorial: boolean;
  hasCompletedAttestationTutorial: boolean;
  hasCompletedDashboardTutorial: boolean;
}

const defaultState: OnboardingState = {
  hasSeenWelcome: false,
  hasCompletedSchemaTutorial: false,
  hasCompletedAttestationTutorial: false,
  hasCompletedDashboardTutorial: false,
};

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ONBOARDING_KEY);
      if (stored) {
        setState(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load onboarding state:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save state to localStorage
  const saveState = (newState: OnboardingState) => {
    try {
      localStorage.setItem(ONBOARDING_KEY, JSON.stringify(newState));
      setState(newState);
    } catch (error) {
      console.error('Failed to save onboarding state:', error);
    }
  };

  const markWelcomeSeen = () => {
    saveState({ ...state, hasSeenWelcome: true });
  };

  const markSchemaTutorialComplete = () => {
    saveState({ ...state, hasCompletedSchemaTutorial: true });
  };

  const markAttestationTutorialComplete = () => {
    saveState({ ...state, hasCompletedAttestationTutorial: true });
  };

  const markDashboardTutorialComplete = () => {
    saveState({ ...state, hasCompletedDashboardTutorial: true });
  };

  const resetOnboarding = () => {
    saveState(defaultState);
  };

  const shouldShowWelcome = isLoaded && !state.hasSeenWelcome;
  const shouldShowSchemaTutorial =
    isLoaded && state.hasSeenWelcome && !state.hasCompletedSchemaTutorial;
  const shouldShowAttestationTutorial =
    isLoaded && state.hasSeenWelcome && !state.hasCompletedAttestationTutorial;
  const shouldShowDashboardTutorial =
    isLoaded && state.hasSeenWelcome && !state.hasCompletedDashboardTutorial;

  return {
    state,
    isLoaded,
    shouldShowWelcome,
    shouldShowSchemaTutorial,
    shouldShowAttestationTutorial,
    shouldShowDashboardTutorial,
    markWelcomeSeen,
    markSchemaTutorialComplete,
    markAttestationTutorialComplete,
    markDashboardTutorialComplete,
    resetOnboarding,
  };
}

// Hook for feature tooltips
export function useFeatureTooltip(featureKey: string) {
  const [hasSeenTooltip, setHasSeenTooltip] = useState(true);

  useEffect(() => {
    try {
      const key = `${TUTORIAL_KEY}-${featureKey}`;
      const seen = localStorage.getItem(key);
      setHasSeenTooltip(seen === 'true');
    } catch (error) {
      console.error('Failed to load tooltip state:', error);
    }
  }, [featureKey]);

  const markTooltipSeen = () => {
    try {
      const key = `${TUTORIAL_KEY}-${featureKey}`;
      localStorage.setItem(key, 'true');
      setHasSeenTooltip(true);
    } catch (error) {
      console.error('Failed to save tooltip state:', error);
    }
  };

  return {
    shouldShowTooltip: !hasSeenTooltip,
    markTooltipSeen,
  };
}
