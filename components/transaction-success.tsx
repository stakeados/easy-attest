'use client';

interface TransactionSuccessProps {
  txHash?: string;
  message?: string;
  details?: React.ReactNode;
  onClose?: () => void;
}

export function TransactionSuccess({ 
  txHash, 
  message = 'Transaction successful!',
  details,
  onClose 
}: TransactionSuccessProps) {
  const blockExplorerUrl = txHash 
    ? `https://basescan.org/tx/${txHash}`
    : undefined;

  return (
    <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
      {/* Success Icon */}
      <svg
        className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-green-900">{message}</p>
        
        {details && (
          <div className="mt-2">
            {details}
          </div>
        )}

        {txHash && (
          <div className="mt-2 space-y-1">
            <p className="text-xs text-green-700">Transaction Hash:</p>
            <p className="text-xs font-mono text-green-800 break-all">{txHash}</p>
            {blockExplorerUrl && (
              <a
                href={blockExplorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-700 hover:underline mt-1"
              >
                View on Basescan
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}
          </div>
        )}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="text-green-600 hover:text-green-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
