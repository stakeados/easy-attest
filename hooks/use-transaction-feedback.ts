'use client';

import { useCallback } from 'react';
import { useTransaction } from '@/contexts/transaction-context';
import { useToast } from '@/components/toast';

export function useTransactionFeedback() {
  const { 
    transaction, 
    setTransactionPending, 
    setTransactionSuccess, 
    setTransactionError,
    resetTransaction 
  } = useTransaction();
  
  const { showToast, removeToast, updateToast } = useToast();

  const startTransaction = useCallback((message: string = 'Transaction pending...') => {
    setTransactionPending();
    const toastId = showToast(message, 'pending');
    return toastId;
  }, [setTransactionPending, showToast]);

  const updateTransactionHash = useCallback((toastId: string, txHash: string) => {
    setTransactionPending(txHash);
    updateToast(toastId, {
      txHash,
      message: 'Transaction submitted',
    });
  }, [setTransactionPending, updateToast]);

  const completeTransaction = useCallback((
    toastId: string,
    txHash: string,
    successMessage: string = 'Transaction successful!',
    result?: any
  ) => {
    setTransactionSuccess(txHash, result);
    removeToast(toastId);
    showToast(successMessage, 'success', { txHash });
  }, [setTransactionSuccess, removeToast, showToast]);

  const failTransaction = useCallback(
    (
      toastId: string,
      message: string,
      code: string,
      details?: string,
      action?: { label: string; url?: string },
      onRetry?: () => void
    ) => {
      setTransactionError(message, code, details, action);
      removeToast(toastId);
      showToast(message, 'error', { details, action, onRetry });
    },
    [setTransactionError, removeToast, showToast]
  );

  const clearTransaction = useCallback(() => {
    resetTransaction();
  }, [resetTransaction]);

  return {
    transaction,
    startTransaction,
    updateTransactionHash,
    completeTransaction,
    failTransaction,
    clearTransaction,
  };
}
