---
name: easyattest
description: Create EAS schemas, submit on-chain attestations, and verify them on Base — no Solidity needed. Use the EasyAttest web app for no-code access, the GraphQL subgraph for programmatic queries (no wallet required), or the EAS JS SDK for full agent automation. Built on top of the official EAS SDK with sensible defaults for Base mainnet and Base Sepolia.
---

# EasyAttest Skill

**EasyAttest** (https://easyattest.xyz) is an open-source no-code interface for the Ethereum Attestation Service (EAS) on Base. It lets AI agents prove work, verify identity, or create any on-chain statement — without writing Solidity.

Source: https://github.com/stakeados/easy-attest  
License: MIT

---

## Networks & Contracts

| Network | Chain ID | EAS Contract | Schema Registry |
|---|---|---|---|
| **Base Mainnet** | 8453 | `0x4200000000000000000000000000000000000021` | `0x4200000000000000000000000000000000000020` |
| **Base Sepolia** | 84532 | `0x4200000000000000000000000000000000000021` | `0x4200000000000000000000000000000000000020` |

**EasyAttest public subgraph (Base Mainnet)**:
```
https://api.studio.thegraph.com/query/1715659/easy-attest/version/latest
```

---

## Key Concepts

| Term | Meaning |
|---|---|
| **Schema** | Reusable template defining what fields an attestation contains. Register once, reuse forever. |
| **Attestation** | A signed, immutable on-chain statement: "I certify that these fields are true." |
| **UID** | Unique on-chain ID of an attestation — used to reference or verify it in contracts or queries. |
| **Revocation** | Creator can revoke an attestation (e.g. for disputes). Only works if schema was created with `revocable: true`. |
| **Schema string** | Solidity-style type list, e.g. `string jobId, uint256 completedAt, bool delivered` |

### Supported field types
`string` · `uint256` · `bool` · `address` · `bytes32` · `bytes`

---

## Method 1 — EasyAttest Web App (No Code, No Setup)

**URL**: https://easyattest.xyz  
**Wallets**: Coinbase Wallet, MetaMask, Rainbow, Injected wallet, Farcaster Frame  
**Gas**: < $0.01 USD on Base. Gasless attestations via Coinbase Paymaster also supported.

### Create a Schema
1. Go to https://easyattest.xyz → connect wallet (needs ETH on Base for gas)
2. Click **"Create Schema"**
3. Define fields using the supported types above
4. Toggle **Revocable** as needed
5. Submit → **copy and save the Schema UID** (`0x...`)

### Create an Attestation
1. Click **"Create Attestation"**
2. Paste your Schema UID or browse existing schemas
3. Fill in recipient address and field values
4. Submit → **copy and save the Attestation UID** (`0x...`)

### Verify an Attestation
1. Go to **Dashboard** or browse schemas
2. Find the attestation by UID
3. Confirm `revoked: false` and `attester` matches the expected address

---

## Method 2 — Subgraph GraphQL (Read-Only, No Wallet)

POST to: `https://api.studio.thegraph.com/query/1715659/easy-attest/version/latest`

### Fetch a specific attestation by UID
```graphql
query {
  attestations(where: { id: "0xYOUR_ATTESTATION_UID" }) {
    id
    attester
    recipient
    time
    data
    txHash
    revoked
    schema { id schema }
  }
}
```
> ✅ Check: `revoked` must be `false` to consider the attestation valid.

### All attestations received by an address
```graphql
query {
  attestations(
    where: { recipient: "0xADDRESS_LOWERCASE" }
    orderBy: time
    orderDirection: desc
    first: 100
  ) { id attester time data revoked }
}
```

### All attestations created by an address
```graphql
query {
  attestations(
    where: { attester: "0xADDRESS_LOWERCASE" }
    orderBy: time
    orderDirection: desc
    first: 100
  ) { id recipient time data revoked }
}
```

### All attestations for a schema
```graphql
query {
  attestations(
    where: { schema: "0xSCHEMA_UID_LOWERCASE" }
    orderBy: time
    orderDirection: desc
    first: 100
  ) { id attester recipient time data txHash revoked }
}
```

### List all schemas
```graphql
query {
  schemas(orderBy: timestamp, orderDirection: desc, first: 50) {
    id schema creator attestationCount timestamp
  }
}
```

**Supported `where` filters**: `recipient`, `attester`, `schema`, `time_gte` (unix), `time_lte` (unix)

**Example fetch from code:**
```javascript
const res = await fetch(
  'https://api.studio.thegraph.com/query/1715659/easy-attest/version/latest',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `query { attestations(...) { id revoked } }` }),
  }
);
const { data } = await res.json();
```

---

## Method 3 — EAS JS SDK (Full Agent Automation)

This mirrors the exact implementation inside `lib/eas.ts` in this repo.

```bash
npm install @ethereum-attestation-service/eas-sdk ethers
```

### Constants
```javascript
const EAS_CONTRACT_ADDRESS    = '0x4200000000000000000000000000000000000021';
const SCHEMA_REGISTRY_ADDRESS = '0x4200000000000000000000000000000000000020';
const BASE_RPC_URL            = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
```

### 1. Register a Schema (one-time)
```javascript
import { SchemaRegistry } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';

async function registerSchema(fields, revocable = true) {
  // fields = [{ name: 'jobId', type: 'string' }, { name: 'completedAt', type: 'uint256' }, ...]
  const schemaString = fields.map(f => `${f.type} ${f.name}`).join(', ');

  const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
  const signer   = new ethers.Wallet(process.env.AGENT_PRIVATE_KEY, provider);

  const registry = new SchemaRegistry(SCHEMA_REGISTRY_ADDRESS);
  registry.connect(signer);

  const tx       = await registry.register({
    schema: schemaString,
    resolverAddress: '0x0000000000000000000000000000000000000000',
    revocable,
  });
  const schemaUID = await tx.wait(); // returns '0x...' UID string

  console.log(`Schema registered: ${schemaUID}`);
  return { schemaUID, schemaString }; // save schemaUID — you'll need it forever
}
```

### 2. Create an Attestation
```javascript
import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';

async function createAttestation({ schemaUID, schemaString, recipient, data, revocable = true }) {
  const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
  const signer   = new ethers.Wallet(process.env.AGENT_PRIVATE_KEY, provider);
  const eas      = new EAS(EAS_CONTRACT_ADDRESS);
  eas.connect(signer);

  // Encode data — handle special cases per EasyAttest's lib/eas.ts
  const fields  = schemaString.split(',').map(f => {
    const parts = f.trim().split(' ');
    return { type: parts[0], name: parts[1] };
  });
  const encoder = new SchemaEncoder(schemaString);
  const values  = fields.map(({ name, type }) => {
    let value = data[name];
    if (type === 'uint256')  value = BigInt(value);                    // REQUIRED — JS numbers silently fail
    if (type === 'bool')     value = Boolean(value);
    if (type === 'address')  value = ethers.getAddress(value);         // normalize checksum
    if (type === 'bytes32' && (!value || value === ''))
      value = ethers.ZeroHash;
    return { name, type, value };
  });

  const tx = await eas.attest({
    schema: schemaUID,
    data: {
      recipient: recipient || ethers.ZeroAddress,
      expirationTime: 0n,
      revocable,
      refUID: ethers.ZeroHash,
      data: encoder.encodeData(values),
      value: 0n,
    },
  });

  const attestationUID = await tx.wait(); // returns '0x...' UID
  console.log(`Attestation created: ${attestationUID}`);
  return attestationUID; // store this & optionally pass to escrow contract
}
```

### 3. Revoke an Attestation
```javascript
async function revokeAttestation(schemaUID, attestationUID) {
  const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
  const signer   = new ethers.Wallet(process.env.AGENT_PRIVATE_KEY, provider);
  const eas      = new EAS(EAS_CONTRACT_ADDRESS);
  eas.connect(signer);

  const tx = await eas.revoke({ schema: schemaUID, data: { uid: attestationUID } });
  await tx.wait();
  console.log(`Revoked: ${attestationUID}`);
}
```

---

## Environment Variables

```env
# Required for signing (agent automation only)
AGENT_PRIVATE_KEY=0x...

# RPC endpoint for Base (public endpoint works for low-to-medium volume)
BASE_RPC_URL=https://mainnet.base.org

# EAS contracts on Base (already set to correct values above — override only if needed)
NEXT_PUBLIC_EAS_CONTRACT_ADDRESS=0x4200000000000000000000000000000000000021
NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS=0x4200000000000000000000000000000000000020

# Subgraph (public, no key needed for the default EasyAttest subgraph)
NEXT_PUBLIC_SUBGRAPH_URL=https://api.studio.thegraph.com/query/1715659/easy-attest/version/latest

# Optional: gasless attestations via Coinbase Paymaster
NEXT_PUBLIC_PAYMASTER_URL=
```

---

## Common Schema Patterns

| Use case | Schema string |
|---|---|
| Job/delivery proof | `string jobId, string deliveryUrl, string buildHash, uint256 completedAt` |
| Agent endorsement | `address agentAddress, string capability, uint256 score, bool verified` |
| Data verification | `string sourceUrl, bytes32 checksum, uint256 verifiedAt, bool passed` |
| Identity / KYC claim | `address subject, string provider, string claimType, uint256 issuedAt` |
| Payment confirmation | `string orderId, address payer, uint256 amount, uint256 paidAt` |

---

## Smart Contract Integration

Pass the returned attestation UID to any contract that reads EAS on Base:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IEAS {
    struct Attestation {
        bytes32 uid;
        bytes32 schema;
        address attester;
        address recipient;
        uint64 time;
        uint64 expirationTime;
        bool revocable;
        bool revoked;
        bytes data;
    }
    function getAttestation(bytes32 uid) external view returns (Attestation memory);
}

contract ExampleEscrow {
    IEAS constant eas = IEAS(0x4200000000000000000000000000000000000021);
    address public trustedAgent;

    function completeJob(bytes32 orderId, bytes32 attestationUID) external {
        IEAS.Attestation memory a = eas.getAttestation(attestationUID);
        require(!a.revoked, "Attestation revoked");
        require(a.attester == trustedAgent, "Untrusted attester");
        // decode a.data to validate orderId matches, then release funds
    }
}
```

---

## When to Use This Skill

| Scenario | Action |
|---|---|
| Completed a build or deployment | Attest `jobId + deliveryUrl + buildHash` |
| Releasing escrow funds | Pass attestation UID to `completeJob()` on the settlement contract |
| Cross-agent trust before collaboration | Query the other agent's attestation history |
| Building an immutable audit trail | Attest each significant action with a timestamp |
| KYC / capability claims | Create identity attestations from a trusted issuer |

---

## Pre-flight Checklist (run before any on-chain operation)

```javascript
import { ethers } from 'ethers';

async function preflight() {
  const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL || 'https://mainnet.base.org');
  const wallet   = new ethers.Wallet(process.env.AGENT_PRIVATE_KEY, provider);

  const network  = await provider.getNetwork();
  const balance  = await provider.getBalance(wallet.address);

  console.log('Chain ID :', network.chainId.toString());  // must be 8453 (Base Mainnet)
  console.log('Address  :', wallet.address);
  console.log('Balance  :', ethers.formatEther(balance), 'ETH');

  if (network.chainId !== 8453n) throw new Error('Wrong network — switch to Base Mainnet (chainId 8453)');
  if (balance < ethers.parseEther('0.0005')) throw new Error('Insufficient ETH — need at least 0.0005 ETH');
}
```

> **Private key format**: must start with `0x`. If your key is 64 hex chars without prefix, prepend `0x`.

---

## Troubleshooting

### ❌ `execution reverted` on SchemaRegistry

**Root cause**: Agent used raw `ethers.Contract` with an incorrect or incomplete ABI instead of the EAS SDK. The calldata arrives malformed and the contract reverts — gas is still consumed.

**Fix A — Use the SDK correctly (recommended)**
```javascript
// CommonJS-safe import (avoids ESM/CJS conflicts)
const { SchemaRegistry, EAS, SchemaEncoder } = require('@ethereum-attestation-service/eas-sdk');
```

**Fix B — Raw ethers fallback with the complete correct ABI**

The ABI **must include the `Registered` event** — otherwise you cannot extract the schema UID from the receipt:

```javascript
import { ethers } from 'ethers';

