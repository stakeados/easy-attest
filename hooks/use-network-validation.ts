'use client';

import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { base } from 'viem/chains';
import { useEffect, useState } from 'react';

export function useNetworkValidation() {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const { switchChain, isPending, error } = useSwitchChain();
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  const expectedChainId = base.id;

  useEffect(() => {
    if (isConnected && chainId !== expectedChainId) {
      setIsWrongNetwork(true);
    } else {
      setIsWrongNetwork(false);
    }
  }, [chainId, isConnected, expectedChainId]);

  const handleSwitchNetwork = () => {
    if (switchChain) {
      switchChain({ chainId: expectedChainId });
    }
  };

  return {
    isWrongNetwork,
    currentChainId: chainId,
    expectedChainId,
    switchNetwork: handleSwitchNetwork,
    isSwitching: isPending,
    switchError: error,
  };
}
