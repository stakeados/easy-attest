import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { farcasterFrame } from '@farcaster/frame-wagmi-connector';
import { getEnv } from './env';

const projectId = getEnv('NEXT_PUBLIC_WC_PROJECT_ID') || 'easy-attest-project-id';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        coinbaseWallet,
        injectedWallet,
        metaMaskWallet,
        rainbowWallet,
      ],
    },
  ],
  {
    appName: 'Easy Attest',
    projectId,
  }
);

// Add Farcaster Frame connector separately as it's not a RainbowKit UI wallet
const finalConnectors = [
  ...connectors,
  farcasterFrame(),
];

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: finalConnectors,
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [base.id]: http(getEnv('NEXT_PUBLIC_RPC_URL') || 'https://mainnet.base.org'),
    [baseSepolia.id]: http(getEnv('NEXT_PUBLIC_RPC_URL_SEPOLIA') || ''),
  },
});

export function getConfig() {
  return config;
}

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
