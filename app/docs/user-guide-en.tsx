export function UserGuideEn() {
    return (
        <article className="prose prose-blue dark:prose-invert max-w-none">
            <h1>Easy Attest User Guide</h1>

            <p className="lead">
                Welcome to Easy Attest! This guide will help you understand how to use the platform to create schemas, make attestations, and build your onchain reputation.
            </p>

            <h2>Getting Started</h2>

            <h3>What You&apos;ll Need</h3>
            <ul>
                <li>A Web3 wallet (Coinbase Wallet, MetaMask, or WalletConnect-compatible)</li>
                <li>A small amount of ETH on Base network for gas fees</li>
                <li>(Optional) A Farcaster account for social sharing</li>
            </ul>

            <h3>First-Time Setup</h3>
            <ol>
                <li>
                    <strong>Install a Wallet</strong>
                    <p>Download Coinbase Wallet or MetaMask browser extension, create a new wallet or import an existing one, and secure your seed phrase.</p>
                </li>
                <li>
                    <strong>Get ETH on Base</strong>
                    <p>Bridge ETH from Ethereum mainnet using Base Bridge or use a centralized exchange that supports Base withdrawals.</p>
                </li>
                <li>
                    <strong>Connect to Easy Attest</strong>
                    <p>visit the Easy Attest application, click &quot;Connect Wallet&quot;, select your wallet and approve the connection.</p>
                </li>
            </ol>

            <h2>Understanding Attestations</h2>
            <p>
                An attestation is a signed statement stored permanently on the blockchain. Think of it as a digital credential or endorsement that can&apos;t be faked or deleted.
            </p>
            <ul>
                <li><strong>Permanent:</strong> Once created, attestations exist forever on the blockchain</li>
                <li><strong>Verifiable:</strong> Anyone can verify an attestation&apos;s authenticity</li>
                <li><strong>Portable:</strong> Your attestations belong to you and work across applications</li>
            </ul>

            <h2>Creating Schemas</h2>
            <p>
                A schema is a template that defines what information an attestation contains. It&apos;s like a form structure that ensures consistency.
            </p>

            <h3>Step-by-Step: Creating a Schema</h3>
            <ol>
                <li><strong>Plan Your Schema:</strong> Decide what fields you need (e.g., event name, date, role).</li>
                <li><strong>Open Schema Builder:</strong> Navigate to &quot;Create Schema&quot;.</li>
                <li><strong>Add Fields:</strong> Click &quot;Add Field&quot; and define the name, type, and whether it&apos;s required.</li>
                <li><strong>Review Preview:</strong> Check the generated schema string.</li>
                <li><strong>Submit Transaction:</strong> Click &quot;Create Schema&quot; and confirm in your wallet.</li>
            </ol>

            <h2>Making Attestations</h2>
            <p>
                Make an attestation to endorse someone&apos;s skills, verify participation, or confirm completion of a task.
            </p>

            <h3>Step-by-Step: Making an Attestation</h3>
            <ol>
                <li><strong>Select Schema:</strong> Navigate to &quot;Create Attestation&quot; and select a schema (or use a template).</li>
                <li><strong>Enter Recipient:</strong> Input the recipient&apos;s Ethereum address, ENS name, or Farcaster username.</li>
                <li><strong>Fill in Data:</strong> Enter the required information for the attestation.</li>
                <li><strong>Review Information:</strong> Double-check everything as attestations are permanent.</li>
                <li><strong>Submit Transaction:</strong> Click &quot;Create Attestation&quot; and approve in your wallet.</li>
            </ol>

            <h2>Managing Your Reputation</h2>
            <p>
                Your dashboard is your reputation hub. You can view attestations you&apos;ve received and given, filter by type or date, and share your reputation via direct links or Farcaster.
            </p>
        </article>
    );
}
