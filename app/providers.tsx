'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import '@coinbase/onchainkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'viem/chains';
import { type ReactNode, useState } from 'react';
import { type State, WagmiProvider } from 'wagmi';
import { getConfig } from '@/lib/wagmi';
import { ThemeProvider } from '@/contexts/theme-context';
import { I18nProvider } from '@/contexts/i18n-context';
import { TransactionProvider } from '@/contexts/transaction-context';
import { MetadataUpdater } from '@/components/metadata-updater';


export function Providers(props: {
  children: ReactNode;
  initialState?: State;
}) {
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());

  return (
    <I18nProvider>
      <MetadataUpdater />
      <ThemeProvider>
        <WagmiProvider config={config} initialState={props.initialState}>
          <QueryClientProvider client={queryClient}>
            <OnchainKitProvider
              apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
              chain={base as any}
              config={{
                appearance: {
                  mode: 'auto',
                  theme: 'default',
                },
              }}
            >
              <RainbowKitProvider>
                <TransactionProvider>
                  {props.children}
                </TransactionProvider>
              </RainbowKitProvider>
            </OnchainKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
