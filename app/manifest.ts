import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Easy Attest',
        short_name: 'Easy Attest',
        description: 'Create and manage onchain attestations on Base using Ethereum Attestation Service',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0052FF',
        icons: [
            {
                src: '/icon',
                sizes: 'some',
                type: 'image/png',
            },
        ],
    };
}
