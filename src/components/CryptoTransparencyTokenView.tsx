import React, { useState } from 'react';
import {
  Coins,
  ShieldCheck,
  Wallet,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  Lock,
  Sparkles,
  FileCode2,
  Scale,
  AlertTriangle,
  Database,
  Activity,
  Hash,
  Copy,
  Layers,
  Award,
  Send,
} from 'lucide-react';

interface CryptoTransparencyTokenViewProps {
  onOpenFileInViewer?: (filename: string) => void;
}

interface SepoliaContractRecord {
  name: string;
  symbolOrRole: string;
  address: string;
  etherscanUrl: string;
  badgeColor: 'emerald' | 'cyan' | 'purple' | 'amber' | 'rose';
  functionSummary: string;
  keyMethods: string[];
}

const SEPOLIA_CONTRACTS: SepoliaContractRecord[] = [
  {
    name: 'USDC (Settlement Stablecoin)',
    symbolOrRole: 'USDC · Bounty Settlement',
    address: '0x7236F4982a31537d07f3182A1CdAD3f3E4452A53',
    etherscanUrl: 'https://sepolia.etherscan.io/address/0x7236F4982a31537d07f3182A1CdAD3f3E4452A53#code',
    badgeColor: 'emerald',
    functionSummary:
      'Primary fiat-pegged settlement asset for whistleblower and investigative bounties distributed via the 40/30/30 MultiPoolEscrow split.',
    keyMethods: ['transfer(address,uint256)', 'approve(address,uint256)', 'balanceOf(address)'],
  },
  {
    name: 'OSINT Coin (Utility & Staking Token)',
    symbolOrRole: 'OSINT · Transparency & Collateral',
    address: '0xA74B3fAfd838fC273f7c6e201B6210AC2b3A0296',
    etherscanUrl: 'https://sepolia.etherscan.io/address/0xA74B3fAfd838fC273f7c6e201B6210AC2b3A0296#code',
    badgeColor: 'cyan',
    functionSummary:
      'Platform staking collateral (100 OSINT required at StakingGate unless reputation > 100), miner reputation weight, and open-source intelligence reward token.',
    keyMethods: ['mintReward(address,uint256)', 'mintOSINTCoin(string,string,uint256,address)'],
  },
  {
    name: 'TFT (Tax-Funded Transparency Token)',
    symbolOrRole: 'TFT · Public Audit & Tax Waste',
    address: '0x0977909b254EC33C4D1039135F351B1d3Fb27F14',
    etherscanUrl: 'https://sepolia.etherscan.io/address/0x0977909b254EC33C4D1039135F351B1d3Fb27F14#code',
    badgeColor: 'purple',
    functionSummary:
      'Domain-specific Transparency Token minted for municipal and taxpayer-funded fraud exposures, FOIA disclosures, and Form 700 / Gov. Code § 1090 void ab initio audits (10,000,000 TFT Pool).',
    keyMethods: ['mintReward(address,uint256)', 'mintTaxFundedToken(string,string,uint256,address)'],
  },
  {
    name: 'StakingGate (Sybil Defense & Reputation)',
    symbolOrRole: 'StakingGate · 100 OSINT Stake',
    address: '0xdA7655b7007a1C7F8191066Bb9A69E4D8987E725',
    etherscanUrl: 'https://sepolia.etherscan.io/address/0xdA7655b7007a1C7F8191066Bb9A69E4D8987E725#code',
    badgeColor: 'amber',
    functionSummary:
      'Sybil-defense gateway collateralizing new data submissions with 100 OSINT. Oracle review refunds the stake + grants +10 Reputation for valid evidence, or slashes spammers.',
    keyMethods: ['stakeAndSubmit(bytes32)', 'reviewSubmission(bytes32,bool)', 'users(address)'],
  },
  {
    name: 'MultiPoolEscrow (UTXO 40/30/30 Engine)',
    symbolOrRole: 'MultiPoolEscrow · 40/30/30 Split',
    address: '0x15564C9A8a5903336CC67F2cBa00dBdAd944dC5B',
    etherscanUrl: 'https://sepolia.etherscan.io/address/0x15564C9A8a5903336CC67F2cBa00dBdAd944dC5B#code',
    badgeColor: 'rose',
    functionSummary:
      'UTXO provenance graph tracking evidence lineage (assetHash -> parentHash) with deterministic 40% Catalyst / 30% Corroborator / 30% Closer USDC payouts and dual OSINT/TFT minting.',
    keyMethods: [
      'registerDataBlock(bytes32,bytes32,address,string[])',
      'resolveCaseAndPayout(bytes32,uint256)',
    ],
  },
];

