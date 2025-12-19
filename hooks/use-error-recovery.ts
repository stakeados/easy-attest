import { useState, useCallback } from 'react';
import { parseTransactionError, type ParsedError } from '@/lib/error-parser';

interface ErrorRecoveryOptions {
  maxRetries?: number;
  retryDelay?: number;
  onRetry?: () => void;
}

interface ErrorRecoveryState {
  error: ParsedError | null;
  retryCount: number;
  isRetrying: boolean;
}

export function useErrorRecovery(options: ErrorRecoveryOptions = {}) {
  const { maxRetries = 3, retryDelay = 1000, onRetry } = options;
  
  const [state, setState] = useState<ErrorRecoveryState>({
    error: null,
    retryCount: 0,
    isRetrying: false,
  });

  const setError = useCallback((error: any) => {
    const parsed = parseTransactionError(error);
    setState((prev) => ({
      ...prev,
      error: parsed,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState({
      error: null,
      retryCount: 0,
      isRetrying: false,
    });
  }, []);

  const retry = useCallback(async (fn: () => Promise<any>) => {
    if (state.retryCount >= maxRetries) {
      return;
    }

    setState((prev) => ({
      ...prev,
      isRetrying: true,
      retryCount: prev.retryCount + 1,
    }));

    onRetry?.();

    // Wait before retrying
    await new Promise((resolve) => setTimeout(resolve, retryDelay));

    try {
      const result = await fn();
      clearError();
      return result;
    } catch (error) {
      setError(error);
      setState((prev) => ({
        ...prev,
        isRetrying: false,
      }));
      throw error;
    }
  }, [state.retryCount, maxRetries, retryDelay, onRetry, clearError, setError]);

  const shouldAutoRetry = useCallback((error: ParsedError | null): boolean => {
    if (!error) return false;
    
    // Auto-retry for network errors only
    return error.code === 'NETWORK_ERROR' && state.retryCount < maxRetries;
  }, [state.retryCount, maxRetries]);

  const canRetry = state.retryCount < maxRetries;

  return {
    error: state.error,
    retryCount: state.retryCount,
    isRetrying: state.isRetrying,
    canRetry,
    setError,
    clearError,
    retry,
    shouldAutoRetry,
  };
}
