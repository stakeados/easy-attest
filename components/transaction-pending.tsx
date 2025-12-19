'use client';

interface TransactionPendingProps {
  txHash?: string;
  message?: string;
}

export function TransactionPending({ txHash, message = 'Transaction pending...' }: TransactionPendingProps) {
  const blockExplorerUrl = txHash 
    ? `https://basescan.org/tx/${txHash}`
    : undefined;

  return (
    <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      {/* Spinner */}
      <svg
        className="animate-spin h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-blue-900">{message}</p>
        {txHash && (
          <div className="mt-2 space-y-1">
            <p className="text-xs text-blue-700">Transaction Hash:</p>
            <p className="text-xs font-mono text-blue-800 break-all">{txHash}</p>
            {blockExplorerUrl && (
              <a
                href={blockExplorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline mt-1"
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
    </div>
  );
}
