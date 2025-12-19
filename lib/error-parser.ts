/**
 * Error parser for Web3 transaction errors
 * Maps common error codes to user-friendly messages with actionable guidance
 */

export interface ParsedError {
  message: string;
  code: string;
  details?: string;
  action?: {
    label: string;
    url?: string;
  };
}

/**
 * Parse Web3 transaction errors into user-friendly messages
 */
export function parseTransactionError(error: any): ParsedError {
  // User rejected transaction
  if (
    error.code === 'ACTION_REJECTED' || 
    error.code === 4001 ||
    error.message?.includes('User rejected') ||
    error.message?.includes('user rejected')
  ) {
    return {
      message: 'Transaction cancelled',
      code: 'USER_REJECTED',
      details: 'You cancelled the transaction in your wallet',
    };
  }

  // Insufficient funds for gas
  if (
    error.code === 'INSUFFICIENT_FUNDS' ||
    error.message?.includes('insufficient funds') ||
    error.message?.includes('insufficient balance')
  ) {
    return {
      message: 'Insufficient funds for gas',
      code: 'INSUFFICIENT_FUNDS',
      details: 'You need more ETH on Base to pay for transaction fees',
      action: {
        label: 'Bridge ETH to Base',
        url: 'https://bridge.base.org',
      },
    };
  }

  // Network/connection errors
  if (
    error.code === 'NETWORK_ERROR' ||
    error.message?.includes('network') ||
    error.message?.includes('connection') ||
    error.message?.includes('timeout')
  ) {
    return {
      message: 'Network error',
      code: 'NETWORK_ERROR',
      details: 'Please check your internet connection and try again',
    };
  }

  // Gas estimation failed
  if (
    error.code === 'UNPREDICTABLE_GAS_LIMIT' ||
    error.message?.includes('gas required exceeds') ||
    error.message?.includes('gas estimation')
  ) {
    return {
      message: 'Gas estimation failed',
      code: 'GAS_ESTIMATION_FAILED',
      details: 'The transaction may fail. Please check your inputs and try again',
    };
  }

  // Contract execution reverted
  if (
    error.code === 'CALL_EXCEPTION' ||
    error.message?.includes('revert') ||
    error.message?.includes('execution reverted')
  ) {
    const revertReason = extractRevertReason(error);
    return {
      message: 'Transaction reverted',
      code: 'CONTRACT_REVERT',
      details: revertReason || 'The contract rejected the transaction. Please check your inputs',
    };
  }

  // Nonce too low (transaction already processed)
  if (
    error.message?.includes('nonce too low') ||
    error.message?.includes('already known')
  ) {
    return {
      message: 'Transaction already processed',
      code: 'NONCE_TOO_LOW',
      details: 'This transaction may have already been submitted',
    };
  }

  // Replacement transaction underpriced
  if (
    error.message?.includes('replacement transaction underpriced') ||
    error.message?.includes('transaction underpriced')
  ) {
    return {
      message: 'Transaction underpriced',
      code: 'UNDERPRICED',
      details: 'Please increase the gas price and try again',
    };
  }

  // Transaction timeout
  if (
    error.message?.includes('timeout') ||
    error.message?.includes('timed out')
  ) {
    return {
      message: 'Transaction timeout',
      code: 'TIMEOUT',
      details: 'The transaction took too long. It may still be processing',
    };
  }

  // Wallet not connected
  if (
    error.message?.includes('wallet not connected') ||
    error.message?.includes('no provider')
  ) {
    return {
      message: 'Wallet not connected',
      code: 'WALLET_NOT_CONNECTED',
      details: 'Please connect your wallet and try again',
    };
  }

  // Wrong network
  if (
    error.message?.includes('wrong network') ||
    error.message?.includes('unsupported chain')
  ) {
    return {
      message: 'Wrong network',
      code: 'WRONG_NETWORK',
      details: 'Please switch to Base network in your wallet',
    };
  }

  // Generic error
  return {
    message: 'Transaction failed',
    code: 'UNKNOWN_ERROR',
    details: error.message || 'An unexpected error occurred. Please try again',
  };
}

/**
 * Extract revert reason from error object
 */
function extractRevertReason(error: any): string | undefined {
  // Try to extract from various error formats
  if (error.reason) {
    return error.reason;
  }

  if (error.data?.message) {
    return error.data.message;
  }

  if (error.error?.message) {
    return error.error.message;
  }

  // Try to extract from error message
  const message = error.message || '';
  const revertMatch = message.match(/revert (.+?)(?:\"|$)/i);
  if (revertMatch) {
    return revertMatch[1];
  }

  return undefined;
}

/**
 * Check if error is a user rejection (not a real error)
 */
export function isUserRejection(error: any): boolean {
  const parsed = parseTransactionError(error);
  return parsed.code === 'USER_REJECTED';
}

/**
 * Check if error is due to insufficient funds
 */
export function isInsufficientFunds(error: any): boolean {
  const parsed = parseTransactionError(error);
  return parsed.code === 'INSUFFICIENT_FUNDS';
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: any): string {
  const parsed = parseTransactionError(error);
  return parsed.message;
}

/**
 * Get error details with guidance
 */
export function getErrorDetails(error: any): string | undefined {
  const parsed = parseTransactionError(error);
  return parsed.details;
}

/**
 * Get suggested action for error
 */
export function getErrorAction(error: any): ParsedError['action'] {
  const parsed = parseTransactionError(error);
  return parsed.action;
}
