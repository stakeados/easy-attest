import { type Address } from 'viem';

const SUBGRAPH_URL =
  process.env.NEXT_PUBLIC_SUBGRAPH_URL ||
  // Default to the official Easy Attest public subgraph (Mainnet)
  // Users can override this with their own API key in .env.local
  'https://api.studio.thegraph.com/query/1715659/easy-attest/version/latest';

const isConfigured = !!SUBGRAPH_URL && !SUBGRAPH_URL.includes('your-subgraph');

export interface SubgraphAttestation {
  id: string;
  schema?: {
    id: string;
    schema: string;
  };
  attester: string;
  recipient: string;
  time: string;
  data: string;
  txHash: string;
  revoked: boolean;
}

export interface SubgraphSchema {
  id: string;
  schema: string;
  creator: string;
  attestationCount: number;
  timestamp: string;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

interface AttestationQueryOptions {
  schemaUID?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'date-desc' | 'date-asc';
  first?: number;
  skip?: number;
}

// Execute a GraphQL query against the subgraph using parameterized variables.
// Passing values as `variables` (instead of interpolating them into the query
// string) avoids GraphQL injection and keeps the query shape cacheable.
async function executeQuery<T>(
  query: string,
  variables: Record<string, unknown>
): Promise<T> {
  if (!isConfigured) {
    throw new Error('Subgraph URL is not configured. Please set NEXT_PUBLIC_SUBGRAPH_URL.');
  }

  const response = await fetch(SUBGRAPH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Subgraph request failed: ${response.statusText}`);
  }

  const result: GraphQLResponse<T> = await response.json();

  if (result.errors) {
    throw new Error(`GraphQL errors: ${result.errors.map((e) => e.message).join(', ')}`);
  }

  return result.data as T;
}

const ATTESTATION_FIELDS = `
  id
  attester
  recipient
  time
  data
  txHash
  revoked
`;

// Shared query for attestations filtered by either recipient or attester.
async function queryAttestationsBy(
  role: 'recipient' | 'attester',
  address: Address,
  options?: AttestationQueryOptions
): Promise<SubgraphAttestation[]> {
  const { schemaUID, startDate, endDate, sortBy = 'date-desc', first = 100, skip = 0 } = options || {};

  const where: Record<string, unknown> = {
    [role]: address.toLowerCase(),
  };

  if (schemaUID) {
    where.schema = schemaUID.toLowerCase();
  }
  if (startDate) {
    where.time_gte = String(Math.floor(new Date(startDate).getTime() / 1000));
  }
  if (endDate) {
    where.time_lte = String(Math.floor(new Date(endDate).getTime() / 1000));
  }

  const query = `
    query Attestations($where: Attestation_filter, $orderDirection: OrderDirection, $first: Int, $skip: Int) {
      attestations(
        where: $where
        orderBy: time
        orderDirection: $orderDirection
        first: $first
        skip: $skip
      ) {
        ${ATTESTATION_FIELDS}
      }
    }
  `;

  const data = await executeQuery<{ attestations: SubgraphAttestation[] }>(query, {
    where,
    orderDirection: sortBy === 'date-desc' ? 'desc' : 'asc',
    first,
    skip,
  });

  return data?.attestations || [];
}

// Query attestations received by an address
export function queryAttestationsReceived(
  recipient: Address,
  options?: AttestationQueryOptions
): Promise<SubgraphAttestation[]> {
  return queryAttestationsBy('recipient', recipient, options);
}

// Query attestations given by an address
export function queryAttestationsGiven(
  attester: Address,
  options?: AttestationQueryOptions
): Promise<SubgraphAttestation[]> {
  return queryAttestationsBy('attester', attester, options);
}

// Query all schemas
export async function querySchemas(
  options?: {
    first?: number;
    skip?: number;
    startDate?: string;
    endDate?: string;
    minAttestations?: number;
    orderBy?: 'timestamp' | 'attestationCount';
    orderDirection?: 'asc' | 'desc';
  }
): Promise<SubgraphSchema[]> {
  const {
    first = 100,
    skip = 0,
    startDate,
    endDate,
    minAttestations,
    orderBy = 'timestamp',
    orderDirection = 'desc',
  } = options || {};

  const where: Record<string, unknown> = {};

  if (startDate) {
    where.timestamp_gte = String(Math.floor(new Date(startDate).getTime() / 1000));
  }
  if (endDate) {
    where.timestamp_lte = String(Math.floor(new Date(endDate).getTime() / 1000));
  }
  if (minAttestations !== undefined) {
    where.attestationCount_gte = minAttestations;
  }

  const query = `
    query Schemas($where: Schema_filter, $orderBy: Schema_orderBy, $orderDirection: OrderDirection, $first: Int, $skip: Int) {
      schemas(
        where: $where
        orderBy: $orderBy
        orderDirection: $orderDirection
        first: $first
        skip: $skip
      ) {
        id
        schema
        creator
        attestationCount
        timestamp
      }
    }
  `;

  const data = await executeQuery<{ schemas: SubgraphSchema[] }>(query, {
    where,
    orderBy,
    orderDirection,
    first,
    skip,
  });

  return data?.schemas || [];
}
