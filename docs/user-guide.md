# Easy Attest User Guide

Welcome to Easy Attest! This guide will help you understand how to use the platform to create schemas, make attestations, and build your onchain reputation.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Understanding Attestations](#understanding-attestations)
3. [Creating Schemas](#creating-schemas)
4. [Making Attestations](#making-attestations)
5. [Managing Your Reputation](#managing-your-reputation)
6. [Farcaster Integration](#farcaster-integration)
7. [Best Practices](#best-practices)
8. [FAQ](#faq)

## Getting Started

### What You'll Need

- A Web3 wallet (Coinbase Wallet, MetaMask, WalletConnect, or Farcaster Wallet)
- A small amount of ETH on Base network for gas fees
- (Optional) A Farcaster account for social sharing

### First-Time Setup

1. **Install a Wallet**
   - **Mobile**: Use Farcaster (Warpcast) or Coinbase Wallet app
   - **Desktop**: Install Coinbase Wallet or MetaMask browser extension
   - Create a new wallet or import an existing one
   - Secure your seed phrase (never share it!)

2. **Get ETH on Base**
   - Bridge ETH from Ethereum mainnet using [Base Bridge](https://bridge.base.org/)
   - Or use a centralized exchange that supports Base withdrawals
   - For testnet: Use a Base Sepolia faucet

3. **Connect to Easy Attest**
   - Visit the Easy Attest application
   - **Farcaster Users**: The app will auto-connect to your Farcaster wallet
   - **Other Users**: Click "Connect Wallet" and select your preferred wallet
   - The app will prompt you to switch to Base network if needed

## Understanding Attestations

### What is an Attestation?

An attestation is a signed statement stored permanently on the blockchain. Think of it as a digital credential or endorsement that can't be faked or deleted.

**Key Properties:**
- **Permanent**: Once created, attestations exist forever on the blockchain
- **Verifiable**: Anyone can verify an attestation's authenticity
- **Portable**: Your attestations belong to you and work across applications
- **Transparent**: All attestations are public and auditable

### What is a Schema?

A schema is a template that defines what information an attestation contains. It's like a form structure that ensures consistency.

**Example Schema:**
```
Skill Endorsement Schema
- skill (string, required)
- proficiency (uint256, required)
- comment (string, optional)
```

**Anyone using this schema must provide:**
- The skill name (e.g., "Solidity Development")
- A proficiency level (e.g., 8 out of 10)
- An optional comment

## Creating Schemas

### When to Create a Schema

Create a new schema when:
- You need a specific attestation type that doesn't exist
- You're building a community reputation system
- You want to standardize endorsements in your organization
- You're creating a new credential type

### Schema Design Best Practices

**Keep It Simple**
- Start with 3-5 fields maximum
- Add more fields only if necessary
- Each field should have a clear purpose

**Choose Appropriate Data Types**
- `string`: Text data (names, descriptions, URLs)
- `uint256`: Numbers (scores, timestamps, quantities)
- `bool`: Yes/no values (verified, completed, active)
- `address`: Ethereum addresses (references to other users)
- `bytes32`: Fixed-size data (hashes, IDs)
- `bytes`: Variable-size data (encoded information)

**Mark Required Fields Carefully**
- Required fields must be filled in every attestation
- Optional fields provide flexibility
- Too many required fields make attestations harder to create

### Step-by-Step: Creating a Schema

**Example: Event Attendance Schema**

1. **Plan Your Schema**
   ```
   Event Attendance
   - eventName (string, required)
   - eventDate (uint256, required)
   - role (string, optional)
   - attended (bool, required)
   ```

2. **Open Schema Builder**
   - Navigate to "Create Schema"
   - You'll see an empty form

3. **Add Fields**
   - Click "Add Field"
   - Field 1: Name = "eventName", Type = "string", Required = ✓
   - Field 2: Name = "eventDate", Type = "uint256", Required = ✓
   - Field 3: Name = "role", Type = "string", Required = ✗
   - Field 4: Name = "attended", Type = "bool", Required = ✓

4. **Review Preview**
   - Check the generated schema string
   - Ensure field names are spelled correctly
   - Verify data types are appropriate

5. **Submit Transaction**
   - Click "Create Schema"
   - Your wallet will prompt for approval
   - Review gas fee (usually $0.01-0.10 on Base)
   - Confirm the transaction

6. **Save Your Schema UID**
   - Copy the Schema UID (starts with "0x")
   - Store it somewhere safe
   - Share it with people who should use this schema

### Schema Examples

**Professional Endorsement**
```
string skill, uint256 yearsExperience, uint256 rating, string testimonial
```

**Course Completion**
```
string courseName, string institution, uint256 completionDate, uint256 grade, bool certified
```

**Community Contribution**
```
string contributionType, string description, uint256 impactScore, string evidenceUrl
```

**Identity Verification**
```
string verificationType, bool verified, uint256 verificationDate, address verifier
```

## Making Attestations

### When to Make an Attestation

Make an attestation to:
- Endorse someone's skills or contributions
- Verify someone's participation in an event
- Confirm completion of a task or course
- Build someone's onchain reputation
- Create a verifiable credential

### Attestation Best Practices

**Be Accurate**
- Only attest to things you can verify
- Provide honest assessments
- Include evidence when possible

**Be Specific**
- Use precise language in text fields
- Provide concrete examples
- Include relevant context

**Consider Privacy**
- Remember: attestations are public and permanent
- Don't include sensitive personal information
- Be respectful in your comments

### Step-by-Step: Making an Attestation

**Example: Endorsing a Developer's Skills**

1. **Select Schema**
   - Navigate to "Create Attestation"
   - Enter the Schema UID or browse available schemas
   - Select "Skill Endorsement" schema

2. **Enter Recipient**
   - Input the recipient's Ethereum address
   - Or enter their ENS name (e.g., "alice.eth")
   - Or enter their Farcaster username
   - The app will resolve and display their name

3. **Fill in Data**
   - Skill: "Smart Contract Development"
   - Proficiency: 9
   - Comment: "Alice built an excellent DeFi protocol with clean, secure code"

4. **Review Information**
   - Double-check the recipient address
   - Verify all data is correct
   - Remember: this is permanent!

5. **Submit Transaction**
   - Click "Create Attestation"
   - Approve in your wallet
   - Wait for confirmation (2-5 seconds)

6. **Share or Save**
   - Copy the Attestation UID
   - Share to Farcaster if desired
   - View on block explorer to verify

### Attestation Tips

**For Recipients**
- Confirm the address before submitting
- Use ENS names to avoid errors
- Consider notifying the recipient

**For Data Quality**
- Use consistent formats (dates, scores, etc.)
- Follow schema conventions
- Provide meaningful comments

**For Gas Optimization**
- Batch multiple attestations if possible
- Create during low-traffic times
- Use Base network for lower fees

## Managing Your Reputation

### Using the Dashboard

Your dashboard is your reputation hub:

**Attestations Received**
- Shows what others have said about you
- Your onchain credentials and endorsements
- Proof of your skills and contributions

**Attestations Given**
- Shows attestations you've created
- Your endorsement history
- Demonstrates your community involvement

### Filtering and Organizing

**By Schema Type**
- Filter to see specific types of attestations
- Example: Show only "Skill Endorsements"
- Helps organize different credential types

**By Date**
- Sort by newest or oldest
- Track your reputation growth over time
- Find specific attestations quickly

**By Search**
- Search attestation content
- Find specific skills or keywords
- Locate attestations from specific people

### Sharing Your Reputation

**Direct Links**
- Share your dashboard URL
- Link to specific attestations
- Include in your portfolio or resume

**Farcaster Integration**
- Share attestations in your Farcaster feed
- Build reputation in social context
- Engage with your community

**Block Explorer**
- Verify attestations onchain
- Prove authenticity to skeptics
- Show technical users the raw data

## Farcaster Integration

### Why Use Farcaster Frames?

Farcaster Frames make attestations social:
- Share in your feed without leaving Farcaster
- Interactive cards that others can click
- Seamless integration with social context
- Increased visibility for your schemas and attestations

### Sharing Schemas

**When to Share a Schema**
- You created a useful schema others should use
- You want to standardize attestations in your community
- You're launching a reputation system

**How It Works**
1. Create your schema
2. Click "Share to Farcaster"
3. The Frame appears in your feed
4. Others click "Use This Schema"
5. They're directed to Easy Attest with schema pre-loaded
6. They can immediately create attestations

### Sharing Attestations

**When to Share an Attestation**
- You want to publicly recognize someone
- You're building your endorsement history
- You want to showcase your community involvement

**How It Works**
1. Create your attestation
2. Click "Share to Farcaster"
3. The Frame shows attestation summary
4. Others can view details
5. Increases visibility of the recipient's reputation

### Frame Best Practices

**For Schemas**
- Share schemas you want others to use
- Include a clear description
- Explain the use case in your cast

**For Attestations**
- Tag the recipient in your cast
- Explain why you're making the attestation
- Encourage others to attest as well

## Best Practices

### Security

**Protect Your Wallet**
- Never share your seed phrase
- Use hardware wallets for large amounts
- Verify transaction details before signing
- Be cautious of phishing attempts

**Verify Before Attesting**
- Only attest to things you can verify
- Check recipient addresses carefully
- Review all data before submitting

### Community Guidelines

**Be Honest**
- Provide accurate information
- Don't inflate scores or ratings
- Be fair in your assessments

**Be Respectful**
- Use professional language
- Avoid personal attacks
- Focus on facts and evidence

**Be Constructive**
- Provide helpful feedback
- Include specific examples
- Help others improve

### Technical Tips

**Gas Optimization**
- Create attestations during off-peak hours
- Use Base network for lower fees
- Consider batching if creating many attestations

**Data Management**
- Keep records of your Schema UIDs
- Document your attestation strategy
- Organize attestations by purpose

**Integration**
- Use attestations across multiple apps
- Build on existing schemas when possible
- Contribute to community standards

## FAQ

### General Questions

**Q: Are attestations free?**
A: You pay only gas fees (usually $0.01-0.10 on Base). There are no platform fees.

**Q: Can I delete an attestation?**
A: No. Attestations are permanent on the blockchain. Some schemas support revocation, but the original attestation remains visible.

**Q: Who can see my attestations?**
A: Everyone. All attestations are public on the blockchain.

**Q: Do I need cryptocurrency?**
A: Yes, you need a small amount of ETH on Base network for gas fees.

### Schema Questions

**Q: How do I find existing schemas?**
A: Browse the schema list or search by name. You can also enter a Schema UID directly.

**Q: Can I edit a schema after creating it?**
A: No. Schemas are immutable. Create a new schema if you need changes.

**Q: How much does it cost to create a schema?**
A: Just the gas fee, typically $0.01-0.10 on Base.

### Attestation Questions

**Q: Can I attest to myself?**
A: Technically yes, but self-attestations have less credibility.

**Q: How long do attestations take?**
A: Usually 2-5 seconds on Base network.

**Q: Can I attest to multiple people at once?**
A: You need to create separate attestations for each recipient.

**Q: What if I make a mistake?**
A: Attestations are permanent. Double-check before submitting. You can create a new attestation to clarify or correct.

### Technical Questions

**Q: What blockchain is this on?**
A: Base network (Ethereum Layer 2).

**Q: Can I use this on other chains?**
A: Currently only Base. Other chains may be supported in the future.

**Q: Is my data stored on IPFS?**
A: No. All data is stored directly on the Base blockchain.

**Q: Can I access attestations programmatically?**
A: Yes. Use the EAS SDK or query The Graph subgraph.

### Troubleshooting

**Q: My transaction failed. What do I do?**
A: Check the error message. Common issues: insufficient gas, wrong network, or user rejection. Try again or contact support.

**Q: Names aren't resolving. Why?**
A: ENS/Farcaster resolution may be slow or unavailable. The address will still work.

**Q: The dashboard isn't loading. Help!**
A: Try refreshing. If the issue persists, the indexer may be syncing. Wait 30 seconds and try again.

**Q: I can't connect my wallet.**
A: Ensure your wallet is installed, unlocked, and on Base network. Try refreshing the page.

## Getting Help

**Documentation**
- [Technical Docs](/docs) - Developer documentation
- [Glossary](/glossary) - Term definitions
- [EAS Documentation](https://docs.attest.sh/) - Protocol details

**Support**
- Check error messages for guidance
- Review this user guide
- Visit the project repository for issues
- Ask in community channels

**Community**
- Share your schemas and attestations
- Learn from others' use cases
- Contribute to best practices
- Help newcomers get started

---

**Ready to get started?** Connect your wallet and create your first schema!
