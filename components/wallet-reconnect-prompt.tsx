'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

interface WalletReconnectPromptProps {
  onReconnect?: () => void;
}

export function WalletReconnectPrompt({ onReconnect }: WalletReconnectPromptProps) {
  const { isConnected, isReconnecting } = useAccount();
  const [wasConnected, setWasConnected] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (isConnected) {
      setWasConnected(true);
      setShowPrompt(false);
    } else if (wasConnected && !isReconnecting) {
      // Connection was lost
      setShowPrompt(true);
    }
  }, [isConnected, wasConnected, isReconnecting]);

  const handleReconnect = () => {
    setShowPrompt(false);
    onReconnect?.();
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setWasConnected(false);
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
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
        </div>

        {/* Content */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-gray-900">
            Wallet Disconnected
          </h3>
          <p className="text-gray-600">
            Your wallet connection was lost. Please reconnect to continue using Easy Attest.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleReconnect}
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Reconnect Wallet
          </button>
          <button
            onClick={handleDismiss}
            className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
