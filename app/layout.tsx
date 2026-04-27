import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { LayoutContent } from '@/components/layout-content';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

// Default metadata in English - will be updated dynamically by i18n system
export const metadata: Metadata = {
  title: 'Easy Attest - No-Code Onchain Attestations',
  description:
    'Create and manage onchain attestations on Base using Ethereum Attestation Service',
  openGraph: {
    title: 'Easy Attest - No-Code Onchain Attestations',
    description:
      'Create and manage onchain attestations on Base using Ethereum Attestation Service',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Easy Attest - No-Code Onchain Attestations',
    description:
      'Create and manage onchain attestations on Base using Ethereum Attestation Service',
  },
  other: {
    'talentapp:project_verification': 'acb2f21edcc391d9c35bf1286a9671dbc2ddb003c3482342e16883bbac008fb454ee1e7b0a9cc4191bccd99b01c85669c98e477ce6148ebb3b70ff884bfb795b',
    'base:app_id': '6938b08c8a7c4e55fec73cc7',
    'fc:frame': JSON.stringify({
      version: 'next',
      imageUrl: 'https://easyattest.xyz/opengraph-image',
      button: {
        title: 'Launch Easy Attest',
        action: {
          type: 'launch_frame',
          name: 'Easy Attest',
          url: 'https://easyattest.xyz',
          splashImageUrl: 'https://easyattest.xyz/icon',
          splashBackgroundColor: '#0052FF',
        },
      },
    }),
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200`}>
        <Script src="/env-config.js" strategy="beforeInteractive" />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0G2J7D7H7N"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0G2J7D7H7N');
          `}
        </Script>
        <Providers>
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </body>
    </html>
  );
}