const SCHEMA_REGISTRY_ABI = [
  // Functions
  'function register(string calldata schema, address resolver, bool revocable) external returns (bytes32)',
  'function getSchema(bytes32 uid) external view returns (tuple(bytes32 uid, address resolver, bool revocable, string schema))',
  // Events — REQUIRED to extract the schema UID from the receipt
  'event Registered(bytes32 indexed uid, address indexed registerer, tuple(bytes32 uid, address resolver, bool revocable, string schema) schema)',
];

async function registerSchemaRaw(schemaString, revocable = true) {
  const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL || 'https://mainnet.base.org');
  const signer   = new ethers.Wallet(process.env.AGENT_PRIVATE_KEY, provider);
  const registry = new ethers.Contract(
    '0x4200000000000000000000000000000000000020',
    SCHEMA_REGISTRY_ABI,
    signer
  );

  // resolver MUST be ethers.ZeroAddress — NOT null, undefined, or empty string
  const tx      = await registry.register(schemaString, ethers.ZeroAddress, revocable);
  const receipt = await tx.wait();

  // Parse the Registered event to get the schema UID
  const iface  = new ethers.Interface(SCHEMA_REGISTRY_ABI);
  const parsed = receipt.logs
    .map(log => { try { return iface.parseLog(log); } catch { return null; } })
    .find(e => e?.name === 'Registered');

  const schemaUID = parsed?.args?.uid;
  if (!schemaUID) throw new Error('Could not extract schema UID from receipt — check the ABI has the Registered event');

  console.log('Schema UID:', schemaUID);
  return schemaUID; // save this — you need it for every attestation
}
```

---

### ❌ Raw ethers fallback for `attest()`

The EAS attest ABI is complex. If the SDK fails, use this exact ABI:

```javascript
const EAS_ABI = [
  'function attest((bytes32 schema, (address recipient, uint64 expirationTime, bool revocable, bytes32 refUID, bytes data, uint256 value) data) request) external payable returns (bytes32)',
  'event Attested(address indexed recipient, address indexed attester, bytes32 uid, bytes32 indexed schema)',
];

