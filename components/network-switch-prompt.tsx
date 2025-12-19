'use client';

import { useNetworkValidation } from '@/hooks/use-network-validation';
import { base } from 'viem/chains';
import { useAccount } from 'wagmi';

export function NetworkSwitchPrompt() {
  const { isConnected } = useAccount();
  const {
    isWrongNetwork,
    switchNetwork,
    isSwitching,
    switchError,
  } = useNetworkValidation();

  if (!isConnected || !isWrongNetwork) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-full mb-4">
          <svg
            className="w-6 h-6 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-xl font-semibold text-center mb-2">
          Wrong Network
        </h2>

        <p className="text-gray-600 text-center mb-6">
          Please switch to {base.name} network to use Easy Attest.
        </p>

        {switchError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              {switchError.message.includes('rejected')
                ? 'Network switch was rejected. Please try again.'
                : 'Failed to switch network. Please switch manually in your wallet.'}
            </p>
          </div>
        )}

        <button
          onClick={switchNetwork}
          disabled={isSwitching}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          {isSwitching ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Switching...
            </span>
          ) : (
            `Switch to ${base.name}`
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          You can also switch networks manually in your wallet settings.
        </p>
      </div>
    </div>
  );
}
