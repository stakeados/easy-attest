'use client';

import { useTranslation } from '@/contexts/i18n-context';

const EAS_CONTRACT = '0x4200000000000000000000000000000000000021';
const SCHEMA_REGISTRY = '0x4200000000000000000000000000000000000020';
const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/1715659/easy-attest/version/latest';

export default function AgentsPage() {
    const { t } = useTranslation();

    const methods = [
        {
            icon: '🖱️',
            title: t('agents.method1Title'),
            desc: t('agents.method1Desc'),
            tags: [t('agents.tagNoCode'), t('agents.tagBrowser'), t('agents.tagFarcaster')],
        },
        {
            icon: '📡',
            title: t('agents.method2Title'),
            desc: t('agents.method2Desc'),
            tags: [t('agents.tagNoWallet'), t('agents.tagNoGas'), t('agents.tagProgrammatic')],
        },
        {
            icon: '⚙️',
            title: t('agents.method3Title'),
            desc: t('agents.method3Desc'),
            tags: [t('agents.tagFullControl'), t('agents.tagAgentSigning'), t('agents.tagEscrowReady')],
        },
    ];

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-10">
                    <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium px-3 py-1.5 rounded-full mb-4">
                        <span>🤖</span>
                        <span>{t('agents.badge')}</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {t('agents.title')}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                        {t('agents.subtitle')}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <a
                            href="https://raw.githubusercontent.com/stakeados/easy-attest/main/agents/SKILL.md"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            📄 {t('agents.downloadSkill')}
                        </a>
                        <a
                            href="https://github.com/stakeados/easy-attest"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            ⭐ {t('agents.viewGithub')}
                        </a>
                    </div>
                </div>

                {/* Contracts */}
                <section className="mb-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        {t('agents.contractsTitle')}
                    </h2>
                    <div className="space-y-3">
                        {([
                            { label: 'EAS Contract', value: EAS_CONTRACT },
                            { label: 'Schema Registry', value: SCHEMA_REGISTRY },
                            { label: 'Subgraph', value: SUBGRAPH_URL },
                        ] as const).map(({ label, value }) => (
                            <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 sm:w-36 shrink-0">{label}</span>
                                <code className="text-xs text-gray-800 dark:text-gray-200 font-mono break-all bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                                    {value}
                                </code>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Three methods */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        {t('agents.methodsTitle')}
                    </h2>
                    <div className="space-y-4">
                        {methods.map(({ icon, title, desc, tags }) => (
                            <div key={title} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">{icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{desc}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {tags.map((tag) => (
                                                <span key={tag} className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Field types */}
                <section className="mb-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        {t('agents.typesTitle')}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {['string', 'uint256', 'bool', 'address', 'bytes32', 'bytes'].map((type) => (
                            <code
                                key={type}
                                className="text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 px-2.5 py-1 rounded-lg font-mono"
                            >
                                {type}
                            </code>
                        ))}
                    </div>
                </section>

                {/* Code example */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        {t('agents.codeTitle')}
                    </h2>
                    <div className="bg-gray-900 dark:bg-gray-950 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800 dark:bg-gray-900 border-b border-gray-700">
                            <span className="text-xs text-gray-400 font-mono">agent-deliver.js</span>
                            <span className="text-xs text-gray-500">EAS JS SDK · Base Mainnet</span>
                        </div>
                        <pre className="p-4 text-sm text-gray-100 font-mono overflow-x-auto leading-relaxed">
                            {`import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';

const EAS_CONTRACT = '0x4200000000000000000000000000000000000021';
const SCHEMA_UID   = process.env.EAS_SCHEMA_UID;
const SCHEMA_STR   = 'string jobId, string deliveryUrl, uint256 completedAt';

async function attestDelivery(jobId, deliveryUrl) {
  const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
  const signer   = new ethers.Wallet(process.env.AGENT_PRIVATE_KEY, provider);
  const eas      = new EAS(EAS_CONTRACT);
  eas.connect(signer);

  const encoder = new SchemaEncoder(SCHEMA_STR);
  const data    = encoder.encodeData([
    { name: 'jobId',       type: 'string',  value: jobId },
    { name: 'deliveryUrl', type: 'string',  value: deliveryUrl },
    { name: 'completedAt', type: 'uint256',
      value: BigInt(Math.floor(Date.now() / 1000)) },
  ]);

  const tx  = await eas.attest({
    schema: SCHEMA_UID,
    data: { recipient: ethers.ZeroAddress, expirationTime: 0n,
            revocable: true, data, refUID: ethers.ZeroHash, value: 0n },
  });

  const uid = await tx.wait();
  console.log('Attestation UID:', uid);
  return uid;
}`}
                        </pre>
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-6 text-center">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {t('agents.ctaTitle')}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
                        {t('agents.ctaSubtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a
                            href="https://raw.githubusercontent.com/stakeados/easy-attest/main/agents/SKILL.md"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                        >
                            📄 {t('agents.downloadSkill')}
                        </a>
                        <a
                            href="https://github.com/stakeados/easy-attest/tree/main/agents"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                        >
                            ⭐ {t('agents.viewGithub')}
                        </a>
                    </div>
                </section>

            </div>
        </main>
    );
}