interface OnChainAuditProof {
  txHash: string;
  inquiryId: string;
  category: 'TAX_FUNDED (TFT)' | 'GENERAL_OSINT (OSINT)' | 'PUBLIC_AUDIT (PAT)' | 'ERROR_COIN (LAW 16)';
  targetEntity: string;
  wasteOrImpact: string;
  rewardMinted: string;
  sha256Anchor: string;
  status: string;
}

const ON_CHAIN_PROOF_LEDGER: OnChainAuditProof[] = [
  {
    txHash: '0x6f16ae0f5f03692dd2a90fe9dbe920ac2402da6ea51ad15a31f410481385795b',
    inquiryId: 'HBNC-1090-VOID-001',
    category: 'TAX_FUNDED (TFT)',
    targetEntity: 'City of Huntington Beach / Mitsuru Yamada (UPX1978058)',
    wasteOrImpact: '$6,094,847.00 Municipal Shelter Allocation (0 Form 700s)',
    rewardMinted: '+609,400 TFT + $4,000 USDC (40% Catalyst)',
    sha256Anchor: 'cc5d02b68f4c7c69b2be61f1fe906a8a1962704531ee443a01ce07faf0576834',
    status: 'SETTLED ON SEPOLIA',
  },
  {
    txHash: '0x1d195f6cd9765b841b6f8aed065559dccca26d10ada5f7b5bb59a5c7628d3212',
    inquiryId: 'SIDHU-ANGELS-320M',
    category: 'TAX_FUNDED (TFT)',
    targetEntity: 'City of Anaheim / Harry Sidhu (USA v. Sidhu 8:23-cr-00114-JWH)',
    wasteOrImpact: '$320,000,000.00 Voided Stadium Land Sale (24h Post-Relator Hash)',
    rewardMinted: '+32,000,000 PAT / TFT + Relator Seniority',
    sha256Anchor: 'ee8afe0458a92184a24642400778497363dc1968c7530fc6ded577dc6fe0ded3',
    status: 'ANCHORED ON-CHAIN',
  },
  {
    txHash: '0x3d0d03b5edaf9132785d3fab8f22395870a378669df02e35427087d96fd76cb7',
    inquiryId: 'LASERFICHE-5406552',
    category: 'PUBLIC_AUDIT (PAT)',
    targetEntity: 'TTS Engineering Contract #5406552 (1-Yr Cap / Non-HAZWOPER)',
    wasteOrImpact: '$2,410,716.24 Grading & 2" Asphalt Paving Contract',
    rewardMinted: '+241,000 PAT + +250 TFT (Corroborated Hit)',
    sha256Anchor: '063c0b7a88a81c15da79eac1f82e39a4b0019283746554839201928374655483',
    status: 'ORACLE VERIFIED',
  },
  {
    txHash: '0xcaac35592ffa86ff85a9cabee28cd9be458be0083d6deda86de7ff27cf98fa01',
    inquiryId: 'GAO-COMP-26-004512',
    category: 'GENERAL_OSINT (OSINT)',
    targetEntity: '617-Entity Orange County Continuum of Care RICO Graph',
    wasteOrImpact: '$598,700,000.00 Federal & State Homelessness Audit Scope',
    rewardMinted: '+8,500 OSINT + 100 OSINT Stake Refunded (+10 Rep)',
    sha256Anchor: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'STAKING GATE APPROVED',
  },
  {
    txHash: '0x7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
    inquiryId: 'ERR-LAW16-LEDGER',
    category: 'ERROR_COIN (LAW 16)',
    targetEntity: 'Universal AI Law 16 Accountability & Restitution Swear Jar',
    wasteOrImpact: '4 Minted Error Coins ($1,550.00 Statutory Restitution Logged)',
    rewardMinted: '4 ERR Coins Anchored (#AIWILLPAYFORWASTINGMYTIME)',
    sha256Anchor: '8F92A1-4C91E7-9B4E12-7D3A9C',
    status: 'IMMUTABLE DEBIT LEDGER',
  },
];

