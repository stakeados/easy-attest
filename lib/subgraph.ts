import { type Address } from 'viem';

const SUBGRAPH_URL =
  process.env.NEXT_PUBLIC_SUBGRAPH_URL ||
  // Default to the official Easy Attest public subgraph (Mainnet)
  // Users can override this with their own API key in .env.local
  'https://api.studio.thegraph.com/query/1715659/easy-attest/version/latest';

console.log('[Subgraph] Configured URL:', SUBGRAPH_URL);

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

// Query attestations received by an address
export async function queryAttestationsReceived(
  recipient: Address,
  options?: {
    schemaUID?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: 'date-desc' | 'date-asc';
    first?: number;
    skip?: number;
  }
): Promise<SubgraphAttestation[]> {
  const { schemaUID, startDate, endDate, sortBy = 'date-desc', first = 100, skip = 0 } = options || {};

  if (!isConfigured) {
    throw new Error('Subgraph URL is not configured. Please set NEXT_PUBLIC_SUBGRAPH_URL.');
  }

  // Build where clause
  const whereConditions: string[] = [`recipient: "${recipient.toLowerCase()}"`];

  if (schemaUID) {
    whereConditions.push(`schema: "${schemaUID.toLowerCase()}"`);
  }

  if (startDate) {
    const timestamp = Math.floor(new Date(startDate).getTime() / 1000);
    whereConditions.push(`time_gte: "${timestamp}"`);
  }

  if (endDate) {
    const timestamp = Math.floor(new Date(endDate).getTime() / 1000);
    whereConditions.push(`time_lte: "${timestamp}"`);
  }

  const whereClause = whereConditions.length > 0 ? `where: { ${whereConditions.join(', ')} }` : '';
  const orderDirection = sortBy === 'date-desc' ? 'desc' : 'asc';

  const query = `
    query {
      attestations(
        ${whereClause}
        orderBy: time
        orderDirection: ${orderDirection}
        first: ${first}
        skip: ${skip}
      ) {
        id

        attester
        recipient
        time
        data
        txHash
        revoked
      }
    }
  `;

  console.log(`Fetching received attestations from: ${SUBGRAPH_URL} for recipient: ${recipient}`);

  const response = await fetch(SUBGRAPH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    console.error(`Subgraph request failed: ${response.status} ${response.statusText}`);
    throw new Error(`Subgraph request failed: ${response.statusText}`);
  }

  const result: GraphQLResponse<{ attestations: SubgraphAttestation[] }> = await response.json();

  if (result.errors) {
    console.warn(`GraphQL errors: ${result.errors.map((e) => e.message).join(', ')}`);
  }

  return result.data?.attestations || [];
}

// Query attestations given by an address
export async function queryAttestationsGiven(
  attester: Address,
  options?: {
    schemaUID?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: 'date-desc' | 'date-asc';
    first?: number;
    skip?: number;
  }
): Promise<SubgraphAttestation[]> {
  const { schemaUID, startDate, endDate, sortBy = 'date-desc', first = 100, skip = 0 } = options || {};

  if (!isConfigured) {
    throw new Error('Subgraph URL is not configured. Please set NEXT_PUBLIC_SUBGRAPH_URL.');
  }

  // Build where clause
  const whereConditions: string[] = [`attester: "${attester.toLowerCase()}"`];

  if (schemaUID) {
    whereConditions.push(`schema: "${schemaUID.toLowerCase()}"`);
  }

  if (startDate) {
    const timestamp = Math.floor(new Date(startDate).getTime() / 1000);
    whereConditions.push(`time_gte: "${timestamp}"`);
  }

  if (endDate) {
    const timestamp = Math.floor(new Date(endDate).getTime() / 1000);
    whereConditions.push(`time_lte: "${timestamp}"`);
  }

  const whereClause = whereConditions.length > 0 ? `where: { ${whereConditions.join(', ')} }` : '';
  const orderDirection = sortBy === 'date-desc' ? 'desc' : 'asc';

  const query = `
    query {
      attestations(
        ${whereClause}
        orderBy: time
        orderDirection: ${orderDirection}
        first: ${first}
        skip: ${skip}
      ) {
        id

        attester
        recipient
        time
        data
        txHash
        revoked
      }
    }
  `;

  console.log(`Fetching given attestations from: ${SUBGRAPH_URL} for attester: ${attester}`);

  const response = await fetch(SUBGRAPH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    console.error(`Subgraph request failed: ${response.status} ${response.statusText}`);
    throw new Error(`Subgraph request failed: ${response.statusText}`);
  }

  const result: GraphQLResponse<{ attestations: SubgraphAttestation[] }> = await response.json();

  if (result.errors) {
    console.warn(`GraphQL errors: ${result.errors.map((e) => e.message).join(', ')}`);
  }

  return result.data?.attestations || [];
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

  console.log(`[Subgraph] querySchemas called with URL: ${SUBGRAPH_URL}`);

  // Build where clause
  const whereConditions: string[] = [];

  if (startDate) {
    const timestamp = Math.floor(new Date(startDate).getTime() / 1000);
    whereConditions.push(`timestamp_gte: "${timestamp}"`);
  }

  if (endDate) {
    const timestamp = Math.floor(new Date(endDate).getTime() / 1000);
    whereConditions.push(`timestamp_lte: "${timestamp}"`);
  }

  if (minAttestations !== undefined) {
    whereConditions.push(`attestationCount_gte: ${minAttestations}`);
  }

  const whereClause = whereConditions.length > 0 ? `where: { ${whereConditions.join(', ')} }` : '';

  const query = `
    query {
      schemas(
        ${whereClause}
        orderBy: ${orderBy}
        orderDirection: ${orderDirection}
        first: ${first}
        skip: ${skip}
      ) {
        id
        schema
        creator
        attestationCount
        timestamp
      }
    }
  `;

  const response = await fetch(SUBGRAPH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`Subgraph request failed: ${response.statusText}`);
  }

  const result: GraphQLResponse<{ schemas: SubgraphSchema[] }> = await response.json();

  if (result.errors) {
    throw new Error(`GraphQL errors: ${result.errors.map((e) => e.message).join(', ')}`);
  }

  return result.data?.schemas || [];
}
