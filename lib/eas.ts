import type { Signer, Provider } from 'ethers';
import { BrowserProvider, JsonRpcProvider } from 'ethers';
import { EAS, SchemaRegistry, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import type { WalletClient, PublicClient } from 'viem';
import { getCachedSchema, setCachedSchema, type SchemaCacheData } from './cache';

// EAS contract addresses on Base
export const EAS_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_EAS_CONTRACT_ADDRESS ||
  '0x4200000000000000000000000000000000000021';

export const SCHEMA_REGISTRY_ADDRESS =
  process.env.NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS ||
  '0x4200000000000000000000000000000000000020';

// Convert WalletClient to ethers Signer
export async function walletClientToSigner(walletClient: WalletClient): Promise<Signer> {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain!.id,
    name: chain!.name,
    ensAddress: chain!.contracts?.ensRegistry?.address,
  };
  const provider = new BrowserProvider(transport, network);
  return await provider.getSigner(account!.address);
}

// Convert PublicClient to ethers Provider
export function publicClientToProvider(publicClient: PublicClient): Provider {
  const { chain, transport } = publicClient;
  const network = {
    chainId: chain!.id,
    name: chain!.name,
    ensAddress: chain!.contracts?.ensRegistry?.address,
  };
  if (transport.type === 'fallback') {
    return new JsonRpcProvider(transport.transports[0].value.url, network);
  }
  return new JsonRpcProvider(transport.url as string, network);
}

// Initialize EAS SDK instances
export function getEAS(signerOrProvider: Signer | Provider) {
  const eas = new EAS(EAS_CONTRACT_ADDRESS);
  eas.connect(signerOrProvider);
  return eas;
}

export function getSchemaRegistry(signerOrProvider: Signer | Provider) {
  const schemaRegistry = new SchemaRegistry(SCHEMA_REGISTRY_ADDRESS);
  schemaRegistry.connect(signerOrProvider);
  return schemaRegistry;
}

// Schema field type definition
export interface SchemaField {
  name: string;
  type: 'string' | 'uint256' | 'bool' | 'address' | 'bytes32' | 'bytes';
  required: boolean;
}

// Generate schema string from fields
export function generateSchemaString(fields: SchemaField[]): string {
  return fields.map((field) => `${field.type} ${field.name}`).join(', ');
}

// Register a new schema
export async function registerSchema(
  signer: Signer,
  fields: SchemaField[],
  revocable: boolean = true
): Promise<{ schemaUID: string; txHash: string }> {
  try {
    const schemaRegistry = getSchemaRegistry(signer);
    const schemaString = generateSchemaString(fields);

    const transaction = await schemaRegistry.register({
      schema: schemaString,
      resolverAddress: '0x0000000000000000000000000000000000000000', // No resolver
      revocable,
    });

    // Wait returns the transaction UID directly
    const schemaUID = await transaction.wait();

    if (!schemaUID) {
      throw new Error('Schema UID not available');
    }

    return {
      schemaUID,
      txHash: (transaction as any).tx?.hash || '',
    };
  } catch (error) {
    throw handleTransactionError(error);
  }
}

// Attestation data type
export interface AttestationData {
  schemaUID: string;
  recipient: string;
  data: Record<string, any>;
  expirationTime?: number;
  revocable?: boolean;
  refUID?: string;
}

// Create an attestation
export async function createAttestation(
  signer: Signer,
  attestationData: AttestationData,
  schemaString: string
): Promise<{ attestationUID: string; txHash: string }> {
  try {
    const eas = getEAS(signer);

    // Encode the attestation data using the schema string
    const encodedData = encodeAttestationData(
      attestationData.data,
      schemaString
    );

    const transaction = await eas.attest({
      schema: attestationData.schemaUID,
      data: {
        recipient: attestationData.recipient,
        expirationTime: BigInt(attestationData.expirationTime || 0),
        revocable: attestationData.revocable ?? true,
        refUID: attestationData.refUID || '0x0000000000000000000000000000000000000000000000000000000000000000',
        data: encodedData,
        value: BigInt(0),
      },
    });

    // Capture hash immediately if possible
    // Note: EAS SDK returns a ContractTransactionResponse which wraps the provider response
    const txResponse = transaction as any;
    let txHash = txResponse.hash || txResponse.tx?.hash || '';

    // Wait returns the attestation UID directly
    const attestationUID = await transaction.wait();

    if (!attestationUID) {
      throw new Error('Attestation UID not available');
    }

    // Ensure we have the hash from the receipt if it wasn't available initially
    if (!txHash) {
      const receipt = txResponse.receipt || (await txResponse.wait());
      txHash = receipt?.hash || receipt?.transactionHash || '';
    }

    return {
      attestationUID,
      txHash,
    };
  } catch (error) {
    throw handleTransactionError(error);
  }
}