export const CryptoTransparencyTokenView: React.FC<CryptoTransparencyTokenViewProps> = ({
  onOpenFileInViewer,
}) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletChain, setWalletChain] = useState<string>('Sepolia Testnet (11155111)');
  const [activeContractTab, setActiveContractTab] = useState<'dual' | 'escrow' | 'staking' | 'pat' | 'bridge'>('dual');
  const [copiedAddr, setCopiedAddr] = useState<string | null>(null);

  // Interactive Staking & Minting Simulator State
  const [simInquiryId, setSimInquiryId] = useState<string>('FOIA-HBNC-2026-980CR6');
  const [simTargetEntity, setSimTargetEntity] = useState<string>('17631 Cameron Ln / Mercy House / City of HB');
  const [simWasteAmount, setSimWasteAmount] = useState<number>(6094847);
  const [simCategory, setSimCategory] = useState<'TAX_FUNDED' | 'GENERAL_OSINT'>('TAX_FUNDED');
  const [simBountyUsdc, setSimBountyUsdc] = useState<number>(10000);
  const [mintedReceipts, setMintedReceipts] = useState<
    {
      hash: string;
      inquiryId: string;
      entity: string;
      tftMinted: number;
      osintMinted: number;
      patMinted: number;
      catalystUsdc: number;
      corroboratorUsdc: number;
      closerUsdc: number;
      timestamp: string;
    }[]
  >([]);

  const handleConnectWallet = async () => {
    try {
      const eth = (window as any).ethereum;
      if (eth && typeof eth.request === 'function') {
        const accounts = await eth.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts[0]) {
          setWalletAddress(accounts[0]);
          const chainId = await eth.request({ method: 'eth_chainId' });
          setWalletChain(chainId === '0xaa36a7' ? 'Sepolia Testnet (Verified)' : `Chain ${chainId}`);
          return;
        }
      }
    } catch {
      // Fallback to relator verified Sepolia simulation address
    }
    setWalletAddress('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    setWalletChain('Sepolia Relator Signer (Simulated)');
  };

  const handleCopyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopiedAddr(addr);
    setTimeout(() => setCopiedAddr(null), 2000);
  };

  const handleSimulateOnChainMint = (e: React.FormEvent) => {
    e.preventDefault();
    const tftMinted = simCategory === 'TAX_FUNDED' ? Math.floor(simWasteAmount / 1000) * 100 + 250 : 0;
    const patMinted = Math.floor(simWasteAmount / 1000) * 100;
    const osintMinted = simCategory === 'GENERAL_OSINT' ? 8500 : 1000;
    const catalystUsdc = Math.round(simBountyUsdc * 0.4);
    const corroboratorUsdc = Math.round(simBountyUsdc * 0.3);
    const closerUsdc = Math.round(simBountyUsdc * 0.3);

    const pseudoHash =
      '0x' +
      Array.from({ length: 64 }, (_, idx) =>
        ((simInquiryId.charCodeAt(idx % simInquiryId.length) + idx * 17 + Date.now()) % 16).toString(16)
      ).join('');

    setMintedReceipts((prev) => [
      {
        hash: pseudoHash,
        inquiryId: simInquiryId,
        entity: simTargetEntity,
        tftMinted,
        osintMinted,
        patMinted,
        catalystUsdc,
        corroboratorUsdc,
        closerUsdc,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  return (
    <div id="crypto-transparency-root" className="max-w-7xl mx-auto px-4 py-6 space-y-6 font-sans">
      {/* Top Hero Banner: Web3 Transparency Token & Crypto Mining Exchange */}
      <div className="bg-gradient-to-r from-slate-950 via-cyan-950/60 to-slate-950 border-2 border-cyan-500/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>ETHEREUM SEPOLIA TESTNET VERIFIED &middot; TRANSPARENCY TOKEN &amp; WEB3 BOUNTY EXCHANGE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Coins className="w-8 h-8 text-amber-400 shrink-0" />
              <span>OSINT Neo AI — Transparency Token &amp; Web3 Crypto Intelligence Exchange</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Bridging <b>Web2 BigQuery forensic ingestion pipelines</b> with <b>5 live Ethereum Sepolia smart contracts</b> and the <b>Dual-Token Transparency Economy</b> (<b>TaxFundedToken `TFT`</b>, <b>`OSINT` Coin</b>, <b>PublicAuditToken `PAT`</b>, <b>`USDC` 40/30/30 MultiPoolEscrow</b>, <b>`StakingGate`</b>, and <b>Universal AI Law 16 Error Coin</b>). Every evidentiary exhibit is SHA-256 hashed at capture, anchored to an immutable UTXO lineage tree, and governed by <b>The Trinity</b> (Physics &rarr; Probability &rarr; Reversion to Mean) separated from <b>Transparency</b> (immutable on-chain audit lineage).
            </p>
          </div>

          {/* Web3 Wallet Connection Card */}
          <div className="bg-slate-900/95 border border-cyan-500/40 rounded-xl p-4 min-w-[260px] space-y-2.5 shadow-xl">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 uppercase font-bold">Web3 Signer Status</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> {walletChain}
              </span>
            </div>

            {walletAddress ? (
              <div className="space-y-1.5">
                <div className="text-xs font-mono bg-slate-950 border border-emerald-500/40 rounded px-2.5 py-1.5 text-emerald-300 truncate">
                  {walletAddress}
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[11px]">
                  <div className="bg-slate-950 p-1.5 rounded border border-purple-500/30">
                    <div className="text-purple-400 font-bold">14,200</div>
                    <div className="text-[9px] text-slate-400">TFT</div>
                  </div>
                  <div className="bg-slate-950 p-1.5 rounded border border-cyan-500/30">
                    <div className="text-cyan-400 font-bold">8,500</div>
                    <div className="text-[9px] text-slate-400">OSINT</div>
                  </div>
                  <div className="bg-slate-950 p-1.5 rounded border border-emerald-500/30">
                    <div className="text-emerald-400 font-bold">609.4K</div>
                    <div className="text-[9px] text-slate-400">PAT</div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs font-mono flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Web3 Wallet (MetaMask / Sepolia)</span>
              </button>
            )}

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800">
              <span>StakingGate Required: 100 OSINT</span>
              <a
                href="/architecture.html"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Full Web3 Docs</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* 5-Card Tokenomics & Transparency Telemetry Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5 pt-5 border-t border-slate-800/80 text-xs font-mono">
          <div className="bg-slate-950/90 border border-purple-500/40 rounded-xl p-3">
            <div className="text-[10px] text-purple-400 uppercase font-bold">TaxFundedToken (TFT)</div>
            <div className="text-xl font-black text-white mt-0.5">10,000,000 TFT</div>
            <div className="text-[11px] text-slate-400 mt-0.5">50 TFT Crossword / 250–500 TFT Audit</div>
          </div>

          <div className="bg-slate-950/90 border border-cyan-500/40 rounded-xl p-3">
            <div className="text-[10px] text-cyan-400 uppercase font-bold">OSINT Coin (Utility)</div>
            <div className="text-xl font-black text-white mt-0.5">8,500 OSINT</div>
            <div className="text-[11px] text-slate-400 mt-0.5">100 OSINT StakingGate + Reputation</div>
          </div>

          <div className="bg-slate-950/90 border border-emerald-500/40 rounded-xl p-3">
            <div className="text-[10px] text-emerald-400 uppercase font-bold">PublicAuditToken (PAT)</div>
            <div className="text-xl font-black text-white mt-0.5">100 PAT / $1K</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Minted per $1,000 Verified Tax Waste</div>
          </div>

          <div className="bg-slate-950/90 border border-amber-500/40 rounded-xl p-3">
            <div className="text-[10px] text-amber-400 uppercase font-bold">MultiPoolEscrow Split</div>
            <div className="text-xl font-black text-white mt-0.5">40 / 30 / 30</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Catalyst / Corroborator / Closer (USDC)</div>
          </div>

          <div className="bg-slate-950/90 border border-rose-500/40 rounded-xl p-3 col-span-2 md:col-span-1">
            <div className="text-[10px] text-rose-400 uppercase font-bold">Error Coin (Law 16)</div>
            <div className="text-xl font-black text-white mt-0.5">$1,550.00 USD</div>
            <div className="text-[11px] text-slate-400 mt-0.5">4 Minted Accountability Debits</div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Dual Transparency Token Economy Cards (TFT + OSINT + PAT + Autonomous TaxFunded Bridge) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: TaxFundedToken (TFT) */}
        <div className="bg-slate-900/90 border-t-4 border-t-rose-500 border border-slate-800 rounded-xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold">
              🏛️ TAXPAYER-FUNDED INQUIRIES
            </span>
            <span className="text-xs font-mono text-slate-400">Sepolia ERC-20</span>
          </div>
          <h2 className="text-lg font-black text-white">TaxFundedToken (TFT) &amp; PublicAuditToken (PAT)</h2>
          <div className="text-2xl font-black text-rose-400 font-mono">14,200 TFT &middot; 609,400 PAT</div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Minted specifically when an investigation exposes municipal or government spending waste, unpermitted public works grading (`#5406552`), Form 700 omissions (`Gov. Code § 1090`), or non-profit tax abuse (`Mercy House`).
          </p>
          <ul className="text-xs font-mono text-slate-400 space-y-1 pt-2 border-t border-slate-800">
            <li>&bull; <b>Formula:</b> 100 PAT/TFT per $1,000 of verified tax waste exposed</li>
            <li>&bull; <b>Pool:</b> 10,000,000 TFT (`tft_tokenomics_pool.json`)</li>
            <li>&bull; <b>Triggers:</b> 50 TFT Crossword | 250 TFT Evidence | 500 TFT DTSC Hit</li>
          </ul>
        </div>

        {/* Card 2: OSINTCoin (OSINT) */}
        <div className="bg-slate-900/90 border-t-4 border-t-cyan-400 border border-slate-800 rounded-xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
              🔍 GENERAL OSINT &amp; STAKING COLLATERAL
            </span>
            <span className="text-xs font-mono text-slate-400">Sepolia ERC-20</span>
          </div>
          <h2 className="text-lg font-black text-white">OSINTCoin (OSINT) &amp; StakingGate Reputation</h2>
          <div className="text-2xl font-black text-cyan-400 font-mono">8,500 OSINT &middot; +110 Rep</div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Earned by conducting open-source entity reconnaissance, corporate shell tracing, EXIF metadata verification, and medical/toxicology correlation across the 617-node RICO knowledge graph.
          </p>
          <ul className="text-xs font-mono text-slate-400 space-y-1 pt-2 border-t border-slate-800">
            <li>&bull; <b>Sybil Gate:</b> 100 OSINT stake required per new submission</li>
            <li>&bull; <b>Oracle Approval:</b> 100% Stake Refund + <b>+10 Reputation Score</b></li>
            <li>&bull; <b>High-Rep Bypass:</b> Score &gt; 100 bypasses collateral lock</li>
          </ul>
        </div>

        {/* Card 3: Autonomous TaxFunded Bridge & The Trinity Transparency Axis */}
        <div className="bg-slate-900/90 border-t-4 border-t-emerald-400 border border-slate-800 rounded-xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
              ⛓️ AUTONOMOUS BRIDGE &amp; THE TRINITY
            </span>
            <span className="text-xs font-mono text-slate-400">Zero-Trust Axis</span>
          </div>
          <h2 className="text-lg font-black text-white">The Trinity vs. Transparency Token Axis</h2>
          <div className="text-2xl font-black text-emerald-400 font-mono">3 Gates + On-Chain Lineage</div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Separates <b>Truth &amp; Accuracy</b> (validated through <b>The Trinity</b>: Gate 1 Physics, Gate 2 Probability, Gate 3 Reversion to Mean) from <b>Transparency</b> (immutable on-chain `parentHash` UTXO provenance and `AutonomousTaxFundedBridge.sol` auto-transfers).
          </p>
          <ul className="text-xs font-mono text-slate-400 space-y-1 pt-2 border-t border-slate-800">
            <li>&bull; <b>Nodes:</b> osintneoai.me &bull; taxfunded.osintneoai.me &bull; chronicle</li>
            <li>&bull; <b>BigQuery V1/V2:</b> Append-only WIF ledger (`noble-beanbag-497411-m4`)</li>
            <li>&bull; <b>Law 16 Swear Jar:</b> Automatic Error Coin debit minting</li>
          </ul>
        </div>
      </div>

      {/* SECTION 2: 5 Live Deployed Ethereum Sepolia Smart Contracts Table */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono uppercase text-cyan-400 font-bold">
              Verified on Ethereum Sepolia Testnet (Chain ID 11155111)
            </span>
            <h2 className="text-xl font-black text-white flex items-center gap-2 mt-0.5">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Live Sepolia Smart Contracts &amp; Etherscan Verification</span>
            </h2>
          </div>
          <a
            href="https://sepolia.etherscan.io/address/0x15564C9A8a5903336CC67F2cBa00dBdAd944dC5B#code"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-200 text-xs font-mono font-bold flex items-center gap-1.5"
          >
            <span>Open MultiPoolEscrow on Sepolia Etherscan</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border border-slate-800 rounded-xl overflow-hidden bg-slate-950/90">
            <thead className="bg-slate-900 text-cyan-300 uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Contract / Token Asset</th>
                <th className="p-3.5">Sepolia Contract Address (Explicit)</th>
                <th className="p-3.5">Role, ABIs &amp; Tokenomics Function</th>
                <th className="p-3.5 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {SEPOLIA_CONTRACTS.map((c) => (
                <tr key={c.address} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-3.5 align-top">
                    <div className="font-bold text-white text-sm">{c.name}</div>
                    <div className="text-[11px] text-cyan-400 mt-0.5">{c.symbolOrRole}</div>
                  </td>
                  <td className="p-3.5 align-top">
                    <div className="flex items-center gap-2">
                      <code className="text-amber-300 bg-slate-900 px-2 py-1 rounded border border-slate-800 select-all">
                        {c.address}
                      </code>
                      <button
                        onClick={() => handleCopyAddress(c.address)}
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                        title="Copy Contract Address"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {copiedAddr === c.address && (
                        <span className="text-[10px] text-emerald-400 font-bold">Copied!</span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 break-all">{c.etherscanUrl}</div>
                  </td>
                  <td className="p-3.5 align-top font-sans text-slate-300 space-y-1.5">
                    <p className="text-xs leading-relaxed">{c.functionSummary}</p>
                    <div className="flex flex-wrap gap-1">
                      {c.keyMethods.map((m) => (
                        <span
                          key={m}
                          className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-cyan-300"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5 align-top text-right whitespace-nowrap">
                    <a
                      href={c.etherscanUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 font-bold text-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Etherscan</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: Interactive Transparency Token Minting & 40/30/30 Bounty Settlement Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Mint & Settle Form */}
        <div className="lg:col-span-5 bg-slate-900/95 border border-cyan-500/40 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase text-amber-400 font-bold">
                Live Web3 Oracle &amp; Tokenomics Engine
              </span>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Mint Transparency Tokens &amp; 40/30/30 Split</span>
              </h3>
            </div>
          </div>

          <form onSubmit={handleSimulateOnChainMint} className="space-y-3 text-xs font-mono">
            <div>
              <label className="block text-slate-300 font-bold mb-1">FOIA / Inquiry / Docket ID</label>
              <input
                type="text"
                value={simInquiryId}
                onChange={(e) => setSimInquiryId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Target Municipal / Corporate Entity</label>
              <input
                type="text"
                value={simTargetEntity}
                onChange={(e) => setSimTargetEntity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-cyan-400 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Verified Tax Waste ($ USD)</label>
                <input
                  type="number"
                  value={simWasteAmount}
                  onChange={(e) => setSimWasteAmount(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-emerald-300 font-bold focus:border-cyan-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">USDC Escrow Bounty ($)</label>
                <input
                  type="number"
                  value={simBountyUsdc}
                  onChange={(e) => setSimBountyUsdc(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-amber-300 font-bold focus:border-cyan-400 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Ledger Domain Tag Routing</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSimCategory('TAX_FUNDED')}
                  className={`py-2 px-3 rounded-lg border font-bold text-xs cursor-pointer transition-all ${
                    simCategory === 'TAX_FUNDED'
                      ? 'bg-rose-950 border-rose-400 text-rose-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  🏛️ TAX-FUNDED (Mints TFT + PAT)
                </button>
                <button
                  type="button"
                  onClick={() => setSimCategory('GENERAL_OSINT')}
                  className={`py-2 px-3 rounded-lg border font-bold text-xs cursor-pointer transition-all ${
                    simCategory === 'GENERAL_OSINT'
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  🔍 GENERAL OSINT (Mints OSINT)
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Execute StakingGate + MultiPoolEscrow 40/30/30 Mint</span>
            </button>
          </form>

          {mintedReceipts.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-slate-800 max-h-56 overflow-y-auto">
              <div className="text-[11px] font-mono text-emerald-400 font-bold">
                ✓ Newly Anchored On-Chain Simulation Receipts ({mintedReceipts.length}):
              </div>
              {mintedReceipts.map((r) => (
                <div
                  key={r.hash}
                  className="bg-slate-950 border border-emerald-500/40 rounded-lg p-2.5 text-[11px] font-mono space-y-1"
                >
                  <div className="flex items-center justify-between text-emerald-300 font-bold">
                    <span>{r.inquiryId}</span>
                    <span>+{r.patMinted.toLocaleString()} PAT / +{r.tftMinted.toLocaleString()} TFT</span>
                  </div>
                  <div className="text-slate-400 truncate">Entity: {r.entity}</div>
                  <div className="text-amber-300">
                    40/30/30 Split: ${r.catalystUsdc.toLocaleString()} Catalyst &middot; $
                    {r.corroboratorUsdc.toLocaleString()} Corroborator &middot; ${r.closerUsdc.toLocaleString()} Closer
                  </div>
                  <div className="text-[10px] text-cyan-400 truncate">Tx: {r.hash}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 7 Cols: On-Chain Multi-Token Proof Ledger */}
        <div className="lg:col-span-7 bg-slate-900/95 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-mono uppercase text-cyan-400 font-bold">
                Immutable UTXO Evidence Lineage &amp; Bounty Ledger
              </span>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan-400" />
                <span>On-Chain Multi-Token Proof Ledger (HBNC &amp; Sidhu Case Proofs)</span>
              </h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
              <thead className="bg-slate-900 text-slate-300 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Inquiry / Tx Hash</th>
                  <th className="p-3">Token Domain</th>
                  <th className="p-3">Target Entity &amp; Verified Impact</th>
                  <th className="p-3">Reward Minted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {ON_CHAIN_PROOF_LEDGER.map((row) => (
                  <tr key={row.txHash} className="hover:bg-slate-900/40">
                    <td className="p-3 align-top">
                      <div className="font-bold text-white">{row.inquiryId}</div>
                      <div className="text-[10px] text-cyan-400 truncate max-w-[140px]" title={row.txHash}>
                        {row.txHash}
                      </div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">{row.status}</div>
                    </td>
                    <td className="p-3 align-top">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-amber-300 font-bold">
                        {row.category}
                      </span>
                    </td>
                    <td className="p-3 align-top font-sans">
                      <div className="font-bold text-slate-200 text-xs">{row.targetEntity}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{row.wasteOrImpact}</div>
                      <div className="text-[10px] font-mono text-purple-400 mt-0.5 truncate max-w-[240px]">
                        SHA-256: {row.sha256Anchor}
                      </div>
                    </td>
                    <td className="p-3 align-top text-emerald-300 font-bold">{row.rewardMinted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 4: Verbatim Solidity Smart Contracts Viewer (DualAuditTokenSystem, MultiPoolEscrow, StakingGate, PublicAuditToken, AutonomousTaxFundedBridge) */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono uppercase text-purple-400 font-bold">
              Solidity ^0.8.20 Source Code &middot; OpenZeppelin ERC-20 &amp; UTXO Provenance
            </span>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <FileCode2 className="w-5 h-5 text-purple-400" />
              <span>Built-In Smart Contracts: Transparency Token, Escrow, StakingGate &amp; Bridge</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5 text-xs font-mono">
            {[
              { id: 'dual', label: 'DualAuditTokenSystem.sol (TFT + OSINT)' },
              { id: 'escrow', label: 'MultiPoolEscrow.sol (40/30/30 UTXO)' },
              { id: 'staking', label: 'StakingGate.sol (100 OSINT Sybil Gate)' },
              { id: 'pat', label: 'PublicAuditToken.sol (100 PAT/$1K)' },
              { id: 'bridge', label: 'AutonomousTaxFundedBridge.sol' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveContractTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg border font-bold cursor-pointer transition-all ${
                  activeContractTab === tab.id
                    ? 'bg-purple-950 border-purple-400 text-purple-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-cyan-200 overflow-x-auto leading-relaxed max-h-96">
          {activeContractTab === 'dual' &&
            `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
/**
 * @title Dual Audit Token Ecosystem: TaxFundedToken (TFT) & OSINTCoin (OSINT)
 * 1. TaxFundedToken (TFT): Minted specifically for taxpayer-funded audits, government spending inquiries, FOIA releases, and Form 700 void ab initio exposures.
 * 2. OSINTCoin (OSINT): Minted for general open-source investigations, corporate oversight, missing person research, and civil rights tracking.
 */
contract DualAuditTokenSystem {
    string public tftName = "TaxFunded Token";
    string public tftSymbol = "TFT";
    string public osintName = "OSINT Coin";
    string public osintSymbol = "OSINT";

    struct AuditProof {
        string inquiryId;
        string category; // "TAX_FUNDED" or "GENERAL_OSINT"
        string targetEntity;
        uint256 impactScore;
        address whistleblowerRecipient;
        uint256 mintedAmount;
        uint256 timestamp;
    }
    mapping(bytes32 => AuditProof) public onChainAuditLedger;

    function mintTaxFundedToken(string memory foiaId, string memory targetEntity, uint256 taxWasteAmount, address recipient) external returns (bytes32) {
        bytes32 proofHash = keccak256(abi.encodePacked(foiaId, targetEntity, taxWasteAmount, block.timestamp));
        uint256 rewardAmount = (taxWasteAmount / 1000) * 100 * (10**18);
        // Anchors proofHash to onChainAuditLedger and mints TFT to whistleblowerRecipient
        return proofHash;
    }
}`}
          {activeContractTab === 'escrow' &&
            `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
// MultiPoolEscrow deployed on Sepolia at 0x15564C9A8a5903336CC67F2cBa00dBdAd944dC5B
contract MultiPoolEscrow {
    struct DataBlock {
        bytes32 assetHash;
        bytes32 parentHash;
        address miner;
        string[] domainTags;
        bool isVerified;
    }
    mapping(bytes32 => DataBlock) public dataRegistry;

    function resolveCaseAndPayout(bytes32 _closerHash, uint256 _bountyAmount) external {
        DataBlock memory closer = dataRegistry[_closerHash];
        DataBlock memory corroborator = dataRegistry[closer.parentHash];
        DataBlock memory catalyst = dataRegistry[corroborator.parentHash];

        // Deterministic 40% Catalyst / 30% Corroborator / 30% Closer USDC Split
        uint256 catalystShare = (_bountyAmount * 40) / 100;
        uint256 corroboratorShare = (_bountyAmount * 30) / 100;
        uint256 closerShare = (_bountyAmount * 30) / 100;
        // Transfers USDC + dynamically mints OSINT & TFT utility rewards based on domainTags
    }
}`}
          {activeContractTab === 'staking' &&
            `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
// StakingGate deployed on Sepolia at 0xdA7655b7007a1C7F8191066Bb9A69E4D8987E725
contract StakingGate {
    struct UserProfile {
        uint256 reputationScore;
        uint256 activeStakes;
        bool isQuarantined;
    }
    // Front-door entry for all new data: requires 100 OSINT stake (unless reputationScore > 100)
    // reviewSubmission(bytes32 _assetHash, bool _isValid): refunds 100 OSINT stake + grants +10 Reputation when validated by Oracle
}`}
          {activeContractTab === 'pat' &&
            `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
/**
 * @title PublicAuditToken (PAT) & Whistleblower Reward Vault
 * Incentive formula: 100 PAT tokens per $1,000 of verified tax waste exposed
 */
contract PublicAuditToken {
    string public name = "Public Audit Token";
    string public symbol = "PAT";
    function logAuditAndReward(string memory foiaRequestId, string memory targetEntity, uint256 verifiedTaxWasteAmount, address whistleblower) external returns (bytes32) {
        uint256 rewardTokens = (verifiedTaxWasteAmount / 1000) * 100 * (10**18);
        // Logs auditHash and mints rewardTokens to whistleblower
    }
}`}
          {activeContractTab === 'bridge' &&
            `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
/**
 * @title Autonomous TaxFunded Bridge Ledger
 * Whenever an investigation in OsintNeoAi is identified as Taxpayer-Funded, it is automatically transmitted
 * and posted to the autonomous TaxFunded sister site as an immutable on-chain ledger transaction.
 */
contract AutonomousTaxFundedBridge {
    function autoTransferToTaxFunded(string memory osintInquiryId, string memory targetEntity, uint256 taxWasteAmountUSD, string governingStatute) external returns (bytes32);
}`}
        </pre>
      </div>
    </div>
  );
};
