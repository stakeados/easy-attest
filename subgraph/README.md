# Easy Attest Subgraph

This subgraph indexes EAS (Ethereum Attestation Service) events on Base network.

## Setup

1. Install dependencies:
```bash
cd subgraph
npm install
```

2. Generate types:
```bash
npm run codegen
```

3. Build the subgraph:
```bash
npm run build
```

## Deployment

### The Graph Studio (Recommended)

1. Create a subgraph at https://thegraph.com/studio/
2. Get your deploy key
3. Authenticate:
```bash
graph auth --studio <DEPLOY_KEY>
```

4. Deploy:
```bash
npm run deploy
```

### Local Graph Node

1. Start a local Graph node (requires Docker)
2. Create the subgraph:
```bash
npm run create-local
```

3. Deploy locally:
```bash
npm run deploy-local
```

## Querying

After deployment, you can query the subgraph using GraphQL. Example queries:

### Get all schemas
```graphql
{
  schemas(first: 10, orderBy: timestamp, orderDirection: desc) {
    id
    schema
    creator
    attestationCount
    timestamp
  }
}
```

### Get attestations for a user
```graphql
{
  attestations(where: { recipient: "0x..." }) {
    id
    schema {
      id
      schema
    }
    attester
    recipient
    time
    data
  }
}
```

### Get attestations by a user
```graphql
{
  attestations(where: { attester: "0x..." }) {
    id
    schema {
      id
      schema
    }
    attester
    recipient
    time
    data
  }
}
```
