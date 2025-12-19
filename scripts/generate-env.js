const fs = require('fs');
const path = require('path');

// List of environment variables to expose to the browser
const envKeys = [
    'NEXT_PUBLIC_EAS_CONTRACT_ADDRESS',
    'NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS',
    'NEXT_PUBLIC_PAYMASTER_URL',
    'NEXT_PUBLIC_RPC_URL',
    'NEXT_PUBLIC_RPC_URL_SEPOLIA',
    'NEXT_PUBLIC_WC_PROJECT_ID',
    'NEXT_PUBLIC_ONCHAINKIT_API_KEY',
    'NEXT_PUBLIC_SUBGRAPH_URL'
];

// Create object with current env values
const envConfig = {};
envKeys.forEach(key => {
    envConfig[key] = process.env[key] || '';
});

// Generate file content
// We assign it to window.ENV so client-side code can access it
const content = `window.ENV = ${JSON.stringify(envConfig)};`;

// Determine public directory path
// In Next.js (local), it's usually ./public
// In Docker standalone output, it might vary, but we usually run this from project root
const publicDir = path.join(__dirname, '..', 'public');

// Ensure directory exists
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Write file
const filePath = path.join(publicDir, 'env-config.js');
fs.writeFileSync(filePath, content);

console.log(`Generated ${filePath} with keys: ${Object.keys(envConfig).join(', ')}`);
