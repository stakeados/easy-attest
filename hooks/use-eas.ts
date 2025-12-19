'use client';

import { getEnv } from '@/lib/env';

import { useWalletClient, usePublicClient, useAccount } from 'wagmi';
import { useWriteContracts, useCapabilities } from 'wagmi/experimental';
import { useState, useCallback } from 'react';
import {
  walletClientToSigner,
  registerSchema,
  createAttestation,
  getSchemaDetails,
  parseSchemaString,
  type SchemaField,
  type AttestationData,
  type TransactionError,
} from '@/lib/eas';

export function useEAS() {
  const { data: walletClient } = useWalletClient();
  const { connector, address } = useAccount();
  const publicClient = usePublicClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<TransactionError | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const { writeContractsAsync } = useWriteContracts();
  const { data: availableCapabilities } = useCapabilities({
    account: walletClient?.account?.address,
  });

  const addLog = useCallback((msg: string) => {
    console.log(msg);
    setLogs(prev => [...prev, `${new Date().toISOString().split('T')[1].slice(0, 8)}: ${msg}`]);
  }, []);

  const handleRegisterSchema = useCallback(async (
    fields: SchemaField[],
    revocable: boolean = true
  ) => {
    if (!walletClient) {
      addLog('Error: Wallet not connected');
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);
    addLog(`Registering schema with ${fields.length} fields...`);

    try {
      const signer = await walletClientToSigner(walletClient);
      const result = await registerSchema(signer, fields, revocable);
      addLog('Schema registered successfully');
      return result;
    } catch (err) {
      const txError = err as TransactionError;
      setError(txError);
      addLog(`Error registering schema: ${err instanceof Error ? err.message : String(err)}`);
      throw txError;
    } finally {
      setIsLoading(false);
    }
  }, [walletClient, addLog]);

  const handleCreateAttestation = useCallback(async (
    attestationData: AttestationData,
    schemaString: string
  ) => {
    if (!walletClient) {
      addLog('Error: Wallet not connected');
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);
    addLog('Starting attestation creation...');

    try {
      // Check if wallet supports Paymaster (Coinbase Smart Wallet / etc)
      let capabilities;
      try {
        if (connector && address) {
          capabilities = await walletClient.getCapabilities({ account: address });
        }
      } catch (e) {
        // Many wallets (Rabby, MetaMask standard) do not support EIP-5792 capabilities yet.
        // We catch this error to avoid crashing and simply proceed without Paymaster for those wallets.
        console.warn('Wallet does not support getCapabilities (EIP-5792), skipping Paymaster check.', e);
      }

      const paymasterUrl = getEnv('NEXT_PUBLIC_PAYMASTER_URL');

      // Try to sponsor gas for any wallet that supports the Paymaster capability
      const canSponsor = (capabilities as any)?.paymasterService?.supported && paymasterUrl;


      // Detailed Env Var Diagnostics
      const hasPaymasterUrl = !!getEnv('NEXT_PUBLIC_PAYMASTER_URL');
      const hasRpcUrl = !!getEnv('NEXT_PUBLIC_RPC_URL');
      const hasProjectId = !!getEnv('NEXT_PUBLIC_WC_PROJECT_ID');

      const debugMsg = `Debug Info:
      - Connector: ${connector?.id} | Chain: ${walletClient.chain.id}
      - Paymaster URL Loaded: ${hasPaymasterUrl ? '✅ Yes' : '❌ NO'}
      - RPC URL Loaded: ${hasRpcUrl ? '✅ Yes' : '❌ NO'}
      - WC Project ID Loaded: ${hasProjectId ? '✅ Yes' : '❌ NO'}
      - Capabilities: ${!!capabilities}
      - Can Sponsor: ${canSponsor}`;

      addLog(debugMsg);

      if (canSponsor) {
        addLog('Attempting Sponsored Transaction (Paymaster)...');
        console.log('Using Paymaster for sponsored transaction...');
        const { encodeAttestationRequest } = await import('@/lib/eas');
        const txRequest = await encodeAttestationRequest(attestationData, schemaString);

        // We need to re-encode just the 'data' part (the bytes) for the ABI call
        const { Interface } = await import('ethers');
        const easAbi = [
          "function attest((bytes32 schema, (address recipient, uint64 expirationTime, bool revocable, bytes32 refUID, bytes data, uint256 value) data)) external payable returns (bytes32)"
        ];
        const iface = new Interface(easAbi);
        const decoded = iface.decodeFunctionData("attest", txRequest.data);

        addLog('Sending transaction via writeContractsAsync...');
        const id = await writeContractsAsync({
          contracts: [
            {
              address: txRequest.to as `0x${string}`,
              abi: [
                {
                  inputs: [
                    {
                      components: [
                        { name: "schema", type: "bytes32" },
                        {
                          components: [
                            { name: "recipient", type: "address" },
                            { name: "expirationTime", type: "uint64" },
                            { name: "revocable", type: "bool" },
                            { name: "refUID", type: "bytes32" },
                            { name: "data", type: "bytes" },
                            { name: "value", type: "uint256" }
                          ],
                          name: "data",
                          type: "tuple"
                        }
                      ],
                      name: "request",
                      type: "tuple"
                    }
                  ],
                  name: "attest",
                  outputs: [{ name: "", type: "bytes32" }],
                  stateMutability: "payable",
                  type: "function"
                }
              ],
              functionName: 'attest',
              args: [decoded[0]]
            }
          ],
          capabilities: {
            paymasterService: {
              url: paymasterUrl,
            },
          },
        });

        // Return a placeholder UID since we don't have it immediately from the tx hash
        // The UI should handle the success state based on the txHash
        let txHash = typeof id === 'string' ? id : (id as any).id;

        // Sanitize txHash: sometimes it returns packed data (TxHash + ChainID)
        // Standard TxHash is 32 bytes (66 chars with 0x prefix)
        if (typeof txHash === 'string' && txHash.length > 66) {
          console.log('Sanitizing Paymaster return value:', txHash);
          txHash = txHash.substring(0, 66);
        }

        // Return immediately for better UX - don't wait for receipt
        console.log('Transaction sent, returning immediately:', txHash);
        addLog(`Transaction sent: ${txHash}`);

        // We return an empty UID. The success screen handles this by showing "Pending" and the Tx Hash.
        const attestationUID = '0x0000000000000000000000000000000000000000000000000000000000000000';

        return { attestationUID, txHash };
      }

      // Fallback to standard EAS SDK (EOA)
      addLog('Fallback to standard EAS SDK (EOA)...');
      console.log('Fallback to standard EAS SDK...');
      const signer = await walletClientToSigner(walletClient);
      addLog('Signer created, calling createAttestation...');
      const result = await createAttestation(signer, attestationData, schemaString);
      addLog(`Attestation created: ${result.attestationUID}`);
      return result;

    } catch (err) {
      const txError = err as TransactionError;
      setError(txError);
      addLog(`Error: ${err instanceof Error ? err.message : String(err)}`);
      throw txError;
    } finally {
      setIsLoading(false);
    }
  }, [walletClient, availableCapabilities, writeContractsAsync, publicClient, connector, addLog]);

  const handleFetchSchema = useCallback(async (schemaUID: string): Promise<{ fields: SchemaField[], revocable: boolean } | null> => {
    try {
      addLog(`Fetching schema ${schemaUID}...`);
      // Always use a read-only Provider for fetching schema details to avoid Wallet latency/issues
      const { JsonRpcProvider } = await import('ethers');
      const rpcUrl = getEnv('NEXT_PUBLIC_RPC_URL') || 'https://mainnet.base.org';
      const provider = new JsonRpcProvider(rpcUrl);

      const schemaDetails = await getSchemaDetails(provider, schemaUID);

      if (!schemaDetails) {
        addLog('Schema not found');
        return null;
      }

      addLog('Schema fetched successfully');
      return {
        fields: parseSchemaString(schemaDetails.schema),
        revocable: schemaDetails.revocable
      };
    } catch (err) {
      console.error('Error fetching schema:', err);
      addLog(`Error fetching schema: ${err}`);
      return null;
    }
  }, [addLog]);

  return {
    registerSchema: handleRegisterSchema,
    createAttestation: handleCreateAttestation,
    fetchSchema: handleFetchSchema,
    isLoading,
    error,
    isReady: !!walletClient,
    logs, // Expose logs
  };
}
