import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WalletConnection } from '../wallet-connection';

// Mock RainbowKit ConnectButton
vi.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: {
    Custom: ({ children }: any) => children({
      account: { address: '0x123', isConnected: true },
      chain: { id: 8453, unsupported: false },
      openAccountModal: vi.fn(),
      openChainModal: vi.fn(),
      openConnectModal: vi.fn(),
      authenticationStatus: 'authenticated',
      mounted: true,
    }),
  },
}));

// Mock OnchainKit Identity
vi.mock('@coinbase/onchainkit/identity', () => ({
  Avatar: () => <div data-testid="mock-avatar" />,
  Name: () => <div data-testid="mock-name">Mock Name</div>,
}));

describe('WalletConnection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render connected state correctly', () => {
    // This test assumes the mock provides a connected state
    render(<WalletConnection />);

    // Should show identity components
    expect(screen.getByTestId('mock-avatar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-name')).toBeInTheDocument();
  });
});