async function attestRaw({ schemaUID, schemaString, recipient, data, revocable = true }) {
  const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL || 'https://mainnet.base.org');
  const signer   = new ethers.Wallet(process.env.AGENT_PRIVATE_KEY, provider);
  const eas      = new ethers.Contract('0x4200000000000000000000000000000000000021', EAS_ABI, signer);

  // Encode the attestation data using the schema string
  // Must use SchemaEncoder from the EAS SDK — there is no clean raw-ethers alternative
  const { SchemaEncoder } = require('@ethereum-attestation-service/eas-sdk');
  const encoder = new SchemaEncoder(schemaString);
  const fields  = schemaString.split(',').map(f => {
    const [type, name] = f.trim().split(' ');
    return { type, name };
  });
  const encoded = encoder.encodeData(
    fields.map(({ name, type }) => {
      let value = data[name];
      if (type === 'bool')    value = Boolean(value);
      if (type === 'uint256') value = BigInt(value);
      if (type === 'bytes32' && !value) value = ethers.ZeroHash;
      return { name, type, value };
    })
  );

  const tx = await eas.attest({
    schema: schemaUID,
    data: {
      recipient: recipient || ethers.ZeroAddress,
      expirationTime: 0n,
      revocable,
      refUID: ethers.ZeroHash,  // use ethers.ZeroHash, not a manual 64-char string
      data: encoded,
      value: 0n,
    },
  });
  const receipt = await tx.wait();

  // Extract attestation UID from the Attested event
  const iface  = new ethers.Interface(EAS_ABI);
  const parsed = receipt.logs
    .map(log => { try { return iface.parseLog(log); } catch { return null; } })
    .find(e => e?.name === 'Attested');

  const attestationUID = parsed?.args?.uid;
  if (!attestationUID) throw new Error('Could not extract attestation UID — check EAS_ABI has the Attested event');

  console.log('Attestation UID:', attestationUID);
  return attestationUID;
}
```

---

### ❌ Schema string format errors

| ✅ Valid | ❌ Invalid | Reason |
|---|---|---|
| `string jobId, uint256 completedAt` | `string jobId;uint256 completedAt` | No semicolons |
| `uint256 score` | `uint score` | Must be `uint256` |
| `string name` | `String name` | Types are lowercase |
| `address agentAddress` | `address agentAddress,` | No trailing comma |

---

### 🔄 Check if a schema already exists before registering

Registering the same schema string twice costs gas and may fail. Always query first:

```javascript
async function findExistingSchema(schemaString) {
  const res = await fetch(
    'https://api.studio.thegraph.com/query/1715659/easy-attest/version/latest',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query { schemas(where: { schema: "${schemaString}" }) { id schema creator } }`,
      }),
    }
  );
  const { data } = await res.json();
  return data?.schemas?.[0]?.id ?? null; // returns schemaUID or null
}

// Usage:
const existing = await findExistingSchema('string jobId, uint256 completedAt, bool delivered');
const schemaUID = existing ?? await registerSchemaRaw('string jobId, uint256 completedAt, bool delivered');
```

---

### ✅ Verify attestation after creating it

Always confirm on-chain before reporting success:

```javascript
async function verifyAttestation(attestationUID) {
  const res = await fetch(
    'https://api.studio.thegraph.com/query/1715659/easy-attest/version/latest',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query { attestations(where: { id: "${attestationUID}" }) { id attester recipient revoked time } }`,
      }),
    }
  );
  const { data } = await res.json();
  const a = data?.attestations?.[0];
  if (!a) throw new Error('Attestation not found on subgraph yet — wait 30s and retry');
  if (a.revoked) throw new Error('Attestation exists but was revoked');
  console.log('✅ Valid attestation:', a);
  return a;
}
```


