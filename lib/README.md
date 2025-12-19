# Name Resolution Utilities

This directory contains utilities for resolving Ethereum addresses to human-readable names.

## Features

- **ENS Resolution**: Resolves Ethereum addresses to ENS names
- **Farcaster Resolution**: Resolves addresses to Farcaster usernames
- **Fallback Chain**: Automatically tries ENS → Farcaster → truncated address
- **Caching**: 5-minute TTL cache to reduce API calls
- **React Component**: Ready-to-use `AddressDisplay` component

## Usage

### Basic Name Resolution

```typescript
import { resolveAddressName } from '@/lib/name-resolution';

const { name, source } = await resolveAddressName('0x...');
// Returns: { name: 'vitalik.eth', source: 'ens' }
// or: { name: 'username', source: 'farcaster' }
// or: { name: '0xd8dA...6045', source: 'address' }
```

### Using the AddressDisplay Component

```tsx
import { AddressDisplay } from '@/components/address-display';

<AddressDisplay
  address="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
  copyable={true}
/>
```

### Individual Resolution Functions

```typescript
import {
  resolveENSName,
  resolveFarcasterName,
  truncateAddress,
} from '@/lib/name-resolution';

// ENS only
const ensName = await resolveENSName('0x...');

// Farcaster only
const farcasterName = await resolveFarcasterName('0x...');

// Truncate address
const short = truncateAddress('0x...'); // "0xd8dA...6045"
```

## Configuration

For Farcaster resolution, set the `FARCASTER_API_KEY` environment variable:

```env
FARCASTER_API_KEY=your_neynar_api_key
```

Get your API key from [Neynar](https://neynar.com/).
