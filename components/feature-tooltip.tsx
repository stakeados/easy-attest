'use client';

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface FeatureTooltipProps {
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  onDismiss: () => void;
  children: React.ReactNode;
}

export function FeatureTooltip({
  title,
  description,
  position = 'bottom',
  onDismiss,
  children,
}: FeatureTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show tooltip after a short delay
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 200);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-blue-600',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-blue-600',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-blue-600',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-blue-600',
  };

  return (
    <div className="relative inline-block">
      {children}

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 w-72 ${positionClasses[position]} transition-all duration-200 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* Tooltip card */}
          <div className="bg-blue-600 text-white rounded-lg shadow-xl p-4 relative">
            {/* Arrow */}
            <div
              className={`absolute w-0 h-0 border-8 border-transparent ${arrowClasses[position]}`}
            />

            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-sm pr-2">{title}</h4>
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 hover:bg-blue-700 rounded transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-blue-50 mb-3">{description}</p>

            {/* Action */}
            <button
              onClick={handleDismiss}
              className="text-sm font-medium text-white hover:text-blue-100 transition-colors"
            >
              Got it
            </button>
          </div>

          {/* Pulse animation ring */}
          <div className="absolute inset-0 rounded-lg border-2 border-blue-400 animate-ping opacity-75 pointer-events-none" />
        </div>
      )}
    </div>
  );
}
