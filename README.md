# Easy Attest

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Base Network](https://img.shields.io/badge/Network-Base-blue)](https://base.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

A no-code decentralized application for creating and managing onchain attestations using the Ethereum Attestation Service (EAS) on Base network.

## Features

- **Schema Builder**: Create custom attestation schemas without code
- **Attestation Generator**: Generate attestations for others using existing schemas
- **User Dashboard**: View attestations received and given
- **AI Agent Integration**: EasyAttest as a skill for AI agents (SDK, GraphQL and SKILL.md support)
- **Mobile-First Design**: Optimized for mobile and desktop experiences

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Wagmi, Viem, Coinbase OnchainKit
- **Blockchain**: Base Network (Layer 2)
- **Attestations**: Ethereum Attestation Service (EAS)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Web3 wallet (Coinbase Wallet, MetaMask, or WalletConnect compatible)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy the environment variables:

```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your configuration (RPC URLs, API keys, etc.)

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:

```bash
npm run build
```

### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

## Environment Variables

See `.env.local.example` for required environment variables:

- `NEXT_PUBLIC_CHAIN_ID`: Base network chain ID (8453 for mainnet)
- `NEXT_PUBLIC_RPC_URL`: RPC endpoint for Base network
- `NEXT_PUBLIC_EAS_CONTRACT_ADDRESS`: EAS contract address on Base
- `NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS`: Schema Registry contract address
- `NEXT_PUBLIC_SUBGRAPH_URL`: The Graph subgraph URL for indexing

## Project Structure

```
├── app/                  # Next.js App Router pages
├── components/           # React components
├── lib/                  # Utility functions and configurations
├── hooks/                # Custom React hooks
├── contexts/             # React contexts
├── public/               # Static assets
├── subgraph/             # The Graph subgraph configuration
```

## Testing

Run tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

## Deployment

This project is tailored for deployment on modern VPS solutions using Docker.

### 🚀 Deploy on Dokploy (VPS)
For detailed instructions on how to deploy this application on your own VPS using Dokploy, please refer to the **[Dokploy Deployment Guide](./docs/deployment.md)**.

## AI Agents

EasyAttest is designed to be agent-friendly. AI agents can integrate EasyAttest as a skill using the provided [SKILL.md](./agents/SKILL.md) or via the EAS SDK.

For more details on integration methods (GraphQL, SDK, No-Code), visit the **[Agents Page](https://easyattest.xyz/agents)**.

## User Guides

📖 **[Complete User Guide](./docs/user-guide.md)** - Comprehensive guide covering all features in detail

### Quick Start: Creating Your First Schema

Schemas define the structure of attestations. Follow these steps to create a custom schema:

1. **Connect Your Wallet**
   - Click "Connect Wallet" in the top right
   - Select your preferred wallet (Coinbase Wallet, MetaMask, or WalletConnect)
   - Approve the connection request
   - Ensure you're connected to Base network (the app will prompt you to switch if needed)

2. **Navigate to Schema Builder**
   - Click "Create Schema" from the home page or navigation menu
   - You'll see the Schema Builder interface

3. **Define Your Schema Fields**
   - Click "Add Field" to add a new field to your schema
   - For each field, specify:
     - **Field Name**: A descriptive name (e.g., "skill", "score", "verified")
     - **Data Type**: Choose from string, uint256, bool, address, bytes32, or bytes
     - **Required**: Toggle whether this field must be filled in attestations
   - Add as many fields as needed for your use case
   - Remove fields by clicking the trash icon

4. **Preview Your Schema**
   - The schema preview shows the generated schema string
   - Example: `string skill, uint256 score, bool verified`

5. **Submit and Register**
   - Click "Create Schema" button
   - Review the transaction details in your wallet
   - Approve the transaction (you'll pay a small gas fee)
   - Wait for confirmation (usually 2-5 seconds on Base)

6. **Save Your Schema UID**
   - Once confirmed, you'll receive a unique Schema UID
   - Copy this UID - you'll need it to create attestations
   - Optionally share your schema as a Farcaster Frame

**Example Use Cases:**
- **Skill Endorsements**: `string skill, uint256 proficiency, string comment`
- **Event Attendance**: `string eventName, uint256 timestamp, bool attended`
- **Reputation Score**: `uint256 score, string category, string evidence`

### Making Attestations

Attestations are onchain statements made using a schema. Here's how to create one:

1. **Navigate to Attestation Generator**
   - Click "Create Attestation" from the home page
   - Or click "Use This Schema" from a schema detail page

2. **Select a Schema**
   - **Option A**: Enter a Schema UID directly if you know it
   - **Option B**: Click "Browse Schemas" to see available schemas
   - The schema fields will load and display

3. **Enter Recipient Address**
   - Input the Ethereum address of the person receiving the attestation
   - The app will automatically resolve ENS names or Farcaster usernames
   - Example: `0x1234...` or `vitalik.eth`

4. **Fill in Attestation Data**
   - Complete all required fields (marked with *)
   - Each field will have an appropriate input based on its type:
     - **String**: Text input
     - **Number (uint256)**: Numeric input
     - **Boolean**: Checkbox or toggle
     - **Address**: Ethereum address input with validation

5. **Review and Submit**
   - Double-check all information
   - Click "Create Attestation"
   - Approve the transaction in your wallet
   - Wait for confirmation

6. **Share Your Attestation**
   - Copy the Attestation UID for reference
   - Click "Share to Farcaster" to post as a Frame
   - View the attestation on a block explorer via the provided link

**Tips:**
- Attestations are permanent and public on the blockchain
- Make sure the recipient address is correct before submitting
- You can view all your created attestations in the Dashboard

### Using the Dashboard

Your dashboard shows all attestations related to your address:

1. **Access Your Dashboard**
   - Connect your wallet
   - Click "Dashboard" in the navigation

2. **View Attestations**
   - **Attestations Received**: Attestations others have made about you
   - **Attestations Given**: Attestations you've created for others
   - Switch between tabs to see different views

3. **Filter and Sort**
   - Use the filter dropdown to narrow by schema type
   - Sort by date (newest first or oldest first)
   - Search by schema name or attestation content

4. **Explore Attestation Details**
   - Each card shows:
     - Schema name and fields
     - Attester and recipient (with resolved names)
     - Timestamp
     - Link to view on block explorer
   - Click on addresses to see their profiles
   - Click the block explorer link to verify onchain


### Troubleshooting

**Wallet Connection Issues**
- Ensure you have a Web3 wallet installed
- Try refreshing the page and reconnecting
- Check that you're on the Base network
- Clear browser cache if connection persists

**Transaction Failures**
- **Insufficient Funds**: You need ETH on Base for gas fees. Use the Base bridge or a faucet for testnet
- **User Rejected**: You cancelled the transaction. Try again when ready
- **Network Error**: Check your internet connection and RPC endpoint
- **Transaction Timeout**: Base network may be congested. Wait and retry

**Schema Not Loading**
- Verify the Schema UID is correct (64-character hex string)
- Check that the schema exists on Base network
- Try refreshing the page
- The schema may still be indexing (wait 30 seconds)

**Name Resolution Not Working**
- ENS names must be registered and properly configured
- Farcaster names require an active Farcaster account
- If resolution fails, the truncated address will display
- This doesn't affect functionality, only display

**Need Help?**
- Check the [Glossary](/glossary) for term definitions
- Review technical documentation in the `/docs` folder
- Visit [EAS Documentation](https://docs.attest.sh/) for protocol details
- Check [Base Network Status](https://status.base.org/) for network issues

## Technical Documentation

- [Web3 Infrastructure](./docs/web3-infrastructure.md) - Wallet connection and network setup
- [Transaction Feedback System](./docs/transaction-feedback-system.md) - Transaction state management
- [Dashboard Feature](./docs/dashboard-feature.md) - Dashboard implementation details
- [Accessibility Guide](./docs/accessibility.md) - Accessibility features and testing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT
