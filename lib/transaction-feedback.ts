/**
 * Transaction Feedback System
 * 
 * Centralized exports for the transaction feedback system.
 * Import everything you need from this single file.
 */

// Context and hooks
export { TransactionProvider, useTransaction } from '@/contexts/transaction-context';
export { useTransactionFeedback } from '@/hooks/use-transaction-feedback';
export type { TransactionStatus, TransactionState } from '@/contexts/transaction-context';

// Notification components
export { TransactionPending } from '@/components/transaction-pending';
export { TransactionSuccess } from '@/components/transaction-success';
export { TransactionError as TransactionErrorComponent } from '@/components/transaction-error';

// Toast system
export { Toast, useToast } from '@/components/toast';
export type { ToastType } from '@/components/toast';

// Error parsing utilities
export {
  parseTransactionError,
  isUserRejection,
  isInsufficientFunds,
  getErrorMessage,
  getErrorDetails,
  getErrorAction,
} from '@/lib/error-parser';
export type { ParsedError } from '@/lib/error-parser';

// Re-export from EAS for convenience
export { TransactionError, handleTransactionError } from '@/lib/eas';
