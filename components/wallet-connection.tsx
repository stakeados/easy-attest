'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Avatar, Name, Identity, EthBalance } from '@coinbase/onchainkit/identity';
import { base } from 'viem/chains';

export function WalletConnection() {
  return (
    <div className="flex justify-end">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          // Note: If your app doesn't use authentication, you
          // can remove all 'authenticationStatus' checks
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus ||
              authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                'style': {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition-colors flex items-center gap-2"
                    >
                      Connect Wallet
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button onClick={openChainModal} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                      Wrong network
                    </button>
                  );
                }

                return (
                  <button
                    onClick={openAccountModal}
                    className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 pr-4 rounded-full transition-colors border border-gray-200 dark:border-gray-700"
                  >
                    {/* OnchainKit Avatar & Name implementation for Basename support */}
                    <div className="flex items-center gap-2">
                      <Avatar address={account.address as `0x${string}`} chain={base} className="h-8 w-8" />
                      <div className="flex flex-col items-start">
                        <Name address={account.address as `0x${string}`} chain={base} className="font-semibold text-sm" />
                      </div>
                    </div>
                  </button>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}
