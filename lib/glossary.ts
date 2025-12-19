/**
 * Glossary of technical terms used in Easy Attest
 * Provides user-friendly definitions for blockchain and attestation concepts
 */

export interface GlossaryTerm {
  term: string;
  definition: string;
  learnMoreUrl?: string;
}

// Glossary terms with translations
const glossaryTerms = {
  en: {
    'schema-uid': {
      term: 'Schema UID',
      definition: 'A unique identifier (like a fingerprint) for your attestation schema. This 66-character code starting with "0x" is generated when you register a schema and can be shared with others.',
      learnMoreUrl: 'https://docs.attest.sh/docs/core--concepts/schemas',
    },
    'attestation-uid': {
      term: 'Attestation UID',
      definition: 'A unique identifier for a specific attestation. This proves that a particular attestation exists on the blockchain and can be used to verify or share it.',
      learnMoreUrl: 'https://docs.attest.sh/docs/core--concepts/attestations',
    },
    'gas-fee': {
      term: 'Gas Fee',
      definition: 'A small transaction fee paid in ETH to process your transaction on the Base network. Think of it like a postage stamp for sending blockchain transactions.',
      learnMoreUrl: 'https://ethereum.org/developers/docs/gas/',
    },
    'base-network': {
      term: 'Base Network',
      definition: 'A Layer 2 blockchain built by Coinbase that offers fast and low-cost transactions. It\'s where your attestations are stored permanently.',
      learnMoreUrl: 'https://base.org',
    },
    'wallet': {
      term: 'Wallet',
      definition: 'A digital wallet (like Coinbase Wallet or MetaMask) that holds your cryptocurrency and allows you to interact with blockchain applications.',
    },
    'ethereum-address': {
      term: 'Ethereum Address',
      definition: 'A unique identifier for a wallet or account on the blockchain. It looks like "0x" followed by 40 characters (letters and numbers).',
    },
    'ens-name': {
      term: 'ENS Name',
      definition: 'Ethereum Name Service - a human-readable name (like "alice.eth") that represents an Ethereum address, making it easier to remember and share.',
      learnMoreUrl: 'https://ens.domains',
    },
    'revocable': {
      term: 'Revocable',
      definition: 'When enabled, attestations using this schema can be cancelled or revoked by the person who created them. Non-revocable attestations are permanent.',
    },
    'attester': {
      term: 'Attester',
      definition: 'The person or entity who creates an attestation. This is the wallet address that vouches for or verifies information about someone else.',
    },
    'recipient': {
      term: 'Recipient',
      definition: 'The person or entity that an attestation is about. This is the wallet address receiving the attestation.',
    },
    'schema': {
      term: 'Schema',
      definition: 'A template that defines what information an attestation contains. Like a form with specific fields (name, score, etc.) that must be filled out.',
      learnMoreUrl: 'https://docs.attest.sh/docs/core--concepts/schemas',
    },
    'onchain': {
      term: 'Onchain',
      definition: 'Stored permanently on the blockchain, making it publicly verifiable and tamper-proof. Onchain data cannot be deleted or modified.',
    },
    'transaction-hash': {
      term: 'Transaction Hash',
      definition: 'A unique code that identifies your blockchain transaction. You can use it to look up your transaction on a block explorer.',
    },
    'block-explorer': {
      term: 'Block Explorer',
      definition: 'A website (like Basescan) that lets you view and verify blockchain transactions, addresses, and other onchain data.',
      learnMoreUrl: 'https://basescan.org',
    },
    'farcaster-frame': {
      term: 'Farcaster Frame',
      definition: 'An interactive component that can be shared on Farcaster (a decentralized social network), allowing others to view or interact with your attestations directly in their feed.',
      learnMoreUrl: 'https://docs.farcaster.xyz/learn/what-is-farcaster/frames',
    },
  },
  es: {
    'schema-uid': {
      term: 'UID del Schema',
      definition: 'Un identificador único (como una huella digital) para tu schema de attestation. Este código de 66 caracteres que comienza con "0x" se genera cuando registras un schema y puede compartirse con otros.',
      learnMoreUrl: 'https://docs.attest.sh/docs/core--concepts/schemas',
    },
    'attestation-uid': {
      term: 'UID del Attestation',
      definition: 'Un identificador único para un attestation específico. Esto prueba que un attestation particular existe en la blockchain y puede usarse para verificarlo o compartirlo.',
      learnMoreUrl: 'https://docs.attest.sh/docs/core--concepts/attestations',
    },
    'gas-fee': {
      term: 'Tarifa de Gas',
      definition: 'Una pequeña tarifa de transacción pagada en ETH para procesar tu transacción en la red Base. Piensa en ello como un sello postal para enviar transacciones blockchain.',
      learnMoreUrl: 'https://docs.base.org/base-learn/docs/gas-fees/',
    },
    'base-network': {
      term: 'Red Base',
      definition: 'Una blockchain de Capa 2 construida por Coinbase que ofrece transacciones rápidas y de bajo costo. Es donde tus attestations se almacenan permanentemente.',
      learnMoreUrl: 'https://base.org',
    },
    'wallet': {
      term: 'Wallet',
      definition: 'Una billetera digital (como Coinbase Wallet o MetaMask) que guarda tu criptomoneda y te permite interactuar con aplicaciones blockchain.',
    },
    'ethereum-address': {
      term: 'Dirección Ethereum',
      definition: 'Un identificador único para una wallet o cuenta en la blockchain. Se ve como "0x" seguido de 40 caracteres (letras y números).',
    },
    'ens-name': {
      term: 'Nombre ENS',
      definition: 'Servicio de Nombres Ethereum - un nombre legible para humanos (como "alice.eth") que representa una dirección Ethereum, haciéndola más fácil de recordar y compartir.',
      learnMoreUrl: 'https://ens.domains',
    },
    'revocable': {
      term: 'Revocable',
      definition: 'Cuando está habilitado, los attestations usando este schema pueden ser cancelados o revocados por la persona que los creó. Los attestations no revocables son permanentes.',
    },
    'attester': {
      term: 'Attestador',
      definition: 'La persona o entidad que crea un attestation. Esta es la dirección de wallet que avala o verifica información sobre alguien más.',
    },
    'recipient': {
      term: 'Destinatario',
      definition: 'La persona o entidad sobre la que trata un attestation. Esta es la dirección de wallet que recibe el attestation.',
    },
    'schema': {
      term: 'Schema',
      definition: 'Una plantilla que define qué información contiene un attestation. Como un formulario con campos específicos (nombre, puntuación, etc.) que deben completarse.',
      learnMoreUrl: 'https://docs.attest.sh/docs/core--concepts/schemas',
    },
    'onchain': {
      term: 'Onchain',
      definition: 'Almacenado permanentemente en la blockchain, haciéndolo públicamente verificable y a prueba de manipulación. Los datos onchain no pueden ser eliminados o modificados.',
    },
    'transaction-hash': {
      term: 'Hash de Transacción',
      definition: 'Un código único que identifica tu transacción blockchain. Puedes usarlo para buscar tu transacción en un explorador de bloques.',
    },
    'block-explorer': {
      term: 'Explorador de Bloques',
      definition: 'Un sitio web (como Basescan) que te permite ver y verificar transacciones blockchain, direcciones y otros datos onchain.',
      learnMoreUrl: 'https://basescan.org',
    },
    'farcaster-frame': {
      term: 'Frame de Farcaster',
      definition: 'Un componente interactivo que puede compartirse en Farcaster (una red social descentralizada), permitiendo a otros ver o interactuar con tus attestations directamente en su feed.',
      learnMoreUrl: 'https://docs.farcaster.xyz/learn/what-is-farcaster/frames',
    },
  },
};

export const glossary: Record<string, GlossaryTerm> = glossaryTerms.en;

/**
 * Get glossary term definition
 */
export function getGlossaryTerm(key: string, language: 'en' | 'es' = 'en'): GlossaryTerm | undefined {
  return (glossaryTerms[language] as Record<string, GlossaryTerm>)[key];
}

/**
 * Get all glossary terms sorted alphabetically
 */
export function getAllGlossaryTerms(language: 'en' | 'es' = 'en'): GlossaryTerm[] {
  return Object.values(glossaryTerms[language]).sort((a, b) => a.term.localeCompare(b.term));
}

/**
 * Search glossary terms
 */
export function searchGlossary(query: string, language: 'en' | 'es' = 'en'): GlossaryTerm[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(glossaryTerms[language]).filter(
    (term) =>
      term.term.toLowerCase().includes(lowerQuery) ||
      term.definition.toLowerCase().includes(lowerQuery)
  );
}
