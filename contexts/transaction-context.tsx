'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type TransactionStatus = 'idle' | 'pending' | 'success' | 'error';

export interface TransactionState {
  status: TransactionStatus;
  txHash?: string;
  error?: {
    message: string;
    code: string;
    details?: string;
    action?: {
      label: string;
      url?: string;
    };
  };
  result?: any;
  optimisticData?: any; // For optimistic UI updates
}

interface TransactionContextValue {
  transaction: TransactionState;
  setTransactionPending: (txHash?: string, optimisticData?: any) => void;
  setTransactionSuccess: (txHash: string, result?: any) => void;
  setTransactionError: (
    message: string,
    code: string,
    details?: string,
    action?: { label: string; url?: string }
  ) => void;
  resetTransaction: () => void;
}

const TransactionContext = createContext<TransactionContextValue | undefined>(undefined);

const initialState: TransactionState = {
  status: 'idle',
};

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transaction, setTransaction] = useState<TransactionState>(initialState);

  const setTransactionPending = useCallback((txHash?: string, optimisticData?: any) => {
    setTransaction({
      status: 'pending',
      txHash,
      optimisticData,
    });
  }, []);

  const setTransactionSuccess = useCallback((txHash: string, result?: any) => {
    setTransaction({
      status: 'success',
      txHash,
      result,
    });
  }, []);

  const setTransactionError = useCallback(
    (
      message: string,
      code: string,
      details?: string,
      action?: { label: string; url?: string }
    ) => {
      setTransaction({
        status: 'error',
        error: {
          message,
          code,
          details,
          action,
        },
      });
    },
    []
  );

  const resetTransaction = useCallback(() => {
    setTransaction(initialState);
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        transaction,
        setTransactionPending,
        setTransactionSuccess,
        setTransactionError,
        resetTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransaction() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
}
