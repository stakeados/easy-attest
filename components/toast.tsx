'use client';

import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'pending';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
  txHash?: string;
  details?: string;
  action?: {
    label: string;
    url?: string;
  };
  onRetry?: () => void;
}

export function Toast({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose,
  txHash,
  details,
  action,
  onRetry 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Don't auto-close pending toasts
    if (type === 'pending') {
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose, type]);

  const bgColor = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    pending: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  }[type];

  const textColor = {
    success: 'text-green-900 dark:text-green-100',
    error: 'text-red-900 dark:text-red-100',
    info: 'text-blue-900 dark:text-blue-100',
    pending: 'text-blue-900 dark:text-blue-100',
  }[type];

  const iconColor = {
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
    info: 'text-blue-600 dark:text-blue-400',
    pending: 'text-blue-600 dark:text-blue-400',
  }[type];

  const blockExplorerUrl = txHash ? `https://basescan.org/tx/${txHash}` : undefined;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <div className={`flex items-start gap-3 p-4 border rounded-lg shadow-lg ${bgColor} min-w-[300px] max-w-md`}>
        {type === 'success' && (
          <svg
            className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`}
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
        )}
        {type === 'error' && (
          <svg
            className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        {type === 'info' && (
          <svg
            className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        {type === 'pending' && (
          <svg
            className={`animate-spin w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`}
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
        )}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
          
          {details && (
            <p className={`mt-1 text-xs ${textColor} opacity-80`}>{details}</p>
          )}

          {txHash && (
            <div className="mt-2 space-y-1">
              <p className={`text-xs ${textColor} opacity-80`}>Transaction Hash:</p>
              <p className={`text-xs font-mono ${textColor} break-all`}>{txHash}</p>
              {blockExplorerUrl && (
                <a
                  href={blockExplorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 text-xs ${iconColor} hover:underline mt-1`}
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

          <div className="mt-3 flex flex-wrap gap-2">
            {onRetry && type === 'error' && (
              <button
                onClick={onRetry}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium ${textColor} bg-red-100 hover:bg-red-200 rounded-md transition-colors`}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Retry Transaction
              </button>
            )}
            
            {action && action.label && action.url && (
              <a
                href={action.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                {action.label}
                <svg
                  className="w-3.5 h-3.5"
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
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className={`${textColor} hover:opacity-70 transition-opacity`}
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
      </div>
    </div>
  );
}

// Toast container for managing multiple toasts
interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  txHash?: string;
  details?: string;
  action?: {
    label: string;
    url?: string;
  };
  onRetry?: () => void;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (
    message: string, 
    type: ToastType = 'info',
    options?: {
      txHash?: string;
      details?: string;
      action?: {
        label: string;
        url?: string;
      };
      onRetry?: () => void;
    }
  ) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { 
      id, 
      message, 
      type,
      txHash: options?.txHash,
      details: options?.details,
      action: options?.action,
      onRetry: options?.onRetry,
    }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const updateToast = (id: string, updates: Partial<ToastMessage>) => {
    setToasts((prev) => 
      prev.map((toast) => 
        toast.id === id ? { ...toast, ...updates } : toast
      )
    );
  };

  const ToastContainer = () => (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          txHash={toast.txHash}
          details={toast.details}
          action={toast.action}
          onRetry={toast.onRetry}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );

  return { showToast, removeToast, updateToast, ToastContainer };
}
