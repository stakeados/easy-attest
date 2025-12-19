'use client';

import { Tooltip } from './tooltip';

interface HelpIconProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function HelpIcon({ content, position = 'top' }: HelpIconProps) {
  return (
    <Tooltip content={content} position={position}>
      <svg
        className="inline-block w-4 h-4 text-gray-500 hover:text-gray-700 transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Help"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </Tooltip>
  );
}