// Encode attestation request for Smart Wallet / Paymaster
export async function encodeAttestationRequest(
  attestationData: AttestationData,
  schemaString: string
): Promise<{ to: string; data: string; value: bigint }> {
  const encodedData = encodeAttestationData(
    attestationData.data,
    schemaString
  );

  const request = {
    schema: attestationData.schemaUID,
    data: {
      recipient: attestationData.recipient,
      expirationTime: BigInt(attestationData.expirationTime || 0),
      revocable: attestationData.revocable ?? true,
      refUID: attestationData.refUID || '0x0000000000000000000000000000000000000000000000000000000000000000',
      data: encodedData,
      value: BigInt(0),
    },
  };

  // We need to encode the function call 'attest' on the EAS contract
  // Since we don't have the contract instance with a provider here easily for static encoding,
  // we can use the EAS SDK's contract interface or manually encode it if needed.
  // However, the EAS SDK doesn't easily expose the raw calldata without a signer.
  // A workaround is to use ethers Interface.

  const { Interface } = await import('ethers');
  const easAbi = [
    "function attest((bytes32 schema, (address recipient, uint64 expirationTime, bool revocable, bytes32 refUID, bytes data, uint256 value) data)) external payable returns (bytes32)"
  ];
  const iface = new Interface(easAbi);

  const calldata = iface.encodeFunctionData("attest", [{
    schema: request.schema,
    data: request.data
  }]);

  return {
    to: EAS_CONTRACT_ADDRESS,
    data: calldata,
    value: BigInt(0)
  };
}

// Encode attestation data based on schema
function encodeAttestationData(
  data: Record<string, any>,
  schemaString: string
): string {
  const encoder = new SchemaEncoder(schemaString);
  const schemaFields = parseSchemaString(schemaString);

  const encodedValues = schemaFields.map((field) => {
    const value = data[field.name];

    // Handle boolean values explicitly
    if (field.type === 'bool') {
      return {
        name: field.name,
        type: field.type,
        value: Boolean(value),
      };
    }

    // Handle bytes32 empty values
    if (field.type === 'bytes32') {
      if (value === '' || value === undefined || value === null) {
        return {
          name: field.name,
          type: field.type,
          value: '0x0000000000000000000000000000000000000000000000000000000000000000',
        };
      }
      // Auto-pad address to bytes32 if user inputs an address
      if (typeof value === 'string' && value.startsWith('0x') && value.length === 42) {
        // Pad left with zeros to make it 32 bytes (64 hex chars + 0x)
        // Address is 20 bytes (40 hex chars). We need 12 bytes (24 zeros) padding.
        // Actually standard padding for bytes32 is usually right-padded for strings or left-padded for numbers/addresses?
        // EAS expects bytes32. If it's an ID, it's usually just the bytes.
        // If we treat it as a number/address, we usually left-pad.
        return {
          name: field.name,
          type: field.type,
          value: '0x000000000000000000000000' + value.slice(2),
        };
      }
    }

    return {
      name: field.name,
      type: field.type,
      value: value,
    };
  });

  return encoder.encodeData(encodedValues);
}

// InferTypeFromValue is no longer needed but keeping it if used elsewhere, 
// though it seems it was only used here. I'll remove it to clean up.

// Get schema details from the registry
export async function getSchemaDetails(
  signerOrProvider: Signer | Provider,
  schemaUID: string
): Promise<{ schema: string; resolver: string; revocable: boolean } | null> {
  try {
    // Check cache first
    const cached = await getCachedSchema(schemaUID);
    if (cached) {
      return {
        schema: cached.schema,
        resolver: cached.resolver,
        revocable: cached.revocable,
      };
    }

    const schemaRegistry = getSchemaRegistry(signerOrProvider);
    const schemaRecord = await schemaRegistry.getSchema({ uid: schemaUID });

    if (!schemaRecord || !schemaRecord.schema) {
      return null;
    }

    // Cache the schema details
    const schemaData: SchemaCacheData = {
      schema: schemaRecord.schema,
      resolver: schemaRecord.resolver,
      revocable: schemaRecord.revocable,
      creator: '', // Not available from this call
      timestamp: Date.now(),
    };
    await setCachedSchema(schemaUID, schemaData);

    return {
      schema: schemaRecord.schema,
      resolver: schemaRecord.resolver,
      revocable: schemaRecord.revocable,
    };
  } catch (error) {
    console.error('Error fetching schema:', error);
    return null;
  }
}

// Parse schema string into fields
export function parseSchemaString(schemaString: string): SchemaField[] {
  if (!schemaString || schemaString.trim() === '') {
    return [];
  }

  const fields: SchemaField[] = [];
  const fieldParts = schemaString.split(',').map((f) => f.trim());

  for (const part of fieldParts) {
    const match = part.match(/^(\w+)\s+(\w+)$/);
    if (match) {
      const [, type, name] = match;
      fields.push({
        type: type as SchemaField['type'],
        name,
        required: true, // EAS doesn't distinguish required/optional in schema string
      });
    }
  }

  return fields;
}

// Prefetch common schemas for performance
export async function prefetchCommonSchemas(
  signerOrProvider: Signer | Provider,
  schemaUIDs: string[]
): Promise<void> {
  try {
    // Fetch schemas in parallel
    await Promise.all(
      schemaUIDs.map(async (uid) => {
        try {
          await getSchemaDetails(signerOrProvider, uid);
        } catch (error) {
          console.warn(`Failed to prefetch schema ${uid}:`, error);
        }
      })
    );
  } catch (error) {
    console.error('Error prefetching schemas:', error);
  }
}

import { parseTransactionError } from './error-parser';

// Transaction error types
export class TransactionError extends Error {
  code: string;
  details?: string;
  action?: {
    label: string;
    url?: string;
  };

  constructor(message: string, code: string, details?: string, action?: { label: string; url?: string }) {
    super(message);
    this.name = 'TransactionError';
    this.code = code;
    this.details = details;
    this.action = action;
  }
}

// Handle transaction errors
export function handleTransactionError(error: any): TransactionError {
  const parsed = parseTransactionError(error);
  return new TransactionError(
    parsed.message,
    parsed.code,
    parsed.details,
    parsed.action
  );
}
